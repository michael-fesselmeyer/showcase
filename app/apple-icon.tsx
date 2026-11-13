import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** Home-screen icon: the brand dot on ink. */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a090b',
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 999,
          background: 'linear-gradient(135deg, #ff7a1a, #ff2e93)',
        }}
      />
    </div>,
    size,
  )
}
