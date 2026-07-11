import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { dataset, projectId, apiVersion } from '@/sanity/env'

// Team upload endpoint for the private /upload page. Auth is a shared
// password (GALLERY_UPLOAD_PASSWORD); writes use SANITY_API_WRITE_TOKEN.
// Both live only in server env — the browser never sees the token.

const API = `https://${projectId}.api.sanity.io/${apiVersion.startsWith('v') ? apiVersion : `v${apiVersion}`}`

function passwordOk(given: string): boolean {
  // Trimmed on both sides — pasted env values often carry a stray newline
  const expected = (process.env.GALLERY_UPLOAD_PASSWORD ?? '').trim()
  if (!expected) return false
  const a = Buffer.from(given.trim())
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

async function groq<T>(query: string, token: string): Promise<T> {
  const res = await fetch(`${API}/data/query/${dataset}?query=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Sanity query failed (${res.status})`)
  return (await res.json()).result
}

async function mutate(mutations: unknown[], token: string) {
  const res = await fetch(`${API}/data/mutate/${dataset}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations, returnIds: true }),
  })
  if (!res.ok) throw new Error(`Sanity mutation failed (${res.status}): ${await res.text()}`)
  return res.json()
}

export async function POST(req: Request) {
  const password = req.headers.get('x-upload-password') ?? ''
  if (!passwordOk(password)) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })
  }
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'Server is missing SANITY_API_WRITE_TOKEN — add it in Vercel env.' },
      { status: 500 }
    )
  }

  try {
    const form = await req.formData()
    const action = form.get('action')

    // ── Create a new event (collection) ────────────────────────────────────
    if (action === 'create-collection') {
      const name = String(form.get('name') ?? '').trim()
      const badge = String(form.get('badge') ?? '').trim()
      if (!name || !badge) {
        return NextResponse.json({ error: 'Event name and badge are required.' }, { status: 400 })
      }
      if (badge.length > 20) {
        return NextResponse.json({ error: 'Badge must be 20 characters or less.' }, { status: 400 })
      }
      const existing = await groq<{ _id: string } | null>(
        `*[_type == "galleryCollection" && lower(name) == "${name.toLowerCase().replace(/"/g, '')}"][0]{_id}`,
        token
      )
      if (existing) {
        return NextResponse.json({ collectionId: existing._id, existed: true })
      }
      const maxRank = (await groq<number | null>(
        'math::max(*[_type == "galleryCollection"].orderRank)',
        token
      )) ?? 0
      const result = await mutate(
        [{ create: { _type: 'galleryCollection', name, badge, orderRank: maxRank + 1 } }],
        token
      )
      return NextResponse.json({ collectionId: result.results[0].id, existed: false })
    }

    // ── Upload one processed photo ──────────────────────────────────────────
    if (action === 'upload') {
      const file = form.get('file')
      const collectionId = String(form.get('collectionId') ?? '')
      const title = String(form.get('title') ?? '').trim()
      if (!(file instanceof File) || !collectionId || !title) {
        return NextResponse.json({ error: 'file, collectionId and title are required.' }, { status: 400 })
      }
      // The browser sends pre-processed ~2000px JPEGs (~0.3MB); anything much
      // larger means processing was bypassed
      if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json({ error: 'File too large — expected a processed web copy.' }, { status: 413 })
      }

      const safeTitle = title.replace(/"/g, '')
      const dupe = await groq<number>(
        `count(*[_type == "galleryItem" && collection._ref == "${collectionId.replace(/"/g, '')}" && title == "${safeTitle}"])`,
        token
      )
      if (dupe > 0) {
        return NextResponse.json({ skipped: true })
      }

      const assetRes = await fetch(
        `${API}/assets/images/${dataset}?filename=${encodeURIComponent(`${title}.jpg`)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'image/jpeg', Authorization: `Bearer ${token}` },
          body: Buffer.from(await file.arrayBuffer()),
        }
      )
      if (!assetRes.ok) throw new Error(`Asset upload failed (${assetRes.status})`)
      const assetId = (await assetRes.json()).document._id

      const num = title.match(/(\d+)$/)?.[1]
      await mutate(
        [
          {
            create: {
              _type: 'galleryItem',
              title,
              mediaType: 'photo',
              image: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
              collection: { _type: 'reference', _ref: collectionId },
              ...(num ? { orderRank: Number(num) } : {}),
            },
          },
        ],
        token
      )
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  } catch (err) {
    console.error('Gallery upload failed:', err)
    const message = err instanceof Error ? err.message : 'Upload failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
