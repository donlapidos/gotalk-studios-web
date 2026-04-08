import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:       "Terms of Service | GoTalk Studios",
  description: "The terms and conditions governing your use of the GoTalk Studios website and services.",
  openGraph: {
    title:       "Terms of Service | GoTalk Studios",
    description: "The terms and conditions governing your use of the GoTalk Studios website and services.",
    url:         "https://gotalkstudios.com/terms-of-service",
    type:        "website",
  },
  twitter: {
    title:       "Terms of Service | GoTalk Studios",
    description: "The terms and conditions governing your use of the GoTalk Studios website and services.",
  },
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing and using gotalkstudios.com ('the Website'), you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please discontinue use of the Website immediately.

These Terms of Service are governed by the laws of Malaysia. Any disputes arising from your use of this Website shall be subject to the exclusive jurisdiction of the courts of Malaysia.`,
  },
  {
    title: "2. About GoTalk Studios",
    body: "GoTalk Studios is a media studio based in Kuching, Sarawak, Malaysia, producing interview and talk show content featuring entrepreneurs, public figures, and cultural icons. Our content is published on YouTube and accessible via this Website.",
  },
  {
    title: "3. Use of the Website",
    body: "You agree to use this Website only for lawful purposes and in a manner that does not infringe the rights of others. You must not:",
    bullets: [
      "Use the Website in any way that violates applicable Malaysian or international laws or regulations",
      "Reproduce, duplicate, copy, or resell any part of the Website or its content without our express written permission",
      "Attempt to gain unauthorised access to any part of the Website or its related systems",
      "Transmit any unsolicited or unauthorised advertising or promotional material",
      "Impersonate GoTalk Studios, its hosts, or any other person or entity",
    ],
  },
  {
    title: "4. Intellectual Property",
    body: `All content on this Website — including but not limited to video content, episode titles, descriptions, blog posts, the GoTalk Studios name, logo, tagline ('Real People. Real Stories. Real Sarawak.'), and all associated brand materials — is the exclusive property of GoTalk Studios and is protected by Malaysian and international intellectual property laws.

You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit any content from this Website without our prior written consent. Sharing links to our YouTube content is permitted and encouraged.`,
  },
  {
    title: "5. Guest Appearances",
    body: "By submitting a guest inquiry through our Website, you acknowledge the following:",
    bullets: [
      "Submission of an inquiry does not guarantee an invitation to appear on GoTalk Studios",
      "GoTalk Studios reserves the right to decline any guest application at its sole discretion",
      "If selected, guests will be required to sign a separate Guest Appearance Agreement prior to recording",
      "GoTalk Studios retains full ownership of all recorded content, including the right to publish, distribute, edit, and promote the episode across all platforms",
      "Guests appearing on GoTalk Studios consent to the recording, publication, and promotion of their likeness, voice, and statements",
    ],
  },
  {
    title: "6. Sponsorship and Partnerships",
    body: "By submitting a sponsorship or partnership inquiry, you acknowledge that:",
    bullets: [
      "Submission of an inquiry does not constitute a binding agreement",
      "All sponsorship arrangements are subject to a separate written agreement to be negotiated in good faith",
      "GoTalk Studios reserves the right to decline any sponsorship proposal that conflicts with our editorial values or brand integrity",
      "GoTalk Studios does not guarantee specific viewership, reach, or outcomes from any sponsorship arrangement",
    ],
  },
  {
    title: "7. Third-Party Content and Links",
    body: "Our Website embeds content from YouTube and may link to third-party websites. These are provided for your convenience only. GoTalk Studios has no control over the content of third-party sites and accepts no responsibility for them or for any loss or damage arising from your use of them.",
  },
  {
    title: "8. Disclaimer of Warranties",
    body: `The Website and its content are provided on an 'as is' and 'as available' basis without any warranties of any kind, either express or implied. GoTalk Studios does not warrant that the Website will be uninterrupted, error-free, or free of viruses or other harmful components.

The views and opinions expressed by guests on GoTalk Studios are those of the guests alone and do not necessarily reflect the views of GoTalk Studios, its hosts, or its affiliates.`,
  },
  {
    title: "9. Limitation of Liability",
    body: "To the fullest extent permitted by Malaysian law, GoTalk Studios shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of — or inability to use — this Website or its content, even if we have been advised of the possibility of such damages.",
  },
  {
    title: "10. Indemnification",
    body: "You agree to indemnify, defend, and hold harmless GoTalk Studios, its co-founders, hosts, employees, and affiliates from any claims, damages, losses, liabilities, costs, and expenses (including legal fees) arising from your use of the Website, your violation of these Terms, or your infringement of any third-party rights.",
  },
  {
    title: "11. Changes to These Terms",
    body: "GoTalk Studios reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the Website. Your continued use of the Website following any changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.",
  },
  {
    title: "12. Termination",
    body: "We reserve the right to restrict or terminate your access to the Website at our sole discretion, without notice, if we believe you have violated these Terms of Service or applicable law.",
  },
  {
    title: "13. Governing Law",
    body: "These Terms of Service shall be governed by and construed in accordance with the laws of Malaysia. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Malaysia.",
  },
  {
    title: "14. Contact Us",
    body: "If you have any questions about these Terms of Service, please contact us:",
    bullets: [
      "Email: hello@gotalkstudios.com",
      "Website: gotalkstudios.com",
      "Location: Kuching, Sarawak, Malaysia",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-[#111111] min-h-screen">

        {/* Page Header */}
        <div className="relative bg-[#111111] border-b border-white/10 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CC0000]" />
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-[#CC0000]" />
              <span className="text-[#CC0000] text-xs font-bold tracking-[0.3em] uppercase">
                Legal
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-bebas-neue)] text-5xl lg:text-7xl text-white tracking-wide mb-4">
              Terms of Service
            </h1>
            <p className="text-white/40 text-sm tracking-widest uppercase">
              Effective Date: 7 April 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
          <p className="text-white/60 leading-relaxed mb-12">
            These Terms of Service govern your use of the GoTalk Studios website and services. Please read them carefully.
          </p>

          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-[#CC0000] tracking-wide mb-4">
                  {section.title}
                </h2>
                {section.body && (
                  <p className="text-white/70 leading-relaxed mb-4 whitespace-pre-line">
                    {section.body}
                  </p>
                )}
                {section.bullets && (
                  <ul className="space-y-2 mb-4">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-[#CC0000] mt-2 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-xs text-white/30 tracking-widest uppercase">Last updated: 7 April 2025</p>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
