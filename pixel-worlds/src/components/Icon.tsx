type IconName = 'arrow' | 'down' | 'download' | 'close' | 'plus' | 'mail'

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, string> = {
    arrow: 'M2 7h8V5H8V3h2v2h2v2h2v2h-2v2h-2v2H8v-2h2V9H2z',
    down: 'M7 2h2v8h2V8h2v2h-2v2H9v2H7v-2H5v-2H3V8h2v2h2z',
    download: 'M7 1h2v6h2V5h2v2h-2v2H9v2H7V9H5V7H3V5h2v2h2zM1 11h2v2h10v-2h2v4H1z',
    close: 'M3 3h2v2h2v2h2V5h2V3h2v2h-2v2H9v2h2v2h2v2h-2v-2H9V9H7v2H5v2H3v-2h2V9h2V7H5V5H3z',
    plus: 'M7 2h2v5h5v2H9v5H7V9H2V7h5z',
    mail: 'M1 3h14v10H1zM3 5v6h10V5zM3 5h2v2H3zM5 7h2v2H5zM7 9h2v2H7zM9 7h2v2H9zM11 5h2v2h-2z',
  }
  return <svg className={`icon ${className}`} viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true"><path d={paths[name]} fillRule="evenodd" /></svg>
}
