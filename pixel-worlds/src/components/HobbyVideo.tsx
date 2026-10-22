import { useEffect, useRef, useState } from 'react'
import type { HobbyMedia } from '../data/hobbies'

/** A poster and a clear play target, with native controls once playback starts. */
export function HobbyVideo({ media }: { media: HobbyMedia }) {
  const video = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'>('idle')
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const node = video.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) node.pause() })
    const pause = () => { if (document.hidden) node.pause() }
    observer.observe(node)
    document.addEventListener('visibilitychange', pause)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', pause); node.pause() }
  }, [])
  const play = () => {
    const node = video.current
    if (!node) return
    if (status === 'error') node.load()
    setStarted(true)
    setStatus('loading')
    void node.play().then(() => node.focus({ preventScroll: true })).catch(error => {
      // Leaving the viewport or changing slides can cancel a pending play.
      if (error instanceof DOMException && error.name === 'AbortError') setStatus('paused')
      else setStatus('error')
    })
  }
  const label = status === 'loading' ? 'Starting video…' : status === 'error' ? 'Try again' : status === 'ended' ? 'Replay video' : 'Play video'
  return <div className="hobby-video" data-status={status}>
    <video ref={video} src={media.src} poster={media.poster} width={media.width} height={media.height}
      controls={started} playsInline preload="metadata" tabIndex={started ? 0 : -1} aria-label={media.alt}
      onPlaying={() => setStatus('playing')} onWaiting={() => setStatus('loading')}
      onPause={() => setStatus(current => current === 'idle' || current === 'error' ? current : 'paused')}
      onEnded={() => setStatus('ended')} onError={() => setStatus('error')}>
      {media.captionsSrc && <track kind="captions" src={media.captionsSrc} srcLang="en" label="English" default />}
    </video>
    {status !== 'playing' && <button className="hobby-video-play" onClick={play} disabled={status === 'loading'} aria-label={`${label}: ${media.alt}`} aria-busy={status === 'loading'}>
      <span className="hobby-play-symbol" aria-hidden="true">{status === 'loading' ? <i className="hobby-video-spinner" /> : <svg viewBox="0 0 32 32"><path d="M9 4v24l20-12Z" fill="currentColor" /></svg>}</span>
      <span>{label}</span>
    </button>}
    {status === 'error' && <p className="hobby-video-error" role="alert">The video could not load. You can try playing it again.</p>}
  </div>
}
