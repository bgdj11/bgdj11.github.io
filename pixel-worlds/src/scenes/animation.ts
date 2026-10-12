type FrameListener = (deltaSeconds: number) => void

const listeners = new Set<FrameListener>()
const frameInterval = 1000 / 24
let request = 0
let lastFrame = 0
let lastPaint = 0

/** All visible worlds share one frame loop. No subscribers means no scheduled work. */
function frame(now: number) {
  request = 0
  if (now - lastFrame >= frameInterval) {
    const delta = Math.min((now - lastPaint) / 1000, 0.08)
    lastFrame = now - ((now - lastFrame) % frameInterval)
    lastPaint = now
    for (const listener of listeners) listener(delta)
  }
  if (listeners.size) request = window.requestAnimationFrame(frame)
}

export function subscribeToSceneFrames(listener: FrameListener) {
  listeners.add(listener)
  if (!request) {
    lastFrame = lastPaint = performance.now()
    request = window.requestAnimationFrame(frame)
  }
  return () => {
    listeners.delete(listener)
    if (!listeners.size) {
      window.cancelAnimationFrame(request)
      request = 0
    }
  }
}
