import { pixelDisc, pixelLine, seededRandom, wrap } from './pixels'
import type { SceneFrame, SceneRenderer } from './types'

type Vec3 = { x: number; y: number; z: number }
interface Branch extends Vec3 { parent: number; children: number; mass: number; phase: number }
interface Leaf extends Vec3 { length: number; angle: number; shade: number; phase: number }
interface Fern { x: number; z: number; length: number; angle: number; curl: number }
interface Projection { x: number; y: number; z: number }
interface DrawItem { kind: 'branch' | 'leaf'; index: number; depth: number }

const TAU = Math.PI * 2
const greens = ['#123d39', '#195e45', '#2c8850', '#57b95f', '#a2db6a', '#e4ed98']
const bark = ['#30453b', '#556743', '#849660', '#b5c57d']

/**
 * A small, seeded 3D space-colonization tree, following the attractor / nearest
 * branch / influence radius / kill radius model of Runions, Lane and
 * Prusinkiewicz (2007):
 * https://algorithmicbotany.org/papers/colonization.egwnp2007.html
 *
 * This is actual generated geometry, not a fixed branching image. Growth is
 * bounded to 420 attractors, 380 nodes and 64 iterations, once per scene mount.
 * Descendant mass supplies branch taper; leaves occupy the resulting twigs.
 */
function growTree(random: () => number) {
  const attractors: Vec3[] = []
  const crownHeight = 1.01 + random() * 0.08
  const crownWidth = 0.58 + random() * 0.15
  const crownDepth = 0.35 + random() * 0.12
  const crownLean = (random() - 0.4) * 0.25
  const trunkLean = (random() - 0.5) * 0.07
  for (let i = 0; i < 420; i++) {
    const azimuth = random() * TAU
    const polar = Math.acos(random() * 2 - 1)
    const radius = Math.cbrt(random())
    // An asymmetric ellipsoid gives the crown a wind-grown, organic profile.
    const y = crownHeight + Math.cos(polar) * radius * 0.48
    attractors.push({
      x: Math.cos(azimuth) * Math.sin(polar) * radius * crownWidth + (y - 0.8) * crownLean,
      y,
      z: Math.sin(azimuth) * Math.sin(polar) * radius * crownDepth,
    })
  }
  const branches: Branch[] = []
  for (let i = 0; i <= 8; i++) {
    branches.push({ x: Math.sin(i * 0.31) * 0.045 + i / 8 * trunkLean, y: i * 0.065, z: Math.sin(i * 0.5) * 0.018,
      parent: i - 1, children: i === 8 ? 0 : 1, mass: 1, phase: random() * TAU })
  }
  const consumed = new Uint8Array(attractors.length)
  const influenceSquared = 0.39 ** 2
  const killSquared = 0.078 ** 2
  for (let iteration = 0; iteration < 64 && branches.length < 380; iteration++) {
    const count = branches.length
    const directions = new Float32Array(count * 3)
    const influences = new Uint16Array(count)
    for (let a = 0; a < attractors.length; a++) {
      if (consumed[a]) continue
      const target = attractors[a]
      let nearest = -1
      let distance = influenceSquared
      for (let b = 0; b < count; b++) {
        const branch = branches[b]
        const squared = (target.x - branch.x) ** 2 + (target.y - branch.y) ** 2 + (target.z - branch.z) ** 2
        if (squared < killSquared) { consumed[a] = 1; nearest = -1; break }
        if (squared < distance) { distance = squared; nearest = b }
      }
      if (nearest < 0) continue
      const branch = branches[nearest]
      const inverseLength = 1 / Math.sqrt(distance)
      directions[nearest * 3] += (target.x - branch.x) * inverseLength
      directions[nearest * 3 + 1] += (target.y - branch.y) * inverseLength
      directions[nearest * 3 + 2] += (target.z - branch.z) * inverseLength
      influences[nearest]++
    }
    let added = 0
    for (let i = 0; i < count && branches.length < 380; i++) {
      if (!influences[i]) continue
      const parent = branches[i]
      const x = directions[i * 3] / influences[i]
      const y = directions[i * 3 + 1] / influences[i] + 0.045
      const z = directions[i * 3 + 2] / influences[i]
      const length = Math.hypot(x, y, z)
      if (length < 0.01) continue
      const node = { x: parent.x + x / length * 0.057, y: parent.y + y / length * 0.057,
        z: parent.z + z / length * 0.057, parent: i, children: 0, mass: 1, phase: random() * TAU }
      // Avoid almost coincident shoots when an older fork is still influenced.
      if (branches.some((branch) => (branch.x - node.x) ** 2 + (branch.y - node.y) ** 2 + (branch.z - node.z) ** 2 < 0.022 ** 2)) continue
      branches.push(node)
      parent.children++
      added++
    }
    if (!added) break
  }
  for (let i = branches.length - 1; i > 0; i--) branches[branches[i].parent].mass += branches[i].mass
  const leaves: Leaf[] = []
  for (const branch of branches) {
    if (branch.y < 0.62 || (branch.children > 0 && branch.mass > 7)) continue
    const count = branch.children === 0 ? 5 : 2
    for (let i = 0; i < count; i++) {
      const angle = i * 2.399963 + branch.phase // Golden-angle phyllotaxis.
      const reach = 0.025 + random() * 0.065
      leaves.push({ x: branch.x + Math.cos(angle) * reach, y: branch.y + (random() - 0.35) * 0.07,
        z: branch.z + Math.sin(angle) * reach, length: 0.037 + random() * 0.03,
        angle, shade: Math.floor(random() * 3), phase: random() * TAU })
    }
  }
  return { branches, leaves }
}

