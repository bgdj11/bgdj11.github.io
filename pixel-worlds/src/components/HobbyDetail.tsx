import { useEffect, useRef, useState } from 'react'
import type { DetailContent } from '../data/portfolio'
import { favoriteGames, steamProfile } from '../data/hobbies'
import type { HobbyAlbum, HobbyMedia, HobbyPage, HobbyStory } from '../data/hobbies'
import { FramedImage } from './Media'
import { HobbyVideo } from './HobbyVideo'
import { SocialLink } from './Contact'
import { Icon } from './Icon'
import { PixelHeadingText } from './PixelHeadingText'

export function HobbyDetail({ entry, page }: { entry: DetailContent; page: HobbyPage }) {
  return <article className={`hobby-detail hobby-${entry.id}`}>
    <header className="hobby-header">
      <img className="hobby-header-icon" src={entry.media.src} alt="" width="80" height="80" />
      <div><p className="hobby-eyebrow">{page.eyebrow}</p><h2 id="dialog-heading"><PixelHeadingText>{entry.title}</PixelHeadingText></h2></div>
      <p className="hobby-introduction">{page.introduction}</p>
    </header>
    <div className="hobby-journal">
      {page.collection && <section className="hobby-journal-entry has-collection" aria-labelledby="collection-heading">
        <Story story={page.collection} id="collection-heading" />
        <Collection media={page.collection.media} />
      </section>}
      {page.albums.map(album => <section className="hobby-journal-entry" key={album.id} aria-labelledby={`${album.id}-heading`}>
        <Story story={album} id={`${album.id}-heading`} />
        <HobbyGallery album={album} />
      </section>)}
    </div>
    {page.gaming && <GamingShelf stories={page.gaming} />}
  </article>
}

function Story({ story, id }: { story: HobbyStory; id: string }) {
  return <div className="hobby-story"><h3 id={id}>{story.title}</h3>{story.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
}

function HobbyGallery({ album }: { album: HobbyAlbum }) {
  const [index, setIndex] = useState(0)
  const [enlarged, setEnlarged] = useState(false)
  const start = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const current = album.media[index]
  const move = (direction: number) => setIndex(value => (value + direction + album.media.length) % album.media.length)
  const movePhoto = (direction: number) => {
    let next = index
    do { next = (next + direction + album.media.length) % album.media.length } while (album.media[next].kind === 'video')
    setIndex(next)
  }
  return <div className="hobby-album" role="region" aria-label={`${album.title} gallery`} onKeyDown={event => {
    // Leave native video seeking and volume keys alone.
    if (event.target instanceof HTMLVideoElement) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowLeft' ? -1 : 1) }
  }}>
    <div className={`hobby-gallery-stage${current.kind === 'video' ? ' is-video' : ''}`} onTouchStart={event => {
      swiped.current = false
      if (current.kind === 'video') return
      start.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
    }} onTouchEnd={event => {
      if (!start.current) return
      const dx = event.changedTouches[0].clientX - start.current.x
      const dy = event.changedTouches[0].clientY - start.current.y
      start.current = null
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) { swiped.current = true; move(dx > 0 ? -1 : 1) }
    }} onTouchCancel={() => { start.current = null }}>
      {current.kind === 'video' ? <HobbyVideo key={current.id} media={current} /> : <>
        <FramedImage key={current.id} media={{ ...current, caption: undefined }} />
        <button className="hobby-photo-open" onClick={() => { if (!swiped.current) setEnlarged(true); swiped.current = false }} aria-label={`Enlarge photo: ${current.alt}`} aria-haspopup="dialog" />
      </>}
      {album.media.length > 1 && <>
        <button className="gallery-arrow gallery-previous" type="button" onClick={() => move(-1)} aria-label={`Previous memory in ${album.title}`}>‹</button>
        <span className="gallery-count" role="status" aria-live="polite">{index + 1} / {album.media.length}{current.kind === 'video' ? ' · Video' : ''}</span>
        <button className="gallery-arrow gallery-next" type="button" onClick={() => move(1)} aria-label={`Next memory in ${album.title}`}>›</button>
      </>}
    </div>
    {current.kind === 'video' && <p className="hobby-video-caption">{current.caption}</p>}
    {enlarged && <PhotoViewer media={current} onClose={() => setEnlarged(false)} onMove={album.media.filter(item => item.kind !== 'video').length > 1 ? movePhoto : undefined} />}
  </div>
}

