import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_SERVICES_QUERY } from "@/sanity/lib/queries";
import {
  StudioBookingForm,
  GuestInquiryForm,
  SponsorshipForm,
  StudioInfo,
  type BookableService,
} from "@/components/ContactForms";
import { FadeIn, FadeUp, DrawLine } from "@/components/motion";

const DESCRIPTION =
  "Book the GoTalk studio, pitch yourself as a guest, or partner with us as a sponsor.";

export const metadata: Metadata = {
  // The brand suffix comes from the root layout's title template; repeating it
  // here produced "… | GoTalk Studios | GoTalk Studios" on every route.
  title: "Book the Studio",
  description: DESCRIPTION,
  openGraph: {
    title: "Book the Studio",
    description: DESCRIPTION,
    url: "https://gotalkstudios.com/contact",
    type: "website",
  },
  twitter: {
    title: "Book the Studio",
    description: DESCRIPTION,
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { data } = await sanityFetch({ query: ALL_SERVICES_QUERY });
  const services = ((data ?? []) as BookableService[]).map((s) => ({
    name: s.name,
    pricingRows: s.pricingRows,
  }));

  // Resolved here rather than via useSearchParams in the form, so the form stays
  // in the server-rendered HTML and its Server Action keeps working without JS.
  const { service } = await searchParams;

  return (
    <main id="main" tabIndex={-1} className="pt-16">
      {/* ── Page header ────────────────────────────────────────── */}
      <section className="relative bg-surface-base border-b border-white/10 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 section-y-tight">
          {/* The "— — —" glyph rule that used to sit under this heading was a
              literal em-dash string styled as a divider; on mobile it read as
              three stray red dashes. A drawn rule does the job. */}
          <FadeIn delay={0.03}>
            <p className="section-label mb-6">Studio Booking</p>
          </FadeIn>
          <FadeUp delay={0.05}>
            <h1 className="font-display text-white tracking-wide mb-5 text-5xl lg:text-7xl">
              Book the Studio.
            </h1>
          </FadeUp>
          <FadeIn delay={0.2}>
            <DrawLine delay={0.25} className="w-16 h-[2px] bg-brand-red mb-6" />
            <p className="text-white/70 text-lg max-w-[62ch] leading-relaxed">
              Tell us the service and the date. We&apos;ll confirm availability and the
              final rate within two business days — usually on WhatsApp.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Primary path: booking ──────────────────────────────── */}
      <section id="book" className="bg-surface-base section-y scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <FadeUp delay={0.05}>
            <StudioBookingForm services={services} initialService={service ?? ""} />
          </FadeUp>
        </div>
      </section>

      {/* ── Secondary paths ────────────────────────────────────── */}
      <section className="bg-surface-alt border-t border-white/10 section-y">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn delay={0.05}>
            <h2 className="font-display text-white uppercase text-3xl tracking-wide mb-3">
              Not booking the studio?
            </h2>
            <p className="text-white/70 text-base mb-10 max-w-[60ch]">
              Two other ways in — pitch yourself as a guest on the show, or talk to us
              about sponsorship.
            </p>
          </FadeIn>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <FadeUp delay={0.1}>
              <GuestInquiryForm />
            </FadeUp>
            <FadeUp delay={0.18}>
              <SponsorshipForm />
            </FadeUp>
          </div>
          <FadeIn delay={0.25}>
            <StudioInfo />
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
