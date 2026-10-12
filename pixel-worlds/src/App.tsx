import { useState } from 'react'
import { chapters, profile, milestones } from './data/portfolio'
import type { Project } from './data/portfolio'
import { Navigation, ChapterRail, CvAction, useActiveSection } from './components/Navigation'
import { WorldSection } from './components/WorldSection'
import { Icon } from './components/Icon'
import { ProjectCollection } from './components/Projects'
import { DetailDialog } from './components/DetailDialog'

export function App() {
  const active = useActiveSection()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [cvOpen, setCvOpen] = useState(false)
  const activeTheme = chapters.find((chapter) => chapter.id === active)!.world
  const openCv = () => setCvOpen(true)
  const closeDialog = () => { setSelectedProject(null); setCvOpen(false) }

  return <div className="portfolio" data-theme={activeTheme}>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation active={active} onCv={openCv} />
    <ChapterRail active={active} />
    <main id="main">
      <WorldSection
        id="home"
        layout="hero"
        eyebrow="Computer graphics · Vision · Creative AI"
        lead={<>Hello, I’m {profile.name}.</>}
        heading={<>I build things<br />that <em>move, see</em><br />& come alive<span className="heading-period">.</span></>}
        description="Exploring the space between intelligent systems and visual imagination. From understanding the world to creating new ones."
        panelFooter={<><span>Engineer by training.</span><span>Explorer by nature.</span></>}
        footer={<div className="chapter-bottom"><a href="#about" className="scroll-cue"><span className="scroll-cue-icon"><Icon name="down" /></span>Scroll to explore<span className="muted">— five worlds, one journey</span></a><span className="mono world-count">01 <span>/ 05</span></span></div>}
      >
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">View projects<Icon name="arrow" /></a>
          <CvAction onMissing={openCv} />
        </div>
        <div className="hero-education"><span className="education-marker" aria-hidden="true">↗</span><p>{profile.education}<span>@ {profile.institution}</span></p></div>
      </WorldSection>

      <WorldSection
        id="about"
        eyebrow="A little perspective"
        heading={<>Curiosity is the<br />common thread<span className="heading-period">.</span></>}
        description="An engineering foundation. A visual imagination. A curiosity that connects the two."
      >
        <div className="about-grid">
          <div className="about-story">
            <p>I’m Bogdan, from Novi Sad, Serbia. My path has taken me from computer science and AI engineering to the study of <strong>Visual and Creative AI at École Polytechnique.</strong></p>
            <p>I’m interested in how computers understand images, how algorithms create worlds, and what happens when those ideas meet. Graphics, vision, animation, and game development are different ways of exploring that same curiosity.</p>
            <p>Now, I’m shaping that foundation toward work in visual computing and creative research.</p>
            <div className="location-line"><span className="tiny-square" />Novi Sad, Serbia<span>→</span>France</div>
          </div>
          <aside className="focus-panel">
            <p className="eyebrow">In my orbit</p>
            <ul>
              <li><span>01</span><div><h3>Computer graphics</h3><p>Rendering, procedural forms & visual worlds</p></div></li>
              <li><span>02</span><div><h3>Computer vision</h3><p>Seeing, understanding & visual reasoning</p></div></li>
              <li><span>03</span><div><h3>Creative AI</h3><p>Intelligent tools for imagination & expression</p></div></li>
            </ul>
            <p className="focus-footnote">Also drawn to animation, games, and the art of making things feel alive.</p>
          </aside>
        </div>
      </WorldSection>

      <WorldSection
        id="journey"
        eyebrow="The path so far"
        heading={<>A change in altitude<span className="heading-period">.</span></>}
        description="Each chapter builds on the last. From a technical foundation to a more visual direction."
        panelFooter={<><span>Want the full picture?</span><CvAction onMissing={openCv} className="text-link" /></>}
      >
        <ol className="timeline">
          {milestones.map((milestone, index) => <li key={milestone.marker} className={index === 2 ? 'timeline-current' : ''}>
            <div className="timeline-stage"><span className="timeline-marker">{milestone.marker}</span><span>{milestone.stage}</span>{index === 2 && <span className="current-label">Now</span>}</div>
            <div className="timeline-content">
              <h3>{milestone.title}</h3>
              <p className="timeline-subtitle">{milestone.subtitle}</p>
              <p>{milestone.description}</p>
              <ul className="tags">{milestone.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </div>
          </li>)}
        </ol>
      </WorldSection>

      <WorldSection
        id="projects"
        eyebrow="Ideas, taking shape"
        heading={<>Room to grow<span className="heading-period">.</span></>}
        description="Research, interactive worlds, and applied intelligence. A growing collection of things I’m interested in building."
      >
        <ProjectCollection onSelect={setSelectedProject} />
      </WorldSection>

      <WorldSection
        id="contact"
        layout="closing"
        eyebrow="The next conversation"
        heading={<>Good things start<br />with a <em>connection</em><span className="heading-period">.</span></>}
        description={<>Interested in graphics, vision, animation, or creative AI?<br />I’d love to explore what we could build together.</>}
        panelFooter={<span className="contact-note"><span className="tiny-square" />Open to conversations about R&D and internship opportunities.</span>}
        footer={<footer className="site-footer"><a href="#home" className="footer-signature">{profile.name}<span className="heading-period">.</span></a><span>Logic, imagination, and everything in between.</span><a className="text-link back-to-top" href="#home">Back to the surface<Icon name="arrow" /></a></footer>}
      >
        <div className="contact-email">
          {profile.email
            ? <a href={'mailto:' + profile.email}><Icon name="mail" />{profile.email}<Icon name="arrow" /></a>
            : <><Icon name="mail" /><div><span>Email</span><p>Contact address coming soon</p></div><span className="contact-pending">To be added</span></>}
        </div>
        <div className="contact-links">
          {profile.links.map((link) => link.url
            ? <a key={link.label} href={link.url} target="_blank" rel="noreferrer">{link.label}<Icon name="arrow" /></a>
            : <div key={link.label} className="pending-link"><span>{link.label}</span><span>Link coming soon</span></div>)}
          <CvAction onMissing={openCv} className="button button-secondary contact-cv" />
        </div>
      </WorldSection>
    </main>
    <DetailDialog project={selectedProject} cv={cvOpen} onClose={closeDialog} />
  </div>
}