/** A tapered leaf, rasterized as short integer scan lines, without vector AA. */
function rasterLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, length: number, angle: number, color: string, vein: string, border = 0) {
  const steps = Math.max(2, Math.round(length))
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  ctx.fillStyle = color
  for (let step = -border; step < steps + border; step++) {
    const halfWidth = Math.sin(Math.max(0, Math.min(1, (step + 0.5) / steps)) * Math.PI) * steps * 0.23 + border
    const sx = x + dx * step
    const sy = y + dy * step
    pixelLine(ctx, sx - dy * halfWidth, sy + dx * halfWidth, sx + dy * halfWidth, sy - dx * halfWidth)
  }
  ctx.fillStyle = vein
  pixelLine(ctx, x, y, x + dx * steps * 0.67, y + dy * steps * 0.67)
}

type PaintLeaf = typeof rasterLeaf

/** Reuse raster leaves instead of issuing thousands of tiny fills each pose. */
function createLeafPainter() {
  const cellSize = 32
  const cellsPerRow = 32
  const cellsPerPage = cellsPerRow ** 2
  const pages: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }[] = []
  const sprites = new Map<string, { page: number; x: number; y: number; originX: number; originY: number }>()

  const draw: PaintLeaf = (ctx, x, y, length, angle, color, vein, border = 0) => {
    const steps = Math.max(2, Math.round(length))
    // Both large trees intentionally extend past the stage edges. Skip sprites
    // wholly outside the canvas before populating the shared atlas.
    const reach = steps + border + 2
    if (x + reach < 0 || y + reach < 0 || x - reach > ctx.canvas.width || y - reach > ctx.canvas.height) return
    const angleBin = ((Math.round(angle / TAU * 32) % 32) + 32) % 32
    const quantizedAngle = angleBin / 32 * TAU
    const key = `${steps}:${angleBin}:${color}:${vein}:${border}`
    let sprite = sprites.get(key)
    if (!sprite) {
      // Two 1024px RGBA atlas pages use at most 8MiB. Overflow keeps rendering
      // correctly without evicting sprites or thrashing during canopy rotation.
      if (sprites.size >= cellsPerPage * 2 || steps + border * 2 > cellSize - 6) {
        rasterLeaf(ctx, x, y, length, angle, color, vein, border)
        return
      }
      const index = sprites.size
      const page = Math.floor(index / cellsPerPage)
      if (!pages[page]) {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = cellSize * cellsPerRow
        const context = canvas.getContext('2d')
        if (!context) {
          rasterLeaf(ctx, x, y, length, angle, color, vein, border)
          return
        }
        pages.push({ canvas, ctx: context })
      }
      const cell = index % cellsPerPage
      sprite = {
        page, x: cell % cellsPerRow * cellSize, y: Math.floor(cell / cellsPerRow) * cellSize,
        originX: cellSize / 2 - Math.cos(quantizedAngle) * steps / 2,
        originY: cellSize / 2 - Math.sin(quantizedAngle) * steps / 2,
      }
      rasterLeaf(pages[page].ctx, sprite.x + sprite.originX, sprite.y + sprite.originY,
        steps, quantizedAngle, color, vein, border)
      sprites.set(key, sprite)
    }
    ctx.drawImage(pages[sprite.page].canvas, sprite.x, sprite.y, cellSize, cellSize,
      Math.round(x - sprite.originX), Math.round(y - sprite.originY), cellSize, cellSize)
  }

  return {
    draw,
    reset() {
      sprites.clear()
      for (const page of pages) page.ctx.clearRect(0, 0, page.canvas.width, page.canvas.height)
    },
  }
}

