import { pixelLine, seededRandom, wrap } from './pixels'
import { noise2 } from './noise'
import type { SceneRenderer } from './types'

type Point = readonly [number, number]

interface Summit {
  x: number
  y: number
  left: number
  right: number
  shoulder: number
  spine: number
  snow: number
}

interface MountainLayer {
  summits: Summit[]
  base: number
  colors: readonly [string, string, string, string, string]
}

/** Scanline polygons stay on the logical pixel grid, including diagonal faces. */
function fillPixelPolygon(ctx: CanvasRenderingContext2D, points: readonly Point[]) {
  let top = Infinity
  let bottom = -Infinity
  for (const point of points) {
    top = Math.min(top, point[1])
    bottom = Math.max(bottom, point[1])
  }
  const intersections: number[] = []
  for (let y = Math.max(0, Math.ceil(top)); y <= Math.min(ctx.canvas.height - 1, Math.floor(bottom)); y++) {
    intersections.length = 0
    for (let index = 0; index < points.length; index++) {
      const start = points[index]
      const end = points[(index + 1) % points.length]
      if ((start[1] <= y && end[1] > y) || (end[1] <= y && start[1] > y)) {
        intersections.push(start[0] + (y - start[1]) * (end[0] - start[0]) / (end[1] - start[1]))
      }
    }
    intersections.sort((a, b) => a - b)
    for (let index = 0; index + 1 < intersections.length; index += 2) {
      const left = Math.ceil(intersections[index])
      const right = Math.floor(intersections[index + 1])
      if (right >= left) ctx.fillRect(left, y, right - left + 1, 1)
    }
  }
}

/** Small angular cuts share each face's fall line instead of using screen-space texture. */
function paintErosion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  left: number,
  right: number,
  faceHeight: number,
  colors: MountainLayer['colors'],
  seed: number,
  count: number,
) {
  const random = seededRandom(seed)
  for (const side of [-1, 1]) {
    const span = side < 0 ? left : right
    for (let index = 0; index < count; index++) {
      const start = 0.1 + random() * 0.14 + index * 0.065
      const end = Math.min(0.94, start + 0.32 + random() * 0.27)
      const slope = (side < 0 ? 0.22 : 0.46) + index * 0.17 + random() * 0.12
      const cut: Point[] = []
      const farEdge: Point[] = []
      const path: Point[] = []
      const widths: number[] = []
      const steps = 6
      for (let step = 0; step < steps; step++) {
        const travel = step / (steps - 1)
        const level = start + (end - start) * travel
        const kink = (random() - 0.5) * span * 0.035 * Math.sin(travel * Math.PI)
        const px = x + side * span * level * slope + kink
        const py = y + level * faceHeight
        const half = Math.max(0.45, span * (0.003 + travel * 0.009) * (0.65 + random() * 0.65))
        path.push([px, py])
        widths.push(half)
        cut.push([px - half, py])
        farEdge.unshift([px + half, py])
      }
      // A mid-tone ridge glints inside shadow; the sunward face receives a
      // darker cut. Both use existing stone colours, with no glow or gradients.
      ctx.fillStyle = side > 0 || index % 2 === 0 ? colors[1] : colors[0]
      fillPixelPolygon(ctx, [...cut, ...farEdge])

      const junction = path[3]
      const branchStart: Point = [junction[0] - side * span * (0.04 + random() * 0.05), junction[1] - faceHeight * 0.16]
      const elbow: Point = [(branchStart[0] + junction[0]) / 2 + side * span * 0.018, junction[1] - faceHeight * 0.08]
      fillPixelPolygon(ctx, [
        branchStart, elbow, [junction[0] + widths[3] * 0.4, junction[1]],
        [junction[0] - widths[3] * 0.8, junction[1] + 1],
        [elbow[0] - 0.8, elbow[1] + 1],
      ])

      // One interrupted ledge branches off the long cut, breaking broad flat
      // faces into irregular rock planes without outlining the entire mountain.
      const ledge = path[2]
      const ledgeLength = span * (0.035 + random() * 0.045)
      ctx.fillStyle = side < 0 ? colors[1] : colors[2]
      fillPixelPolygon(ctx, [
        [ledge[0] - ledgeLength, ledge[1] + faceHeight * 0.025],
        [ledge[0] - ledgeLength * 0.35, ledge[1] + faceHeight * 0.005],
        [ledge[0] + ledgeLength * 0.4, ledge[1] + faceHeight * 0.033],
        [ledge[0] - ledgeLength * 0.12, ledge[1] + faceHeight * 0.025],
      ])
    }

    // Scree remains in small groups along the slope. Each chip is an angled
    // sliver or a two-pixel rock, never a repeated vertical hatch pattern.
    for (let chip = 0; chip < count * 3; chip++) {
      const level = 0.29 + random() * 0.53
      const slope = (side < 0 ? 0.25 : 0.48) + random() * 0.48
      const px = x + side * span * level * slope
      const py = y + faceHeight * level
      const length = faceHeight * (0.013 + random() * 0.032)
      const drift = side * span * (0.009 + random() * 0.018)
      ctx.fillStyle = side > 0 || chip % 3 === 0 ? colors[1] : colors[0]
      fillPixelPolygon(ctx, [
        [px, py], [px + drift, py + length * 0.72],
        [px + drift - 1.4, py + length], [px - 0.8, py + length * 0.26],
      ])
      if (chip % 3 === 0) {
        ctx.fillStyle = colors[2]
        ctx.fillRect(Math.round(px - 1), Math.round(py + length * 0.72), 2, 1)
      }
    }
  }
}

