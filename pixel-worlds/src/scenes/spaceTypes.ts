export const planetIds = ['aurelia', 'vesper', 'nereid', 'solis', 'ember', 'caelum'] as const
export type PlanetId = typeof planetIds[number]
export interface PlanetRotation { yaw: number; pitch: number }
export interface SpaceFrame {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  time: number
  progress: number
  compact: boolean
  pointer: { x: number; y: number }
  rotations: Record<PlanetId, PlanetRotation>
  reducedMotion: boolean
}
export interface PlanetTarget {
  id: PlanetId
  x: number
  y: number
  radius: number
  label: string
}