function drawFern(ctx: CanvasRenderingContext2D, baseX: number, baseY: number, scale: number, fern: Fern, time: number, paintLeaf: PaintLeaf) {
  const sway = Math.sin(time * 0.43 + fern.angle) * 0.035
  const angle = fern.angle + sway
  const length = fern.length * scale
  const frond = (u: number) => ({
    x: baseX + Math.sin(angle) * length * u + Math.sin(u * Math.PI * 0.7) * fern.curl * length * 0.5,
    y: baseY - Math.cos(angle) * length * u + u ** 3 * length * 0.3,
  })
  let previous = frond(0)
  for (let i = 1; i <= 15; i++) {
    const u = i / 15
    const current = frond(u)
    ctx.fillStyle = '#759f50'
    pixelLine(ctx, previous.x, previous.y, current.x, current.y)
    if (i > 1 && i < 15) {
      const width = Math.sin(u * Math.PI) * length * 0.22
      const tangent = Math.atan2(current.y - previous.y, current.x - previous.x)
      for (const side of [-1, 1]) {
        const tilt = tangent + side * 0.83
        paintLeaf(ctx, current.x, current.y, width, tilt, side > 0 ? '#529c4e' : '#32784b', '#9dcd65')
      }
    }
    previous = current
  }
}

function createTreeState(random: () => number, secondary = false) {
  const { branches, leaves } = growTree(random)
  const items: DrawItem[] = [
    ...branches.map((_, index) => ({ kind: 'branch' as const, index, depth: 0 })),
    ...leaves.map((_, index) => ({ kind: 'leaf' as const, index, depth: 0 })),
  ]
  const projectedBranches: Projection[] = branches.map(() => ({ x: 0, y: 0, z: 0 }))
  const projectedLeaves: Projection[] = leaves.map(() => ({ x: 0, y: 0, z: 0 }))
  const ferns: Fern[] = Array.from({ length: secondary ? 6 : 9 }, (_, i) => ({
    x: (i % 3 - 1) * 0.42 + (random() - 0.5) * 0.2,
    z: (i % 3) * 0.075,
    length: 0.18 + random() * 0.24,
    angle: (i % 7 - 3) * 0.28,
    curl: (random() - 0.5) * 0.8,
  }))
  const ground = Array.from({ length: secondary ? 58 : 86 }, () => ({ x: random(), y: random(), size: 1 + Math.floor(random() * 4), shade: Math.floor(random() * 4) }))
  const flowers = Array.from({ length: secondary ? 2 : 4 }, (_, i) => ({ x: (i / (secondary ? 1 : 3) - 0.5) * 1.12, y: random() * 0.035,
    length: 0.06 + random() * 0.13, phase: random() * TAU, warm: i % 3 === 0 }))
  return { branches, leaves, items, projectedBranches, projectedLeaves, ferns, ground, flowers }
}

