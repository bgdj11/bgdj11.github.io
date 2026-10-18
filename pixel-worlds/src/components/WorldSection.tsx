import type { ReactNode } from 'react'
import { chapters } from '../data/portfolio'
import type { SectionId } from '../data/portfolio'
import { DesktopWindow } from './Desktop'

export function WorldSection({ id, children, aside, footer, eyebrow, description }: {
  id: SectionId; children: ReactNode; aside?: ReactNode; footer?: ReactNode
  eyebrow?: string; description?: ReactNode
}) {
  const chapter = chapters.find(item => item.id === id)!
  return <DesktopWindow id={id}>
      <div className={'desktop-panel' + (aside ? ' desktop-panel-hero' : '')}>
        <div className="section-editorial">
          <SectionHeading id={id} eyebrow={eyebrow} description={description ?? chapter.description}>{chapter.title}</SectionHeading>
          <div className="section-body">{children}</div>
        </div>
        {aside && <aside className="section-aside">{aside}</aside>}
      </div>
      {footer}
  </DesktopWindow>
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
