import { lazy, Suspense, useEffect, useRef } from 'react'
import { profile } from '../data/portfolio'
import { DesktopIcon } from './Desktop'
import { Icon } from './Icon'

const PdfViewer = lazy(() => import('./PresentationViewer'))
const resume = { title: `${profile.name} — CV`, url: profile.resume.url, description: 'Curriculum vitae', preview: '', format: 'PDF' }

export function ResumeDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    dialog.querySelector<HTMLButtonElement>('.dialog-close')?.focus({ preventScroll: true })
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])
  return <dialog ref={ref} className="detail-dialog resume-dialog" aria-labelledby="resume-heading"
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => {
      const rect = event.currentTarget.getBoundingClientRect()
      if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) onClose()
    }}>
    <div className="dialog-toolbar">
      <DesktopIcon name="computer" />
      <h2 id="resume-heading" className="dialog-filename">{profile.name} — CV</h2>
      <a className="resume-download" href={profile.resume.url} download={profile.resume.filename}>Download PDF<Icon name="download" /></a>
      <button className="dialog-close" onClick={onClose} aria-label="Close CV"><Icon name="close" /></button>
    </div>
    <div className="resume-document">
      <Suspense fallback={<p role="status">Loading CV…</p>}><PdfViewer document={resume} mode="document" /></Suspense>
    </div>
  </dialog>
}
