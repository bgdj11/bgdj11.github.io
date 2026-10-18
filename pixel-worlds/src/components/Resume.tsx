import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { profile } from '../data/portfolio'
import { FramedImage } from './Media'
import { Icon } from './Icon'
import { ResumeDialog } from './ResumeDialog'

type ResumeState = 'checking' | 'available' | 'missing'
const ResumeContext = createContext<{ state: ResumeState; isOpen: boolean; open: () => void; close: () => void } | null>(null)
function useResume() {
  const context = useContext(ResumeContext)
  if (!context) throw new Error('Resume controls require ResumeProvider')
  return context
}
// Verify the signature too: Vite and static hosts can return index.html with 200
// for an absent file. A successful HEAD request alone would create a broken CV.
export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ResumeState>('checking')
  const [isOpen, setOpen] = useState(false)
  const open = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])
  useEffect(() => {
    const abort = new AbortController()
    let disposed = false
    const update = (next: ResumeState) => { if (!disposed) setState(next) }
    const timeout = window.setTimeout(() => abort.abort(), 6000)
    async function check() {
      try {
        const response = await fetch(profile.resume.url, { headers: { Range: 'bytes=0-1023' }, signal: abort.signal })
        const reader = response.body?.getReader()
        if (!response.ok || !reader) { update('missing'); return }
        let header = ''
        while (header.length < 1024) {
          const chunk = await reader.read()
          if (chunk.done) break
          header += new TextDecoder().decode(chunk.value.subarray(0, 1024 - header.length))
        }
        await reader.cancel()
        update(header.includes('%PDF-') ? 'available' : 'missing')
      } catch { update('missing') }
      finally { clearTimeout(timeout) }
    }
    void check()
    return () => { disposed = true; abort.abort(); clearTimeout(timeout) }
  }, [])
  return <ResumeContext.Provider value={{ state, isOpen, open, close }}>{children}</ResumeContext.Provider>
}

export function CvAction({ className = 'button button-secondary', compact = false, download = false, label: customLabel }: { className?: string; compact?: boolean; download?: boolean; label?: string }) {
  const { state, open } = useResume()
  const label = customLabel ?? (compact ? 'CV' : download ? 'Download PDF' : 'View CV')
  const content = <>{label}<Icon name={download ? 'download' : 'arrow'} /></>
  return state === 'available'
    ? download
      ? <a className={className} href={profile.resume.url} download={profile.resume.filename}>{content}</a>
      : <button type="button" className={className} onClick={open} aria-haspopup="dialog">{content}</button>
    : <button className={className} disabled title={state === 'checking' ? 'Checking resume availability' : 'Resume PDF has not been added yet'} aria-label={`${label} — ${state === 'checking' ? 'checking availability' : 'PDF not yet added'}`}>{content}</button>
}

export function ResumePreview() {
  const { state } = useResume()
  return <article className="resume-preview">
    <FramedImage media={profile.resume.thumbnail} />
    <div><h3>Resume</h3><p>{state === 'available' ? 'View my resume here or download a PDF copy.' : state === 'checking' ? 'Checking resume availability…' : 'The PDF resume hasn’t been added yet.'}</p><div className="resume-actions"><CvAction label="View Resume" /><CvAction download /></div></div>
  </article>
}

export function ResumeModal() {
  const { isOpen, close } = useResume()
  return isOpen ? <ResumeDialog onClose={close} /> : null
}
