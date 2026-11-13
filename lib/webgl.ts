/** Renderer names reported by WebGL implementations that run on the CPU. */
const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|software|basic render driver|microsoft basic/i

export function isSoftwareRenderer(renderer: string) {
  return SOFTWARE_RENDERER.test(renderer)
}

/**
 * True when WebGL is available and runs on a GPU. Without one (some older
 * phones, locked-down machines, CI browsers) a shader renders on the CPU and
 * makes the page janky, so callers should keep their static fallback.
 *
 * Browsers do not always flag software rendering as a performance caveat,
 * so the renderer name is checked as well.
 */
export function hasFastWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const options: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true }
    const gl: WebGLRenderingContext | WebGL2RenderingContext | null =
      canvas.getContext('webgl2', options) ?? canvas.getContext('webgl', options)
    if (!gl) return false

    const debug = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = String(
      gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? '',
    )
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return !isSoftwareRenderer(renderer)
  } catch {
    return false
  }
}
