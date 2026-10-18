import { useCallback, useEffect, useRef, useState } from 'react'
import type { DetailContent, Education, Project } from '../data/portfolio'
import { projects } from '../data/portfolio'
import { FramedImage, ImageGallery } from './Media'
import { ContentLinks } from './Contact'
import { Icon } from './Icon'
import { PixelHeadingText } from './PixelHeadingText'
import { ProjectCaseStudy } from './ProjectCaseStudy'
import { DesktopIcon } from './Desktop'

function linkedProject() {
  const id = new URL(location.href).searchParams.get('project')
  return projects.find(project => project.id === id) ?? null
}

export function useDetails() {
  const [entry, setEntry] = useState<DetailContent | null>(linkedProject)
  const pushed = useRef(false)
  const returnPoint = useRef<{ element: HTMLElement | null; y: number } | null>(null)
  useEffect(() => {
    let frame = 0
    const restore = () => {
      const project = linkedProject()
      pushed.current = false; setEntry(project)
      if (!project && returnPoint.current) {
        const point = returnPoint.current
        // Let the browser finish hash/history restoration before returning to
        // the exact invoking control, even when the URL named another section.
        frame = requestAnimationFrame(() => {
          window.scrollTo({ top: point.y, behavior: 'instant' })
          point.element?.focus({ preventScroll: true })
        })
      }
    }
    window.addEventListener('popstate', restore)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('popstate', restore) }
  }, [])
  const open = useCallback((item: DetailContent) => {
    if (projects.some(project => project === item)) {
      returnPoint.current = { element: document.activeElement instanceof HTMLElement ? document.activeElement : null, y: scrollY }
      const url = new URL(location.href)
      url.searchParams.set('project', item.id)
      url.hash = 'projects'
      history.pushState({ ...history.state, portfolioProject: item.id }, '', url)
      pushed.current = true
    }
    setEntry(item)
  }, [])
  const close = useCallback(() => {
    if (pushed.current) { pushed.current = false; history.back(); return }
    else {
      const url = new URL(location.href)
      if (url.searchParams.has('project')) { url.searchParams.delete('project'); history.replaceState(history.state, '', url) }
    }
    setEntry(null)
  }, [])
  return { entry, open, close }
}

