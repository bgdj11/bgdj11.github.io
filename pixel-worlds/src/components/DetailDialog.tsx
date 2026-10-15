import { useCallback, useEffect, useRef, useState } from 'react'
import type { DetailContent, Project } from '../data/portfolio'
import { projects } from '../data/portfolio'
import { FramedImage, ImageGallery } from './Media'
import { ContentLinks } from './Contact'
import { Icon } from './Icon'

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
  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !entry) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!dialog.open) dialog.showModal()
    dialog.scrollTop = 0
    dialog.querySelector<HTMLButtonElement>('.dialog-close')?.focus({ preventScroll: true })
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (previous?.isConnected && previous !== document.body) previous.focus({ preventScroll: true })
      else document.getElementById('main')?.focus({ preventScroll: true })
    }
  }, [entry])
  const project = entry && 'category' in entry ? entry as Project : null
  const accent = entry && 'degree' in entry ? 'education' : entry && 'role' in entry ? 'experience' : project ? 'projects' : 'beyond-code'
  const facts = entry ? [
    ['degree' in entry ? 'Degree' : 'role' in entry ? 'Role' : '', 'degree' in entry ? ['credential' in entry ? entry.credential : '', entry.degree].filter(Boolean).join(' — ') : 'role' in entry ? String(entry.role) : ''],
    ['Dates', 'dates' in entry ? String(entry.dates ?? '') : project?.year ?? ''],
    ['Location', entry.location ?? ''],
    ['Contribution', project?.contribution ?? ''],
    ['Technologies', 'technologies' in entry ? (entry.technologies as string[] | undefined)?.join(', ') ?? '' : ''],
  ].filter(([, value]) => value) : []
  return <dialog className="detail-dialog" data-accent={accent} ref={ref} aria-labelledby="dialog-heading" onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={event => {
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
      <div className="dialog-toolbar"><span>Details</span><button className="dialog-close" onClick={onClose} aria-label="Close details"><Icon name="close" /></button></div>
      <div className="dialog-inner" key={entry.id}>
        <div className={entry.media.presentation === 'logo' ? 'detail-institution-heading' : undefined}>
          {entry.media.presentation === 'logo' && entry.media.src && <FramedImage media={entry.media} />}
          <div><h2 id="dialog-heading">{'role' in entry ? String(entry.role) : entry.title}</h2>{'role' in entry && <p className="experience-company">{entry.title}</p>}</div>
        </div>
        {entry.subtitle && <p>{entry.subtitle}</p>}
        {entry.summary && <p className="detail-summary">{entry.summary}</p>}
        {entry.placeholderNote && <p className="draft-note">{entry.placeholderNote}</p>}
        {!!facts.length && <dl className="detail-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
        {entry.media.presentation !== 'logo' && (!('role' in entry) || entry.media.src) && <FramedImage media={{ ...entry.media, fit: 'contain' }} />}
        {entry.details.map((block, index) => <section className="detail-block" key={index} aria-labelledby={'detail-block-' + index}><h3 id={'detail-block-' + index}>{block.heading}</h3>{block.paragraphs?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}{!!block.items?.length && <ul>{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul>}</section>)}
        {!!entry.gallery?.length && <section className="detail-block"><h3>Gallery</h3><ImageGallery media={entry.gallery} /></section>}
        {!!entry.favorites?.length && <section className="detail-block"><h3>Favorites & collections</h3><div className="favorites">{entry.favorites.map((favorite, index) => <article key={index}>{favorite.media && <FramedImage media={favorite.media} />}<h4>{favorite.title}</h4>{favorite.category && <p>{favorite.category}</p>}{favorite.note && <p>{favorite.note}</p>}</article>)}</div></section>}
        <ContentLinks links={entry.links} />
      </div>
    </>}
  </dialog>
}
