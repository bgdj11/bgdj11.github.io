import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { MediaAsset } from '../data/portfolio'

export function PixelFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`pixel-frame ${className}`}>{children}</div>
}

function Placeholder({ label }: { label: string }) {
  return <div className="media-placeholder"><svg viewBox="0 0 48 40" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" shapeRendering="crispEdges"><path d="M6 2h36v4h4v28h-4v4H6v-4H2V6h4zM8 30l10-10 8 8 6-6 8 8" /><path d="M32 10h6v6h-6z" /></svg><span>{label}</span></div>
}

/** Authentic media; animations run only while visible and respect reduced motion. */
export function FramedImage({ media, priority = false, className = '', onOpen, openLabel }: { media: MediaAsset; priority?: boolean; className?: string; onOpen?: () => void; openLabel?: string }) {
  // A changed local path must clear loading/error/playback state.
  return <MediaFigure key={`${media.id}:${media.src ?? ''}`} media={media} priority={priority} className={className} onOpen={onOpen} openLabel={openLabel} />
}

function MediaFigure({ media, priority, className, onOpen, openLabel }: { media: MediaAsset; priority: boolean; className: string; onOpen?: () => void; openLabel?: string }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [manualPlayback, setManualPlayback] = useState<boolean | null>(null)
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [visible, setVisible] = useState(priority)
  const frame = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const kind = media.kind ?? (/\.gif(?:[?#]|$)/i.test(media.src ?? '') ? 'gif' : 'image')
  useEffect(() => {
    const node = frame.current
    if (!node || kind === 'image') return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (!entry.isIntersecting) video.current?.pause()
    })
    const pause = () => { setVisible(!document.hidden && !!node.getClientRects().length && node.getBoundingClientRect().bottom > 0 && node.getBoundingClientRect().top < innerHeight); if (document.hidden) video.current?.pause() }
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const motionChange = () => { video.current?.pause(); setReducedMotion(motion.matches); setManualPlayback(null) }
    observer.observe(node)
    document.addEventListener('visibilitychange', pause)
    motion.addEventListener('change', motionChange)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', pause); motion.removeEventListener('change', motionChange) }
  }, [kind])
  const playing = visible && (manualPlayback ?? !reducedMotion)
  const shape = media.shape ?? 'landscape'
  const style = {
    '--media-ratio': media.width && media.height ? `${media.width} / ${media.height}` : shape === 'portrait' ? '3 / 4' : shape === 'square' ? '1' : '16 / 10',
    '--media-fit': media.fit ?? 'cover', '--media-position': media.position ?? 'center', '--media-background': media.background,
  } as CSSProperties
  const src = kind === 'gif' && !playing ? media.poster : media.src
  return <figure ref={frame} className={`framed-media media-${shape} ${media.presentation === 'logo' ? 'media-logo' : ''} ${className}`} style={style}>
    <PixelFrame>
      <div className={`media-window ${media.pixelated ? 'is-pixelated' : ''}`}>
        {(!media.src || failed) ? <Placeholder label={failed ? 'Media unavailable' : media.placeholder} /> : kind === 'video' ? <>
          <video ref={video} src={visible ? media.src : undefined} poster={media.poster} controls playsInline preload="none" aria-label={media.alt || media.placeholder} onError={() => setFailed(true)}>
            {media.captionsSrc && <track kind="captions" src={media.captionsSrc} srcLang="en" label="English" default />}
          </video>
        </> : <>
          {(!loaded || !src) && <Placeholder label={src ? 'Loading image…' : 'Animated preview'} />}
          {src && <img key={src} src={src} alt={media.alt || media.placeholder.replace(/ to come$/, '')} width={media.width} height={media.height}
            srcSet={kind === 'image' ? media.srcSet : undefined}
            sizes={media.sizes ?? '(max-width: 700px) 90vw, 45vw'}
            loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"
            onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />}
        </>}
      </div>
      {onOpen && <button className="media-open" onClick={onOpen} aria-label={openLabel ?? 'Open details'} />}
    </PixelFrame>
    {kind === 'gif' && media.src && !failed && <button className="media-play" onClick={() => { setLoaded(false); setManualPlayback(!playing) }} aria-pressed={playing}>{playing ? 'Ⅱ Pause animation' : '▶ Play animation'}</button>}
    {media.caption && <figcaption>{media.caption}</figcaption>}
  </figure>
}

export function ImageGallery({ media }: { media: MediaAsset[] }) {
  const [index, setIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const startX = useRef(0)
  const move = (direction: number) => setIndex(value => (value + direction + media.length) % media.length)
  const current = media[Math.min(index, media.length - 1)]
  if (!current) return null
  return <div className="image-gallery" role="region" aria-label={`${media[0]?.alt || 'Project media'} — gallery`} tabIndex={0}
    onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowLeft' ? -1 : 1) } }}
    onTouchStart={event => { startX.current = event.touches[0].clientX }}
    onTouchEnd={event => { const delta = event.changedTouches[0].clientX - startX.current; if (Math.abs(delta) > 60) move(delta > 0 ? -1 : 1) }}>
    <FramedImage key={current.id} media={{ ...current, fit: 'contain' }} onOpen={current.kind !== 'video' ? () => setExpanded(true) : undefined} openLabel="Enlarge figure" />
    {expanded && <MediaLightbox media={current} onClose={() => setExpanded(false)} />}
    {media.length > 1 && <>
      <div className="gallery-controls"><button className="button button-secondary" onClick={() => setIndex((index + media.length - 1) % media.length)} aria-label="Previous image">← Previous</button><span role="status">{index + 1} / {media.length}</span><button className="button button-secondary" onClick={() => setIndex((index + 1) % media.length)} aria-label="Next image">Next →</button></div>
      <div className="gallery-thumbnails" aria-label="Choose an image">{media.map((item, i) => <button key={item.id} aria-label={`Show image ${i + 1}: ${item.alt || item.placeholder}`} aria-pressed={index === i} onClick={() => setIndex(i)}>{item.poster || (item.src && item.kind !== 'video' && item.kind !== 'gif' && !/\.gif(?:[?#]|$)/i.test(item.src)) ? <Thumbnail src={item.poster ?? item.src!} number={i + 1} /> : <span>{i + 1}</span>}</button>)}</div>
    </>}
  </div>
}

function Thumbnail({ src, number }: { src: string; number: number }) {
  const [failed, setFailed] = useState(false)
  return failed ? <span>{number}</span> : <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
}

function MediaLightbox({ media, onClose }: { media: MediaAsset; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [zoom, setZoom] = useState(false)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    dialog.current?.showModal()
    return () => { dialog.current?.close(); previous?.focus({ preventScroll: true }) }
  }, [])
  return <dialog ref={dialog} className="media-lightbox" aria-label="Full-resolution figure" onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose() }} onKeyDown={event => {
    event.stopPropagation()
    if (event.key === 'Tab') {
      const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')]
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1)?.focus() }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0]?.focus() }
    }
  }}>
    <div className="viewer-toolbar"><button onClick={() => setZoom(value => !value)}>{zoom ? 'Fit figure' : 'Zoom in'}</button><a href={media.src} target="_blank" rel="noopener noreferrer">Original image ↗</a><button onClick={onClose} autoFocus aria-label="Close enlarged figure">Close ×</button></div>
    <div className={`lightbox-image ${zoom ? 'is-zoomed' : ''}`}><FramedImage media={media} priority /></div>
  </dialog>
}