export function createBotanicalScene(seed: number): SceneRenderer {
  const random = seededRandom(seed)
  const left = createTreeState(random)
  // A separate random stream grows a second tree, rather than reflecting or
  // copying the first tree's geometry. Both remain stable throughout this visit.
  const siblingRandom = seededRandom(seed ^ 0x9e3779b9)
  const right = createTreeState(siblingRandom, true)
  const siblingSize = 0.86 + siblingRandom() * 0.07
  const siblingYaw = 0.35 + siblingRandom() * 0.35
  const trees = [left, right]
  const motes = Array.from({ length: 8 }, (_, i) => ({ x: random(), y: random(), phase: random() * TAU,
    speed: 0.3 + random() * 0.85, warm: i % 3 === 0 }))
  // A slowly moving canopy needs fewer raster updates than its flying particles.
  const canopy = document.createElement('canvas')
  const canopyContext = canopy.getContext('2d')
  const leafPainter = createLeafPainter()
  let lastPose = ''

  return (frame: SceneFrame) => {
    const { ctx: output, width, height, time, scroll, focusX, focusY, sceneWidth, compact } = frame
    const ctx = canopyContext ?? output
    const mainScale = compact ? Math.min(width * 0.52, height * 0.22) : Math.min(width * 0.36, height * 0.54)
    const poses = trees.map((tree, index) => {
      const scale = mainScale * (index ? siblingSize : 1)
      return {
        tree, scale,
        baseX: compact ? width * (index ? 0.93 : 0.08)
          : index ? width - focusX + scale * 0.015 : focusX - scale * 0.035,
        baseY: focusY + mainScale * 0.72 + (index ? mainScale * 0.045 : 0),
        angle: index ? siblingYaw + scroll * 0.44 + Math.sin(time * 0.064 + 2.1) * 0.045
          : -0.18 + scroll * 0.52 + Math.sin(time * 0.075) * 0.055,
      }
    })

    const pose = `${width}:${height}:${focusX}:${focusY}:${sceneWidth}:${compact}:${Math.floor(time * 10)}:${Math.round(scroll * 5)}`
    if (pose !== lastPose || !canopyContext) {
      lastPose = pose
      if (canopy.width !== width || canopy.height !== height) {
        canopy.width = width
        canopy.height = height
        leafPainter.reset()
      }
      ctx.globalAlpha = 1
      ctx.imageSmoothingEnabled = false
      ctx.fillStyle = frame.palette.background
      ctx.fillRect(0, 0, width, height)

      // One composed 10fps layer and one bounded leaf atlas serve both trees.
      for (const { tree, scale, baseX, baseY, angle } of poses) {
      const { branches, leaves, items, projectedBranches, projectedLeaves, ferns, ground, flowers } = tree
      const cosine = Math.cos(angle)
      const sine = Math.sin(angle)

      // Stepped earthen island, layered moss shelves and mineral flecks.
      const islandWidth = scale * 0.83
      const islandDepth = Math.max(4, Math.round(scale * 0.13))
      for (let row = 0; row < islandDepth; row++) {
        const halfWidth = islandWidth * Math.sqrt(Math.max(0, 1 - (row / islandDepth) ** 2))
        ctx.fillStyle = row < 3 ? '#467344' : row < islandDepth * 0.45 ? '#233e36' : '#142f30'
        ctx.fillRect(Math.round(baseX - halfWidth), Math.round(baseY + row), Math.round(halfWidth * 2), 1)
      }
      for (const stone of ground) {
        const x = baseX + (stone.x - 0.5) * islandWidth * 1.95
        const y = baseY + stone.y * islandDepth * 0.85
        ctx.fillStyle = ['#213d32', '#35503a', '#658c4e', '#99b668'][stone.shade]
        ctx.fillRect(Math.round(x), Math.round(y), stone.size, 1)
      }

      const project = (point: Vec3, phase: number, target: Projection) => {
        const depth = point.z * cosine - point.x * sine
        const sway = Math.sin(time * 0.48 + point.y * 2.3 + phase * 0.12) * point.y ** 2 * 0.008
        target.x = baseX + (point.x * cosine + point.z * sine + sway) * scale
        target.y = baseY - point.y * scale + depth * scale * 0.17
        target.z = depth
      }
      branches.forEach((point, i) => project(point, point.phase, projectedBranches[i]))
      leaves.forEach((point, i) => project(point, point.phase, projectedLeaves[i]))
      for (const item of items) item.depth = (item.kind === 'branch' ? projectedBranches : projectedLeaves)[item.index].z
      items.sort((a, b) => a.depth - b.depth)

      // Paint one shared black silhouette before the depth-sorted tree. This
      // outlines its outside edge without drawing a black border on every leaf.
      for (const outline of [true, false]) {
        const edge = outline ? 1 : 0
        // Buttress roots keep the generated trunk visible beneath its canopy.
        for (let root = 0; root < 7; root++) {
          const a = root / 7 * TAU
          const length = 0.15 + root % 3 * 0.035
          const endX = baseX + Math.cos(a) * scale * length
          const endY = baseY + Math.sin(a) * scale * length * 0.22
          ctx.fillStyle = outline ? '#030806' : '#69784a'
          pixelLine(ctx, baseX - edge, baseY - scale * 0.14 - edge,
            baseX + (endX - baseX) * 0.4 - edge, endY - scale * 0.025 - edge,
            Math.max(2, Math.round(scale * 0.025)) + edge * 2)
          pixelLine(ctx, baseX + (endX - baseX) * 0.4 - edge, endY - scale * 0.025 - edge,
            endX - edge, endY - edge, 2 + edge * 2)
        }

        for (const item of items) {
          if (item.kind === 'branch') {
            const branch = branches[item.index]
            if (branch.parent < 0) continue
            const from = projectedBranches[branch.parent]
            const to = projectedBranches[item.index]
            const thickness = Math.max(1, Math.round(Math.sqrt(branch.mass) * scale * 0.0034))
            if (Math.max(from.x, to.x) + thickness + 2 < 0 || Math.min(from.x, to.x) - 2 > width
              || Math.max(from.y, to.y) + thickness + 2 < 0 || Math.min(from.y, to.y) - 2 > height) continue
            const shade = Math.max(0, Math.min(3, Math.floor((to.z + 0.42) * 4)))
            ctx.fillStyle = outline ? '#030806' : bark[shade]
            pixelLine(ctx, from.x - edge, from.y - edge, to.x - edge, to.y - edge, thickness + edge * 2)
            if (!outline && thickness > 2) {
              ctx.fillStyle = '#c1cc89'
              pixelLine(ctx, from.x, from.y, to.x, to.y)
            }
          } else {
            const source = leaves[item.index]
            const to = projectedLeaves[item.index]
            const shade = Math.max(1, Math.min(5, Math.floor((to.z + 0.45) * 3) + source.shade))
            const flicker = Math.sin(time * 0.6 + source.phase) * 0.12
            leafPainter.draw(ctx, to.x, to.y, Math.max(3, source.length * scale), source.angle + flicker + angle,
              outline ? '#030806' : greens[shade], outline ? '#030806' : greens[Math.min(5, shade + 1)], edge)
          }
        }
      }

      for (const fern of ferns) drawFern(ctx, baseX + fern.x * scale, baseY + fern.z * scale * 0.14, scale, fern, time, leafPainter.draw)
      for (const flower of flowers) {
        const x = baseX + flower.x * scale
        const y = baseY + flower.y * scale
        const tipX = x + Math.sin(time * 0.55 + flower.phase) * scale * 0.009
        const tipY = y - flower.length * scale
        ctx.fillStyle = '#7daa61'
        pixelLine(ctx, x, y, tipX, tipY)
        leafPainter.draw(ctx, x, y - flower.length * scale * 0.25, scale * 0.045, flower.phase, '#528f57', '#a6cf72')
        ctx.fillStyle = flower.warm ? '#ef9a59' : '#afc7ff'
        const petal = Math.max(1, Math.round(scale * 0.013))
        pixelDisc(ctx, tipX - petal, tipY, petal)
        pixelDisc(ctx, tipX + petal, tipY, petal)
        pixelDisc(ctx, tipX, tipY - petal, petal)
        ctx.fillStyle = '#ffe6a1'
        ctx.fillRect(Math.round(tipX), Math.round(tipY), 1, 1)
      }

      // Small shelf mushrooms give the forest floor another scale of life.
      for (let i = 0; i < 2; i++) {
        const x = baseX + (i - 0.5) * scale * 0.45
        const y = baseY + scale * 0.06 + i % 2 * 2
        const size = Math.max(2, Math.round(scale * (0.018 + i % 2 * 0.012)))
        ctx.fillStyle = '#bdc9b3'
        ctx.fillRect(Math.round(x), Math.round(y - size), 1, size + 2)
        ctx.fillStyle = '#6bafd0'
        ctx.fillRect(Math.round(x - size), Math.round(y - size), size * 2 + 1, 1)
        ctx.fillStyle = '#a1e4de'
        ctx.fillRect(Math.round(x - size + 1), Math.round(y - size - 1), size * 2 - 1, 1)
      }

      }
    }
    if (canopyContext) output.drawImage(canopy, 0, 0)

    // Fireflies remain on the shared 24fps clock, separate from the canopy cache.
    // They blink through three discrete levels, with orbiting movement.
    // Every particle is opaque; the scene's palette stays crisp and limited.
    for (let index = 0; index < motes.length; index++) {
      const mote = motes[index]
      const { scale, baseX, baseY } = poses[index % 2]
      const x = baseX + (mote.x - 0.5) * scale * 1.95 + Math.sin(time * 0.32 + mote.phase) * scale * 0.06
      const y = baseY - wrap(mote.y * scale * 1.8 + time * mote.speed * 1.3, scale * 1.8)
      const light = Math.sin(time * 1.6 + mote.phase)
      output.fillStyle = mote.warm ? light > 0.7 ? '#ffe99d' : light > -0.3 ? '#c1a75f' : '#655b3e'
        : light > 0.6 ? '#b5f4b1' : '#3f8865'
      output.fillRect(Math.round(x), Math.round(y), 1, 1)
      if (mote.warm && light > 0.9 && !compact) {
        output.fillStyle = '#606846'
        output.fillRect(Math.round(x) - 2, Math.round(y), 1, 1)
        output.fillRect(Math.round(x) + 2, Math.round(y), 1, 1)
      }
    }
  }
}
