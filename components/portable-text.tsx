import SanityImage from '@/components/SanityImage'
import type { SanityImageValue } from '@/sanity/lib/image'

// Shared PortableText renderers for blog posts and guest bios.
// Marks are identical across both; block styles differ in scale.

const marks = {
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="text-white font-bold">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => {
    const raw = value?.href ?? ''
    const href = /^https?:|^mailto:/.test(raw) ? raw : '#'
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#CC0000] underline hover:text-white transition-colors"
      >
        {children}
      </a>
    )
  },
}

export const blogPtComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 text-white/75 leading-relaxed">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl text-white tracking-wide mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-wide mt-8 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-[#CC0000] pl-5 my-6 text-white/60 italic">
        {children}
      </blockquote>
    ),
  },
  marks,
  types: {
    image: ({ value }: { value: SanityImageValue & { caption?: string } }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden">
            <SanityImage
              image={value}
              alt=""
              width={900}
              height={506}
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs text-white/35 mt-2 tracking-wide">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export const guestPtComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 text-white/70 leading-relaxed text-sm">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-wide mt-8 mb-3">
        {children}
      </h2>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-[#CC0000] pl-5 my-6 text-white/55 italic text-sm">
        {children}
      </blockquote>
    ),
  },
  marks,
}
