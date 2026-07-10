// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  // Safety net: live events only reach the server through browsers that are
  // connected when content is published — publish with no visitors and a
  // static page stays stale indefinitely. This caps staleness at 60s while
  // live revalidation still applies instantly for connected visitors.
  fetchOptions: { revalidate: 60 },
});
