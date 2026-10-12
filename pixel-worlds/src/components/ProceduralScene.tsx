import { useEffect, useRef } from 'react'
import type { World } from '../data/portfolio'
import { subscribeToSceneFrames } from '../scenes/animation'
import { createUniverseScene, createSkyScene } from '../scenes/celestial'
import { createMountainsScene } from '../scenes/landscapes'
import { createBotanicalScene } from '../scenes/botanical'
import { createUnderwaterScene } from '../scenes/underwater'
import type { ScenePalette, SceneRenderer } from '../scenes/types'
import { worldSeeds } from '../scenes/seeds'

const factories: Record<World, (seed: number) => SceneRenderer> = {
  universe: createUniverseScene,
  sky: createSkyScene,
  mountains: createMountainsScene,
  botanical: createBotanicalScene,
  underwater: createUnderwaterScene,
}

function readPalette(element: HTMLElement): ScenePalette {
  const style = getComputedStyle(element)
  const color = (token: string) => style.getPropertyValue(token).trim()
  return {
    background: color('--scene-base') || color('--color-bg'), atmosphere: color('--scene-color'),
    back: color('--scene-back'), front: color('--scene-front'),
    accent: color('--color-accent'), secondary: color('--color-secondary'),
  }
}

/** A deliberately coarse, DPR-independent drawing surface. Text is never on it. */
export function ProceduralScene({ world }: { world: World }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const layer = canvas?.parentElement
    if (!canvas || !layer) return
    const section = layer.closest('section') ?? layer
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) {
      canvas.dataset.sceneState = 'unavailable'
      return
    }

    const render = factories[world](worldSeeds[world])
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let palette = readPalette(canvas)
    let elapsed = 0
    let visible = false
    let contextAvailable = true
    let compact = window.innerWidth < 900
    let focusHeightRatio = 0.3
    let focusRatio = 0.5
    let sceneRatio = 0.55
    let unsubscribe: (() => void) | undefined

    function draw() {
      if (!ctx || !canvas || !contextAvailable) return
      const rect = section.getBoundingClientRect()
      const scroll = motion.matches ? 0 : Math.max(-1, Math.min(1,
        (window.innerHeight - rect.top * 2 - rect.height) / (window.innerHeight + rect.height)))
      const clamp = (value: number) => Math.max(0, Math.min(1, value))
      const entry = motion.matches ? 0 : clamp(rect.top / window.innerHeight)
      const exit = motion.matches ? 0 : clamp((window.innerHeight - rect.bottom) / window.innerHeight)
      const travel = motion.matches ? 0 : clamp(-rect.top / Math.max(1, rect.height - window.innerHeight))
      const ease = (value: number) => value * value * (3 - 2 * value)
      // A continuous camera handoff: the outgoing world recedes and drifts,
      // while the incoming landscape travels along the opposite arc. Nothing
      // dissolves, blacks out, or covers the editorial layer.
      const incoming = ease(entry), outgoing = ease(exit)
      const zoom = motion.matches ? 1 : 1.08 + incoming * 0.42 - outgoing * 0.2 - travel * 0.08
      const direction = world === 'sky' || world === 'botanical' ? -1 : 1
      const panX = motion.matches ? 0 : direction * canvas.width * (incoming * 0.085 + outgoing * 0.055)
      const panY = motion.matches ? 0 : canvas.height * (incoming * 0.1 - outgoing * 0.07)
      // Level horizons for clouds, mountains, and the water surface.
      const turn = compact || (world !== 'universe' && world !== 'botanical')
        ? 0 : direction * (incoming * 0.075 - outgoing * 0.06) + scroll * 0.02
      const focusX = canvas.width * focusRatio
      const focusY = canvas.height * focusHeightRatio
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.imageSmoothingEnabled = false
      ctx.fillStyle = palette.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.translate(canvas.width / 2 + panX, canvas.height / 2 + panY)
      ctx.rotate(turn)
      ctx.scale(zoom, zoom)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)
      render({ ctx, width: canvas.width, height: canvas.height, time: elapsed, scroll, palette,
        compact, focusX, focusY, sceneWidth: canvas.width * sceneRatio })
      ctx.restore()
    }

    function syncPlayback() {
      if (!canvas) return
      unsubscribe?.()
      unsubscribe = undefined
      if (!contextAvailable) {
        canvas.dataset.sceneState = 'unavailable'
      } else if (motion.matches) {
        canvas.dataset.sceneState = 'still'
        draw()
      } else if (visible && !document.hidden) {
        canvas.dataset.sceneState = 'active'
        draw()
        unsubscribe = subscribeToSceneFrames((delta) => {
          elapsed += delta
          draw()
        })
      } else {
        canvas.dataset.sceneState = 'paused'
      }
    }

    function resize() {
      if (!canvas || !layer) return
      const width = Math.max(1, layer.clientWidth)
      const height = Math.max(1, layer.clientHeight)
      compact = window.innerWidth < 900
      const panel = section.querySelector('.section-panel')?.getBoundingClientRect()
      const sceneRect = layer.getBoundingClientRect()
      const leftEdge = panel ? (panel.left - sceneRect.left) / width : 0.16
      const rightEdge = panel ? (panel.right - sceneRect.left) / width : 0.84
      // Anchor the large forms to the frame, with intentional occlusion. Their
      // scale no longer collapses to the width of an empty sidebar.
      sceneRatio = compact ? 1 : 0.55
      focusRatio = compact ? (world === 'universe' ? 0.76 : 0.36)
        : world === 'botanical' ? leftEdge + 0.015 : rightEdge + 0.01
      focusHeightRatio = compact ? Math.min(0.2, 145 / height)
        : world === 'botanical' ? 0.5 : world === 'mountains' ? 0.54 : 0.3
      // Keep square logical pixels on a sticky viewport-sized stage. Retina screens
      // do not multiply memory/work; neither axis nor total area is unbounded.
      const scale = Math.max(3, Math.ceil(width / 480), Math.ceil(height / 1200),
        Math.ceil(Math.sqrt(width * height / 300_000)))
      const bufferWidth = Math.max(1, Math.floor(width / scale))
      const bufferHeight = Math.max(1, Math.floor(height / scale))
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth
        canvas.height = bufferHeight
      }
      palette = readPalette(canvas)
      draw()
    }

    const intersection = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
        // Merely touching a viewport edge is "intersecting" with zero area.
        // A tiny positive threshold avoids animating those hidden neighbours.
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.001
        syncPlayback()
      }, { threshold: 0.001 })
      : undefined
    // Without visibility observation, provide an attractive still composition.
    const resizing = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : undefined
    const contextLost = (event: Event) => {
      event.preventDefault()
      contextAvailable = false
      syncPlayback()
    }
    const contextRestored = () => {
      contextAvailable = true
      resize()
      syncPlayback()
    }

    resize()
    syncPlayback()
    intersection?.observe(section)
    resizing?.observe(layer)
    if (!resizing) window.addEventListener('resize', resize, { passive: true })
    motion.addEventListener('change', syncPlayback)
    document.addEventListener('visibilitychange', syncPlayback)
    canvas.addEventListener('contextlost', contextLost)
    canvas.addEventListener('contextrestored', contextRestored)

    return () => {
      unsubscribe?.()
      intersection?.disconnect()
      resizing?.disconnect()
      window.removeEventListener('resize', resize)
      motion.removeEventListener('change', syncPlayback)
      document.removeEventListener('visibilitychange', syncPlayback)
      canvas.removeEventListener('contextlost', contextLost)
      canvas.removeEventListener('contextrestored', contextRestored)
    }
  }, [world])

  return <canvas ref={ref} className="procedural-scene" data-scene-state="paused" aria-hidden="true" />
}
