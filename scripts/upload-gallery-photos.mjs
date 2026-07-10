// Bulk-upload prepared gallery photos to Sanity: uploads each image as an
// asset and creates a *published* Gallery Item titled from the filename
// (DSC00745.jpg → title "DSC00745"). Re-runs are safe — files whose title
// already exists in the target collection are skipped.
//
// Usage:
//   node scripts/upload-gallery-photos.mjs <folder> --collection "Name"
//   node scripts/upload-gallery-photos.mjs <folder> --collection "Name" --dry-run
//
// <folder> should be the *processed* output of prepare-gallery-photos.mjs
// (resized + watermarked) — never point this at your raw originals.
//
// Requires SANITY_API_WRITE_TOKEN in .env.local:
//   manage.sanity.io → project → API → Tokens → Add API token (Editor role)
// The token stays local; it is NOT needed in Vercel.

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

// ── env ───────────────────────────────────────────────────────────────────────
try {
  process.loadEnvFile('.env.local')
} catch {
  /* fall back to already-set env vars */
}

const PROJECT_ID = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '').replace(/"/g, '')
const DATASET = (process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production').replace(/"/g, '')
const TOKEN = process.env.SANITY_API_WRITE_TOKEN
const API = `https://${PROJECT_ID}.api.sanity.io/v2026-04-01`

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

// ── args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const colIdx = args.indexOf('--collection')
const folder = args.find((a) => !a.startsWith('--') && a !== args[colIdx + 1])
const collectionName = colIdx >= 0 ? args[colIdx + 1] : null

if (!folder || !collectionName || !PROJECT_ID) {
  console.error('Usage: node scripts/upload-gallery-photos.mjs <folder> --collection "Name" [--dry-run]')
  process.exit(1)
}

// ── sanity api helpers ────────────────────────────────────────────────────────
async function groq(query) {
  const res = await fetch(`${API}/data/query/${DATASET}?query=${encodeURIComponent(query)}`, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  })
  if (!res.ok) throw new Error(`Query failed (${res.status}): ${await res.text()}`)
  return (await res.json()).result
}

async function uploadAsset(filePath, mime) {
  const body = await readFile(filePath)
  const filename = encodeURIComponent(path.basename(filePath))
  const res = await fetch(`${API}/assets/images/${DATASET}?filename=${filename}`, {
    method: 'POST',
    headers: { 'Content-Type': mime, Authorization: `Bearer ${TOKEN}` },
    body,
  })
  if (!res.ok) throw new Error(`Asset upload failed (${res.status}): ${await res.text()}`)
  return (await res.json()).document._id
}

async function createItem(doc) {
  const res = await fetch(`${API}/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: [{ create: doc }] }),
  })
  if (!res.ok) throw new Error(`Create failed (${res.status}): ${await res.text()}`)
}

// ── main ──────────────────────────────────────────────────────────────────────
// (process.exitCode instead of process.exit — hard exits with in-flight fetch
// handles trip a libuv assertion on Windows)
async function main() {
  // 1. Resolve the collection by (case-insensitive) name
  const collections = await groq('*[_type == "galleryCollection"]{ _id, name }')
  const target = collections.find((c) => c.name.toLowerCase() === collectionName.toLowerCase())
  if (!target) {
    console.error(`Collection "${collectionName}" not found. Available collections:`)
    for (const c of collections) console.error(`  - ${c.name}`)
    console.error('Create it in /studio first (Gallery Collections), then re-run.')
    return 1
  }

  // 2. Existing titles in that collection → idempotent re-runs
  const existing = new Set(
    await groq(`*[_type == "galleryItem" && collection._ref == "${target._id}"].title`)
  )

  // 3. Plan the batch
  const entries = (await readdir(folder)).filter((f) => MIME[path.extname(f).toLowerCase()]).sort()
  if (entries.length === 0) {
    console.error(`No uploadable images (.jpg/.png/.webp) found in ${folder}`)
    return 1
  }
  const plan = entries.map((file) => {
    const title = path.parse(file).name
    // Numeric tail of the filename (DSC00745 → 745) keeps grid order stable
    // and matching shoot order across re-runs
    const num = title.match(/(\d+)$/)?.[1]
    return { file, title, orderRank: num ? Number(num) : undefined, skip: existing.has(title) }
  })
  const todo = plan.filter((p) => !p.skip)

  console.log(`Collection: ${target.name} (${target._id})`)
  console.log(`Folder:     ${folder} — ${entries.length} image(s), ${plan.length - todo.length} already uploaded, ${todo.length} to upload\n`)

  if (dryRun) {
    for (const p of plan) console.log(`${p.skip ? 'skip   ' : 'upload '} ${p.file} → "${p.title}"${p.orderRank !== undefined ? ` (order ${p.orderRank})` : ''}`)
    console.log('\nDry run — nothing uploaded.')
    return 0
  }

  if (!TOKEN) {
    console.error('SANITY_API_WRITE_TOKEN is not set in .env.local.')
    console.error('Create one at manage.sanity.io → project → API → Tokens (Editor role).')
    return 1
  }

  let done = 0
  let failed = 0
  for (const p of todo) {
    try {
      const mime = MIME[path.extname(p.file).toLowerCase()]
      const assetId = await uploadAsset(path.join(folder, p.file), mime)
      await createItem({
        _type: 'galleryItem',
        title: p.title,
        mediaType: 'photo',
        image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
        collection: { _type: 'reference', _ref: target._id },
        ...(p.orderRank !== undefined ? { orderRank: p.orderRank } : {}),
      })
      done++
      console.log(`✓ [${done}/${todo.length}] ${p.file} → "${p.title}"`)
    } catch (err) {
      failed++
      console.error(`✗ ${p.file}: ${err.message}`)
    }
  }

  console.log(`\nDone. ${done} uploaded, ${plan.length - todo.length} skipped, ${failed} failed.`)
  return failed > 0 ? 1 : 0
}

process.exitCode = await main()
