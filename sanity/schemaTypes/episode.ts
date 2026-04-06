import { defineField, defineType } from 'sanity'

export const episode = defineType({
  name: 'episode',
  title: 'Episode',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'episodeNumber',
      title: 'Episode Number',
      type: 'number',
      validation: (R) => R.required().integer().positive(),
    }),
    defineField({
      name: 'season',
      title: 'Season',
      type: 'number',
      initialValue: 1,
      validation: (R) => R.required().integer().positive(),
    }),
    defineField({
      name: 'segment',
      title: 'Segment',
      type: 'string',
      options: {
        list: [
          { title: 'Business', value: 'Business' },
          { title: 'Politics', value: 'Politics' },
          { title: 'Icons', value: 'Icons' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'guestCompany',
      title: 'Guest Company / Title',
      type: 'string',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Full YouTube URL e.g. https://www.youtube.com/watch?v=xxxxx',
      validation: (R) =>
        R.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      description: 'Override thumbnail (falls back to YouTube auto-thumbnail)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
    }),
    defineField({
      name: 'featured',
      title: 'Featured (Hero Episode)',
      type: 'boolean',
      description: 'Only one episode should be featured at a time.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      ep: 'episodeNumber',
      segment: 'segment',
      media: 'thumbnail',
    },
    prepare({ title, ep, segment, media }) {
      return {
        title: `EP ${ep} — ${title}`,
        subtitle: segment,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Episode Number, Newest First',
      name: 'episodeNumberDesc',
      by: [{ field: 'episodeNumber', direction: 'desc' }],
    },
  ],
})
