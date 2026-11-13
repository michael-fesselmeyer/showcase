import { cacheLife } from 'next/cache'
import { ImageResponse } from 'next/og'
import { siteConfig } from '@/site.config'

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

const INK = '#0a090b'
const PAPER = '#f3efe8'
const MUTED = '#a8a39b'
const FROM = '#ff7a1a'
const TO = '#ff2e93'

/**
 * Loads a subset of a Google font (only the glyphs in `text`) as TTF,
 * which the image renderer needs. Runs at build time, when the images are
 * generated; if the font cannot be fetched the image still renders with the
 * default face.
 */
async function loadFont(family: string, text: string) {
  'use cache'
  cacheLife('max')
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`
    const css = await (await fetch(url)).text()
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
    if (!src) return null
    return await (await fetch(src)).arrayBuffer()
  } catch {
    return null
  }
}

const displayFamily = (italic: boolean) => `Fraunces:ital,opsz,wght@${italic ? 1 : 0},144,300`
const textFamily = 'Instrument+Sans:wght@400'

type OgCardProps = {
  eyebrow: string
  title: string
  /** Optional italic gradient word appended to the title. */
  accent?: string
  footer: string
}

/** The shared Open Graph card: dark, editorial, brand gradient glow. */
export async function renderOgCard({ eyebrow, title, accent, footer }: OgCardProps) {
  const wordmark = siteConfig.brand.wordmark
  const [text, regular, italic] = await Promise.all([
    loadFont(textFamily, `${eyebrow.toUpperCase()}${footer}`),
    loadFont(displayFamily(false), `${title} `),
    loadFont(displayFamily(true), `${wordmark}.${accent ?? ''}`),
  ])

  // The first font is the renderer's default, so the text face goes first.
  const fonts = [
    text && { name: 'Text', data: text, style: 'normal' as const, weight: 400 as const },
    regular && { name: 'Display', data: regular, style: 'normal' as const, weight: 300 as const },
    italic && { name: 'Display', data: italic, style: 'italic' as const, weight: 300 as const },
  ].filter((font) => font !== null)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: `radial-gradient(60% 80% at 88% 18%, ${TO}55, transparent 70%), radial-gradient(50% 70% at 100% 90%, ${FROM}44, transparent 70%), ${INK}`,
        color: PAPER,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Display',
            fontSize: 40,
            fontStyle: 'italic',
            letterSpacing: -1,
          }}
        >
          {wordmark}
          <span style={{ color: TO }}>.</span>
        </div>
        <div style={{ fontSize: 20, letterSpacing: 4, textTransform: 'uppercase', color: MUTED }}>
          {eyebrow}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Display',
          fontSize: title.length > 40 ? 76 : 96,
          lineHeight: 1,
          letterSpacing: -3,
          maxWidth: 1000,
        }}
      >
        {title}
        {accent && (
          <span
            style={{
              fontStyle: 'italic',
              backgroundImage: `linear-gradient(100deg, ${FROM}, ${TO})`,
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {accent}
          </span>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: `1px solid ${PAPER}33`,
          paddingTop: 24,
          fontSize: 22,
          color: MUTED,
        }}
      >
        <span>{footer}</span>
        <span
          style={{
            display: 'flex',
            width: 120,
            height: 4,
            background: `linear-gradient(90deg, ${FROM}, ${TO})`,
            marginTop: 10,
          }}
        />
      </div>
    </div>,
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  )
}
