import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { MediaAsset } from '../data/portfolio'

export function PixelFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`pixel-frame ${className}`}>{children}</div>
}

function Placeholder({ label }: { label: string }) {
  return <div className="media-placeholder"><svg viewBox="0 0 48 40" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" shapeRendering="crispEdges"><path d="M6 2h36v4h4v28h-4v4H6v-4H2V6h4zM8 30l10-10 8 8 6-6 8 8" /><path d="M32 10h6v6h-6z" /></svg><span>{label}</span></div>
}

type ImageProps = { media: MediaAsset; priority?: boolean; className?: string; controls?: ReactNode }

/** GIFs and animated WebPs loop natively, without a playback or enlargement UI. */
export function FramedImage({ media, priority = false, className = '', controls }: ImageProps) {
  return <MediaFigure media={media} priority={priority} className={className} controls={controls} />
}

function MediaFigure({ media, priority, className, controls }: ImageProps) {
  const [failed, setFailed] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => { setFailed(false) }, [media.src])
  const kind = media.kind ?? (/\.gif(?:[?#]|$)/i.test(media.src ?? '') ? 'gif' : 'image')
  useEffect(() => {
    const node = video.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) node.pause() })
    const pause = () => { if (document.hidden) node.pause() }
    observer.observe(node)
    document.addEventListener('visibilitychange', pause)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', pause) }
  }, [])
  const shape = media.shape ?? 'landscape'
  const style = {
    '--media-ratio': media.width && media.height ? `${media.width} / ${media.height}` : shape === 'portrait' ? '3 / 4' : shape === 'square' ? '1' : '16 / 10',
    '--media-fit': media.fit ?? 'cover', '--media-position': media.position ?? 'center', '--media-background': media.background,
  } as CSSProperties
  return <figure className={`framed-media media-${shape} ${media.presentation === 'logo' ? 'media-logo' : ''} ${className}`} style={style}>
    <PixelFrame>
      <div className={`media-window ${media.pixelated ? 'is-pixelated' : ''}`}>
        {(!media.src || failed) ? <Placeholder label={failed ? 'Media unavailable' : media.placeholder} /> : kind === 'video' ?
          <video ref={video} src={media.src} poster={media.poster} controls playsInline preload="none" aria-label={media.alt || media.placeholder} onError={() => setFailed(true)}>
            {media.captionsSrc && <track kind="captions" src={media.captionsSrc} srcLang="en" label="English" default />}
          </video> : <>
            <img src={media.src} alt={media.alt || media.placeholder.replace(/ to come$/, '')} width={media.width} height={media.height}
              srcSet={kind === 'image' ? media.srcSet : undefined} sizes={media.sizes ?? '(max-width: 700px) 90vw, 45vw'}
              loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"
              onError={() => setFailed(true)} />
          </>}
        {controls}
      </div>
    </PixelFrame>
    {media.caption && <figcaption>{media.caption}</figcaption>}
  </figure>
}

export function ImageGallery({ media }: { media: MediaAsset[] }) {
  const [index, setIndex] = useState(0)
  const start = useRef({ x: 0, y: 0 })
  const move = (direction: number) => setIndex(value => (value + direction + media.length) % media.length)
  const current = media[Math.min(index, media.length - 1)]
  if (!current) return null
  return <div className={`image-gallery${media.length > 1 ? ' has-slides' : ''}`} role="region" aria-label={`${media[0]?.alt || 'Project media'} — gallery`} tabIndex={media.length > 1 ? 0 : undefined}
    onKeyDown={event => { if (media.length > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) { event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowLeft' ? -1 : 1) } }}
    onTouchStart={event => { start.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
    onTouchEnd={event => { const dx = event.changedTouches[0].clientX - start.current.x; const dy = event.changedTouches[0].clientY - start.current.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? -1 : 1) }}>
    <FramedImage media={{ ...current, fit: 'contain' }} controls={media.length > 1 && <>
      <button className="gallery-arrow gallery-previous" onClick={() => move(-1)} aria-label="Previous image">‹</button>
      <span className="gallery-count" role="status" aria-live="polite">{index + 1} / {media.length}</span>
      <button className="gallery-arrow gallery-next" onClick={() => move(1)} aria-label="Next image">›</button>
    </>} />
  </div>
}
