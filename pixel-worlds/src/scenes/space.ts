import { fbm } from './noise'
import { pixelDisc, seededRandom, wrap } from './pixels'
import { createPlanetSurface, createSurfaceVariation } from './planetSurface'
import type { PlanetMaterial } from './planetSurface'
import type { PlanetId, PlanetTarget, SpaceFrame } from './spaceTypes'

const TAU = Math.PI * 2
const clamp = (x: number, low = 0, high = 1) => Math.max(low, Math.min(high, x))
const rgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]

/** Fixed world positions: the camera passes these bodies along a curved course.
 * Consecutive encounters overlap in depth, with no chapter-triggered swaps. */
const bodies: { id: PlanetId; label: string; material: PlanetMaterial; x: number; y: number; z: number; radius: number; ring: boolean }[] = [
  { id: 'aurelia', label: 'Aurelia, the ringed world', material: 'terrestrial', x: 1.78, y: 0.76, z: 3.5, radius: 0.81, ring: true },
  { id: 'vesper', label: 'Vesper, the rocky moon', material: 'rocky', x: -1.68, y: -1.22, z: 4.7, radius: 0.29, ring: false },
  { id: 'nereid', label: 'Nereid, the ice world', material: 'ice', x: -1.67, y: 0.75, z: 9.3, radius: 0.9, ring: false },
  { id: 'solis', label: 'Solis, the banded gas giant', material: 'gas', x: 1.83, y: -0.12, z: 15.1, radius: 1.02, ring: true },
  { id: 'ember', label: 'Ember, the volcanic world', material: 'volcanic', x: -1.72, y: 0.92, z: 21.8, radius: 0.84, ring: false },
  { id: 'caelum', label: 'Caelum, the distant world', material: 'terrestrial', x: 1.62, y: 0.62, z: 30.7, radius: 0.92, ring: false },
]

const RING_COLORS = [
  ['#4b3c60', '#8a6c87', '#d4b087', '#817487', '#494258', '#bda69c'],
  ['#504037', '#ad8c62', '#e2c399', '#8b7970', '#484052', '#bfaa8a'],
  ['#283848', '#577b91', '#9cc5c5', '#637988', '#354654', '#bbcfc8'],
  ['#403348', '#86657e', '#d1a4b0', '#806d8c', '#4d3d59', '#bcb0c9'],
]

/** Physical/style traits vary per visit; the accepted flight path stays fixed. */
export function createPlanetSystem(seed: number) {
  let firstTerrestrialPalette = -1
  return bodies.map((body, index) => {
    const planetSeed = seed ^ (12691 + index * 84313)
    const random = seededRandom(planetSeed ^ 0x3c6ef372)
    const surface = createSurfaceVariation(planetSeed)
    if (body.material === 'terrestrial') {
      if (firstTerrestrialPalette < 0) firstTerrestrialPalette = surface.palette
      else if (surface.palette === firstTerrestrialPalette) surface.palette = (surface.palette + 1 + Math.floor(random() * 3)) % 4
    }
    const ring = body.id === 'aurelia' || (body.id !== 'vesper' && random() < (body.material === 'gas' ? 0.78 : body.material === 'volcanic' ? 0.1 : 0.25))
    const moons = Array.from({ length: body.id === 'vesper' ? 0 : Math.floor(random() * 3) }, () => ({
      phase: random() * TAU, speed: 0.06 + random() * 0.1,
      distance: 1.7 + random() * 0.55, inclination: 0.28 + random() * 0.25,
      size: 0.035 + random() * 0.035,
    }))
    return { ...body, seed: planetSeed, surface, ring, moons,
      phase: random() * TAU, tilt: (random() < 0.5 ? -1 : 1) * (0.16 + random() * 0.34),
      axisTilt: (random() - 0.5) * 0.85, size: 0.87 + random() * 0.26,
      spin: (random() < 0.18 ? -1 : 1) * (0.022 + random() * 0.032),
      ringRadius: 1.36 + random() * 0.18, ringWidth: 0.07 + random() * 0.2,
      ringBands: 3 + Math.floor(random() * 4), ringPalette: Math.floor(random() * RING_COLORS.length),
    }
  })
}

