import { defineField, defineType } from 'sanity'

export const galleryCollection = defineType({
  name: 'galleryCollection',
  title: 'Gallery Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: "Full collection name, e.g. 'Sarawak Business Summit'",
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: "Short chip shown on cards, e.g. \"SUMMIT '26\"",
      validation: (R) => R.required().max(20),
    }),
    defineField({
      name: 'orderRank',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first in the collection filter',
      validation: (R) => R.required().integer(),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'badge' },
  },
  orderings: [
    {
      title: 'Sort Order',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
})