function Collection({ media }: { media: HobbyMedia }) {
  const [enlarged, setEnlarged] = useState(false)
  return <div className="hobby-collection">
    <div className="hobby-collection-photo">
      <FramedImage media={media} />
      <button className="hobby-photo-open" onClick={() => setEnlarged(true)} aria-label="Enlarge my board game collection" aria-haspopup="dialog" />
    </div>
    {enlarged && <PhotoViewer media={media} onClose={() => setEnlarged(false)} />}
  </div>
}

function PhotoViewer({ media, onClose, onMove }: { media: HobbyMedia; onClose: () => void; onMove?: (direction: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog?.showModal()
    dialog?.querySelector<HTMLButtonElement>('.hobby-photo-close')?.focus({ preventScroll: true })
    return () => { dialog?.close(); previous?.focus({ preventScroll: true }) }
  }, [])
  return <dialog ref={ref} className="hobby-photo-dialog" aria-label="Photo viewer" onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose() }} onClick={event => { if (event.target === event.currentTarget) onClose() }} onKeyDown={event => {
    event.stopPropagation()
    if (onMove && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) { event.preventDefault(); onMove(event.key === 'ArrowLeft' ? -1 : 1) }
    if (event.key === 'Tab') {
      const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button')]
      const first = buttons[0], last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
  }}>
    <div className="hobby-photo-toolbar"><span>Photo viewer</span><button className="hobby-photo-close" aria-label="Close photo viewer" onClick={onClose}><Icon name="close" /></button></div>
    <div className="hobby-photo-full"><img src={media.src} alt={media.alt} width={media.width} height={media.height} /></div>
    <div className="hobby-photo-footer">
      {onMove && <button aria-label="Previous photo" onClick={() => onMove(-1)}>←</button>}
      <p aria-live="polite">{media.alt}</p>
      {onMove && <button aria-label="Next photo" onClick={() => onMove(1)}>→</button>}
    </div>
  </dialog>
}

function GamingShelf({ stories }: { stories: NonNullable<HobbyPage['gaming']> }) {
  return <>
    <section className="hobby-gaming-story" aria-labelledby="game-development-heading"><Story story={stories.development} id="game-development-heading" /></section>
    <section className="hobby-game-shelf" aria-labelledby="favorite-games-heading">
      <div className="hobby-album-heading"><h3 id="favorite-games-heading">On my favorites shelf</h3><span>A personal selection</span></div>
      <div className="hobby-game-grid">{favoriteGames.map(game => <a className={`hobby-game-card${game.favorite ? ' is-favorite' : ''}`} href={game.url} target="_blank" rel="noopener noreferrer" key={game.slug} aria-label={`${game.title} on ${game.destination}`}>
        <img src={game.image} alt="" width="460" height="215" loading="lazy" />
        <div><h4>{game.title}</h4>{game.favorite ? <span>All-time favorite</span> : <span aria-hidden="true">↗</span>}</div>
      </a>)}</div>
    </section>
    <section className="hobby-gaming-story" aria-labelledby="games-together-heading"><Story story={stories.together} id="games-together-heading" /></section>
    <div className="hobby-steam">
      <SocialLink social={{ kind: 'steam', label: 'Find me on Steam', url: steamProfile }} compact />
      <span>bgdj11</span>
      <a href={`${steamProfile}games/?tab=all`} target="_blank" rel="noopener noreferrer">Steam library <span aria-hidden="true">↗</span></a>
    </div>
  </>
}
