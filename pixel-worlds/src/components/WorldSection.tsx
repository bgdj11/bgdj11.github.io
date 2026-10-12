import type { ReactNode } from 'react'
import { chapters } from '../data/portfolio'
import type { SectionId, World } from '../data/portfolio'
import { BiomeIcon } from './BiomeIcon'

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

/** Editorial chapters share one continuous scene, independent of their height. */
export function WorldSection({
  id, heading, eyebrow, children, chapterTitle, description, lead, theme,
  scene, aside, panelFooter, footer, layout = 'editorial', className = '',
}: WorldSectionProps) {
  const chapter = chapters.find((item) => item.id === id)!
  const world = theme ?? chapter.world
  return (
    <section id={id} className={`world world-${world} ${className}`} data-theme={world} aria-labelledby={`${id}-heading`}>
      {scene && <div className="scene-layer" aria-hidden="true" inert>{scene}</div>}
      <div className="section-container">
        <div className="chapter-line">
          <span className="chapter-label"><span className="chapter-number">{chapter.number}</span><BiomeIcon world={world} />{chapterTitle ?? chapter.title}</span>
          <span className="chapter-rule" aria-hidden="true" />
          <span className="chapter-purpose">{id === 'home' ? 'A personal universe' : chapter.label}</span>
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
