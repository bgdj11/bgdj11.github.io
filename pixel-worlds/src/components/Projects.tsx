import { useState } from 'react'
import type { MouseEvent } from 'react'
import { projects } from '../data/portfolio'
import type { MediaAsset, Project, ProjectCategory } from '../data/portfolio'
import { FramedImage } from './Media'

export function ProjectCollection({ onSelect }: { onSelect: (project: Project) => void }) {
  const [filter, setFilter] = useState<'All' | ProjectCategory>('All')
  const featured = projects.filter(project => project.featured)
  const archive = projects.filter(project => !project.featured && (filter === 'All' || project.category === filter))
  const filters: ('All' | ProjectCategory)[] = ['All', 'Graphics', 'Vision', 'AI', 'Games', 'Other']
  return <>
    <div className="featured-work">{featured.map(project => <FeaturedProjectCard key={project.id} project={project} onSelect={onSelect} />)}</div>
    <div className="project-filters" role="group" aria-label="Filter more work">{filters.map(item => <button key={item} data-category={item} className={'filter' + (filter === item ? ' is-selected' : '')} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <p className="sr-only" role="status">{archive.length} projects shown for {filter}.</p>
    <div className="small-projects">{archive.map(project => <SmallProjectCard key={project.id} project={project} onSelect={onSelect} />)}</div>
    {!archive.length && <p className="empty-state">No entries in this category yet. Choose another filter to keep exploring.</p>}
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
  return <article className="featured-project" data-category={project.category} onClick={event => openCard(event, project, onSelect)}>
    <FramedImage media={preview(project.media)} />
    <div className="work-copy">
      <h3><button className="title-button" aria-label={`Open project: ${project.title}`}>{project.title}</button></h3>
      <p>{project.summary}</p>
      {project.placeholderNote && <p className="project-draft">Draft entry</p>}
    </div>
  </article>
}

export function SmallProjectCard({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  return <article className="small-project" data-category={project.category} onClick={event => openCard(event, project, onSelect)}><FramedImage media={{ ...preview(project.media), shape: 'square' }} />
    <div><h3><button className="title-button" aria-label={`Open project: ${project.title}`}>{project.title}</button></h3><p>{project.summary}</p></div>
  </article>
}
