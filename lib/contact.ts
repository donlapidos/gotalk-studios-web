/**
 * Contact channels.
 *
 * WhatsApp is the default channel for booking a local service in Malaysia.
 * The studio's number is the default; NEXT_PUBLIC_WHATSAPP_NUMBER overrides it
 * (international format, digits only — e.g. 60146808010 for +60 14-680 8010).
 */

const DEFAULT_NUMBER = '60146808010'
const DEFAULT_DISPLAY = '+60 14-680 8010'

const raw = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_NUMBER).replace(/[^0-9]/g, '')

/** Digits-only WhatsApp number, or an empty string when unconfigured. */
export const WHATSAPP_NUMBER = raw

/** Deep link to a WhatsApp chat, or null when unconfigured. */
export const WHATSAPP_URL = raw ? `https://wa.me/${raw}` : null

/** The number formatted for display, or null when unconfigured. */
export const WHATSAPP_DISPLAY = raw ? (raw === DEFAULT_NUMBER ? DEFAULT_DISPLAY : `+${raw}`) : null

/** A WhatsApp chat link with the first message already written. */
export function whatsappLink(message: string): string | null {
  return WHATSAPP_URL ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}` : null
}

export const CONTACT_EMAIL = 'hello@gotalkstudios.com'
export const INSTAGRAM_HANDLE = '@gotalkstudios'
export const INSTAGRAM_URL = 'https://instagram.com/gotalkstudios'
