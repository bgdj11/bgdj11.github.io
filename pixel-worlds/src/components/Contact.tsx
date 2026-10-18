import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { profile } from '../data/portfolio'
import type { ContentLink, Social, SocialKind } from '../data/portfolio'
import { FramedImage } from './Media'
import { Icon } from './Icon'

export function safeUrl(url?: string) {
  if (!url) return undefined
  return /^(https?:\/\/|mailto:|\/(?!\/))/.test(url) ? url : undefined
}

export function ContentLinks({ links = [] }: { links?: ContentLink[] }) {
  return <div className="content-links">{links.filter(link => safeUrl(link.url)).map(link => <a key={link.url} href={link.url} className="text-link" target="_blank" rel="noopener noreferrer">{link.url.startsWith('https://github.com/') && <img className="github-link-icon" src="/media/social/normal/github.png" width="24" height="24" alt="GitHub:" />}{link.label}<Icon name="arrow" /></a>)}</div>
}

function SocialIcon({ kind }: { kind: SocialKind }) {
  return <span className="social-icon" aria-hidden="true">
    {(['normal', 'hover', 'pressed'] as const).map(state =>
      <img key={state} className={`social-icon-${state}`} src={`/media/social/${state}/${kind}.png`}
        width={16} height={16} alt="" draggable={false} />
    )}
  </span>
}

export function SocialLink({ social, compact = false }: { social: Social; compact?: boolean }) {
  const url = safeUrl(social.url)
  const content = <><SocialIcon kind={social.kind} /><span>{social.label}{!url && <small>To be added</small>}</span>{url && !compact && <Icon name="arrow" />}</>
  return url ? <a className={`social-link ${compact ? 'is-compact' : ''}`} href={url} target={url.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{content}</a> : <div className={`social-link is-unavailable ${compact ? 'is-compact' : ''}`}>{content}</div>
}

type ResumeState = 'checking' | 'available' | 'missing'
const ResumeContext = createContext<ResumeState>('checking')
// Verify the signature too: Vite and static hosts can return index.html with 200
// for an absent file. A successful HEAD request alone would create a broken CV.
export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ResumeState>('checking')
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
  return <ResumeContext.Provider value={state}>{children}</ResumeContext.Provider>
}

export function CvAction({ className = 'button button-secondary', compact = false, download = false, label: customLabel }: { className?: string; compact?: boolean; download?: boolean; label?: string }) {
  const state = useContext(ResumeContext)
  const label = customLabel ?? (compact ? 'CV' : download ? 'Download PDF' : 'View CV')
  const content = <>{label}<Icon name={download ? 'download' : 'arrow'} /></>
  return state === 'available'
    ? <a className={className} href={profile.resume.url} target={download ? undefined : '_blank'} rel="noopener noreferrer" download={download ? profile.resume.filename : undefined}>{content}</a>
    : <button className={className} disabled title={state === 'checking' ? 'Checking resume availability' : 'Resume PDF has not been added yet'} aria-label={`${label} — ${state === 'checking' ? 'checking availability' : 'PDF not yet added'}`}>{content}</button>
}

export function ResumePreview() {
  const state = useContext(ResumeContext)
  return <article className="resume-preview">
    <FramedImage media={profile.resume.thumbnail} />
    <div><h3>Resume</h3><p>{state === 'available' ? 'View my resume in a new tab or save a copy.' : state === 'checking' ? 'Checking resume availability…' : 'The PDF resume hasn’t been added yet.'}</p><div className="resume-actions"><CvAction label="View Resume" /><CvAction download /></div></div>
  </article>
}
