import type { CSSProperties } from 'react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { Project, ProjectChart, ProjectSection } from '../data/portfolio'
import { ContentLinks } from './Contact'
import { ImageGallery } from './Media'
const PresentationViewer = lazy(() => import('./PresentationViewer'))

export function ProjectCaseStudy({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState('project-section-0')
  const [contentsOpen, setContentsOpen] = useState(false)
  const [deck, setDeck] = useState(0)
  const [showSlides, setShowSlides] = useState(false)
  const decks = project.documents?.filter(item => item.slides) ?? []
  useEffect(() => {
    const dialog = root.current?.closest('dialog')
    const headings = root.current?.querySelectorAll<HTMLElement>('.case-section > h3')
    if (!dialog || !headings) return
    const update = () => {
      const top = dialog.getBoundingClientRect().top + 140
      const preceding = [...headings].filter(heading => heading.getBoundingClientRect().top <= top)
      if (preceding.length) setActive(preceding[preceding.length - 1].id)
    }
    dialog.addEventListener('scroll', update, { passive: true })
    return () => dialog.removeEventListener('scroll', update)
  }, [])
  const jumpTo = (id: string) => {
    setActive(id); setContentsOpen(false)
    // Measure after the mobile contents menu collapses, so its old height does
    // not shift the destination above the dialog's visible reading area.
    requestAnimationFrame(() => {
      const target = document.getElementById(id)
      const dialog = root.current?.closest('dialog')
      if (target && dialog) dialog.scrollTo({ top: dialog.scrollTop + target.getBoundingClientRect().top - dialog.getBoundingClientRect().top - 85, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
      target?.focus({ preventScroll: true })
    })
  }
  return <article ref={root} className="project-profile" data-category={project.category}>
    <header className={`project-profile-header ${project.media.src?.endsWith('.svg') ? 'architecture-header' : ''}`}>
      <div>
        <h2 id="dialog-heading">{project.title}</h2>
        <p className="project-introduction">{project.summary}</p>
        {project.contribution && <p className="project-contribution">{project.contribution}</p>}
        <ContentLinks links={project.links} />
        {!!project.documents?.length && <button className="button button-secondary document-jump" onClick={() => { setShowSlides(true); jumpTo('project-documents') }}>View presentation ↓</button>}
      </div>
      <ImageGallery media={[{ ...project.media, caption: undefined }]} />
    </header>
    <nav className={`project-contents ${contentsOpen ? 'is-open' : ''}`} aria-label="On this page">
      <strong>On this page</strong><button className="contents-toggle" aria-expanded={contentsOpen} onClick={() => setContentsOpen(value => !value)}>{contentsOpen ? 'Hide sections −' : 'Show sections +'}</button>
      <div>{project.caseStudy?.map((section, index) => <button key={section.heading} aria-current={active === `project-section-${index}` ? 'location' : undefined} onClick={() => jumpTo(`project-section-${index}`)}>{section.navLabel ?? section.heading}</button>)}{!!project.documents?.length && <button onClick={() => jumpTo('project-documents')}>Research materials</button>}</div>
    </nav>
    {project.caseStudy?.map((section, index) => <CaseSection key={section.heading} section={section} index={index} />)}
    {!!project.documents?.length && <section className="case-section" aria-labelledby="project-documents">
      <h3 id="project-documents" tabIndex={-1}>Research Materials</h3>
      {!!decks.length && <div className="presentation-resources"><div className="deck-selector" role="group" aria-label="Presentation language">{decks.map((item, index) => <button key={item.url} aria-pressed={deck === index} onClick={() => { setDeck(index); setShowSlides(true) }}>{item.title}</button>)}</div>{showSlides ? <Suspense fallback={<p>Loading slide viewer…</p>}><PresentationViewer key={decks[deck].url} document={decks[deck]} /></Suspense> : <button className="presentation-cover" onClick={() => setShowSlides(true)}><img src={decks[0].preview} alt="First slide of the original English presentation" loading="lazy" /><span>View presentation — 18 slides</span></button>}</div>}
      <div className="project-documents">{project.documents.filter(item => !item.slides).map(document => <a className="project-document" key={document.url} href={document.url} target="_blank" rel="noopener noreferrer">
        <img src={document.preview} alt={`First-page preview: ${document.title}`} loading="lazy" decoding="async" />
        <h4>{document.title}</h4><p>{document.description}</p><span>{document.format} ↗</span>
      </a>)}</div>
    </section>}
    <footer className="project-profile-footer">
      {!!project.technologies?.length && <p><strong>Built with</strong> {project.technologies.join(', ')}</p>}
      <ContentLinks links={project.links} />
    </footer>
  </article>
}

function CaseSection({ section, index }: { section: ProjectSection; index: number }) {
  const headingId = `project-section-${index}`
  return <section className="case-section" aria-labelledby={headingId}>
    <h3 id={headingId} tabIndex={-1}>{section.heading}</h3>
    {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    {!!section.subsections?.length && <div className="case-columns">{section.subsections.map(part => <div key={part.heading}>
      <h4>{part.heading}</h4>{part.paragraphs?.map(text => <p key={text}>{text}</p>)}
      {!!part.items?.length && <ul>{part.items.map(item => <li key={item}>{item}</li>)}</ul>}
    </div>)}</div>}
    {!!section.items?.length && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
    {section.code && <pre className="case-code"><code>{section.code}</code></pre>}
    {section.table && <div className="table-scroll" tabIndex={0} role="region" aria-label={section.table.caption}><table><caption>{section.table.caption}</caption><thead><tr>{section.table.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{section.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
    {section.chart && <ResultChart chart={section.chart} />}
    {!!section.comparison?.length && <div className="case-comparison">{section.comparison.map(item => <div key={item.label}><h4>{item.label}</h4><ImageGallery media={[item.media]} /></div>)}</div>}
    {!!section.media?.length && <div className="case-media"><ImageGallery media={section.media} /></div>}
    {section.source && <ContentLinks links={[section.source]} />}
  </section>
}

function ResultChart({ chart }: { chart: ProjectChart }) {
  const format = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 }) + chart.unit
  if (chart.display === 'table') return <figure className="result-table"><div className="table-scroll" tabIndex={0} role="region" aria-label={chart.label}><table><caption>{chart.label}</caption><thead><tr><th scope="col">{chart.rows.length === 4 ? 'Metric' : 'Method'}</th>{chart.series.map(series => <th scope="col" key={series}>{series}</th>)}</tr></thead><tbody>{chart.rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{row.values.map((value, index) => <td key={index}>{format(value)}</td>)}</tr>)}</tbody></table></div><figcaption>{chart.note}</figcaption></figure>
  return <figure className="result-chart">
    <figcaption>{chart.label}</figcaption>
    <div className="chart-legend" aria-hidden="true">{chart.series.map((series, i) => <span key={series} data-series={i}><i />{series}</span>)}</div>
    <p className="chart-scale">Linear scale: 0–{chart.max}{chart.unit}</p>
    <dl className="chart-rows">{chart.rows.map(row => <div key={row.label}>
      <dt>{row.label}</dt>
      <dd>{row.values.map((value, i) => <div className="chart-value" key={i} data-series={i}>
        <span className="sr-only">{chart.series[i]}: </span>
        <div className="chart-track" aria-hidden="true"><span style={{ '--bar-width': `${Math.max(0, Math.min(100, value / chart.max * 100))}%` } as CSSProperties} /></div>
        <span className="chart-number">{format(value)}</span>
      </div>)}</dd>
    </div>)}</dl>
    <p className="chart-note">{chart.note}</p>
  </figure>
}
