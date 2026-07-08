import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('GoTalk Studios')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('episode').title('Episodes'),
      S.divider(),
      S.listItem()
        .title('Guests')
        .child(
          S.documentTypeList('guest')
            .title('Guests')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Services')
        .child(
          S.documentTypeList('service')
            .title('Services')
            .defaultOrdering([{ field: 'orderRank', direction: 'asc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Gallery Settings')
        .id('gallerySettings')
        .child(
          S.document()
            .schemaType('gallerySettings')
            .documentId('gallerySettings')
        ),
      S.listItem()
        .title('Gallery Collections')
        .child(
          S.documentTypeList('galleryCollection')
            .title('Gallery Collections')
            .defaultOrdering([{ field: 'orderRank', direction: 'asc' }])
        ),
      S.listItem()
        .title('Gallery Items')
        .child(
          S.documentTypeList('galleryItem')
            .title('Gallery Items')
        ),
      S.divider(),
      S.documentTypeListItem('blogPost').title('Blog Posts'),
    ])
