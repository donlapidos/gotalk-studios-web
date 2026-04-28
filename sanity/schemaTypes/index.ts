import { type SchemaTypeDefinition } from 'sanity'
import { episode } from './episode'
import { blogPost } from './blogPost'
import { siteSettings } from './siteSettings'
import { guest } from './guest'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [episode, blogPost, siteSettings, guest],
}
