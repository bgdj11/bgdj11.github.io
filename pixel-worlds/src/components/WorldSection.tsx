import type { ReactNode } from 'react'
import { chapters } from '../data/portfolio'
import type { SectionId, World } from '../data/portfolio'

export function WorldSection({ id, children, aside, footer, eyebrow, description, theme, scene }: {
  id: SectionId; children: ReactNode; aside?: ReactNode; footer?: ReactNode
  eyebrow?: string; description?: ReactNode; theme?: World; scene?: ReactNode
}) {
  const chapter = chapters.find(item => item.id === id)!
  return <section id={id} className="world" data-theme={theme ?? chapter.world} aria-labelledby={id + '-heading'}>
    {scene && <div className="scene-layer" aria-hidden="true" inert>{scene}</div>}
    <div className="section-container">
      <ContentPanel className={'section-panel' + (aside ? ' section-panel-hero' : '')}>
        <div className="section-editorial">
          <SectionHeading id={id} eyebrow={eyebrow} description={description ?? chapter.description}>{chapter.title}</SectionHeading>
          <div className="section-body">{children}</div>
        </div>
        {aside && <aside className="section-aside">{aside}</aside>}
      </ContentPanel>
      {footer}
    </div>
  </section>
}

export function ContentPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={'panel ' + className}>{children}</div>
}

export function SectionHeading({ id, eyebrow, children, description }: {
  id: SectionId; eyebrow?: string; children: ReactNode; description?: ReactNode
}) {
  const Heading = id === 'home' ? 'h1' : 'h2'
  return <header className="section-heading">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <Heading id={id + '-heading'}>{children}</Heading>
    {description && <p className="section-intro">{description}</p>}
  </header>
}
