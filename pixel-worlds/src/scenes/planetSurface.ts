import { fbm } from './noise'
import { seededRandom } from './pixels'

export type PlanetMaterial = 'terrestrial' | 'rocky' | 'ice' | 'gas' | 'volcanic'

const TAU = Math.PI * 2
const clamp = (x: number, low = 0, high = 1) => Math.max(low, Math.min(high, x))
const rgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]

/** Style decisions are sampled once, independently of animation and sizing. */
export function createSurfaceVariation(seed: number) {
  const random = seededRandom(seed ^ 0x6a09e667)
  return {
    palette: Math.floor(random() * 4), hueJitter: (random() - 0.5) * 14,
    saturation: 0.86 + random() * 0.3, brightness: 0.96 + random() * 0.08,
    terrainScale: 1.9 + random() * 4.5, landThreshold: 0.4 + random() * 0.2,
    highlands: 0.07 + random() * 0.13, cloudThreshold: 0.6 + random() * 0.2,
    cloudScale: 1.1 + random() * 1.9, iceLatitude: 0.98 + random() * 0.48,
    craterCount: 8 + Math.floor(random() * 23), craterScale: 0.65 + random() * 0.75,
    plateCount: 12 + Math.floor(random() * 21), fractureWidth: 0.018 + random() * 0.04,
    lavaWidth: 0.008 + random() * 0.018, lavaThreshold: 0.34 + random() * 0.2,
    bandFrequency: 18 + random() * 34, bandWarp: 0.45 + random() * 1.1,
    stormCount: 1 + Math.floor(random() * 2), stormScale: 0.65 + random() * 0.7,
  }
}
export type SurfaceVariation = ReturnType<typeof createSurfaceVariation>

