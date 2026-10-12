import { useState } from 'react'
import { projects } from '../data/portfolio'
import type { Project, ProjectCategory } from '../data/portfolio'
import { Icon } from './Icon'
import { ProjectArtwork } from './Artwork'

const filters: ('All work' | ProjectCategory)[] = ['All work', 'Research & vision', 'Graphics & games', 'Applied AI']

export function ProjectCollection({ onSelect }: { onSelect: (project: Project) => void }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All work')
  const featured = projects.filter((project) => project.featured)
  const archive = projects.filter((project) => !project.featured && (filter === 'All work' || project.category === filter))
  return <>
    <div className="project-subheading"><h3>Featured projects</h3><span className="mono">{String(featured.length).padStart(2, '0')} SELECTED DIRECTIONS</span></div>
    <div className="featured-grid">
      {featured.map((project, index) => <article className="project-card" key={project.id}>
        <button className="project-preview-button" onClick={() => onSelect(project)} aria-label={`View ${project.title}`}>
          {project.images[0] ? <img className="project-image" src={project.images[0].src} alt={project.images[0].alt} loading="lazy" /> : <ProjectArtwork art={project.art} />}
          <span className="project-preview-arrow"><Icon name="arrow" /></span>
        </button>
        <div className="project-content"><div className="project-meta"><span>{project.category}</span><span>0{index + 1}</span></div><h4><button onClick={() => onSelect(project)}>{project.title}</button></h4><p>{project.summary}</p><p className="project-role">{project.role}</p><ul className="tags" aria-label="Project technologies">{project.technologies.map((tag) => <li key={tag}>{tag}</li>)}</ul><button className="text-link project-details" onClick={() => onSelect(project)}>Explore project<Icon name="arrow" /></button></div>
      </article>)}
    </div>
    <div className="archive-heading"><div><p className="eyebrow">The ongoing explorations</p><h3>More work<span className="heading-period">.</span></h3></div><p>Smaller builds. Curious experiments.<br />Other paths worth exploring.</p></div>
    <div className="project-filters" role="group" aria-label="Filter more work">{filters.map((item) => <button key={item} className={filter === item ? 'filter is-selected' : 'filter'} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <p className="sr-only" role="status">{archive.length} {archive.length === 1 ? 'project' : 'projects'} shown for {filter}.</p>
    <div className="archive-grid">
      {archive.map((project) => <button className="archive-card" key={project.id} onClick={() => onSelect(project)}><ProjectArtwork art={project.art} small /><span className="archive-card-text"><span className="archive-category">{project.category}</span><span className="archive-title">{project.title}</span><span className="archive-summary">{project.summary}</span></span><Icon name="arrow" /></button>)}
      {archive.length === 0 && <p className="archive-empty">No archive projects in this category yet. Explore the featured AI project above, or select another category.</p>}
    </div>
    <p className="content-note"><span className="tiny-square" /> Project selection is taking shape. These are editorial placeholders; case studies and original media will follow.</p>
  </>
}
