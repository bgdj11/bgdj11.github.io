export interface ScenePalette {
  background: string
  atmosphere: string
  back: string
  front: string
  accent: string
  secondary: string
}

export interface SceneFrame {
  ctx: CanvasRenderingContext2D
  /** Coordinates are low-resolution canvas pixels, independent of device DPR. */
  width: number
  height: number
  /** Seconds spent animating while visible. Pausing never advances this clock. */
  time: number
  /** Section-relative viewport position, clamped to -1…1; zero in reduced motion. */
  scroll: number
  /** Frame-relative anchor in logical pixels; forms may extend behind the panel. */
  focusX: number
  focusY: number
  /** Composition span in logical pixels, independent of the remaining gutters. */
  sceneWidth: number
  /** Narrow layouts place the focal artwork near the panel's upper edge. */
  compact: boolean
  palette: ScenePalette
}

export type SceneRenderer = (frame: SceneFrame) => void
