/**
 * Category badge styling, shared by the blog index and post pages.
 *
 * These badges used to carry four different hues — brand red for Business, plus
 * blue, amber, and emerald for the other three. Those three appear nowhere else
 * in the brand and encoded no meaning: nothing about "Culture" is amber, and a
 * reader gained no information from the colour. On a site otherwise disciplined
 * to red-on-near-black, they read as another designer's work.
 *
 * One badge treatment now. The category is distinguished by its label, which is
 * what a reader actually reads, and colour stays available for things that need
 * it. Business keeps red because red is the brand's own accent, not a category
 * code.
 */

export const categoryColors: Record<string, string> = {
  Business: "text-accent border-brand-red/40",
}

export const fallbackCategoryColor = "text-white/70 border-white/25"
