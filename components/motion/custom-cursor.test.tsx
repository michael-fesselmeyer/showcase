import { describe, expect, it } from 'vitest'
import { cursorStateFor } from '@/components/motion/custom-cursor'

function render(html: string) {
  document.body.innerHTML = html
  return (selector: string) => document.querySelector(selector)
}

describe('cursorStateFor', () => {
  it('is default over plain content and with no target', () => {
    const $ = render('<p id="t">Text</p>')
    expect(cursorStateFor($('#t'))).toEqual({ variant: 'default' })
    expect(cursorStateFor(null)).toEqual({ variant: 'default' })
  })

  it('grows over links and buttons, including their children', () => {
    const $ = render('<a href="/work"><span id="t">Work</span></a><button id="b">Go</button>')
    expect(cursorStateFor($('#t'))).toEqual({ variant: 'interactive' })
    expect(cursorStateFor($('#b'))).toEqual({ variant: 'interactive' })
  })

  it('steps aside over text fields', () => {
    const $ = render('<input id="t" />')
    expect(cursorStateFor($('#t'))).toEqual({ variant: 'text' })
  })

  it('shows the nearest label, which wins over the link inside it', () => {
    const $ = render(
      '<article data-cursor-label="View"><a href="/x"><img id="t" alt="" /></a></article>',
    )
    expect(cursorStateFor($('#t'))).toEqual({ variant: 'label', label: 'View' })
  })
})
