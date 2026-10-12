import { useEffect, useRef } from 'react'
import type { Project } from '../data/portfolio'
import { Icon } from './Icon'
import { ProjectArtwork } from './Artwork'

export function DetailDialog({ project, cv, onClose }: { project: Project | null; cv: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const open = Boolean(project || cv)
  useEffect(() => {
    const dialog = ref.current
    if (open && dialog && !dialog.open) dialog.showModal()
    if (!open && dialog?.open) dialog.close()
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [open])

  return <dialog className="detail-dialog" ref={ref} aria-labelledby="dialog-heading" onCancel={onClose} onClose={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="dialog-inner"><button className="dialog-close" autoFocus onClick={onClose} aria-label="Close details"><Icon name="close" /></button>
      {project ? <>
        {project.images[0] ? <img className="dialog-image" src={project.images[0].src} alt={project.images[0].alt} /> : <ProjectArtwork art={project.art} />}
        <p className="eyebrow">{project.category} · {project.status}</p><h2 id="dialog-heading">{project.title}</h2><p>{project.summary}</p><div className="dialog-divider" /><h3>About the project</h3><p>{project.description}</p><dl className="project-facts"><div><dt>Role / direction</dt><dd>{project.role}</dd></div>{project.year && <div><dt>Year</dt><dd>{project.year}</dd></div>}<div><dt>Focus</dt><dd>{project.technologies.join(' · ')}</dd></div></dl>
        {project.links.length > 0 ? <div className="dialog-links">{project.links.map((link) => <a key={link.url} className="button button-primary" href={link.url} target="_blank" rel="noreferrer">{link.label}<Icon name="arrow" /></a>)}</div> : <p className="content-note">Original project media and links have not been added yet.</p>}
      </> : <><p className="eyebrow">Curriculum vitae</p><h2 id="dialog-heading">The next piece<br />of the picture.</h2><p>The CV PDF hasn’t been attached to this portfolio yet. In the meantime, the Journey section introduces my education, experience, and current direction.</p><a className="button button-primary" href="#journey" onClick={onClose}>Explore my journey<Icon name="arrow" /></a></>}
    </div>
  </dialog>
}
