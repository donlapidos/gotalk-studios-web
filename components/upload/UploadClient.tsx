'use client'

import { useRef, useState } from 'react'
import type { GalleryCollection } from '@/components/gallery/types'

type Props = {
  collections: GalleryCollection[]
  watermarkText: string
}

type FileStatus = 'queued' | 'processing' | 'uploading' | 'done' | 'skipped' | 'failed'

type QueuedFile = {
  file: File
  title: string
  status: FileStatus
  error?: string
}

const MAX_EDGE = 2000
const JPEG_QUALITY = 0.82

// Resize + bake the watermark in the browser, mirroring
// scripts/prepare-gallery-photos.mjs. Canvas redraw also strips EXIF/GPS.
async function processPhoto(file: File, watermarkText: string): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported in this browser')
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()

  const fontSize = Math.round(Math.min(w, h) / 18)
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate((-24 * Math.PI) / 180)
  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.textAlign = 'center'
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${Math.round(fontSize / 4)}px`
  ctx.font = `bold ${fontSize}px Arial, sans-serif`
  ctx.fillText(watermarkText, 0, -Math.round(h * 0.04))
  ctx.font = `bold ${Math.round(fontSize * 0.62)}px Arial, sans-serif`
  ctx.fillText(watermarkText, 0, Math.round(h * 0.28))
  ctx.restore()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not encode image'))),
      'image/jpeg',
      JPEG_QUALITY
    )
  })
}

const inputCls =
  'bg-[#1A1A1A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[#CC0000] transition-colors w-full'

const labelCls = 'text-[10px] font-bold tracking-[0.25em] uppercase text-white/50'

export default function UploadClient({ collections, watermarkText }: Props) {
  const [password, setPassword] = useState(
    () => (typeof window !== 'undefined' && sessionStorage.getItem('gt-upload-pass')) || ''
  )
  const [cols, setCols] = useState(collections)
  const [collectionId, setCollectionId] = useState(collections[0]?._id ?? '__new__')
  const [newName, setNewName] = useState('')
  const [newBadge, setNewBadge] = useState('')
  const [files, setFiles] = useState<QueuedFile[]>([])
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isNew = collectionId === '__new__'
  const doneCount = files.filter((f) => f.status === 'done').length
  const skipCount = files.filter((f) => f.status === 'skipped').length
  const failCount = files.filter((f) => f.status === 'failed').length

  function addFiles(list: FileList | File[]) {
    const incoming = [...list]
      .filter((f) => /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic)$/i.test(f.name))
      .map((file) => ({
        file,
        title: file.name.replace(/\.[^.]+$/, ''),
        status: 'queued' as FileStatus,
      }))
    setFiles((prev) => {
      const known = new Set(prev.map((p) => p.title))
      return [...prev, ...incoming.filter((f) => !known.has(f.title))]
    })
  }

  function setFileState(title: string, patch: Partial<QueuedFile>) {
    setFiles((prev) => prev.map((f) => (f.title === title ? { ...f, ...patch } : f)))
  }

  async function post(body: FormData): Promise<Response> {
    return fetch('/api/gallery-upload', {
      method: 'POST',
      headers: { 'x-upload-password': password },
      body,
    })
  }

  async function startUpload() {
    setFormError(null)
    if (!password) return setFormError('Enter the upload password.')
    if (files.length === 0) return setFormError('Add some photos first.')
    if (isNew && (!newName.trim() || !newBadge.trim()))
      return setFormError('New events need a name and a short badge.')
    if (isNew && newBadge.trim().length > 20)
      return setFormError('Badge must be 20 characters or less.')

    setBusy(true)
    sessionStorage.setItem('gt-upload-pass', password)
    try {
      // Resolve the event first (creating it if needed)
      let targetId = collectionId
      if (isNew) {
        const fd = new FormData()
        fd.set('action', 'create-collection')
        fd.set('name', newName.trim())
        fd.set('badge', newBadge.trim())
        const res = await post(fd)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? `Could not create event (${res.status})`)
        targetId = json.collectionId
        const created = { _id: targetId, name: newName.trim(), badge: newBadge.trim() }
        setCols((prev) => [...prev, created])
        setCollectionId(targetId)
        setNewName('')
        setNewBadge('')
      }

      // Process + upload one at a time so progress is honest and memory stays flat
      for (const f of files) {
        if (f.status === 'done' || f.status === 'skipped') continue
        try {
          setFileState(f.title, { status: 'processing', error: undefined })
          const blob = await processPhoto(f.file, watermarkText)
          setFileState(f.title, { status: 'uploading' })
          const fd = new FormData()
          fd.set('action', 'upload')
          fd.set('file', new File([blob], `${f.title}.jpg`, { type: 'image/jpeg' }))
          fd.set('collectionId', targetId)
          fd.set('title', f.title)
          const res = await post(fd)
          const json = await res.json()
          if (res.status === 401) throw new Error('Wrong password.')
          if (!res.ok) throw new Error(json.error ?? `Upload failed (${res.status})`)
          setFileState(f.title, { status: json.skipped ? 'skipped' : 'done' })
        } catch (err) {
          setFileState(f.title, {
            status: 'failed',
            error: err instanceof Error ? err.message : 'Failed',
          })
          if (err instanceof Error && err.message === 'Wrong password.') {
            setFormError('Wrong password — fix it and press Upload to retry.')
            break
          }
        }
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const statusLabel: Record<FileStatus, string> = {
    queued: 'QUEUED',
    processing: 'WATERMARKING…',
    uploading: 'UPLOADING…',
    done: 'LIVE ✓',
    skipped: 'ALREADY UPLOADED',
    failed: 'FAILED',
  }
  const statusColor: Record<FileStatus, string> = {
    queued: 'text-white/30',
    processing: 'text-amber-400',
    uploading: 'text-amber-400',
    done: 'text-emerald-400',
    skipped: 'text-white/40',
    failed: 'text-[#CC0000]',
  }

  return (
    <div className="max-w-2xl">
      {/* Password */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label htmlFor="up-pass" className={labelCls}>
          Upload password
        </label>
        <input
          id="up-pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ask Lionel"
          className={inputCls}
          autoComplete="off"
        />
      </div>

      {/* Event */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label htmlFor="up-col" className={labelCls}>
          Event
        </label>
        <select
          id="up-col"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          className={`${inputCls} appearance-none`}
        >
          {cols.map((c) => (
            <option key={c._id} value={c._id} className="bg-[#1A1A1A]">
              {c.name}
            </option>
          ))}
          <option value="__new__" className="bg-[#1A1A1A]">
            ➕ New event…
          </option>
        </select>
      </div>

      {isNew && (
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="up-name" className={labelCls}>
              Event name
            </label>
            <input
              id="up-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Kuching Festival 2026"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="up-badge" className={labelCls}>
              Badge (short, on cards)
            </label>
            <input
              id="up-badge"
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              maxLength={20}
              placeholder="KCH FEST '26"
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          addFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed px-6 py-12 text-center cursor-pointer transition-colors mb-6 ${
          dragOver ? 'border-[#CC0000] bg-[#CC0000]/5' : 'border-white/20 hover:border-white/40'
        }`}
      >
        <p className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide text-white/70">
          Drop photos here
        </p>
        <p className="text-xs text-white/35 mt-1">
          or click to choose — you can select a whole event&apos;s worth at once
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* Queue */}
      {files.length > 0 && (
        <div className="mb-6 max-h-72 overflow-auto border border-white/10 divide-y divide-white/5">
          {files.map((f) => (
            <div key={f.title} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
              <span className="text-white/70 truncate">{f.title}</span>
              <span className={`text-[10px] font-bold tracking-[0.15em] whitespace-nowrap ${statusColor[f.status]}`}>
                {f.status === 'failed' && f.error ? `FAILED — ${f.error}` : statusLabel[f.status]}
              </span>
            </div>
          ))}
        </div>
      )}

      {formError && <p className="text-sm text-[#CC0000] mb-4">{formError}</p>}

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="button"
          onClick={startUpload}
          disabled={busy}
          className="bg-[#CC0000] text-white text-xs font-bold tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#AA0000] active:scale-95 transition-all disabled:opacity-60"
        >
          {busy
            ? `Uploading… ${doneCount + skipCount}/${files.length}`
            : `Upload ${files.length > 0 ? `${files.length} photo${files.length === 1 ? '' : 's'}` : ''}`}
        </button>
        {files.length > 0 && !busy && (
          <button
            type="button"
            onClick={() => setFiles([])}
            className="text-[11px] font-bold tracking-[0.2em] uppercase px-5 py-3.5 text-white/60 hover:text-white outline outline-1 -outline-offset-1 outline-white/20 hover:outline-white/50 transition-all"
          >
            Clear list
          </button>
        )}
        {(doneCount > 0 || skipCount > 0 || failCount > 0) && !busy && (
          <span className="text-xs text-white/40">
            {doneCount} live · {skipCount} skipped · {failCount} failed
          </span>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-white/35 mt-8 max-w-lg">
        Photos are resized to 2000px and watermarked in your browser before upload — originals
        never leave your computer. Keep the full-resolution files in the team Google Drive; those
        are what buyers receive. Re-uploading the same filenames is safe: duplicates are skipped.
      </p>
    </div>
  )
}