/** Seeded angular ranges, cached as a few flat-colour pixel planes. */
export function createMountainsScene(seed: number): SceneRenderer {
  const random = seededRandom(seed)
  const createSummit = (x: number, y: number, left: number, right: number, snow: number): Summit => ({
    x: x + (random() - 0.5) * 0.055,
    y: y + (random() - 0.5) * 0.045,
    left: left * (0.9 + random() * 0.2),
    right: right * (0.9 + random() * 0.2),
    shoulder: 0.33 + random() * 0.17,
    spine: 0.16 + random() * 0.2,
    snow: snow * (0.8 + random() * 0.35),
  })
  // The tall summits alternate between the exposed left and right margins.
  // Lower saddles cross behind the centered panel instead of competing with it.
  const plans: MountainLayer[] = [
    {
      base: 0.88,
      colors: ['#1e2433', '#303548', '#41465b', '#777e94', '#545e76'],
      summits: [
        createSummit(-0.16, 0.38, 0.27, 0.31, 0),
        createSummit(0.13, 0.25, 0.25, 0.3, 0.027),
        createSummit(0.42, 0.43, 0.24, 0.26, 0),
        createSummit(0.65, 0.38, 0.22, 0.26, 0),
        createSummit(0.98, 0.19, 0.33, 0.22, 0.031),
        createSummit(1.19, 0.34, 0.24, 0.26, 0),
      ],
    },
    {
      base: 1.01,
      colors: ['#1b2837', '#334452', '#526271', '#abb7c2', '#788c9e'],
      summits: [
        createSummit(-0.12, 0.51, 0.29, 0.22, 0),
        createSummit(0.035, 0.34, 0.22, 0.33, 0.043),
        createSummit(0.31, 0.57, 0.23, 0.29, 0),
        createSummit(0.61, 0.51, 0.22, 0.23, 0),
        createSummit(0.875, 0.285, 0.32, 0.27, 0.047),
        createSummit(1.19, 0.42, 0.24, 0.25, 0.017),
      ],
    },
    {
      base: 1.09,
      colors: ['#142330', '#243847', '#38505c', '#8397a7', '#5b7385'],
      summits: [
        createSummit(-0.2, 0.6, 0.29, 0.27, 0),
        createSummit(0.11, 0.54, 0.3, 0.3, 0),
        createSummit(0.43, 0.74, 0.2, 0.24, 0),
        createSummit(0.66, 0.71, 0.23, 0.26, 0),
        createSummit(1.045, 0.48, 0.35, 0.28, 0),
      ],
    },
    {
      base: 1.22,
      colors: ['#09131c', '#101e28', '#1b303b', '#536e7e', '#364e60'],
      summits: [
        createSummit(-0.075, 0.79, 0.32, 0.37, 0),
        createSummit(1.095, 0.76, 0.38, 0.27, 0),
      ],
    },
  ]
  const snow = Array.from({ length: 6 }, () => ({ x: random(), y: random(), speed: 0.3 + random() * 0.6, phase: random() * 6.28 }))
  const pines = Array.from({ length: 8 }, (_, index) => ({
    x: index % 2 ? 0.86 + random() * 0.16 : random() * 0.15 - 0.015,
    height: 0.055 + random() * 0.065,
    depth: random(),
  }))
  let key = ''
  let layers: HTMLCanvasElement[] = []

  return ({ ctx, width, height, time, scroll, focusX, focusY, compact }) => {
    const padding = 64
    const verticalShift = compact ? -height * 0.06 : (focusY - height * 0.54) * 0.35
    const focalShift = compact ? 0 : Math.max(-0.05, Math.min(0.05, focusX / width - 0.85))
    const nextKey = `${width}:${height}:${focusX}:${focusY}:${compact}`
    if (key !== nextKey) {
      key = nextKey
      layers = plans.map((plan, layer) => {
        const canvas = document.createElement('canvas')
        canvas.width = width + padding * 2
        canvas.height = height
        const paint = canvas.getContext('2d')
        if (!paint) return canvas
        const baseY = plan.base * height + verticalShift
        paint.fillStyle = plan.colors[1]
        for (let x = 0; x < canvas.width; x++) {
          const nx = (x - padding) / width
          let crest = baseY
          for (const summit of plan.summits) {
            const distance = nx - summit.x - focalShift
            const reach = Math.abs(distance) / (distance < 0 ? summit.left : summit.right)
            if (reach >= 1) continue
            // A broken shoulder retains a recognisable angular summit. Noise
            // only chips the edge; it never determines broad lighting bands.
            const slope = reach < summit.shoulder
              ? reach * 0.91
              : summit.shoulder * 0.91 + (reach - summit.shoulder) * 1.13
            const shoulderPosition = summit.shoulder + (distance < 0 ? -0.055 : 0.04)
            const shoulderTooth = Math.max(0, 1 - Math.abs(reach - shoulderPosition) / 0.072)
            const lowerSpur = Math.max(0, 1 - Math.abs(reach - shoulderPosition - 0.26) / 0.057)
            const brokenSlope = slope - shoulderTooth * 0.11 - lowerSpur * 0.072
            const peakY = summit.y * height + verticalShift
            const edge = (noise2(nx * 82, layer * 3.1, seed + 219) - 0.5) * height * 0.011
              + (noise2(nx * 31, layer * 2.6, seed + 109) - 0.5) * height * 0.017
            crest = Math.min(crest, peakY + brokenSlope * (baseY - peakY) + edge * Math.min(1, reach * 8 + 0.2))
          }
          const ridge = Math.round(crest)
          paint.fillRect(x, ridge, 1, Math.max(0, height - ridge))
        }

        // The silhouette is already opaque. Source-atop clips every pixel face
        // to it, preserving clean crests without antialiased clipping masks.
        paint.globalCompositeOperation = 'source-atop'
        for (const [summitIndex, summit] of plan.summits.entries()) {
          const x = (summit.x + focalShift) * width + padding
          const y = summit.y * height + verticalShift
          const left = summit.left * width
          const right = summit.right * width
          const faceHeight = baseY - y
          const shoulderY = y + faceHeight * 0.4
          const spineX = x + right * summit.spine
          // All peaks share a light source above the left side. Long diagonal
          // shadow faces follow spurs down into the range, not vertical columns.
          paint.fillStyle = plan.colors[0]
          fillPixelPolygon(paint, [
            [x, y - 3], [x + right * 0.43, shoulderY], [x + right, baseY],
            [x + right * 0.61, baseY], [spineX, y + faceHeight * 0.57],
            [x + right * 0.045, y + faceHeight * 0.17],
          ])
          paint.fillStyle = plan.colors[2]
          fillPixelPolygon(paint, [
            [x - 1, y - 2], [x - left * 0.21, y + faceHeight * 0.23],
            [x - left * 0.63, y + faceHeight * 0.72], [x - left * 0.31, y + faceHeight * 0.64],
            [x + right * 0.075, y + faceHeight * 0.34],
          ])
          paint.fillStyle = plan.colors[0]
          fillPixelPolygon(paint, [
            [x - left * 0.19, y + faceHeight * 0.28], [x - left * 0.51, y + faceHeight * 0.67],
            [x - left * 0.4, y + faceHeight * 0.76], [x - left * 0.34, y + faceHeight * 0.58],
          ])

          paintErosion(paint, x, y, left, right, faceHeight, plan.colors,
            seed ^ Math.imul(layer + 1, 73856093) ^ Math.imul(summitIndex + 1, 19349663), layer === 0 || layer === 3 ? 2 : 3)

          if (summit.snow > 0) {
            const depth = summit.snow * height
            const snowLeft = Math.max(2, left * depth / faceHeight * 1.1)
            const snowRight = Math.max(2, right * depth / faceHeight * 1.2)
            paint.fillStyle = plan.colors[3]
            fillPixelPolygon(paint, [
              [x, y - 3], [x + snowRight, y + depth],
              [x + snowRight * 0.5, y + depth * 0.75],
              [x + snowRight * 0.25, y + depth * 1.28],
              [x - snowLeft * 0.05, y + depth * 0.63],
              [x - snowLeft * 0.46, y + depth * 1.12],
              [x - snowLeft * 0.53, y + depth * 0.77],
              [x - snowLeft, y + depth * 1.09],
            ])
            paint.fillStyle = plan.colors[4]
            fillPixelPolygon(paint, [
              [x, y - 2], [x + snowRight, y + depth],
              [x + snowRight * 0.5, y + depth * 0.75],
              [x + snowRight * 0.25, y + depth * 1.28],
              [x + snowRight * 0.1, y + depth * 0.48],
            ])
          }
        }
        paint.globalCompositeOperation = 'source-over'
        return canvas
      })
    }

    ctx.globalAlpha = 1
    for (let layer = 0; layer < 3; layer++) {
      ctx.drawImage(layers[layer], Math.round(-padding + scroll * (layer + 1) * 10), Math.round(scroll * layer * 2.5))
    }
    const lakeY = Math.round(height * 0.91 + verticalShift * 0.3)
    ctx.fillStyle = '#10212d'
    ctx.fillRect(0, lakeY, width, height - lakeY)
    for (let row = 0; row < 5; row++) {
      const y = Math.round(lakeY + row * height * 0.013)
      ctx.fillStyle = row % 2 ? '#304657' : '#23394a'
      for (let ripple = 0; ripple < 5; ripple++) {
        const x = width * (0.74 + ripple * 0.054) + Math.sin(time * 0.45 + row + ripple) * 1.1
        ctx.fillRect(Math.round(x), y, 3 + (row + ripple) % 5, 1)
      }
    }
    ctx.drawImage(layers[3], Math.round(-padding + scroll * 42), Math.round(scroll * 7))

    for (const pine of pines) {
      const x = pine.x * width + scroll * 42
      const y = height * (0.96 + pine.depth * 0.07) + scroll * 7
      const size = height * pine.height
      ctx.fillStyle = '#09131b'
      pixelLine(ctx, x, y, x, y - size)
      for (let tier = 0; tier < 3; tier++) {
        for (let row = 0; row < size * 0.5; row++) {
          const half = row * 0.26
          ctx.fillStyle = tier % 2 ? '#10232e' : '#182f3a'
          ctx.fillRect(Math.round(x - half), Math.round(y - size + row + tier * size * 0.21), Math.round(half * 2 + 1), 1)
        }
      }
    }
    // Two low cloud wisps and a few isolated flakes are the only airborne motion.
    for (let bank = 0; bank < 2; bank++) {
      const length = width * (0.1 + bank * 0.035)
      const x = wrap(width * (0.05 + bank * 0.76) + time * (0.32 + bank * 0.09), width + length) - length * 0.4
      const y = Math.round(height * (0.61 + bank * 0.11) + scroll * 5)
      ctx.fillStyle = bank ? '#344453' : '#2c3748'
      ctx.fillRect(Math.round(x), y, Math.round(length), 1)
      ctx.fillRect(Math.round(x + length * 0.18), y - 1, Math.round(length * 0.53), 1)
    }
    for (const flake of snow) {
      const x = wrap(flake.x * width + time * flake.speed + Math.sin(time * 0.25 + flake.phase) * 2, width)
      const y = wrap(flake.y * height + time * flake.speed * 1.3, height)
      ctx.fillStyle = flake.speed > 0.7 ? '#a0adbd' : '#63778d'
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
    }
  }
}
