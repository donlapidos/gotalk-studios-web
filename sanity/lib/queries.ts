import { defineQuery } from 'next-sanity'

export const FEATURED_EPISODE_QUERY = defineQuery(`
  *[_type == "episode" && featured == true] | order(episodeNumber desc) [0] {
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

export const ALL_GUESTS_QUERY = defineQuery(`
  *[_type == "guest"] | order(segment asc, name asc) {
    _id,
    name,
    slug,
    photo,
    title,
    company,
    quote,
    segment,
    domainFocus,
    socialLinks,
    featured,
    episode-> {
      _id,
      title,
      episodeNumber,
      youtubeUrl,
      description,
      season
    }
  }
`)

export const GUEST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "guest" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    photo,
    title,
    company,
    bio,
    quote,
    segment,
    domainFocus,
    socialLinks,
    featured,
    episode-> {
      _id,
      title,
      episodeNumber,
      youtubeUrl,
      shortDescription,
      season
    }
  }
`)

export const GUEST_SLUGS_QUERY = defineQuery(`
  *[_type == "guest" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`)

export const FEATURED_GUEST_QUERY = defineQuery(`
  *[_type == "guest" && featured == true][0] {
    _id,
    name,
    slug,
    photo,
    title,
    company,
    bio,
    quote,
    segment,
    domainFocus,
    socialLinks,
    episode-> {
      _id,
      title,
      episodeNumber,
      youtubeUrl,
      description,
      season
    }
  }
`)
