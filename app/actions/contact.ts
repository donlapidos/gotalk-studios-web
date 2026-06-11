'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO = 'hello@gotalkstudios.com'
const FROM = 'GoTalk Studios <no-reply@gotalkstudios.com>'

type Result = { success: boolean; error?: string }

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

export async function submitGuestInquiry(_: Result | null, formData: FormData): Promise<Result> {
  if (isSpam(formData)) return { success: true }

  const name   = field(formData, 'name')
  const email  = field(formData, 'email')
  const social = field(formData, 'social')
  const pitch  = field(formData, 'pitch')

  if (!name || !email || !pitch) {
    return { success: false, error: 'Please fill in all required fields.' }
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