/** A small, distant light source, never an expanding full-screen finale. */
function createSun(seed: number) {
  const noise = new Float32Array(48 * 48)
  for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) noise[y * 48 + x] = fbm(x * 0.12, y * 0.12, seed, 3)
  const colors = ['#7d302b', '#c8672c', '#ed943c', '#f3b64e', '#f7d478', '#ffebaa'].map(rgb)
  const sprite = document.createElement('canvas'), context = sprite.getContext('2d')
  let radius = 0, raster: ImageData | undefined, lastStep = -1
  let samples: { offset: number; x: number; y: number; edge: number }[] = []
  return (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, time: number) => {
    const nextRadius = Math.max(1, Math.min(18, Math.round(size)))
    if (context && nextRadius !== radius) {
      radius = nextRadius; sprite.width = sprite.height = radius * 2 + 1
      raster = context.createImageData(sprite.width, sprite.height); samples = []
      for (let y = -radius; y <= radius; y++) for (let x = -radius; x <= radius; x++) {
        const distance = (x * x + y * y) / (radius * radius)
        if (distance > 1) continue
        samples.push({ offset: ((y + radius) * sprite.width + x + radius) * 4,
          x: Math.floor((x / radius + 1) * 20), y: Math.floor((y / radius + 1) * 20), edge: Math.sqrt(1 - distance) })
      }
      lastStep = -1
    }
    const step = Math.floor(time * 6)
    if (raster && context && step !== lastStep) {
      for (const sample of samples) {
        const nx = Math.floor(wrap(sample.x + step * 0.17, 48)), ny = Math.floor(wrap(sample.y + step * 0.07, 48))
        const color = colors[clamp(Math.floor(noise[ny * 48 + nx] * 5 + sample.edge * 2 - 0.7), 0, colors.length - 1)]
        raster.data[sample.offset] = color[0]; raster.data[sample.offset + 1] = color[1]
        raster.data[sample.offset + 2] = color[2]; raster.data[sample.offset + 3] = 255
      }
      context.putImageData(raster, 0, 0); lastStep = step
    }
    if (context) ctx.drawImage(sprite, Math.round(cx) - radius, Math.round(cy) - radius)
  }
}

