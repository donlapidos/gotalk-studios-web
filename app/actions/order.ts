'use server'

import { Resend } from 'resend'
import { client } from '@/sanity/lib/client'
import { imageUrl } from '@/sanity/lib/image'

const TO = 'hello@gotalkstudios.com'
const FROM = 'GoTalk Studios <no-reply@gotalkstudios.com>'

type Result = { success: boolean; error?: string }

type OrderItem = { id: string; title: string; badge: string }

type PaymentSettings = {
  duitnowQr: unknown
  bankName: string | null
  accountNumber: string | null
  accountName: string | null
} | null

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

  // Short human-quotable reference tying the buyer's payment to this order
  const orderRef = `GT-${Date.now().toString(36).toUpperCase().slice(-5)}`

  // Payment details are editor-managed in Gallery Settings so the account
  // holder can change them without a deploy. Missing details degrade to a
  // confirmation email without payment instructions.
  let payment: PaymentSettings = null
  try {
    payment = await client.fetch(
      `*[_type == "gallerySettings"][0].payment{ duitnowQr, bankName, accountNumber, accountName }`
    )
  } catch (err) {
    console.error('Gallery order: could not load payment settings:', err)
  }
  const qrUrl = payment?.duitnowQr ? imageUrl(payment.duitnowQr, 600) : null
  const bankLines = [
    payment?.bankName ? `Bank:           ${payment.bankName}` : null,
    payment?.accountNumber ? `Account number: ${payment.accountNumber}` : null,
    payment?.accountName ? `Account name:   ${payment.accountName}` : null,
  ].filter((l): l is string => l !== null)
  const hasPaymentDetails = qrUrl !== null || bankLines.length > 0

  const frameList = items.map(
    (it, i) => `${i + 1}. ${it.title}${it.badge ? ` [${it.badge}]` : ''}`
  )

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Gallery Order ${orderRef} — ${items.length} frame${items.length === 1 ? '' : 's'} — ${oneLine(total)}`,
      text: [
        `Order ref:    ${orderRef}`,
        `Buyer email:  ${email}`,
        `Frames:       ${items.length}`,
        `Quoted total: ${total} (at current site pricing — verify before invoicing)`,
        '',
        'Selected frames:',
        ...items.map((it, i) => `${frameList[i]} — id: ${it.id}`),
        '',
        hasPaymentDetails
          ? `The buyer was automatically sent payment details with reference ${orderRef}.`
          : 'NOTE: No payment details are set in Gallery Settings — the buyer only received an order confirmation. Reply to them with payment instructions.',
        'Once payment shows up in the account, send the full-resolution files from Google Drive.',
      ].join('\n'),
    })
  } catch (err) {
    console.error('Gallery order email failed:', err)
    return { success: false, error: 'Something went wrong sending your order. Please try again.' }
  }

  // Buyer auto-reply — best-effort: the order is already with the studio, so
  // a failure here must not fail the order
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      replyTo: TO,
      subject: `Your GoTalk Studios order ${orderRef} — payment details`,
      text: [
        `Thanks for your order! Reference: ${orderRef}`,
        '',
        `Frames (${items.length}):`,
        ...frameList,
        `Total: ${total}`,
        '',
        ...(hasPaymentDetails
          ? [
              'How to pay:',
              ...(qrUrl ? ['• Scan the attached DuitNow QR with your banking app, or'] : []),
              ...(bankLines.length > 0 ? ['• Transfer to:', ...bankLines.map((l) => `  ${l}`)] : []),
              '',
              `Please put ${orderRef} as the payment reference/description.`,
              'Once paid, reply to this email with your receipt and we will send your',
              'full-resolution, watermark-free files.',
            ]
          : [
              'We will follow up shortly with payment details. Once payment clears,',
              'your full-resolution, watermark-free files will be on their way.',
            ]),
        '',
        '— GoTalk Studios',
        'Real People. Real Stories. Real Sarawak.',
      ].join('\n'),
      ...(qrUrl ? { attachments: [{ path: qrUrl, filename: 'gotalk-duitnow-qr.png' }] } : {}),
    })
  } catch (err) {
    console.error(`Gallery order ${orderRef}: buyer auto-reply failed:`, err)
  }

  return { success: true }
}
