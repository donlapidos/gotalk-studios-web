import { defineField, defineType } from 'sanity'

export const guest = defineType({
  name: 'guest',
  title: 'Guest',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: "e.g. 'Founder, Chubbs Burger'",
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      description: 'A standout quote from their episode',
      rows: 4,
    }),
    defineField({
      name: 'episode',
      title: 'Episode',
      type: 'reference',
      to: [{ type: 'episode' }],
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
    }),
    defineField({
      name: 'domainFocus',
      title: 'Domain Focus',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: "e.g. 'F&B', 'Fintech', 'Property'",
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
        defineField({ name: 'website', title: 'Website', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured (Hero Guest)',
      type: 'boolean',
      description:
        'Toggle on to feature this guest in the hero section. Only one guest should be featured at a time.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'company',
      media: 'photo',
    },
  },
  orderings: [
    {
      title: 'Name, A–Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
})
