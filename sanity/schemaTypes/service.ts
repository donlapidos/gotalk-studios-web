import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Manual sort order (lower = first)',
    }),
    defineField({
      name: 'serviceNumber',
      title: 'Service Number',
      type: 'string',
      description: "Display number, e.g. '01', '02'",
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: "Short hook line, e.g. 'Launch Your Podcast the Right Way!'",
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Bullet points of what is included',
    }),
    defineField({
      name: 'perfectFor',
      title: 'Perfect For',
      type: 'text',
      rows: 2,
      description: "Who this service is ideal for, e.g. 'Solo creators, interview shows, and corporate panels.'",
    }),
    defineField({
      name: 'featured',
      title: 'Featured (Large Card)',
      type: 'boolean',
      description: 'Toggle on to render this service as a large two-column hero card.',
      initialValue: false,
    }),
    defineField({
      name: 'pricingRows',
      title: 'Pricing Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'duration', title: 'Duration / Package', type: 'string' }),
            defineField({ name: 'price', title: 'Price', type: 'string', description: "e.g. 'RM180 – RM250'" }),
          ],
          preview: {
            select: { title: 'duration', subtitle: 'price' },
          },
        },
      ],
    }),
    defineField({
      name: 'pricingNote',
      title: 'Pricing Note',
      type: 'string',
      description: "Optional note below pricing table, e.g. 'Raw footage delivery included'",
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Uncheck to hide this service without deleting it.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'serviceNumber',
    },
    prepare({ title, subtitle }) {
      return { title: subtitle ? `${subtitle} — ${title}` : (title ?? 'Untitled') }
    },
  },
  orderings: [
    {
      title: 'Order Rank',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
})