export function createSpaceScene(seed: number): (frame: SpaceFrame) => PlanetTarget[] {
  const random = seededRandom(seed)
  const stars = Array.from({ length: 155 }, (_, i) => ({ x: random(), y: random(), depth: 0.25 + random() * 1.4,
    phase: random() * TAU, bright: i % 17 === 0, warm: random() > 0.6 }))
  const dust = Array.from({ length: 28 }, () => ({ x: random(), y: random(), depth: random() }))
  const planets = createPlanetSystem(seed).map(body => ({ ...body,
    draw: createPlanetSurface(body.seed, body.material, body.surface),
  }))
  const sun = createSun(seed ^ 17111)

  return ({ ctx, width, height, time, progress, compact, pointer, rotations }) => {
    ctx.globalAlpha = 1; ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#07090d'; ctx.fillRect(0, 0, width, height)
    const p = clamp(progress), travel = p * 28
    const cameraX = Math.sin(p * TAU * 1.1) * 0.22 + pointer.x * 0.025
    const cameraY = Math.sin(p * TAU * 1.5) * 0.1 - pointer.y * 0.02
    const yaw = Math.sin(p * TAU * 1.15) * 0.075
    const pitch = Math.sin(p * TAU * 1.3) * 0.028
    const roll = Math.sin(p * TAU * 1.5) * (compact ? 0.07 : 0.13)
    const cs = Math.cos(roll), sn = Math.sin(roll)
    const focal = Math.min(width * (compact ? 0.68 : 0.9), height * 0.95)
    const originY = compact ? Math.min(height * 0.33, 92) : height * 0.5

    // The same camera turn moves all depths, with nearby grains travelling much
    // faster than the stars. Text and input coordinates never inherit this roll.
    for (let i = 0; i < stars.length; i++) {
      if (compact && i % 2) continue
      const star = stars[i], zoom = 1 + p * star.depth * 0.18
      const sx = (star.x - 0.5) * width * zoom, sy = (star.y - 0.5) * height * zoom
      const x = Math.round(wrap(sx * cs - sy * sn + width * 0.5 - yaw * width - pointer.x * star.depth * 3 - travel * star.depth * 1.1, width))
      const y = Math.round(wrap(sx * sn + sy * cs + height * 0.5 + pitch * height - pointer.y * star.depth * 2 - travel * star.depth * 1.8, height))
      const pulse = Math.sin(time * 0.6 + star.phase)
      ctx.fillStyle = pulse > 0.68 ? star.warm ? '#d7b88a' : '#acb8cf' : pulse > -0.4 ? '#666581' : '#303145'
      ctx.fillRect(x, y, 1, 1)
      if (star.bright && pulse > 0.78) {
        ctx.fillStyle = star.warm ? '#655141' : '#43495f'
        ctx.fillRect(x - 2, y, 1, 1); ctx.fillRect(x + 2, y, 1, 1)
        ctx.fillRect(x, y - 2, 1, 1); ctx.fillRect(x, y + 2, 1, 1)
      }
    }
    for (let i = 0; i < dust.length; i++) {
      if (compact && i % 3) continue
      const grain = dust[i]
      ctx.fillStyle = '#383044'
      const x = wrap(grain.x * width - travel * (4 + grain.depth * 5) - pointer.x * 6, width)
      const y = wrap(grain.y * height - travel * (3 + grain.depth * 5) + time * 0.15, height)
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
    }
    // Constant celestial reference: a slight angular drift with the camera,
    // not a scale animation used to replace the planetary journey.
    sun(ctx, width * 0.09 - yaw * focal * 0.5, compact ? 46 : height * 0.16 + pitch * focal,
      Math.min(width * 0.018, height * 0.025), time)

    const projected = planets.flatMap(planet => {
      const dx = planet.x - cameraX + Math.sin(time * 0.08 + planet.phase) * 0.025
      const dy = planet.y - cameraY + Math.cos(time * 0.06 + planet.phase) * 0.02
      const dz = planet.z - travel
      const rx = Math.cos(yaw) * dx - Math.sin(yaw) * dz
      const rz = Math.sin(yaw) * dx + Math.cos(yaw) * dz
      const ry = Math.cos(pitch) * dy - Math.sin(pitch) * rz
      const depth = Math.sin(pitch) * dy + Math.cos(pitch) * rz
      if (depth <= 0.45) return []
      const sx = focal * rx / depth, sy = -focal * ry / depth
      const x = width * 0.5 + sx * cs - sy * sn
      const y = originY + sx * sn + sy * cs
      const radius = Math.max(1, Math.min(140, focal * planet.radius * planet.size / depth))
      const extent = radius * (planet.ring ? (planet.ringRadius + planet.ringWidth) * 1.5 : 1.08)
      // Passed and off-camera planets incur no raster work or pointer targets.
      if (x + extent < 0 || x - extent > width || y + extent < 0 || y - extent > height) return []
      return [{ planet, x, y, radius, depth, bearing: Math.atan2(dx, dz) }]
    }).sort((a, b) => b.depth - a.depth)

    const targets: PlanetTarget[] = []
    for (const body of projected) {
      const { planet, x: cx, y: cy, radius } = body
      const rotation = rotations[planet.id]
      const tilt = planet.tilt + roll + body.bearing * 0.22 + rotation.pitch * 0.23
      const ring = (front: boolean) => {
        if (!planet.ring) return
        for (let band = 0; band < planet.ringBands; band++) {
          ctx.fillStyle = RING_COLORS[planet.ringPalette][band]
          for (let i = 0; i < 300; i++) {
            const angle = i / 300 * TAU
            if ((Math.sin(angle) > 0) !== front || i % 37 === 0) continue
            const rx = Math.cos(angle) * radius * (planet.ringRadius + band / (planet.ringBands - 1) * planet.ringWidth)
            const ry = Math.sin(angle) * radius * (0.28 + Math.cos(body.bearing) * 0.09)
            ctx.fillRect(Math.round(cx + rx), Math.round(cy + ry + rx * tilt), 1, 1)
          }
        }
      }
      const moons = (front: boolean) => {
        if (radius < 20) return
        for (const moon of planet.moons) {
          const angle = moon.phase + time * moon.speed + body.bearing * 1.4
          if ((Math.sin(angle) > 0) !== front) continue
          const moonX = cx + Math.cos(angle) * radius * moon.distance
          const moonY = cy + Math.sin(angle) * radius * moon.distance * moon.inclination + Math.cos(angle) * radius * tilt
          const size = Math.max(1, Math.round(radius * moon.size))
          ctx.fillStyle = '#aaa09d'; pixelDisc(ctx, moonX, moonY, size)
          ctx.fillStyle = '#464052'; pixelDisc(ctx, moonX + 1, moonY + 1, Math.max(1, size - 1))
        }
      }
      moons(false)
      ring(false)
      planet.draw(ctx, cx, cy, radius, planet.phase + time * planet.spin
        + body.bearing * 0.85 + rotation.yaw,
      planet.axisTilt + pitch + body.bearing * 0.16 + rotation.pitch, 0.12)
      ring(true)
      moons(true)
      if (radius >= 7 && cx + radius > 0 && cx - radius < width && cy + radius > 0 && cy - radius < height) {
        targets.push({ id: planet.id, x: Math.round(cx), y: Math.round(cy), radius: Math.round(radius), label: planet.label })
      }
    }
    return targets
  }
}