// Four compatible colour families per material, with small variations inside
// each family. Lava remains warm; ice remains blue/teal/lilac. These are palette
// transforms at generation time, never colour interpolation during rendering.
const HUES: Record<PlanetMaterial, number[]> = {
  terrestrial: [0, -42, 54, 104], rocky: [0, 32, -34, 92],
  ice: [0, -25, 31, 57], gas: [0, -29, 146, 189], volcanic: [0, -8, 11, 22],
}
function variedColor(hex: string, hue: number, saturation: number, brightness: number) {
  const [r, g, b] = rgb(hex).map(value => value / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min
  const light = clamp((max + min) * 0.5 * brightness)
  let h = delta === 0 ? 0 : max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  h = ((h * 60 + hue) % 360 + 360) % 360 / 60
  const originalLight = (max + min) * 0.5
  const s = delta === 0 ? 0 : clamp(delta / (1 - Math.abs(2 * originalLight - 1)) * saturation)
  const chroma = (1 - Math.abs(2 * light - 1)) * s, x = chroma * (1 - Math.abs(h % 2 - 1)), m = light - chroma / 2
  const channels = h < 1 ? [chroma,x,0] : h < 2 ? [x,chroma,0] : h < 3 ? [0,chroma,x]
    : h < 4 ? [0,x,chroma] : h < 5 ? [x,0,chroma] : [chroma,0,x]
  return channels.map(channel => Math.round(clamp(channel + m) * 255))
}

/** Four surface materials, each lit with the same five discrete light levels.
 * The original two palettes keep the opening planets recognizable. */
const PALETTES: Record<PlanetMaterial, string[][]> = {
  terrestrial: [
    ['#0a1020', '#172a43', '#25516c', '#44849b', '#79bcca'],
    ['#101c25', '#264347', '#4d7d71', '#89b297', '#c4d6aa'],
    ['#211c33', '#49405c', '#7c668b', '#b09bac', '#e4cbb6'],
    ['#242c42', '#50637a', '#829cae', '#c1d5d0', '#f2eed5'],
  ],
  rocky: [
    ['#171425', '#2c283d', '#554052', '#956778', '#cc9b9b'],
    ['#21192b', '#483145', '#785464', '#b58888', '#e7bfa5'],
    ['#282033', '#594454', '#9c7481', '#d1a598', '#f3d6b4'],
    ['#332439', '#795b6c', '#aa8b97', '#e0baae', '#ffe5c7'],
  ],
  ice: [
    ['#081222', '#112a43', '#155776', '#267e9d', '#4bafc2'],
    ['#102032', '#26465c', '#4a899c', '#85c5cf', '#c5e9e2'],
    ['#172339', '#34586d', '#73aab8', '#b4dadb', '#edf8ed'],
    ['#0b1e32', '#1a445d', '#387a92', '#6bbac5', '#a3dedc'],
  ],
  gas: [
    ['#241827', '#4b2e38', '#805042', '#b3784e', '#d7a465'],
    ['#2b202c', '#5b4040', '#a17554', '#d3a873', '#efce94'],
    ['#362933', '#6a5050', '#ac8c76', '#ddc7a3', '#f5e5bb'],
    ['#2b1520', '#5a2930', '#9f4937', '#d37648', '#ebae6f'],
  ],
  volcanic: [
    ['#10121b', '#1d202a', '#353640', '#50505a', '#77727a'],
    ['#18131d', '#2e222a', '#54353a', '#805144', '#ad7860'],
    ['#191921', '#31303b', '#52505a', '#787078', '#a49a96'],
    ['#6a241f', '#a83e27', '#e76531', '#ffad52', '#ffe399'],
  ],
}

/** Bake surface labels once in longitude/latitude space. All noise coordinates
 * wrap through a sphere so rotating through the longitude seam stays continuous. */
function createAtlas(seed: number, materialType: PlanetMaterial, style: SurfaceVariation) {
  const random = seededRandom(seed)
  const width = 256, height = 128
  const atlas = new Uint8Array(width * height)
  const offset = random() * 9, scale = style.terrainScale
  const land = style.landThreshold
  const craterCenters = Array.from({ length: materialType === 'rocky' ? style.craterCount : 0 }, () => ({
    u: random(), v: 0.15 + random() * 0.7, radius: (0.014 + random() * 0.055) * style.craterScale,
  }))
  // Uniform spherical plate centers give ice and volcanic fissures a continuous
  // tectonic structure, rather than a flat noise pattern wrapped onto a ball.
  const plates = Array.from({ length: materialType === 'ice' || materialType === 'volcanic' ? style.plateCount : 0 }, () => {
    const z = random() * 2 - 1, longitude = random() * TAU, ring = Math.sqrt(1 - z * z)
    return { x: Math.cos(longitude) * ring, y: Math.sin(longitude) * ring, z, shade: random() }
  })
  const bandPhase = random() * TAU
  const storms = Array.from({ length: materialType === 'gas' ? style.stormCount : 0 }, (_, i) => ({
    longitude: (i / style.stormCount * TAU + random() * 1.5 + bandPhase) % TAU,
    latitude: (random() - 0.5) * 1.3,
    width: (0.3 + random() * 0.16) * style.stormScale,
    height: (0.14 + random() * 0.1) * style.stormScale,
  }))
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const longitude = x / width * TAU, latitude = (y / (height - 1) - 0.5) * Math.PI
    const ring = Math.cos(latitude), nx = Math.cos(longitude) * ring, ny = Math.sin(longitude) * ring, nz = Math.sin(latitude)
    const a = nx * scale, b = ny * scale + nz * 2.1
    const value = fbm(a + offset, b, seed ^ 819, 4)
    let kind = value > land + style.highlands ? 2 : value > land ? 1 : 0

    if (materialType === 'terrestrial') {
      if (Math.abs(latitude) > style.iceLatitude + value * 0.14) kind = 3
      else if (fbm(a * style.cloudScale + 18, b * style.cloudScale - 12, seed ^ 341, 3) > style.cloudThreshold) kind = 3
    } else if (materialType === 'rocky') {
      for (const crater of craterCenters) {
        const du = Math.min(Math.abs(x / width - crater.u), 1 - Math.abs(x / width - crater.u))
        const dv = (y / height - crater.v) * 0.5
        const distance = Math.hypot(du * Math.cos(latitude), dv) / crater.radius
        if (distance < 0.7) kind = 0
        else if (distance < 1) kind = dv < 0 ? 3 : 1
      }
    } else if (materialType === 'gas') {
      const turbulence = fbm(a * 1.7 + 11, b * 1.7 - 9, seed ^ 6521, 3)
      // Latitude-driven jets with longitudinal folds and smaller cloud streaks.
      const jet = latitude * style.bandFrequency + Math.sin(longitude * 3 + latitude * 4 + bandPhase) * ring * style.bandWarp
        + (value - 0.5) * 6 + (turbulence - 0.5) * 2
      const band = Math.sin(jet) + Math.sin(jet * 0.43 + 1.7) * 0.45
      kind = band > 0.67 ? 2 : band > -0.18 ? 1 : band < -0.95 ? 3 : 0
      // Seeded anticyclones: elliptical distance and angular winding create
      // curved, nested cloud bands, not a circular spot stamped on the sphere.
      for (const storm of storms) {
        const delta = Math.atan2(Math.sin(longitude - storm.longitude), Math.cos(longitude - storm.longitude))
        const sx = delta * Math.cos(latitude) / storm.width, sy = (latitude - storm.latitude) / storm.height
        const distance = Math.hypot(sx, sy)
        if (distance < 1.22) {
          const swirl = Math.sin(distance * 19 + Math.atan2(sy, sx) * 2 + (turbulence - 0.5) * 3)
          if (distance < 0.34) kind = 3
          else if (distance < 0.98) kind = swirl > 0.3 ? 2 : swirl > -0.45 ? 1 : 3
          else if (swirl > 0) kind = 2
        }
      }
    } else {
      let nearest = Infinity, second = Infinity, plateShade = 0
      for (const plate of plates) {
        const distance = (nx - plate.x) ** 2 + (ny - plate.y) ** 2 + (nz - plate.z) ** 2
        if (distance < nearest) { second = nearest; nearest = distance; plateShade = plate.shade }
        else if (distance < second) second = distance
      }
      const seam = second - nearest
      if (materialType === 'ice') {
        kind = plateShade > 0.42 ? 2 : 1
        if (value < 0.34) kind = 3
        if (seam < style.fractureWidth + value * 0.025) kind = seam < style.fractureWidth * 0.6 ? 0 : 3
        if (Math.abs(latitude) > style.iceLatitude) kind = 2
      } else {
        kind = value > 0.57 ? 1 : value < 0.37 ? 2 : 0
        // Sparse bright fissures cross otherwise solid dark basalt plates.
        if (seam < style.lavaWidth && value > style.lavaThreshold) kind = 3
        else if (seam < style.lavaWidth * 2.3 && value > style.lavaThreshold) kind = 1
      }
    }
    atlas[y * width + x] = kind
  }
  return atlas
}

