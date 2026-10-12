import { useEffect, useRef } from 'react'
import { subscribeToSceneFrames } from '../scenes/animation'
import { createSpaceScene } from '../scenes/space'
import type { PlanetId, PlanetRotation } from '../scenes/spaceTypes'
import { planetIds } from '../scenes/spaceTypes'
import { worldSeeds } from '../scenes/seeds'

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

/** One continuous, low-resolution universe. Only the exposed planets take input. */
export function SpaceScene() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = stage?.querySelector('canvas')
    if (!stage || !canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    const handles = Object.fromEntries(planetIds.map(id => [id,
      stage.querySelector<HTMLButtonElement>(`[data-planet="${id}"]`)!,
    ])) as Record<PlanetId, HTMLButtonElement>
    if (!ctx) {
      canvas.dataset.sceneState = 'unavailable'
      for (const handle of Object.values(handles)) handle.hidden = true
      return
    }
    const render = createSpaceScene(worldSeeds.universe)
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = matchMedia('(pointer: fine)')
    const makeRotations = () => Object.fromEntries(planetIds.map(id => [id, { yaw: 0, pitch: 0 }])) as Record<PlanetId, PlanetRotation>
    const rotations = makeRotations()
    const velocity = makeRotations()
    const pointer = { x: 0, y: 0 }, pointerGoal = { x: 0, y: 0 }
    let elapsed = 0, progress = 0, scrollRange = 1
    let cssWidth = 1, cssHeight = 1, contextAvailable = true
    let unsubscribe: (() => void) | undefined
    let drag: { id: PlanetId; pointerId: number; x: number; y: number; movedAt: number } | null = null
    const bar = stage.querySelector<HTMLElement>('.space-progress > i')

    function draw() {
      if (!ctx || !canvas || !contextAvailable) return
      ctx.imageSmoothingEnabled = false
      const scaleX = cssWidth / canvas.width, scaleY = cssHeight / canvas.height
      const targets = render({ ctx, width: canvas.width, height: canvas.height,
        time: elapsed, progress, compact: cssWidth < 900,
        pointer, rotations, reducedMotion: motion.matches })
      for (const id of planetIds) {
        const handle = handles[id]
        const target = targets.find(item => item.id === id)
        if (!target) {
          if (drag?.id === id) endDrag()
          handle.hidden = true; continue
        }
        const radius = Math.max(target.radius, 7)
        const left = (target.x - radius) * scaleX, top = (target.y - radius) * scaleY
        handle.hidden = left + radius * 2 * scaleX < 0 || left > cssWidth
          || top + radius * 2 * scaleY < 0 || top > cssHeight
        handle.style.left = `${left}px`; handle.style.top = `${top}px`
        handle.style.width = `${radius * 2 * scaleX}px`; handle.style.height = `${radius * 2 * scaleY}px`
        handle.style.zIndex = String(2 + targets.indexOf(target))
        handle.setAttribute('aria-label', `Rotate ${target.label}. Drag, use arrow keys, or press Home to reset.`)
        handle.dataset.yaw = rotations[id].yaw.toFixed(3)
        handle.dataset.pitch = rotations[id].pitch.toFixed(3)
        handle.dataset.side = target.x < canvas.width / 2 ? 'left' : 'right'
      }
      canvas.dataset.progress = progress.toFixed(4)
      if (bar) bar.style.transform = `scaleX(${progress})`
    }

    function step(delta: number) {
      elapsed += delta
      const ease = 1 - Math.exp(-delta * 7)
      progress += (clamp(window.scrollY / scrollRange, 0, 1) - progress) * ease
      pointer.x += (pointerGoal.x - pointer.x) * ease
      pointer.y += (pointerGoal.y - pointer.y) * ease
      for (const id of planetIds) {
        if (drag?.id === id) continue
        rotations[id].yaw += velocity[id].yaw * delta
        rotations[id].pitch = clamp(rotations[id].pitch + velocity[id].pitch * delta, -1.2, 1.2)
        const damping = Math.exp(-delta * 5)
        velocity[id].yaw *= damping; velocity[id].pitch *= damping
      }
      draw()
    }

    function syncPlayback() {
      unsubscribe?.(); unsubscribe = undefined
      if (!canvas) return
      if (!contextAvailable) canvas.dataset.sceneState = 'unavailable'
      else if (document.hidden) canvas.dataset.sceneState = 'paused'
      else if (motion.matches) {
        canvas.dataset.sceneState = 'still'
        // A stable composition: automatic motion, pointer parallax and scroll
        // camera stop, while deliberate keyboard / drag rotation still works.
        elapsed = 0; progress = 0; pointer.x = pointer.y = 0
        for (const id of planetIds) velocity[id].yaw = velocity[id].pitch = 0
        draw()
      } else {
        canvas.dataset.sceneState = 'active'
        draw()
        unsubscribe = subscribeToSceneFrames(step)
      }
    }

    function measureScroll() {
      scrollRange = Math.max(1, document.documentElement.scrollHeight - innerHeight)
    }
    function resize() {
      if (!stage || !canvas) return
      cssWidth = Math.max(1, stage.clientWidth); cssHeight = Math.max(1, stage.clientHeight)
      const scale = Math.max(3, Math.ceil(cssWidth / 480), Math.ceil(cssHeight / 1200),
        Math.ceil(Math.sqrt(cssWidth * cssHeight / 300_000)))
      canvas.width = Math.max(1, Math.floor(cssWidth / scale))
      canvas.height = Math.max(1, Math.floor(cssHeight / scale))
      measureScroll(); draw()
    }

    function movePointer(event: PointerEvent) {
      if (motion.matches || !finePointer.matches || event.pointerType === 'touch') return
      pointerGoal.x = event.clientX / cssWidth * 2 - 1
      pointerGoal.y = event.clientY / cssHeight * 2 - 1
    }
    function endDrag(event?: PointerEvent) {
      if (!drag || (event && event.pointerId !== drag.pointerId)) return
      const handle = handles[drag.id]
      if (motion.matches || performance.now() - drag.movedAt > 100) {
        velocity[drag.id].yaw = velocity[drag.id].pitch = 0
      }
      const pointerId = drag.pointerId
      drag = null
      handle.classList.remove('is-dragging')
      if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId)
    }
    function resetPointer() { pointerGoal.x = pointerGoal.y = 0; endDrag() }
    const cleanupHandles = planetIds.map(id => {
      const handle = handles[id]
      const down = (event: PointerEvent) => {
        if (event.button !== 0 || !event.isPrimary) return
        endDrag()
        drag = { id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, movedAt: performance.now() }
        velocity[id].yaw = velocity[id].pitch = 0
        handle.setPointerCapture(event.pointerId)
        handle.classList.add('is-dragging')
      }
      const move = (event: PointerEvent) => {
        if (drag?.id !== id || drag.pointerId !== event.pointerId) return
        const now = performance.now(), delta = Math.max(0.016, (now - drag.movedAt) / 1000)
        const dx = (event.clientX - drag.x) * 0.009
        const dy = (event.clientY - drag.y) * 0.009
        rotations[id].yaw += dx
        rotations[id].pitch = clamp(rotations[id].pitch + dy, -1.2, 1.2)
        velocity[id].yaw = clamp(dx / delta, -2, 2)
        velocity[id].pitch = clamp(dy / delta, -1.2, 1.2)
        drag.x = event.clientX; drag.y = event.clientY; drag.movedAt = now
        if (motion.matches) draw()
      }
      const key = (event: KeyboardEvent) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'Enter', ' '].includes(event.key)) return
        event.preventDefault()
        velocity[id].yaw = velocity[id].pitch = 0
        const amount = event.shiftKey ? 0.3 : 0.12
        if (event.key === 'Home') rotations[id].yaw = rotations[id].pitch = 0
        else if (event.key === 'ArrowUp') rotations[id].pitch -= amount
        else if (event.key === 'ArrowDown') rotations[id].pitch += amount
        else rotations[id].yaw += event.key === 'ArrowLeft' ? -amount : amount
        rotations[id].pitch = clamp(rotations[id].pitch, -1.2, 1.2)
        draw()
      }
      // Assistive technologies can activate a button without a key event.
      const click = (event: MouseEvent) => { if (event.detail === 0) { rotations[id].yaw += 0.2; draw() } }
      handle.addEventListener('pointerdown', down)
      handle.addEventListener('pointermove', move)
      handle.addEventListener('pointerup', endDrag)
      handle.addEventListener('pointercancel', endDrag)
      handle.addEventListener('lostpointercapture', endDrag)
      handle.addEventListener('keydown', key)
      handle.addEventListener('click', click)
      return () => {
        handle.removeEventListener('pointerdown', down); handle.removeEventListener('pointermove', move)
        handle.removeEventListener('pointerup', endDrag); handle.removeEventListener('pointercancel', endDrag)
        handle.removeEventListener('lostpointercapture', endDrag); handle.removeEventListener('keydown', key)
        handle.removeEventListener('click', click)
      }
    })
    const lost = (event: Event) => {
      event.preventDefault(); contextAvailable = false; endDrag()
      for (const handle of Object.values(handles)) handle.hidden = true
      syncPlayback()
    }
    const restored = () => { contextAvailable = true; resize(); syncPlayback() }
    const visibility = () => { if (document.hidden) resetPointer(); syncPlayback() }
    const sizing = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : undefined
    const contentSizing = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measureScroll) : undefined
    sizing?.observe(stage)
    const main = document.querySelector('main')
    if (main) contentSizing?.observe(main)
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', movePointer, { passive: true })
    window.addEventListener('blur', resetPointer)
    document.documentElement.addEventListener('pointerleave', resetPointer)
    document.addEventListener('visibilitychange', visibility)
    motion.addEventListener('change', syncPlayback)
    canvas.addEventListener('contextlost', lost); canvas.addEventListener('contextrestored', restored)
    resize(); syncPlayback()
    return () => {
      endDrag(); unsubscribe?.(); sizing?.disconnect(); contentSizing?.disconnect()
      cleanupHandles.forEach(cleanup => cleanup())
      window.removeEventListener('resize', resize); window.removeEventListener('pointermove', movePointer)
      window.removeEventListener('blur', resetPointer)
      document.documentElement.removeEventListener('pointerleave', resetPointer)
      document.removeEventListener('visibilitychange', visibility); motion.removeEventListener('change', syncPlayback)
      canvas.removeEventListener('contextlost', lost); canvas.removeEventListener('contextrestored', restored)
    }
  }, [])

  return <div ref={stageRef} className="space-stage" role="region" aria-label="Interactive planetary background">
    <canvas className="space-canvas" aria-hidden="true" data-scene-state="paused" />
    {planetIds.map(id => <button key={id} type="button" className="planet-handle" data-planet={id}
      aria-label={`Rotate ${id}`} hidden>
      <span className="planet-hint" aria-hidden="true">Drag to rotate <span>↔ ↕</span></span>
    </button>)}
    <div className="space-status" aria-hidden="true"><span>Scroll through the orbits</span><div className="space-progress"><i /></div></div>
  </div>
}
