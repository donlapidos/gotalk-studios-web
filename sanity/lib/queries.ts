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
    thumbnail{ ..., "lqip": asset->metadata.lqip },
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
    featuredImage{ ..., "lqip": asset->metadata.lqip },
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
    featuredImage{ ..., "lqip": asset->metadata.lqip },
    body,
    author,
    publishedAt
  }
`)

export const ALL_GUESTS_QUERY = defineQuery(`
  *[_type == "guest"] | order(segment asc, name asc) {
    _id,
    name,
    slug,
    photo{ ..., "lqip": asset->metadata.lqip },
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
    photo{ ..., "lqip": asset->metadata.lqip },
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

export const ALL_SERVICES_QUERY = defineQuery(`
  *[_type == "service" && active == true] | order(orderRank asc) {
    _id,
    serviceNumber,
    name,
    tagline,
    features,
    perfectFor,
    featured,
    pricingRows,
    pricingNote
  }
`)

export const GALLERY_PAGE_QUERY = defineQuery(`{
  "settings": *[_type == "gallerySettings"][0] {
    singlePrice,
    packs,
    watermarkText,
    watermarkStyle
  },
  "collections": *[_type == "galleryCollection"] | order(orderRank asc) {
    _id,
    name,
    badge
  },
  "items": *[_type == "galleryItem"] | order(collection->orderRank asc, coalesce(orderRank, 9999) asc, _createdAt desc) {
    _id,
    title,
    mediaType,
    image{ ..., "lqip": asset->metadata.lqip },
    youtubeUrl,
    duration,
    description,
    collection->{ _id, name, badge }
  }
}`)
