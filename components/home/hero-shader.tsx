'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/motion/use-media-query'

// The WebGL bundle loads only in the browser, after the page is idle.
const MeshGradient = dynamic(
  () => import('@paper-design/shaders-react').then((mod) => mod.MeshGradient),
  { ssr: false },
)

function whenIdle(callback: () => void) {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 2000 })
    return () => window.cancelIdleCallback(id)
  }
  const id = setTimeout(callback, 600)
  return () => clearTimeout(id)
}

/**
 * True when WebGL is hardware accelerated. Without a GPU (some older phones,
 * locked-down machines, headless browsers) the shader would render on the
 * CPU and make scrolling janky, so the CSS gradient stays instead.
 */
function hasFastWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const options: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true }
    const gl: WebGLRenderingContext | WebGL2RenderingContext | null =
      canvas.getContext('webgl2', options) ?? canvas.getContext('webgl', options)
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return gl !== null
  } catch {
    return false
  }
}

/** Reads the brand tokens so the shader follows the accent defined in CSS. */
function readPalette() {
  const style = getComputedStyle(document.documentElement)
  const token = (name: string) => style.getPropertyValue(name).trim()
  const ink = token('--ink-950')
  return [ink, token('--brand-from'), token('--brand-to'), '#4a1052']
}

/**
 * Animated mesh-gradient background for the hero. A CSS gradient in the same
 * colours paints first, so the largest contentful element is the headline,
 * never the canvas, and it remains the background where WebGL is slow. The shader pauses itself when off screen or when the tab
 * is hidden, and holds still for reduced motion.
 */
export function HeroShader() {
  const reduced = usePrefersReducedMotion()
  const [palette, setPalette] = useState<string[] | null>(null)

  useEffect(
    () =>
      whenIdle(() => {
        if (hasFastWebGL()) setPalette(readPalette())
      }),
    [],
  )

  return (
    <div aria-hidden className="hero-fallback absolute inset-0 -z-10 overflow-hidden">
      {palette && (
        <MeshGradient
          className="hero-canvas absolute inset-0"
          colors={palette}
          distortion={0.9}
          swirl={0.55}
          speed={reduced ? 0 : 0.22}
          minPixelRatio={1}
          maxPixelCount={1280 * 800}
        />
      )}
      {/* Keep the text corner dark enough for contrast; let the colour bloom elsewhere. */}
      <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_0%_100%,var(--ink-950)_30%,transparent_75%)]" />
      <div className="absolute inset-0 bg-linear-to-t from-ink-950 from-0% to-transparent to-30%" />
    </div>
  )
}
