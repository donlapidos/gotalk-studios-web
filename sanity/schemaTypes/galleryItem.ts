import { defineField, defineType } from 'sanity'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Photo (for sale)', value: 'photo' },
          { title: 'Video', value: 'video' },
          { title: 'Short Film', value: 'film' },
        ],
        layout: 'radio',
      },
      initialValue: 'photo',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'image',
      title: 'Display Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
      description:
        'Upload a resized display copy (~2000px longest side). Keep the full-resolution original in Google Drive — that is the file buyers receive.',
      hidden: ({ document }) => document?.mediaType !== 'photo',
      validation: (R) =>
        R.custom((value, context) => {
          const doc = context.document as { mediaType?: string } | undefined
          if (doc?.mediaType === 'photo' && !value) return 'Photos need a display image'
          return true
        }),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Full YouTube URL for videos and short films',
      hidden: ({ document }) => document?.mediaType === 'photo',
      validation: (R) =>
        R.uri({ scheme: ['http', 'https'] }).custom((value, context) => {
          const doc = context.document as { mediaType?: string } | undefined
          if (doc?.mediaType !== 'photo' && !value) return 'Videos and films need a YouTube URL'
          return true
        }),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: "e.g. '2:14' — shown on video cards",
      hidden: ({ document }) => document?.mediaType === 'photo',
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'galleryCollection' }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Shown in the lightbox',
    }),
    defineField({
      name: 'orderRank',
      title: 'Sort Order',
      type: 'number',
      description: 'Optional — lower numbers appear first within the grid',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image', mediaType: 'mediaType', badge: 'collection.badge' },
    prepare({ title, media, mediaType, badge }) {
      const kind = typeof mediaType === 'string' ? mediaType.toUpperCase() : ''
      return { title, subtitle: [badge, kind].filter(Boolean).join(' · '), media }
    },
  },
})
