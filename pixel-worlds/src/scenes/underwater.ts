import { pixelLine, seededRandom, wrap } from './pixels'
import type { SceneRenderer } from './types'

const TAU = Math.PI * 2

/** Side-on water with a shimmering surface and light travelling through it.
 * All detail belongs to the water field; there are no separate wave illustrations. */
export function createUnderwaterScene(seed: number): SceneRenderer {
  const random = seededRandom(seed)
  const waves = Array.from({ length: 4 }, (_, i) => ({
    frequency: [1.6, 4.3, 11, 27][i] * (0.9 + random() * 0.2),
    amplitude: [1, 0.26, 0.08, 0.025][i],
    speed: [0.68, -0.94, 1.45, -1.85][i], phase: random() * TAU,
  }))
  const shafts = Array.from({ length: 7 }, (_, i) => ({
    x: (i + 0.35 + random() * 0.3) / 7,
    width: 0.012 + random() * 0.016,
    length: 0.6 + random() * 0.38,
    lean: (random() - 0.5) * 0.3,
    phase: random() * TAU,
  }))
  const reflections = Array.from({ length: 120 }, () => ({
    x: random(), depth: random() ** 1.5,
    length: 0.01 + random() * 0.034,
    speed: 0.55 + random() * 0.7,
    phase: random() * TAU,
  }))
  const ripples = Array.from({ length: 10 }, (_, i) => ({
    x: i / 10 + random() * 0.06, depth: 0.03 + random() * 0.21,
    length: 0.03 + random() * 0.045, phase: random() * TAU,
  }))
  const bubbles = Array.from({ length: 10 }, (_, i) => ({
    x: i % 2 ? 0.85 + random() * 0.14 : 0.01 + random() * 0.14,
    depth: random(), radius: 1 + random() * 2.4,
    speed: 2.4 + random() * 3.2, phase: random() * TAU,
  }))
  let surface = new Int16Array(0)

  return ({ ctx, width, height, time, scroll, compact, palette }) => {
    if (surface.length !== width) surface = new Int16Array(width)
    const waterline = Math.round(height * (compact ? 0.22 : 0.43) + scroll * 7)
    const amplitude = Math.min(compact ? 4 : 8, Math.max(1, width * 0.018))
    const depth = Math.max(1, height - waterline)
    const sample = (x: number, layer = 0) => waves.reduce((sum, wave) => sum
      + Math.sin(x / width * TAU * wave.frequency + time * wave.speed + wave.phase + layer * 0.8)
      * wave.amplitude, 0) * amplitude * (1 - layer * 0.22)
    const surfaceAt = (x: number) => surface[Math.max(0, Math.min(width - 1, Math.round(x)))]

    ctx.fillStyle = palette.background
    ctx.fillRect(0, 0, width, height)
    // The shallow water surface has several continuous, low rolling contours.
    for (let layer = 2; layer >= 0; layer--) {
      ctx.fillStyle = ['#0a4251', '#1b7783', '#145462'][layer]
      for (let x = 0; x < width; x++) {
        const y = Math.round(waterline + sample(x + scroll * layer * 9, layer) - layer * 3)
        ctx.fillRect(x, y, 2, height - y)
        if (layer === 0) surface[x] = y
      }
    }

    // One solid base and clipped optics prevent seams during fractional zoom.
    ctx.save()
    ctx.beginPath(); ctx.moveTo(0, height)
    for (let x = 0; x < width; x++) ctx.lineTo(x, surface[x])
    ctx.lineTo(width, surface[width - 1]); ctx.lineTo(width, height); ctx.closePath(); ctx.clip()
    ctx.fillStyle = '#092d3e'
    ctx.fillRect(0, waterline - amplitude * 2, width, depth + amplitude * 2)

    // Irregular blocks of transmitted light use discrete palette steps. These
    // moving contours suggest depth without interpolated colours or gradients.
    // Complete each colour band before the next: overlapping columns must not
    // repaint a darker stripe over the neighbouring shallow-water column.
    for (let band = 0; band < 2; band++) {
      ctx.fillStyle = band === 0 ? '#0c4353' : '#105b68'
      for (let x = 0; x < width; x += 2) {
        const bend = Math.sin(x * 0.017 + time * 0.29 + waves[0].phase) * depth * 0.028
        ctx.fillRect(x, surface[x], 3, Math.max(1,
          depth * (band === 0 ? 0.47 : 0.17) + bend * (band === 0 ? 1 : 0.4)))
      }
    }

    // Shafts widen beneath the surface and sway with refraction. Their mint
    // source and blue-green body follow the same restricted pixel palette.
    for (const shaft of shafts) {
      const origin = width * shaft.x + Math.sin(time * 0.33 + shaft.phase) * width * 0.016
      const start = surfaceAt(origin)
      const length = Math.max(1, depth * shaft.length)
      for (let y = 2; y < length; y += 2) {
        const t = y / length
        const offset = y * shaft.lean + Math.sin(t * 2.8 + time * 0.28 + shaft.phase) * (1 + t * 4)
        const span = width * shaft.width * (0.45 + t * 1.6)
        ctx.fillStyle = t < 0.17 ? '#207e88' : t < 0.53 ? '#165b6e' : '#104355'
        ctx.fillRect(Math.round(origin + offset - span / 2), start + y, Math.max(1, Math.round(span)), 2)
        // A broken brighter core, so the shaft remains light rather than a pole.
        if (t < 0.58 && Math.sin(t * 15 + time * 0.7 + shaft.phase) > -0.3) {
          ctx.fillStyle = t < 0.14 ? '#43b4b1' : '#217a87'
          ctx.fillRect(Math.round(origin + offset - span * 0.15), start + y, Math.max(1, Math.round(span * 0.28)), 2)
        }
      }
    }

    // Horizontal cyan/mint reflections, like light broken into short strokes on
    // rippling water. They move with the surface instead of floating in the air.
    for (let i = 0; i < reflections.length; i++) {
      const reflection = reflections[i]
      if (compact && i % 2) continue
      const x = wrap(reflection.x * width + time * reflection.speed * 1.25
        + Math.sin(time * 0.6 + reflection.phase) * 3, width + 14) - 7
      const near = reflection.depth < 0.3
      const y = surfaceAt(x) + 3 + reflection.depth * depth * 0.78
        + Math.sin(time * 0.7 + reflection.phase) * 1.3
      const shimmer = Math.sin(time * 1.4 + reflection.phase)
      const length = Math.max(2, Math.round(width * reflection.length * (0.7 + shimmer * 0.2)))
      ctx.fillStyle = near ? shimmer > 0.65 ? '#c4f4df' : shimmer > -0.2 ? '#61cfcc' : '#2b969f'
        : shimmer > 0.5 ? '#258392' : '#155667'
      ctx.fillRect(Math.round(x), Math.round(y), length, 1)
      if (near && shimmer > 0.35) {
        ctx.fillStyle = '#29909a'
        ctx.fillRect(Math.round(x + length * 0.3), Math.round(y + 1), Math.max(1, Math.round(length * 0.55)), 1)
        ctx.fillRect(Math.round(x + length + 3), Math.round(y), 2, 1)
      }
    }

    for (const ripple of ripples) {
      const x = ripple.x * width + Math.sin(time * 0.33 + ripple.phase) * 5
      const y = surfaceAt(x) + 5 + depth * ripple.depth
      const radius = width * ripple.length * (0.9 + Math.sin(time * 0.8 + ripple.phase) * 0.13)
      ctx.fillStyle = '#49b8bb'
      // Broken, flattened rings are highlights on the water, not outlined disks.
      for (let i = 0; i < 24; i++) {
        const angle = i / 24 * TAU
        if (Math.sin(angle * 3 + time * 0.6 + ripple.phase) < 0.15) continue
        ctx.fillRect(Math.round(x + Math.cos(angle) * radius), Math.round(y + Math.sin(angle) * 2), 2, 1)
      }
    }

    for (let i = 0; i < bubbles.length; i++) {
      if (compact && i % 3) continue
      const bubble = bubbles[i]
      const x = width * bubble.x + Math.sin(time * 0.65 + bubble.phase) * (compact ? 1 : 3)
      const travel = Math.max(1, height - surfaceAt(x) - 10)
      const y = surfaceAt(x) + 7 + wrap(bubble.depth * travel - time * bubble.speed, travel)
      const radius = Math.max(1, Math.round(bubble.radius * (compact ? 0.65 : 1)))
      for (let side = 0; side < 12; side++) {
        const angle = side / 12 * TAU
        const next = (side + 1) / 12 * TAU
        ctx.fillStyle = side >= 6 && side <= 9 ? '#b4eee0' : '#3f9fae'
        pixelLine(ctx, x + Math.cos(angle) * radius, y + Math.sin(angle) * radius,
          x + Math.cos(next) * radius, y + Math.sin(next) * radius)
      }
      ctx.fillStyle = '#ddf9e9'
      ctx.fillRect(Math.round(x - radius * 0.35), Math.round(y - radius * 0.55), 1, 1)
    }
    ctx.restore()

    // A single continuous waterline catches light. No decorative crest shapes.
    for (let x = 0; x < width; x++) {
      const shimmer = Math.sin(x * 0.13 - time * 1.5 + waves[1].phase)
      ctx.fillStyle = '#207d8c'; ctx.fillRect(x, surface[x] + 1, 2, 2)
      ctx.fillStyle = shimmer > 0.65 ? '#c4f4df' : shimmer > -0.25 ? '#66d1d0' : '#359ea9'
      ctx.fillRect(x, surface[x], 2, 1)
    }
  }
}
