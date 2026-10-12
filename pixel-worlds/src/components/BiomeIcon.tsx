import type { World } from '../data/portfolio'

// Small, original 16×16 chapter symbols, built only from square pixels.
export function BiomeIcon({ world }: { world: World }) {
  const paths: Record<World, string> = {
    universe: 'M6 2h4v2h2v2h2v4h-2v2h-2v2H6v-2H4v-2H2V6h2V4h2zM4 6v4h2v2h4v-2h2V6h-2V4H6v2zM0 12h4v2H0zM12 2h4v2h-4z',
    sky: 'M4 4h6v2h2v2h2v2h2v4H0v-4h2V6h2zM4 8v4h8v-2h-2V8H8V6H6v2z',
    mountains: 'M6 2h2v2h2v2h2v2h2v2h2v4H0v-4h2V8h2V6h2zM6 6v2H4v4h8v-2h-2V8H8V6z',
    botanical: 'M7 4h2v10H7zM1 2h4v2h2v4H3V6H1zM11 6h4v4h-2v2H9V8h2z',
    underwater: 'M0 3h4v2h4V3h4v2h4v2h-4V5H8v2H4V5H0zM0 9h4v2h4V9h4v2h4v2h-4v-2H8v2H4v-2H0z',
  }
  return <svg className="biome-icon" viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true"><path d={paths[world]} fillRule="evenodd" /></svg>
}
