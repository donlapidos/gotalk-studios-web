'use server'

import { Resend } from 'resend'

const TO = 'hello@gotalkstudios.com'
const FROM = 'GoTalk Studios <no-reply@gotalkstudios.com>'

type Result = { success: boolean; error?: string }

type OrderItem = { id: string; title: string; badge: string }

function field(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

// Subject lines must stay single-line
function oneLine(s: string): string {
  return s.replace(/[\r\n]+/g, ' ')
}

// Hidden honeypot field — humans never fill it; bots do. Pretend success so
// bots don't learn they were filtered.
function isSpam(formData: FormData): boolean {
  return field(formData, 'website_url') !== ''
}

export async function submitGalleryOrder(_: Result | null, formData: FormData): Promise<Result> {
  if (isSpam(formData)) return { success: true }

  const email = field(formData, 'email')
  const total = field(formData, 'total')

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  let items: OrderItem[] = []
  try {
    const parsed = JSON.parse(field(formData, 'items'))
    if (Array.isArray(parsed)) {
      items = parsed
        .filter((it): it is OrderItem => !!it && typeof it.id === 'string' && typeof it.title === 'string')
        .slice(0, 100)
    }
  } catch {
    /* fall through to the empty check */
  }
  if (items.length === 0) {
    return { success: false, error: 'Your selection could not be read. Please reselect and try again.' }
  }

  // Constructed lazily — new Resend(undefined) throws at module load, which
  // would 500 every action call (including the honeypot path) when the env
  // var is missing
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('Gallery order: RESEND_API_KEY is not set')
    return { success: false, error: 'Ordering is temporarily unavailable. Please try again later.' }
  }
  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Gallery Order — ${items.length} frame${items.length === 1 ? '' : 's'} — ${oneLine(total)}`,
      text: [
        `Buyer email:  ${email}`,
        `Frames:       ${items.length}`,
        `Quoted total: ${total} (at current site pricing — verify before invoicing)`,
        '',
        'Selected frames:',
        ...items.map((it, i) => `${i + 1}. ${it.title}${it.badge ? ` [${it.badge}]` : ''} — id: ${it.id}`),
        '',
        'Reply to the buyer with payment details (DuitNow / bank transfer).',
        'After payment, send the full-resolution files from Google Drive.',
      ].join('\n'),
    })
    return { success: true }
  } catch (err) {
    console.error('Gallery order email failed:', err)
    return { success: false, error: 'Something went wrong sending your order. Please try again.' }
  }
}
