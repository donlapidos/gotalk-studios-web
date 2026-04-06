"use client";

import { useState } from "react";

// ─── Form Input ───────────────────────────────────────────────────────────────

function Field({
  label,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">
        {label}
        {required && <span className="text-[#CC0000] ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-[#1A1A1A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[#CC0000] transition-colors"
      />
    </div>
  );
}

function TextareaField({
  label,
  placeholder,
  rows = 5,
  required = false,
}: {
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">
        {label}
        {required && <span className="text-[#CC0000] ml-1">*</span>}
      </label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        className="bg-[#1A1A1A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[#CC0000] transition-colors resize-none"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  required = false,
}: {
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">
        {label}
        {required && <span className="text-[#CC0000] ml-1">*</span>}
      </label>
      <select className="bg-[#1A1A1A] border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#CC0000] transition-colors appearance-none">
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#1A1A1A]">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Guest Form ───────────────────────────────────────────────────────────────

export function GuestInquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="border border-white/10 bg-[#161616] p-8 lg:p-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-white/30 font-bold tracking-[0.3em] uppercase border border-white/10 px-2 py-0.5">
          PATH 01
        </span>
      </div>
      <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-white tracking-wide mb-2">
        GUEST INQUIRIES
      </h2>
      <p className="text-sm text-white/45 mb-8">
        Pitch your appearance on GoTalk. We read every submission.
      </p>

      {submitted ? (
        <div className="border border-[#CC0000]/30 bg-[#CC0000]/5 p-6 text-center">
          <p className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-1">
            Submission Received.
          </p>
          <p className="text-sm text-white/50">
            We&apos;ll be in touch soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full Name" placeholder="Your full name" required />
            <Field
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <Field
            label="Social Media / Website"
            placeholder="instagram.com/yourhandle or yourwebsite.com"
          />
          <TextareaField
            label="Your Pitch"
            placeholder="What is your story? Why does it belong on GoTalk?"
            rows={6}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#CC0000] text-white text-xs font-bold tracking-[0.2em] uppercase py-4 hover:bg-[#AA0000] transition-colors"
          >
            SUBMIT INQUIRY
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Sponsorship Form ─────────────────────────────────────────────────────────

export function SponsorshipForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="border border-white/10 bg-[#161616] p-8 lg:p-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-white/30 font-bold tracking-[0.3em] uppercase border border-white/10 px-2 py-0.5">
          PATH 02
        </span>
      </div>
      <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-white tracking-wide mb-2">
        SPONSORSHIP &amp; PARTNERSHIPS
      </h2>
      <p className="text-sm text-white/45 mb-8">
        Partner with Sarawak&apos;s most compelling media platform. Reach
        engaged, local audiences who care about the people and ideas shaping our
        land.
      </p>

      {submitted ? (
        <div className="border border-[#CC0000]/30 bg-[#CC0000]/5 p-6 text-center">
          <p className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-1">
            Proposal Request Sent.
          </p>
          <p className="text-sm text-white/50">
            Our team will reach out within 2 business days.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field
              label="Company / Brand Name"
              placeholder="Your company name"
              required
            />
            <Field
              label="Contact Person"
              placeholder="Your name"
              required
            />
          </div>
          <Field
            label="Business Email"
            type="email"
            placeholder="you@company.com"
            required
          />
          <SelectField
            label="Budget Range"
            options={[
              "Select a range...",
              "Under RM 5,000",
              "RM 5,000 – RM 15,000",
              "RM 15,000 – RM 50,000",
              "RM 50,000+",
              "Open to discussion",
            ]}
          />
          <TextareaField
            label="Partnership Goals"
            placeholder="What are you hoping to achieve through this partnership?"
            rows={4}
          />
          <button
            type="submit"
            className="w-full border border-[#CC0000] text-[#CC0000] text-xs font-bold tracking-[0.2em] uppercase py-4 hover:bg-[#CC0000] hover:text-white transition-all"
          >
            REQUEST PROPOSAL
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Studio Info ──────────────────────────────────────────────────────────────

export function StudioInfo() {
  return (
    <div className="border border-white/10 bg-[#161616] p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-16">
        <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-wide flex-shrink-0">
          Find Us
        </h3>
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 flex-1">
          {[
            { label: "Studio", value: "GoTalk Studios — Kuching, Sarawak, Malaysia", href: undefined },
            { label: "Email", value: "hello@gotalkstudios.com", href: "mailto:hello@gotalkstudios.com" },
            { label: "Instagram", value: "@gotalkstudios", href: "https://instagram.com/gotalkstudios" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="w-1 h-4 bg-[#CC0000] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1">{item.label}</p>
                {item.href ? (
                  <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm text-white/65 hover:text-white transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-white/65">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
