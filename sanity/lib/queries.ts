import { defineQuery } from 'next-sanity'

export const FEATURED_EPISODE_QUERY = defineQuery(`
  *[_type == "episode" && featured == true][0] {
    _id,
    title,
    episodeNumber,
    season,
    segment,
    guestName,
    guestCompany,
    youtubeUrl,
    thumbnail,
    description,
    publishedAt
  }
`)

export const ALL_EPISODES_QUERY = defineQuery(`
  *[_type == "episode"] | order(episodeNumber desc) {
    _id,
    title,
    episodeNumber,
    season,
    segment,
    guestName,
    guestCompany,
    youtubeUrl,
    thumbnail,
    description,
    publishedAt,
    featured
  }
`)

export const ALL_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    featuredImage,
    author,
    publishedAt
  }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    featuredImage,
    body,
    author,
    publishedAt
  }
`)

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    contactEmail,
    instagramHandle,
    heroTagline
  }
`)
