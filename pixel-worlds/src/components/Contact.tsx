import { publicAsset } from '../data/assets'
import type { ContentLink, Social, SocialKind } from '../data/portfolio'
import { Icon } from './Icon'

export function safeUrl(url?: string) {
  if (!url) return undefined
  return /^(https?:\/\/|mailto:|\/(?!\/))/.test(url) ? url : undefined
}

export function ContentLinks({ links = [] }: { links?: ContentLink[] }) {
  return <div className="content-links">{links.filter(link => safeUrl(link.url)).map(link => <a key={link.url} href={link.url} className="text-link" target="_blank" rel="noopener noreferrer">{link.url.startsWith('https://github.com/') && <img className="github-link-icon" src={publicAsset('/media/social/normal/github.png')} width="24" height="24" alt="GitHub:" />}{link.label}<Icon name="arrow" /></a>)}</div>
}

function SocialIcon({ kind }: { kind: SocialKind }) {
  return <span className="social-icon" aria-hidden="true">
    {(['normal', 'hover', 'pressed'] as const).map(state =>
      <img key={state} className={`social-icon-${state}`} src={publicAsset(`/media/social/${state}/${kind}.png`)}
        width={16} height={16} alt="" draggable={false} />
    )}
  </span>
}

export function SocialLink({ social, compact = false }: { social: Social; compact?: boolean }) {
  const url = safeUrl(social.url)
  const content = <><SocialIcon kind={social.kind} /><span>{social.label}{!url && <small>To be added</small>}</span>{url && !compact && <Icon name="arrow" />}</>
  return url ? <a className={`social-link ${compact ? 'is-compact' : ''}`} href={url} target={url.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{content}</a> : <div className={`social-link is-unavailable ${compact ? 'is-compact' : ''}`}>{content}</div>
}
