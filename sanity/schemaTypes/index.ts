import { type SchemaTypeDefinition } from 'sanity'
import { episode } from './episode'
import { blogPost } from './blogPost'
import { siteSettings } from './siteSettings'
import { guest } from './guest'
import { service } from './service'
import { galleryCollection } from './galleryCollection'
import { galleryItem } from './galleryItem'
import { gallerySettings } from './gallerySettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [episode, blogPost, siteSettings, guest, service, galleryCollection, galleryItem, gallerySettings],
}
