'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO = 'hello@gotalkstudios.com'
const FROM = 'GoTalk Studios <no-reply@gotalkstudios.com>'

type Result = { success: boolean; error?: string }

export async function submitGuestInquiry(_: Result | null, formData: FormData): Promise<Result> {
  const name   = (formData.get('name')   as string).trim()
  const email  = (formData.get('email')  as string).trim()
  const social = (formData.get('social') as string | null)?.trim() ?? ''
  const pitch  = (formData.get('pitch')  as string).trim()

  if (!name || !email || !pitch) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Guest Inquiry — ${name}`,
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
  const company = (formData.get('company') as string).trim()
  const contact = (formData.get('contact') as string).trim()
  const email   = (formData.get('email')   as string).trim()
  const budget  = (formData.get('budget')  as string | null)?.trim() ?? ''
  const goals   = (formData.get('goals')   as string | null)?.trim() ?? ''

  if (!company || !contact || !email) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Sponsorship Inquiry — ${company}`,
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
