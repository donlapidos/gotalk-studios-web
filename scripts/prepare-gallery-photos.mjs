// Prepare raw photos for the gallery: downscale to a web-safe resolution and
// bake a watermark into the pixels (unlike the CSS overlay, this cannot be
// removed by opening the image URL directly).
//
// Usage:
//   node scripts/prepare-gallery-photos.mjs <input-folder> [output-folder]
//
//   node scripts/prepare-gallery-photos.mjs ./raw-photos
//     → writes web-ready copies to ./raw-photos-web/
//
// Options (set via env or edit the constants below):
//   MAX_EDGE   longest side of the output in px      (default 2000)
//   QUALITY    JPEG quality 1-100                    (default 82)
//   MARK       watermark text                        (default © GOTALK STUDIOS)
//   NO_MARK=1  skip the baked watermark
//
// Then upload the files from the output folder as Gallery Item display
// images in /studio. Keep the raws in Google Drive — they never touch the
// site, and buyers receive them only after purchase.

import sharp from 'sharp'
import { readdir, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'

const MAX_EDGE = Number(process.env.MAX_EDGE) || 2000
const QUALITY = Number(process.env.QUALITY) || 82
const MARK = process.env.MARK ?? '© GOTALK STUDIOS'
const NO_MARK = process.env.NO_MARK === '1'

const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif', '.heic'])

const [, , inputDir, outArg] = process.argv
if (!inputDir) {
  console.error('Usage: node scripts/prepare-gallery-photos.mjs <input-folder> [output-folder]')
  process.exit(1)
}
const outputDir = outArg ?? `${inputDir.replace(/[\\/]+$/, '')}-web`

// Semi-transparent diagonal watermark sized relative to the image, repeated
// twice so a crop can't trivially avoid it.
function watermarkSvg(width, height) {
  const fontSize = Math.round(Math.min(width, height) / 18)
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        text {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: bold;
          letter-spacing: ${Math.round(fontSize / 4)}px;
          fill: rgba(255,255,255,0.28);
        }
      </style>
      <text x="50%" y="46%" text-anchor="middle" font-size="${fontSize}"
        transform="rotate(-24, ${width / 2}, ${height / 2})">${MARK}</text>
      <text x="50%" y="78%" text-anchor="middle" font-size="${Math.round(fontSize * 0.62)}"
        transform="rotate(-24, ${width / 2}, ${height / 2})">${MARK}</text>
    </svg>
  `)
}

async function processOne(file) {
  const src = path.join(inputDir, file)
  const base = path.parse(file).name
  const dest = path.join(outputDir, `${base}.jpg`)

  let img = sharp(src, { failOn: 'none' }).rotate() // apply EXIF orientation
  const meta = await img.metadata()

  // EXIF orientations 5-8 rotate by 90°/270°, swapping the effective axes
  const rotated = (meta.orientation ?? 1) >= 5
  const srcW = (rotated ? meta.height : meta.width) ?? MAX_EDGE
  const srcH = (rotated ? meta.width : meta.height) ?? MAX_EDGE

  img = img.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })

  if (!NO_MARK) {
    // Compute the post-resize dimensions so the SVG scales correctly
    const scale = Math.min(1, MAX_EDGE / Math.max(srcW, srcH))
    const w = Math.round(srcW * scale)
    const h = Math.round(srcH * scale)
    img = img.composite([{ input: watermarkSvg(w, h), top: 0, left: 0 }])
  }

  // Strip EXIF/GPS metadata (sharp drops it unless asked to keep) and save
  await img.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(dest)

  const out = await stat(dest)
  const inSize = (await stat(src)).size
  console.log(
    `✓ ${file} → ${path.basename(dest)}  (${(inSize / 1e6).toFixed(1)}MB → ${(out.size / 1e6).toFixed(2)}MB)`
  )
}

const entries = await readdir(inputDir)
const files = entries.filter((f) => EXTS.has(path.extname(f).toLowerCase()))
if (files.length === 0) {
  console.error(`No images found in ${inputDir} (looked for: ${[...EXTS].join(', ')})`)
  process.exit(1)
}

await mkdir(outputDir, { recursive: true })
console.log(`Processing ${files.length} image(s) → ${outputDir}\n(max edge ${MAX_EDGE}px, quality ${QUALITY}${NO_MARK ? ', no watermark' : `, watermark "${MARK}"`})\n`)

let failed = 0
for (const f of files) {
  try {
    await processOne(f)
  } catch (err) {
    failed++
    console.error(`✗ ${f}: ${err.message}`)
  }
}

console.log(`\nDone. ${files.length - failed}/${files.length} written to ${outputDir}`)
if (failed > 0) process.exit(1)
