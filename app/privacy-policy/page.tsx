import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:       "Privacy Policy | GoTalk Studios",
  description: "How GoTalk Studios collects, uses, and protects your personal information.",
  openGraph: {
    title:       "Privacy Policy | GoTalk Studios",
    description: "How GoTalk Studios collects, uses, and protects your personal information.",
    url:         "https://gotalkstudios.com/privacy-policy",
    type:        "website",
  },
  twitter: {
    title:       "Privacy Policy | GoTalk Studios",
    description: "How GoTalk Studios collects, uses, and protects your personal information.",
  },
};

const sections = [
  {
    title: "1. Introduction",
    body: `GoTalk Studios ('we', 'us', or 'our') operates the website gotalkstudios.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, watch our content, submit a guest inquiry, or engage with us as a sponsor or partner.

By using our website, you consent to the practices described in this Privacy Policy. If you do not agree with this policy, please do not use our website.`,
  },
  {
    title: "2. Information We Collect",
    body: "We may collect the following types of personal information:",
    bullets: [
      "Contact information — name, email address, phone number, company name, when submitted via our contact or inquiry forms",
      "Communication data — messages, pitches, and correspondence you send to us via the website or email",
      "Usage data — pages visited, time spent on the site, browser type, device information, and IP address collected automatically via analytics tools",
      "Sponsorship and partnership information — company details, budget ranges, and partnership goals submitted via the sponsorship form",
      "Guest application information — social media profiles, website links, and pitch content submitted via the guest inquiry form",
    ],
  },
  {
    title: "3. How We Use Your Information",
    body: "We use the information we collect for the following purposes:",
    bullets: [
      "To respond to guest inquiries and sponsorship proposals",
      "To communicate with you regarding your application, partnership, or enquiry",
      "To improve and maintain our website and content",
      "To send relevant updates, newsletters, or promotional materials where you have given consent",
      "To analyse website usage and improve user experience",
      "To comply with legal obligations under Malaysian law",
    ],
  },
  {
    title: "4. How We Share Your Information",
    body: "GoTalk Studios does not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:",
    bullets: [
      "Service providers — trusted third-party services that assist us in operating our website (e.g. Vercel for hosting, Sanity for content management) who are contractually obligated to keep your data confidential",
      "Legal requirements — if required to do so by law or in response to valid requests by public authorities in Malaysia",
      "Business transfers — in the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction",
    ],
  },
  {
    title: "5. Cookies and Tracking",
    body: "Our website may use cookies and similar tracking technologies to enhance your browsing experience and analyse site traffic. You can control cookie settings through your browser preferences. Please note that disabling certain cookies may affect the functionality of the website.",
  },
  {
    title: "6. Third-Party Links and Embeds",
    body: "Our website embeds YouTube videos and may contain links to third-party websites. These third-party services have their own privacy policies, and we are not responsible for their practices. We encourage you to review the privacy policies of any third-party sites you visit, including YouTube (operated by Google LLC).",
  },
  {
    title: "7. Data Retention",
    body: "We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by Malaysian law. Contact form submissions and guest inquiries are retained for a maximum of 2 years unless an ongoing relationship exists.",
  },
  {
    title: "8. Your Rights Under Malaysian Law",
    body: "Under the Personal Data Protection Act 2010 (PDPA) of Malaysia, you have the right to:",
    bullets: [
      "Access the personal data we hold about you",
      "Request correction of inaccurate or incomplete personal data",
      "Withdraw consent for the processing of your personal data",
      "Request that we cease processing your personal data for direct marketing purposes",
    ],
    footer: "To exercise any of these rights, please contact us at hello@gotalkstudios.com. We will respond to your request within 21 days.",
  },
  {
    title: "9. Data Security",
    body: "We implement reasonable technical and organisational measures to protect your personal information from unauthorised access, disclosure, alteration, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    title: "10. Children's Privacy",
    body: "Our website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately at hello@gotalkstudios.com.",
  },
  {
    title: "11. Changes to This Privacy Policy",
    body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically. Your continued use of the website following any changes constitutes your acceptance of the updated policy.",
  },
  {
    title: "12. Contact Us",
    body: "If you have any questions or concerns about this Privacy Policy, please contact us:",
    bullets: [
      "Email: hello@gotalkstudios.com",
      "Website: gotalkstudios.com",
      "Location: Kuching, Sarawak, Malaysia",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-white/40 text-sm tracking-widest uppercase">
              Effective Date: 7 April 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
          <p className="text-white/60 leading-relaxed mb-12">
            These documents govern your use of the GoTalk Studios website and services. Please read them carefully.
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
                {section.footer && (
                  <p className="text-white/70 leading-relaxed text-sm">{section.footer}</p>
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
