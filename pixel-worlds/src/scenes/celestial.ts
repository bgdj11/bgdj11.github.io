import { pixelDisc, seededRandom, wrap } from './pixels'
import { fbm } from './noise'
import type { SceneRenderer } from './types'

const TAU = Math.PI * 2

export function createUniverseScene(seed: number): SceneRenderer {
  const random = seededRandom(seed)
  const stars = Array.from({ length: 60 }, () => ({ x: random(), y: random(), phase: random() * TAU, depth: 0.3 + random(), bright: random() > 0.94 }))
  const orbiters = Array.from({ length: 6 }, (_, i) => ({ angle: random() * TAU, distance: 1.5 + random() * 0.28, speed: (i % 2 ? 1 : -1) * (0.025 + random() * 0.025) }))
  const tilt = -0.38 + random() * 0.24
  const initialRotation = Math.floor(random() * 256)
  const continentScale = 2.7 + random() * 1.6
  const landThreshold = 0.47 + random() * 0.06
  const cometOffset = random() * 67
  const planetSize = 0.92 + random() * 0.13
  const companionSize = 0.22 + random() * 0.08
  const companionPhase = random() * TAU
  // A seeded spherical atlas produces different continents on every visit.
  // Materials and lighting use a fixed number of crisp palette steps.
  const texture = new Uint8Array(256 * 128)
  for (let y = 0; y < 128; y++) for (let x = 0; x < 256; x++) {
    const longitude = x / 256 * TAU, latitude = (y / 127 - 0.5) * Math.PI
    const ring = Math.cos(latitude) * continentScale
    const elevation = fbm(Math.cos(longitude) * ring + 5, Math.sin(longitude) * ring + Math.sin(latitude) * 2.5, seed ^ 819)
    texture[y * 256 + x] = Math.abs(y - 64) > 57 + elevation * 5 ? 3 : elevation > landThreshold + 0.13 ? 2 : elevation > landThreshold ? 1 : 0
  }
  const colors = [
    ['#10142d', '#203258', '#365e94', '#6babc4'], ['#182b36', '#29525b', '#488d83', '#a2cbb1'],
    ['#282139', '#635178', '#a285a2', '#e8cba5'], ['#283049', '#71839b', '#b3c4cd', '#f1e4c8'],
  ].map(row => row.map(hex => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]))
  const sprite = document.createElement('canvas')
  const spriteContext = sprite.getContext('2d')
  let radius = 0, lastStep = Number.NaN
  let pixels: { offset: number; u: number; v: number; shade: number }[] = []
  let raster: ImageData | undefined
  // A second, smaller rocky world balances the composition on the other edge.
  const companionTexture = new Uint8Array(128 * 64)
  for (let y = 0; y < 64; y++) for (let x = 0; x < 128; x++) {
    const longitude = x / 128 * TAU, latitude = (y / 63 - 0.5) * Math.PI
    const radius = Math.cos(latitude) * 3.2
    const height = fbm(Math.cos(longitude) * radius, Math.sin(longitude) * radius + Math.sin(latitude) * 2, seed ^ 4913, 3)
    companionTexture[y * 128 + x] = height > 0.6 ? 2 : height > 0.44 ? 1 : 0
  }
  const companionColors = [
    ['#171723', '#363345', '#625968', '#9c8c8c'],
    ['#221c24', '#46353d', '#806362', '#b9937d'],
    ['#282128', '#56434a', '#927c79', '#d0b6a0'],
  ].map(row => row.map(hex => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]))
  const companion = document.createElement('canvas'), companionContext = companion.getContext('2d')
  let companionRadius = 0, companionStep = Number.NaN
  let companionRaster: ImageData | undefined
  let companionPixels: { offset: number; u: number; v: number; shade: number }[] = []
  return ({ ctx, width, height, time, scroll, focusX, focusY, sceneWidth, compact, palette }) => {
    ctx.globalAlpha = 1
    for (const star of stars) {
      const x = Math.round(wrap(star.x * width + scroll * star.depth * 18, width))
      const y = Math.round(wrap(star.y * height + time * star.depth * 0.07 - scroll * star.depth * 8, height))
      const pulse = Math.sin(time * 0.75 + star.phase)
      ctx.fillStyle = pulse > 0.75 ? '#d6c9ae' : pulse > -0.2 ? '#777090' : '#343044'
      ctx.fillRect(x, y, 1, 1)
      if (star.bright && pulse > 0.84) {
        ctx.fillStyle = '#514964'
        ctx.fillRect(x - 2, y, 1, 1); ctx.fillRect(x + 2, y, 1, 1)
        ctx.fillRect(x, y - 2, 1, 1); ctx.fillRect(x, y + 2, 1, 1)
      }
    }
    const nextRadius = Math.max(5, Math.round(Math.min(width * (compact ? 0.22 : 0.2), height * (compact ? 0.115 : 0.24)) * planetSize))
    if (nextRadius !== radius && spriteContext) {
      radius = nextRadius
      sprite.width = sprite.height = radius * 2 + 1
      raster = spriteContext.createImageData(sprite.width, sprite.height)
      pixels = []
      for (let y = -radius; y <= radius; y++) for (let x = -radius; x <= radius; x++) {
        const nx = x / radius, ny = y / radius, squared = nx * nx + ny * ny
        if (squared > 1) continue
        const nz = Math.sqrt(1 - squared), light = -nx * 0.57 - ny * 0.5 + nz * 0.59
        pixels.push({ offset: ((y + radius) * sprite.width + x + radius) * 4,
          u: (Math.atan2(nx, nz) / TAU + 0.5) * 256,
          v: Math.min(127, Math.floor((Math.asin(ny) / Math.PI + 0.5) * 128)),
          shade: light > 0.7 ? 3 : light > 0.25 ? 2 : light > -0.15 ? 1 : 0 })
      }
      lastStep = Number.NaN
    }
    const cx = Math.round(focusX + scroll * sceneWidth * 0.035), cy = Math.round(focusY + Math.sin(time * 0.18) * 1.5 - scroll * 6)
    const ringTilt = tilt + scroll * 0.24 + Math.sin(time * 0.06) * 0.025
    const ring = (front: boolean) => {
      for (let band = 0; band < 4; band++) {
        ctx.fillStyle = ['#554164', '#ac7997', '#e4bb89', '#75527f'][band]
        for (let i = 0; i < 250; i++) {
          const a = i / 250 * TAU
          if ((Math.sin(a) > 0) !== front || i % 29 === 0) continue
          const rx = Math.cos(a) * radius * (1.62 + band * 0.035), ry = Math.sin(a) * radius * 0.38
          ctx.fillRect(Math.round(cx + rx), Math.round(cy + ry + rx * ringTilt), 1, 1)
        }
      }
    }
    ring(false)
    const rotation = Math.floor(initialRotation + time * 1.5 + scroll * 30)
    if (raster && spriteContext && rotation !== lastStep) {
      for (const pixel of pixels) {
        const kind = texture[pixel.v * 256 + (Math.floor(pixel.u + rotation) & 255)], color = colors[kind][pixel.shade]
        raster.data[pixel.offset] = color[0]; raster.data[pixel.offset + 1] = color[1]
        raster.data[pixel.offset + 2] = color[2]; raster.data[pixel.offset + 3] = 255
      }
      spriteContext.putImageData(raster, 0, 0); lastStep = rotation
    }
    if (spriteContext) ctx.drawImage(sprite, cx - radius, cy - radius)
    ring(true)
    const nextCompanionRadius = Math.max(3, Math.round(radius * companionSize))
    if (companionContext && nextCompanionRadius !== companionRadius) {
      companionRadius = nextCompanionRadius
      companion.width = companion.height = companionRadius * 2 + 1
      companionRaster = companionContext.createImageData(companion.width, companion.height)
      companionPixels = []
      for (let y = -companionRadius; y <= companionRadius; y++) for (let x = -companionRadius; x <= companionRadius; x++) {
        const nx = x / companionRadius, ny = y / companionRadius, squared = nx * nx + ny * ny
        if (squared > 1) continue
        const nz = Math.sqrt(1 - squared), light = nx * 0.45 - ny * 0.55 + nz * 0.5
        companionPixels.push({ offset: ((y + companionRadius) * companion.width + x + companionRadius) * 4,
          u: (Math.atan2(nx, nz) / TAU + 0.5) * 128,
          v: Math.min(63, Math.floor((Math.asin(ny) / Math.PI + 0.5) * 64)),
          shade: light > 0.65 ? 3 : light > 0.22 ? 2 : light > -0.12 ? 1 : 0 })
      }
      companionStep = Number.NaN
    }
    const secondaryRotation = Math.floor(initialRotation * 0.5 - time * 0.65 - scroll * 19)
    if (companionContext && companionRaster && secondaryRotation !== companionStep) {
      for (const pixel of companionPixels) {
        const material = companionTexture[pixel.v * 128 + (Math.floor(pixel.u + secondaryRotation) & 127)]
        const color = companionColors[material][pixel.shade]
        companionRaster.data[pixel.offset] = color[0]; companionRaster.data[pixel.offset + 1] = color[1]
        companionRaster.data[pixel.offset + 2] = color[2]; companionRaster.data[pixel.offset + 3] = 255
      }
      companionContext.putImageData(companionRaster, 0, 0); companionStep = secondaryRotation
    }
    if (companionContext) ctx.drawImage(companion,
      Math.round(width * (compact ? 0.13 : 0.11) + scroll * 8 - companionRadius),
      Math.round(height * (compact ? 0.19 : 0.72) + Math.sin(time * 0.09 + companionPhase) * 2 - companionRadius))
    orbiters.forEach((orbiter, index) => {
      const angle = orbiter.angle + time * orbiter.speed + scroll * 0.65
      const distance = radius * orbiter.distance
      const x = cx + Math.cos(angle) * distance, y = cy + Math.sin(angle) * distance * 0.65
      ctx.fillStyle = index ? '#716385' : palette.secondary
      if (index === 0) {
        pixelDisc(ctx, x, y, compact ? 2 : 3)
        ctx.fillStyle = '#55405e'; pixelDisc(ctx, x + 1, y + 1, compact ? 1 : 2)
      } else ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
    })
    // One brief, infrequent meteor keeps the star field spacious.
    const travel = wrap(time + cometOffset, 67)
    if (travel < 1.25) {
      const x = focusX - sceneWidth * 0.5 + travel * sceneWidth * 0.7, y = focusY - radius * 1.75 + travel * 7
      for (let tail = 0; tail < 9; tail++) {
        ctx.fillStyle = tail < 2 ? '#e5c5a6' : tail < 5 ? '#867293' : '#342b41'
        ctx.fillRect(Math.round(x - tail * 2), Math.round(y - tail * 0.5), 1, 1)
      }
    }
  }
}