export function DetailDialog({ entry, onClose }: { entry: DetailContent | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [moreBelow, setMoreBelow] = useState(false)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !entry) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!dialog.open) dialog.showModal()
    dialog.scrollTop = 0
    dialog.querySelector<HTMLButtonElement>('.dialog-close')?.focus({ preventScroll: true })
    const updateScrollCue = () => setMoreBelow(dialog.scrollHeight - dialog.clientHeight - dialog.scrollTop > 24)
    const observer = new ResizeObserver(updateScrollCue)
    observer.observe(dialog)
    const body = dialog.querySelector('.dialog-inner')
    if (body) observer.observe(body)
    dialog.addEventListener('scroll', updateScrollCue, { passive: true })
    dialog.addEventListener('load', updateScrollCue, true)
    updateScrollCue()
    return () => {
      observer.disconnect()
      dialog.removeEventListener('scroll', updateScrollCue)
      dialog.removeEventListener('load', updateScrollCue, true)
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previous?.isConnected && previous !== document.body) previous.focus({ preventScroll: true })
      else document.getElementById('main')?.focus({ preventScroll: true })
    }
  }, [entry])
  const project = entry && 'category' in entry ? entry as Project : null
  const educationEntry = entry && 'degree' in entry ? entry as Education : null
  const polytechniqueEntry = educationEntry?.id === 'polytechnique' ? educationEntry : null
  const educationProfile = educationEntry
  const experienceProfile = !!entry && 'role' in entry
  const accent = entry && 'degree' in entry ? 'education' : entry && 'role' in entry ? 'experience' : project ? 'projects' : 'beyond-code'
  const facts = entry && !educationEntry ? [
    ['role' in entry ? 'Role' : '', 'role' in entry ? String(entry.role) : ''],
    ['Dates', 'dates' in entry ? String(entry.dates ?? '') : project?.year ?? ''],
    ['Location', entry.location ?? ''],
    ['Contribution', project?.contribution ?? ''],
    ['Technologies', 'technologies' in entry ? (entry.technologies as string[] | undefined)?.join(', ') ?? '' : ''],
  ].filter(([label, value]) => label && value && !(experienceProfile && label === 'Role')) : []
  return <dialog className={'detail-dialog' + (educationProfile ? ' education-profile-dialog' : '') + (experienceProfile ? ' experience-profile-dialog' : '') + (project ? ' project-profile-dialog' : '')} data-accent={accent} ref={ref} aria-labelledby="dialog-heading" onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={event => {
    if (event.key !== 'Tab') return
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], video[controls], [tabindex="0"]')].filter(node => node.getClientRects().length > 0)
    const first = controls[0], last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }} onClick={event => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) onClose()
  }}>
    {entry && <>
      <div className="dialog-toolbar"><DesktopIcon name={project ? 'folder' : educationEntry ? 'books' : experienceProfile ? 'terminal' : 'joystick'} /><span className="dialog-filename">{entry.title}</span><button className="dialog-close" onClick={onClose} aria-label="Close details"><Icon name="close" /></button></div>
      <div className="dialog-inner" key={entry.id}>
        {project?.caseStudy ? <ProjectCaseStudy project={project} /> : <>
        {educationEntry ? <header className="education-dialog-header">
          {entry.media.src && <FramedImage media={entry.media} />}
          <div className="education-dialog-identity">
            <h2 id="dialog-heading"><PixelHeadingText>{entry.title}</PixelHeadingText></h2>
            {entry.subtitle && <p className="education-dialog-university">{entry.subtitle}</p>}
          </div>
          {educationProfile && <div className="education-dialog-degree">
            {educationEntry.credential && <p className="education-dialog-credential">{educationEntry.credential}</p>}
            <p className="education-dialog-program">{educationEntry.degree}</p>
            {educationEntry.summary && <p className="education-dialog-specialization">{educationEntry.summary}</p>}
          </div>}
          <dl className="education-dialog-meta" aria-label="Education details">
            {educationEntry.dates && <div><dt>Period</dt><dd>{educationEntry.dates}</dd></div>}
            {educationEntry.location && <div><dt>Location</dt><dd>{educationEntry.location}</dd></div>}
            {educationEntry.credits && <div><dt>Credits</dt><dd>{educationEntry.credits} ECTS</dd></div>}
            {educationEntry.gpa && <div><dt>GPA</dt><dd>{educationEntry.gpa}</dd></div>}
            {educationEntry.status && <div><dt>Status</dt><dd>{educationEntry.status}</dd></div>}
          </dl>
        </header> : <>
          <div className={entry.media.presentation === 'logo' ? 'detail-institution-heading' : undefined}>
            {entry.media.presentation === 'logo' && entry.media.src && <FramedImage media={entry.media} />}
            <div><h2 id="dialog-heading"><PixelHeadingText>{'role' in entry ? String(entry.role) : entry.title}</PixelHeadingText></h2>{'role' in entry && <p className="experience-company">{entry.title}</p>}</div>
          </div>
          {entry.subtitle && <p>{entry.subtitle}</p>}
        </>}
        {entry.summary && !educationProfile && !experienceProfile && <p className="detail-summary">{entry.summary}</p>}
        {entry.placeholderNote && <p className="draft-note">{entry.placeholderNote}</p>}
        {!!facts.length && <dl className="detail-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
        {entry.media.presentation !== 'logo' && (!('role' in entry) || entry.media.src) && <FramedImage media={{ ...entry.media, fit: 'contain' }} />}
        {!!educationEntry?.aboutProgram?.length && <DetailBlockView block={{ heading: 'About the Program', paragraphs: educationEntry.aboutProgram }} id="detail-block-about" />}
        {!!educationEntry?.coursework?.length && <Coursework blocks={educationEntry.coursework} />}
        {polytechniqueEntry ? <>
          <DetailBlockView block={polytechniqueEntry.details[0]} id="detail-block-about" />
          <Coursework blocks={polytechniqueEntry.details.slice(1, 3)} />
          <section className="detail-block education-involvement" aria-labelledby="detail-block-honors">
            <h3 id="detail-block-honors">Honors &amp; Involvement</h3>
            <div className="education-involvement-columns">
              <article>
                <h4>{polytechniqueEntry.details[3].items?.join(', ')}</h4>
                <p>Academic distinction</p>
              </article>
              {polytechniqueEntry.involvement?.map(item => <article key={item.title}>
                <h4><svg className="ambassador-icon" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges"><path fill="currentColor" d="M2 1h12v2h2v8h-2v2H8l-4 3v-3H2v-2H0V3h2V1zm0 2v8h4v2l2-2h6V3H2zM4 6h2v2H4zm3 0h2v2H7zm3 0h2v2h-2z" /></svg>{item.title}</h4>
                <p>{item.description}</p>
              </article>)}
            </div>
          </section>
        </> : entry.details.map((block, index) => <DetailBlockView block={block} id={'detail-block-' + index} key={index} />)}
        {!!entry.gallery?.length && <section className="detail-block"><h3>Gallery</h3><ImageGallery media={entry.gallery} /></section>}
        {!!entry.favorites?.length && <section className="detail-block"><h3>Favorites & collections</h3><div className="favorites">{entry.favorites.map((favorite, index) => <article key={index}>{favorite.media && <FramedImage media={favorite.media} />}<h4>{favorite.title}</h4>{favorite.category && <p>{favorite.category}</p>}{favorite.note && <p>{favorite.note}</p>}</article>)}</div></section>}
        <ContentLinks links={entry.links} />
        </>}
      </div>
      <div className="dialog-scroll-cue"><button className="dialog-scroll-hint" data-visible={moreBelow} tabIndex={moreBelow ? 0 : -1} aria-hidden={!moreBelow} onClick={() => ref.current?.scrollBy({ top: ref.current.clientHeight * .7, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Scroll down for more <Icon name="down" /></button></div>
    </>}
  </dialog>
}

function DetailBlockView({ block, id }: { block: DetailContent['details'][number]; id: string }) {
  if (!block) return null
  return <section className="detail-block" aria-labelledby={id}><h3 id={id}>{block.heading}</h3>{block.paragraphs?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}{!!block.subsections?.length && <div className="education-subsections">{block.subsections.map(part => <article key={part.heading}><h4>{part.heading}</h4>{part.paragraphs?.map(text => <p key={text}>{text}</p>)}{!!part.items?.length && <ul>{part.items.map(text => <li key={text}>{text}</li>)}</ul>}</article>)}</div>}{!!block.items?.length && <ul>{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul>}<ContentLinks links={block.links} /></section>
}

function Coursework({ blocks }: { blocks: DetailContent['details'] }) {
  return <section className="detail-block education-coursework" aria-labelledby="education-coursework-heading">
    <h3 id="education-coursework-heading">Relevant Coursework</h3>
    <div className={'education-coursework-columns' + (blocks.length === 3 ? ' has-three-columns' : '')}>
      {blocks.map((block, index) => <section className="education-coursework-column" key={block.heading} aria-labelledby={'coursework-column-' + index}>
        <h4 id={'coursework-column-' + index}>{block.heading}</h4>
        <ul>{block.items?.map(item => <li key={item}>{item}</li>)}</ul>
      </section>)}
    </div>
  </section>
}
