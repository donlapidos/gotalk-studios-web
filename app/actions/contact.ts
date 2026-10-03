'use server'

import { Resend } from 'resend'

const TO = 'hello@gotalkstudios.com'
const FROM = 'GoTalk Studios <no-reply@gotalkstudios.com>'

// Constructed lazily — new Resend(undefined) throws at module load, which
// would 500 every action call when the env var is missing (e.g. local dev)
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  return apiKey ? new Resend(apiKey) : null
}

// `summary` lets a success state show the user what was actually sent. The forms
// previously replaced themselves with a bare confirmation, leaving no record of
// the submission and no way to send another.
type Result = { success: boolean; error?: string; summary?: string[] }

// Tolerates missing fields (bots POSTing without the form) instead of throwing
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

/**
 * Studio booking — the site's primary conversion.
 *
 * Until this existed, every "Book Now" on the site landed on a page offering only
 * a guest-appearance pitch and a sponsorship proposal, so the five services with
 * published rates had no booking path at all.
 */
export async function submitStudioBooking(_: Result | null, formData: FormData): Promise<Result> {
  if (isSpam(formData)) return { success: true }

  const service   = field(formData, 'service')
  const pkg       = field(formData, 'package')
  const date      = field(formData, 'preferred_date')
  const altDate   = field(formData, 'alt_date')
  const name      = field(formData, 'name')
  const whatsapp  = field(formData, 'whatsapp')
  const email     = field(formData, 'email')
  const notes     = field(formData, 'notes')

  if (!service || !date || !name || !whatsapp) {
    return {
      success: false,
      error: 'Please add a service, a preferred date, your name, and a WhatsApp number.',
    }
  }

  const resend = getResend()
  if (!resend) {
    console.error('Studio booking: RESEND_API_KEY is not set')
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email || undefined,
      subject: `Studio Booking — ${oneLine(service)} — ${oneLine(date)}`,
      text: [
        `Service:         ${service}`,
        `Package:         ${pkg || 'Not specified'}`,
        `Preferred date:  ${date}`,
        `Alternate date:  ${altDate || 'Not provided'}`,
        '',
        `Name:            ${name}`,
        `WhatsApp:        ${whatsapp}`,
        `Email:           ${email || 'Not provided'}`,
        '',
        'Notes:',
        notes || 'None',
      ].join('\n'),
    })
    return {
      success: true,
      summary: [
        `Service: ${service}`,
        ...(pkg ? [`Package: ${pkg}`] : []),
        `Preferred date: ${date}`,
        ...(altDate ? [`Alternate: ${altDate}`] : []),
        `WhatsApp: ${whatsapp}`,
      ],
    }
  } catch (err) {
    console.error('Studio booking email failed:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function submitGuestInquiry(_: Result | null, formData: FormData): Promise<Result> {
  if (isSpam(formData)) return { success: true }

  const name   = field(formData, 'name')
  const email  = field(formData, 'email')
  const social = field(formData, 'social')
  const pitch  = field(formData, 'pitch')

  if (!name || !email || !pitch) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  const resend = getResend()
  if (!resend) {
    console.error('Guest inquiry: RESEND_API_KEY is not set')
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Guest Inquiry — ${oneLine(name)}`,
      text: [
        `Name:              ${name}`,
        `Email:             ${email}`,
        `Social / Website:  ${social || 'Not provided'}`,
        '',
        'Pitch:',
        pitch,
      ].join('\n'),
    })
    return { success: true }
  } catch (err) {
    console.error('Guest inquiry email failed:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function submitSponsorshipInquiry(_: Result | null, formData: FormData): Promise<Result> {
  if (isSpam(formData)) return { success: true }

  const company = field(formData, 'company')
  const contact = field(formData, 'contact')
  const email   = field(formData, 'email')
  const budget  = field(formData, 'budget')
  const goals   = field(formData, 'goals')

  if (!company || !contact || !email) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  const resend = getResend()
  if (!resend) {
    console.error('Sponsorship inquiry: RESEND_API_KEY is not set')
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Sponsorship Inquiry — ${oneLine(company)}`,
      text: [
        `Company:   ${company}`,
        `Contact:   ${contact}`,
        `Email:     ${email}`,
        `Budget:    ${budget || 'Not specified'}`,
        '',
        'Partnership Goals:',
        goals || 'Not provided',
      ].join('\n'),
    })
    return { success: true }
  } catch (err) {
    console.error('Sponsorship inquiry email failed:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
