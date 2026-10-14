import type { DetailContent, Education, Experience, Hobby } from '../data/portfolio'
import type { MouseEvent } from 'react'
import { FramedImage } from './Media'

type Select = (entry: DetailContent) => void

function openEntry(event: MouseEvent<HTMLElement>, entry: DetailContent, onSelect: Select) {
  if (window.getSelection()?.isCollapsed === false) return
  const control = (event.target as HTMLElement).closest('button, a, video')
  if (control && !control.classList.contains('title-button')) return
  event.currentTarget.querySelector<HTMLButtonElement>('.title-button')?.focus({ preventScroll: true })
  onSelect(entry)
}

export function AcademicEntry({ entry, onSelect }: { entry: Education; onSelect: Select }) {
  return <article className="academic-entry interactive-entry" onClick={event => openEntry(event, entry, onSelect)}>
    <div className="academic-heading">{entry.media.src && <FramedImage media={entry.media} />}<div>
      <h3><button className="title-button" aria-haspopup="dialog">{entry.title}</button></h3>
      {entry.subtitle && <p className="entry-school">{entry.subtitle}</p>}
      {entry.location && <p className="entry-location">{entry.location}</p>}
      <p className="entry-date">{entry.dates ?? 'Dates to be added'}</p>
    </div></div>
    <div className="academic-program">
      <p className="academic-degree">{entry.degree}</p>
      {entry.credential && <p className="degree-level">{entry.credential}</p>}
      {entry.summary && <p className="academic-summary">{entry.summary}</p>}
      {(entry.credits || entry.gpa) && <dl className="academic-metrics">
        {entry.credits && <div><dt>ECTS credits</dt><dd>{entry.credits}</dd></div>}
        {entry.gpa && <div><dt>Cumulative GPA</dt><dd>{entry.gpa}</dd></div>}
      </dl>}
    </div>
  </article>
}

export function ExperienceEntry({ entry, onSelect }: { entry: Experience; onSelect: Select }) {
  return <li className="experience-entry interactive-entry" onClick={event => openEntry(event, entry, onSelect)}>
    <FramedImage media={entry.media} />
    <div className="experience-copy">
      <h3><button className="title-button" aria-haspopup="dialog" aria-label={`${entry.role} at ${entry.title}`}>{entry.role}</button></h3>
      <p className="experience-company">{entry.title}</p>
      <p className="experience-summary">{entry.summary}</p>
      {!!entry.highlights?.length && <ul className="experience-highlights" aria-label="Areas of work">{entry.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>}
    </div>
    <div className="experience-meta">
      {entry.dates && <p className="experience-date">{entry.dates}</p>}
      {entry.location && <p className="entry-location">{entry.location}</p>}
    </div>
  </li>
}

export function HobbyCard({ hobby, onSelect }: { hobby: Hobby; onSelect: Select }) {
  return <article className="hobby-card interactive-entry" onClick={event => openEntry(event, hobby, onSelect)}><FramedImage media={hobby.media} /><h3><button className="title-button" aria-haspopup="dialog">{hobby.title}</button></h3></article>
}