/** Inverse-projected, two-axis sphere. Illumination remains in camera space,
 * so dragging rotates continents and storms beneath a stationary light source.
 * Only visible spheres redraw; unchanged quantized poses reuse their sprite. */
export function createPlanetSurface(seed: number, materialType: PlanetMaterial, style = createSurfaceVariation(seed)) {
  const material = createAtlas(seed, materialType, style)
  const hue = HUES[materialType][style.palette] + style.hueJitter
  const colors = PALETTES[materialType].map(row => row.map(hex => variedColor(hex, hue, style.saturation, style.brightness)))
  const sprite = document.createElement('canvas'), context = sprite.getContext('2d')
  let radius = 0, raster: ImageData | undefined, lastKey = ''
  let samples: { offset: number; x: number; y: number; z: number; shade: number }[] = []
  return (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, yaw: number, pitch: number, warmth: number) => {
    if (!context) return
    const nextRadius = Math.max(2, Math.min(140, Math.round(size)))
    if (radius !== nextRadius) {
      radius = nextRadius
      sprite.width = sprite.height = radius * 2 + 1
      raster = context.createImageData(sprite.width, sprite.height)
      samples = []
      for (let y = -radius; y <= radius; y++) for (let x = -radius; x <= radius; x++) {
        const nx = x / radius, ny = y / radius, square = nx * nx + ny * ny
        if (square > 1) continue
        const nz = Math.sqrt(1 - square)
        const light = -nx * 0.59 - ny * 0.38 + nz * 0.64
        const shade = light > 0.8 ? 4 : light > 0.47 ? 3 : light > 0.11 ? 2 : light > -0.22 ? 1 : 0
        samples.push({ offset: ((y + radius) * sprite.width + x + radius) * 4, x: nx, y: ny, z: nz, shade })
      }
      lastKey = ''
    }
    const yawStep = Math.round(yaw * 220), pitchStep = Math.round(pitch * 180), heat = Math.round(clamp(warmth) * 8)
    const key = `${yawStep}:${pitchStep}:${heat}`
    if (raster && key !== lastKey) {
      const a = yawStep / 220, b = pitchStep / 180
      const sy = Math.sin(a), cyaw = Math.cos(a), sp = Math.sin(b), cp = Math.cos(b)
      for (const sample of samples) {
        const py = sample.y * cp + sample.z * sp, pz = sample.z * cp - sample.y * sp
        const px = sample.x * cyaw - pz * sy, rz = sample.x * sy + pz * cyaw
        const u = Math.floor((Math.atan2(px, rz) / TAU + 0.5) * 256) & 255
        const v = clamp(Math.floor((Math.asin(clamp(py, -1, 1)) / Math.PI + 0.5) * 128), 0, 127)
        const surface = material[v * 256 + u]
        const shade = materialType === 'volcanic' && surface === 3 ? Math.max(1, sample.shade) : sample.shade
        const color = colors[surface][shade]
        const warm = heat * (sample.shade / 4)
        raster.data[sample.offset] = Math.min(255, color[0] + warm * 3)
        raster.data[sample.offset + 1] = Math.min(255, color[1] + warm)
        raster.data[sample.offset + 2] = Math.max(0, color[2] - warm * 2)
        raster.data[sample.offset + 3] = 255
      }
      context.putImageData(raster, 0, 0); lastKey = key
    }
    ctx.drawImage(sprite, Math.round(cx) - radius, Math.round(cy) - radius)
  }
}
