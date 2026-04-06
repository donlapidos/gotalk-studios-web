/**
 * Extracts a YouTube video ID from any common YouTube URL format:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 *   https://www.youtube.com/live/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 *   https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeId(url: string | null | undefined): string {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^(www\.|m\.)/, '')

    if (host === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0]
    }

    if (host === 'youtube.com') {
      // /shorts/ID, /live/ID, /embed/ID
      const pathMatch = parsed.pathname.match(
        /^\/(shorts|live|embed)\/([a-zA-Z0-9_-]{11})/
      )
      if (pathMatch) return pathMatch[2]

      // /watch?v=ID
      return parsed.searchParams.get('v') ?? ''
    }

    return ''
  } catch {
    return ''
  }
}
