/** A page-load seed keeps scenery stable through StrictMode, resizes, and navigation. */
export function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0
    return value / 4294967296
  }
}

export function wrap(value: number, range: number) {
  return ((value % range) + range) % range
}

/** Integer raster primitives avoid antialiased vector edges on the pixel grid. */
export function pixelLine(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, thickness = 1) {
  let x = Math.round(x0)
  let y = Math.round(y0)
  const endX = Math.round(x1)
  const endY = Math.round(y1)
  const dx = Math.abs(endX - x)
  const dy = -Math.abs(endY - y)
  const sx = x < endX ? 1 : -1
  const sy = y < endY ? 1 : -1
  let error = dx + dy
  for (;;) {
    ctx.fillRect(x, y, thickness, thickness)
    if (x === endX && y === endY) break
    const twiceError = error * 2
    if (twiceError >= dy) { error += dy; x += sx }
    if (twiceError <= dx) { error += dx; y += sy }
  }
}

export function pixelDisc(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  const r = Math.max(1, Math.round(radius))
  const x = Math.round(cx)
  const y = Math.round(cy)
  for (let row = -r; row <= r; row++) {
    const span = Math.floor(Math.sqrt(r * r - row * row))
    ctx.fillRect(x - span, y + row, span * 2 + 1, 1)
  }
}
