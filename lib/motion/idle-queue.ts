'use client'

type Task = () => void

const queue = new Set<Task>()
let scheduled = false
let fontsReady: Promise<unknown> | null = null

/** Runs queued tasks while the browser is idle, a few per idle period. */
function run(deadline?: IdleDeadline) {
  scheduled = false
  let first = true
  for (const task of queue) {
    // Always make progress, then stop once the idle period is nearly used up.
    if (!first && deadline && !deadline.didTimeout && deadline.timeRemaining() < 6) break
    first = false
    queue.delete(task)
    task()
  }
  if (queue.size > 0) schedule()
}

function schedule() {
  if (scheduled) return
  scheduled = true
  // Wait for web fonts so text is measured once, with the final faces.
  fontsReady ??= document.fonts?.ready ?? Promise.resolve()
  void fontsReady.then(() => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
    else setTimeout(() => run(), 300)
  })
}

/**
 * Queues work for idle time, after fonts load. Returns a function that
 * removes the task if it has not run yet (for example because the caller
 * needed it sooner and ran it directly).
 */
export function whenIdle(task: Task): () => void {
  queue.add(task)
  schedule()
  return () => queue.delete(task)
}