export function createSkyScene(seed: number): SceneRenderer {
  const random = seededRandom(seed)
  // Each group is a single cumulus silhouette. Large overlapping billows share
  // a level base and interior light masses, without separate outlined circles.
  const clouds = Array.from({ length: 7 }, (_, index) => {
    const depth = index % 3
    const sprite = document.createElement('canvas')
    sprite.width = 160; sprite.height = 90
    const ctx = sprite.getContext('2d')
    const lobes = Array.from({ length: 5 }, (_, i) => ({
      x: 20 + i * 29 + random() * 4,
      y: 55 - Math.sin(i / 4 * Math.PI) * (13 + random() * 8),
      radius: (i === 0 || i === 4 ? 17 : 25) + random() * 7,
    }))
    const palette = [
      ['#0a121c', '#182736', '#2a3d4d', '#405666'],
      ['#101a25', '#243544', '#3c5060', '#647886'],
      ['#101a25', '#243544', '#3c5060', '#647886'],
    ][depth]
    if (ctx) {
      const raster = ctx.createImageData(sprite.width, sprite.height)
      const rgb = palette.map(hex => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)])
      const base = 69 + Math.round(random() * 3)
      for (let y = 0; y < sprite.height; y++) for (let x = 0; x < sprite.width; x++) {
        if (y > base) continue
        const inside = lobes.some(lobe => (x - lobe.x) ** 2 + (y - lobe.y) ** 2 <= lobe.radius ** 2)
        if (!inside) continue
        let shade = 0
        // Union the lit masses before coloring: the banks read as soft volumes,
        // while their silhouette and every shade boundary stay on the pixel grid.
        if (y < base - 5 && lobes.some(lobe => (x - lobe.x + 2) ** 2 + (y - lobe.y + 3) ** 2 < (lobe.radius * 0.94) ** 2)) shade = 1
        if (y < base - 13 && lobes.some(lobe => (x - lobe.x + 5) ** 2 + (y - lobe.y + 8) ** 2 < (lobe.radius * 0.77) ** 2)) shade = 2
        if (y < base - 25 && lobes.slice(1, 4).some(lobe => (x - lobe.x + 7) ** 2 + (y - lobe.y + 12) ** 2 < (lobe.radius * 0.82) ** 2)) shade = 3
        const offset = (y * sprite.width + x) * 4, color = rgb[shade]
        raster.data[offset] = color[0]; raster.data[offset + 1] = color[1]
        raster.data[offset + 2] = color[2]; raster.data[offset + 3] = 255
      }
      ctx.putImageData(raster, 0, 0)
    }
    return { sprite, depth, side: index % 2 ? 0.95 : 0.04, y: 0.01 + index / 7 * 0.88 + random() * 0.035,
      size: 0.3 + random() * 0.13, phase: random() * TAU }
  }).sort((a, b) => a.depth - b.depth)

  return ({ ctx, width, height, time, scroll, compact, focusY }) => {
    ctx.globalAlpha = 1
    ctx.imageSmoothingEnabled = false
    for (const cloud of clouds) {
      const size = Math.round(width * cloud.size)
      const movement = scroll * (8 + cloud.depth * 20)
      const center = width * cloud.side + Math.sin(time * (0.075 + cloud.depth * 0.025) + cloud.phase) * width * 0.09
      const x = center - size * 0.5 + movement
      const y = compact
        ? focusY + (cloud.y - 0.3) * Math.min(height * 0.36, width * 1.1) - scroll * (cloud.depth + 1) * 5
        : height * cloud.y + Math.sin(time * 0.15 + cloud.phase) * (1 + cloud.depth) - scroll * (cloud.depth + 1) * 10
      ctx.drawImage(cloud.sprite, Math.round(x), Math.round(y), size, Math.round(size * 0.56))
    }
  }
}
