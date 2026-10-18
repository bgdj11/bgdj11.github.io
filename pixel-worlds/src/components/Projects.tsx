import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { projects } from '../data/portfolio'
import type { MediaAsset, Project } from '../data/portfolio'
import { FramedImage } from './Media'

const filters = ['All', 'Graphics & Vision', 'AI & Systems', 'Games', 'Coursework'] as const
type Filter = typeof filters[number]
const readFilter = (): Filter => filters.find(item => item === new URL(location.href).searchParams.get('work')) ?? 'All'
export function ProjectCollection({ onSelect }: { onSelect: (project: Project) => void }) {
  const [filter, setFilter] = useState<Filter>(readFilter)
  useEffect(() => { const sync = () => setFilter(readFilter()); window.addEventListener('popstate', sync); return () => window.removeEventListener('popstate', sync) }, [])
  const featured = projects.filter(project => project.featured)
  const archive = projects.filter(project => !project.featured && project.id !== 'bunhub' && (filter === 'All' || (filter === 'Graphics & Vision' && ['Graphics', 'Vision'].includes(project.category)) || (filter === 'AI & Systems' && project.category === 'AI') || (filter === 'Games' && project.category === 'Games')))
  const select = (item: Filter) => { setFilter(item); const url = new URL(location.href); if (item === 'All') url.searchParams.delete('work'); else url.searchParams.set('work', item); history.replaceState(history.state, '', url) }
  const bunhub = projects.find(project => project.id === 'bunhub')!
  return <>
    <div className="featured-work">{featured.map(project => <FeaturedProjectCard key={project.id} project={project} onSelect={onSelect} />)}</div>
    <div className="systems-highlight"><FeaturedProjectCard project={bunhub} onSelect={onSelect} /></div>
    <div className="project-filters" role="group" aria-label="Filter additional projects; featured projects stay visible">{filters.map(item => <button key={item} data-category={item === 'Graphics & Vision' ? 'Graphics' : item === 'AI & Systems' ? 'AI' : item === 'Games' ? 'Games' : 'All'} className={'filter' + (filter === item ? ' is-selected' : '')} aria-pressed={filter === item} onClick={() => select(item)}>{item}</button>)}</div>
    <p className="sr-only" role="status">{archive.length} projects shown for {filter}.</p>
    <div className="small-projects">{archive.map(project => <SmallProjectCard key={project.id} project={project} onSelect={onSelect} />)}</div>
    {(filter === 'All' || filter === 'Coursework' || filter === 'Graphics & Vision') && <div className="coursework-collections">{['Computer Animation Lab', 'Computer Graphics / Shape Modeling Lab'].map(title => <article key={title}><h3>{title}</h3><p>Ongoing Master’s Coursework</p><p className="coursework-note">A collection in progress. Lab work and results will be added as the semester develops.</p></article>)}</div>}
  </>
}

function preview(media: MediaAsset): MediaAsset {
  const animated = media.kind === 'video' || media.kind === 'gif' || /\.gif(?:[?#]|$)/i.test(media.src ?? '')
  return { ...media, kind: 'image', src: animated ? media.poster : media.src, shape: 'landscape', width: undefined, height: undefined, caption: undefined }
}

function openCard(event: MouseEvent<HTMLElement>, project: Project, onSelect: (project: Project) => void) {
  if (window.getSelection()?.isCollapsed === false) return
  event.currentTarget.querySelector('button')?.focus({ preventScroll: true })
  onSelect(project)
}

export function FeaturedProjectCard({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  return <article className="featured-project game-card" data-category={project.category} onClick={event => openCard(event, project, onSelect)}>
    <FramedImage media={preview(project.cardMedia ?? project.media)} />
    <div className="work-copy">
      <h3><button className="title-button" aria-label={`Open project: ${project.title}`}>{project.title}</button></h3>
      <p>{project.summary}</p>
      {project.placeholderNote && <p className="project-draft">Draft entry</p>}
    </div>
  </article>
}

export function SmallProjectCard({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  return <article className="small-project game-card" data-category={project.category} onClick={event => openCard(event, project, onSelect)}><FramedImage media={preview(project.cardMedia ?? project.media)} />
    <div><h3><button className="title-button" aria-label={`Open project: ${project.title}`}>{project.title}</button></h3><p>{project.summary}</p></div>
  </article>
}
