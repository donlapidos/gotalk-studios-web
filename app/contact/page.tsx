import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GuestInquiryForm, SponsorshipForm, StudioInfo } from "@/components/ContactForms";

export const metadata: Metadata = {
  title: "Contact — GoTalk Studios",
  description:
    "Apply to be a guest, explore sponsorship opportunities, or just say hello. GoTalk Studios is always listening.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Page Header */}
        <div className="relative bg-[#111111] border-b border-white/10 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CC0000]" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-[#CC0000]" />
              <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
                Contact
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-bebas-neue)] text-6xl lg:text-8xl text-white tracking-wide mb-4">
              Get In Touch.
            </h1>
            <div className="flex items-center gap-1 mb-5">
              <span className="text-[#CC0000] text-xl">— — —</span>
            </div>
            <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
              Whether you&apos;re a Sarawakian with a story to tell, a brand
              looking to reach a powerful local audience, or a leader ready to
              speak — the GoTalk chair is waiting.
            </p>
          </div>
        </div>

        {/* Forms */}
        <div className="bg-[#111111] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <GuestInquiryForm />
              <SponsorshipForm />
            </div>
            <StudioInfo />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
