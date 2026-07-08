import { defineField, defineType } from 'sanity'

export const gallerySettings = defineType({
  name: 'gallerySettings',
  title: 'Gallery Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'singlePrice',
      title: 'Single Frame Price (RM)',
      type: 'number',
      initialValue: 10,
      validation: (R) => R.required().positive(),
    }),
    defineField({
      name: 'packs',
      title: 'Set Pricing',
      type: 'array',
      description: 'Discounted sets, e.g. 3 frames for RM 25',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'qty', title: 'Frames', type: 'number', validation: (R) => R.required().integer().min(2) }),
            defineField({ name: 'price', title: 'Price (RM)', type: 'number', validation: (R) => R.required().positive() }),
          ],
          preview: {
            select: { qty: 'qty', price: 'price' },
            prepare({ qty, price }) {
              return { title: `${qty} frames — RM ${price}` }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'watermarkText',
      title: 'Watermark Text',
      type: 'string',
      initialValue: '© GOTALK STUDIOS',
    }),
    defineField({
      name: 'watermarkStyle',
      title: 'Watermark Style',
      type: 'string',
      options: {
        list: [
          { title: 'Corner', value: 'corner' },
          { title: 'Diagonal', value: 'diagonal' },
          { title: 'Centered', value: 'centered' },
        ],
        layout: 'radio',
      },
      initialValue: 'corner',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Gallery Settings' }
    },
  },
})
