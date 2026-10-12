import type { ReactNode } from 'react'
import { chapters } from '../data/portfolio'
import type { SectionId, World } from '../data/portfolio'
import { BiomeIcon } from './BiomeIcon'
import { ProceduralScene } from './ProceduralScene'

/** Custom scene renderers inherit the same decorative, viewport-sized stage. */
export function SceneLayer({ world, children }: { world: World; children?: ReactNode }) {
  return (
    <div className={`scene-layer scene-${world}`} aria-hidden="true" inert data-scene={world}>
      <div className="scene-viewport">
        {children ?? <>
          <ProceduralScene world={world} />
          <div className="scene-fallback"><div className="scene-form scene-form-back" /><div className="scene-form scene-form-front" /></div>
        </>}
      </div>
    </div>
  )
}

/** Stepped foreground silhouettes borrow the shape language of the next biome. */
function horizonPath(world: World, layer: number) {
  let path = 'M-80 160'
  for (let x = -80; x <= 560; x += 2) {
    let y = 0
    const u = x + layer * 27
    if (world === 'sky') {
      // Merged cumulus mounds, rasterized to the same stepped grid as the scenes.
      y = 70 - Math.abs(Math.sin(u * 0.024)) * 27 - Math.abs(Math.sin(u * 0.051 + 1)) * 13
    } else if (world === 'mountains') {
      const triangular = 1 - Math.abs(((u + 640) % 128) / 64 - 1)
      y = 76 - triangular * 44 - Math.sin(u * 0.044) * 7
    } else if (world === 'botanical') {
      y = 69 - Math.abs(Math.sin(u * 0.037)) * 29 - Math.sin(u * 0.13) * 6
    } else {
      y = 58 + Math.sin(u * 0.033) * 13 + Math.sin(u * 0.077 + 1) * 4
    }
    const step = Math.round((y + layer * 17) / 2) * 2
    path += `H${x}V${step}`
  }
  return `${path}V160Z`
}

function ChapterTransition({ next }: { next: World }) {
  return <div className="chapter-transition" data-theme={next} aria-hidden="true" inert>
    <svg viewBox="0 0 480 100" preserveAspectRatio="none" shapeRendering="crispEdges">
      <path className="transition-back" d={horizonPath(next, 0)} />
      <path className="transition-front" d={horizonPath(next, 1)} />
      <path className="transition-ground" d={horizonPath(next, 2)} />
    </svg>
  </div>
}

export interface WorldSectionProps {
  id: SectionId
  heading: ReactNode
  eyebrow: string
  children: ReactNode
  chapterTitle?: string
  description?: ReactNode
  lead?: ReactNode
  theme?: World
  scene?: ReactNode
  aside?: ReactNode
  panelFooter?: ReactNode
  footer?: ReactNode
  layout?: 'editorial' | 'hero' | 'closing'
  className?: string
}

/** Shared chapter metadata, semantic heading, readable frame, and scene boundary. */
export function WorldSection({
  id, heading, eyebrow, children, chapterTitle, description, lead, theme,
  scene, aside, panelFooter, footer, layout = 'editorial', className = '',
}: WorldSectionProps) {
  const chapter = chapters.find((item) => item.id === id)!
  const world = theme ?? chapter.world
  const nextChapter = chapters[chapters.findIndex((item) => item.id === id) + 1]
  return (
    <section id={id} className={`world world-${world} ${className}`} data-theme={world} aria-labelledby={`${id}-heading`}>
      <SceneLayer world={world}>{scene}</SceneLayer>
      <div className="section-container">
        <div className="chapter-line">
          <span className="chapter-label"><span className="chapter-number">{chapter.number}</span><BiomeIcon world={world} />{chapterTitle ?? chapter.title}</span>
          <span className="chapter-rule" aria-hidden="true" />
          <span className="chapter-purpose">{id === 'home' ? 'A portfolio in five worlds' : chapter.label}</span>
        </div>
        <Panel className={`section-panel section-panel-${layout}`}>
          <div className="section-editorial">
            <SectionHeading id={id} eyebrow={eyebrow} description={description} lead={lead}>{heading}</SectionHeading>
            <div className="section-body">{children}</div>
          </div>
          {aside && <div className="section-aside">{aside}</div>}
          {panelFooter && <div className="section-panel-footer">{panelFooter}</div>}
        </Panel>
        {footer}
      </div>
      {nextChapter && <ChapterTransition next={nextChapter.world} />}
    </section>
  )
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`panel ${className}`}>{children}</div>
}

export function SectionHeading({ id, eyebrow, children, description, lead }: {
  id: SectionId; eyebrow: string; children: ReactNode; description?: ReactNode; lead?: ReactNode
}) {
  const Heading = id === 'home' ? 'h1' : 'h2'
  return (
    <header className="section-heading">
      <p className="eyebrow"><span className="tiny-square" aria-hidden="true" />{eyebrow}</p>
      {lead && <p className="section-lead">{lead}</p>}
      <Heading id={`${id}-heading`}>{children}</Heading>
      {description && <p className="section-intro">{description}</p>}
    </header>
  )
}
