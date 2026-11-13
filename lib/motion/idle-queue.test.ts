import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('whenIdle', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('runs queued tasks later, not synchronously', async () => {
    const { whenIdle } = await import('@/lib/motion/idle-queue')
    const task = vi.fn()
    whenIdle(task)
    expect(task).not.toHaveBeenCalled()
    await vi.runAllTimersAsync()
    expect(task).toHaveBeenCalledOnce()
  })

  it('skips a task cancelled before it runs', async () => {
    const { whenIdle } = await import('@/lib/motion/idle-queue')
    const kept = vi.fn()
    const dropped = vi.fn()
    whenIdle(kept)
    const cancel = whenIdle(dropped)
    cancel()
    await vi.runAllTimersAsync()
    expect(kept).toHaveBeenCalledOnce()
    expect(dropped).not.toHaveBeenCalled()
  })
})
