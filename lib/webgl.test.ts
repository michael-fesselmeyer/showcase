import { describe, expect, it } from 'vitest'
import { hasFastWebGL, isSoftwareRenderer } from '@/lib/webgl'

describe('isSoftwareRenderer', () => {
  it.each([
    'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)',
    'Google SwiftShader',
    'llvmpipe (LLVM 15.0.7, 256 bits)',
    'Microsoft Basic Render Driver',
  ])('flags %s', (renderer) => {
    expect(isSoftwareRenderer(renderer)).toBe(true)
  })

  it.each([
    'ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)',
    'Adreno (TM) 740',
    'Apple GPU',
    'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)',
  ])('accepts %s', (renderer) => {
    expect(isSoftwareRenderer(renderer)).toBe(false)
  })
})

describe('hasFastWebGL', () => {
  it('is false where WebGL is unavailable', () => {
    // jsdom has no WebGL implementation.
    expect(hasFastWebGL()).toBe(false)
  })
})
