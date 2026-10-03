"use client";

import { useActionState, useId, useState } from "react";
import {
  submitStudioBooking,
  submitGuestInquiry,
  submitSponsorshipInquiry,
} from "@/app/actions/contact";
import { WHATSAPP_URL, CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/contact";

// ─── Form primitives ──────────────────────────────────────────────────────────
//
// Every control here is bound to a real <label for>. Previously 9 of 11 controls
// on this page had no accessible name at all — the visible captions were styled
// <p> elements and the only programmatic hint was a placeholder at 1.90:1.
//
// None of these suppress the focus outline. The global :focus-visible ring in
// globals.css is the indicator; the red border tint is a supplement, not a
// replacement, because at 2.96:1 it never cleared the 3:1 non-text floor.

const LABEL = "text-2xs font-bold tracking-label uppercase text-white/70";
// placeholder at /50 (5.33:1 on surface-raised); /45 measured 4.47:1 — 0.03 short.
const CONTROL =
  "bg-surface-raised border border-white/10 text-white text-sm px-4 py-3 min-h-[48px] placeholder-white/50 focus:border-brand-red transition-colors";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  defaultValue,
  hint,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  hint?: string;
  autoComplete?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL}>
        {label}
        {required && (
          <span className="text-accent ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-describedby={hint ? hintId : undefined}
        className={CONTROL}
      />
      {hint && (
        <p id={hintId} className="text-2xs text-white/55">
          {hint}
        </p>
      )}
    </div>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  rows = 5,
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL}>
        {label}
        {required && (
          <span className="text-accent ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={`${CONTROL} resize-none`}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
}: {
  label: string;
  name: string;
  options: string[];
  /** Rendered as a disabled, unselectable first option so it can never submit. */
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL}>
        {label}
        {required && (
          <span className="text-accent ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        defaultValue={onChange ? undefined : ""}
        className={`${CONTROL} appearance-none disabled:opacity-50`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-surface-raised">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// Invisible to humans (and skipped by screen readers); bots auto-fill it and
// get silently dropped server-side.
function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
      <label>
        Website URL
        <input name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** Errors are announced, and sit next to a submit the user just pressed. */
function FormError({ error }: { error?: string }) {
  return (
    <div role="alert" aria-live="polite" className="min-h-[1.25rem]">
      {error && <p className="text-xs text-accent">{error}</p>}
    </div>
  );
}

function SubmitButton({
  pending,
  children,
  pendingLabel,
  variant = "primary",
}: {
  pending: boolean;
  children: string;
  pendingLabel: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full text-xs font-bold tracking-label uppercase py-4 min-h-[48px] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        variant === "primary"
          ? "bg-brand-red text-white hover:bg-brand-red-hover"
          : "border border-brand-red text-white hover:bg-brand-red"
      }`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Success panel that keeps a record of the submission and offers a way back. */
function SuccessPanel({
  title,
  body,
  summary,
  onReset,
}: {
  title: string;
  body: string;
  summary?: string[];
  onReset: () => void;
}) {
  return (
    <div className="border border-white/10 bg-surface-alt p-8 lg:p-10">
      <div className="border border-brand-red/30 bg-brand-red/5 p-6">
        <p className="font-display text-2xl text-white tracking-wide mb-1">
          {title}
        </p>
        <p className="text-sm text-white/70">{body}</p>

        {summary && summary.length > 0 && (
          <dl className="mt-6 pt-5 border-t border-white/10 space-y-1.5">
            {summary.map((line) => {
              const [key, ...rest] = line.split(": ");
              return (
                <div key={line} className="flex gap-3 text-xs">
                  <dt className="text-white/55 min-w-[7.5rem]">{key}</dt>
                  <dd className="text-white">{rest.join(": ")}</dd>
                </div>
              );
            })}
          </dl>
        )}

        <button
          type="button"
          onClick={onReset}
          className="mt-6 text-2xs font-bold tracking-label uppercase text-accent hover:text-white transition-colors"
        >
          Send another
        </button>
      </div>
    </div>
  );
}

function FormShell({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-white/10 bg-surface-alt p-8 lg:p-10">
      {/* The "PATH 01" / "PATH 02" chips that used to sit here were internal
          jargon; the heading already names each path. */}
      <h2 className="font-display text-3xl text-white tracking-wide mb-2">
        {title}
      </h2>
      <p className="text-sm text-white/70 mb-8 max-w-[60ch]">{blurb}</p>
      {children}
    </div>
  );
}

// ─── Studio Booking ───────────────────────────────────────────────────────────

export type BookableService = {
  name: string;
  pricingRows: { duration: string; price: string }[] | null;
};

export function StudioBookingForm({
  services,
  initialService = "",
}: {
  services: BookableService[];
  /**
   * Deep-linked selection, resolved on the server from ?service=… and passed in.
   *
   * This deliberately does NOT read useSearchParams(). Doing so forced the whole
   * form behind a Suspense boundary during prerender, so it never appeared in the
   * server-rendered HTML — which meant React could not emit the hidden
   * $ACTION_REF inputs, and the form's action degraded to a client-only
   * `javascript:throw`. Taking the param as a prop keeps the form in the SSR
   * output and the Server Action progressively enhanced, like its two siblings.
   */
  initialService?: string;
}) {
  const [state, action, pending] = useActionState(submitStudioBooking, null);
  const [resetKey, setResetKey] = useState(0);

  const matched = services.find((s) => s.name === initialService)?.name ?? "";
  const [override, setOverride] = useState<string | null>(null);
  const service = override ?? matched;
  const setService = setOverride;

  // Packages are derived from the selected service's own pricing rows, so the
  // options can never drift from the published rate card, and the price is
  // confirmed at the moment of selection rather than remembered from /services.
  const packages =
    services
      .find((s) => s.name === service)
      ?.pricingRows?.map((r) => `${r.duration} — RM ${r.price.replace(/^RM\s*/i, "")}`) ?? [];

  if (state?.success) {
    return (
      <SuccessPanel
        title="Booking Request Sent."
        body="We'll confirm availability within two business days, usually on WhatsApp."
        summary={state.summary}
        onReset={() => setResetKey((k) => k + 1)}
      />
    );
  }

  return (
    <FormShell
      title="Book the Studio"
      blurb="Tell us what you need and when. We'll confirm availability and the final rate before anything is locked in."
    >
      <form key={resetKey} action={action} className="relative space-y-5">
        <HoneypotField />

        <SelectField
          name="service"
          label="Service"
          placeholder="Choose a service…"
          options={services.map((s) => s.name)}
          value={service}
          onChange={setService}
          required
        />

        <SelectField
          name="package"
          label="Duration / Package"
          placeholder={service ? "Choose a package…" : "Pick a service first"}
          options={packages}
          disabled={!service || packages.length === 0}
        />

        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            name="preferred_date"
            label="Preferred Date"
            type="date"
            required
          />
          <Field name="alt_date" label="Alternate Date" type="date" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            name="name"
            label="Your Name"
            placeholder="Your full name"
            autoComplete="name"
            required
          />
          <Field
            name="whatsapp"
            label="WhatsApp Number"
            type="tel"
            placeholder="012 888 9999"
            autoComplete="tel"
            hint="Fastest way for us to confirm."
            required
          />
        </div>

        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />

        <TextareaField
          name="notes"
          label="Anything Else?"
          placeholder="How many people, what you're recording, any gear you need."
          rows={4}
        />

        <FormError error={state?.error} />
        <SubmitButton pending={pending} pendingLabel="Sending…">
          Request This Booking
        </SubmitButton>

        {WHATSAPP_URL && (
          <p className="text-2xs text-white/55 text-center">
            In a hurry?{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-white transition-colors font-semibold"
            >
              Message us on WhatsApp
            </a>{" "}
            instead.
          </p>
        )}
      </form>
    </FormShell>
  );
}

// ─── Guest Form ───────────────────────────────────────────────────────────────

export function GuestInquiryForm() {
  const [state, action, pending] = useActionState(submitGuestInquiry, null);
  const [resetKey, setResetKey] = useState(0);

  if (state?.success) {
    return (
      <SuccessPanel
        title="Pitch Received."
        body="We read every submission and reply within two business days."
        onReset={() => setResetKey((k) => k + 1)}
      />
    );
  }

  return (
    <FormShell
      title="Be a Guest"
      blurb="Pitch your appearance on GoTalk. We read every submission."
    >
      <form key={resetKey} action={action} className="relative space-y-5">
        <HoneypotField />
        <div className="grid sm:grid-cols-2 gap-5">
          <Field name="name" label="Full Name" placeholder="Your full name" autoComplete="name" required />
          <Field
            name="email"
            label="Email Address"
            placeholder="you@example.com"
            autoComplete="email"
            required
            type="email"
          />
        </div>
        <Field
          name="social"
          label="Social Media / Website"
          placeholder="instagram.com/yourhandle"
          hint="A profile or site so we can find your work."
        />
        <TextareaField
          name="pitch"
          label="Your Pitch"
          placeholder="What is your story? Why does it belong on GoTalk?"
          rows={6}
          required
        />
        <FormError error={state?.error} />
        <SubmitButton pending={pending} pendingLabel="Sending…" variant="ghost">
          Send My Pitch
        </SubmitButton>
      </form>
    </FormShell>
  );
}

// ─── Sponsorship Form ─────────────────────────────────────────────────────────

export function SponsorshipForm() {
  const [state, action, pending] = useActionState(submitSponsorshipInquiry, null);
  const [resetKey, setResetKey] = useState(0);

  if (state?.success) {
    return (
      <SuccessPanel
        title="Proposal Request Sent."
        body="Our team will reach out within two business days."
        onReset={() => setResetKey((k) => k + 1)}
      />
    );
  }

  return (
    <FormShell
      title="Sponsorship & Partnerships"
      blurb="Partner with Sarawak's most compelling media platform. Reach engaged, local audiences who care about the people and ideas shaping our land."
    >
      <form key={resetKey} action={action} className="relative space-y-5">
        <HoneypotField />
        <div className="grid sm:grid-cols-2 gap-5">
          <Field name="company" label="Company / Brand Name" placeholder="Your company name" autoComplete="organization" required />
          <Field name="contact" label="Contact Person" placeholder="Your name" autoComplete="name" required />
        </div>
        <Field
          name="email"
          label="Business Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
        {/* The placeholder used to be a real, submittable option — "Select a
            range..." arrived in the inbox as the budget. It is disabled now. */}
        <SelectField
          name="budget"
          label="Budget Range"
          placeholder="Select a range…"
          options={[
            "Under RM 5,000",
            "RM 5,000 – RM 15,000",
            "RM 15,000 – RM 50,000",
            "RM 50,000+",
            "Open to discussion",
          ]}
        />
        <TextareaField
          name="goals"
          label="Partnership Goals"
          placeholder="What are you hoping to achieve through this partnership?"
          rows={4}
        />
        <FormError error={state?.error} />
        <SubmitButton pending={pending} pendingLabel="Sending…" variant="ghost">
          Request a Proposal
        </SubmitButton>
      </form>
    </FormShell>
  );
}

// ─── Studio Info ──────────────────────────────────────────────────────────────

export function StudioInfo() {
  const items = [
    { label: "Studio", value: "GoTalk Studios — Kuching, Sarawak, Malaysia", href: undefined },
    ...(WHATSAPP_URL
      ? [{ label: "WhatsApp", value: "Message us", href: WHATSAPP_URL }]
      : []),
    { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { label: "Instagram", value: INSTAGRAM_HANDLE, href: INSTAGRAM_URL },
  ];

  return (
    <div className="border border-white/10 bg-surface-alt p-8">
      <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-16">
        <h2 className="font-display text-2xl text-white tracking-wide flex-shrink-0">
          Find Us
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="w-1 h-4 bg-brand-red mt-1 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-2xs text-white/55 uppercase tracking-wide mb-1.5">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    // Was a 17px-tall tap target on the primary fallback contact
                    // method; the padding brings it to a real touch size.
                    className="inline-flex items-center min-h-[44px] py-1 text-sm text-white/70 hover:text-white transition-colors break-all"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-white/70">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
