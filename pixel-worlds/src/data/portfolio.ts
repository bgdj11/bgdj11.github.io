import portraitImage from '../../../images/me.jpg'
import basketballImage from '../../../images/basketabll.png'
import boardGamesImage from '../../../images/board_games.png'
import videoGamesImage from '../../../images/gaming.png'
import fishingImage from '../../../images/fishing.png'
import comtradeLogo from '../../../images/comtrade.png'
import petnicaLogo from '../../../images/petnica.jpg'

export type SectionId = 'home' | 'education' | 'experience' | 'projects' | 'beyond-code' | 'contact'
export type World = 'universe' | 'sky' | 'mountains' | 'botanical' | 'underwater'
// Retained for original, unmounted artwork.
export type ProjectArt = 'reasoning' | 'terrain' | 'network' | 'botanical' | 'orbit' | 'vision' | 'shader'

// All six chapters share the existing continuous space renderer.
// Labels, copy and theme mapping are independent of layout.
export const chapters: { id: SectionId; label: string; world: World; title: string; number: string; description?: string }[] = [
  { id: 'home', label: 'Home', world: 'universe', title: "Hey, I'm Bogdan.", number: '01' },
  { id: 'education', label: 'Education', world: 'universe', title: 'Education', number: '02' },
  { id: 'experience', label: 'Experience', world: 'universe', title: 'Experience', number: '03' },
  { id: 'projects', label: 'Projects', world: 'universe', title: 'Projects', number: '04' },
  { id: 'beyond-code', label: 'Hobbies', world: 'universe', title: 'Hobbies', number: '05', description: "Not everything on this website is about work or university! I've made some space for the things I love doing outside of all that. Each hobby has its own little corner filled with photos, memories, favorites, and a few random things I've collected along the way. Pick something that catches your eye and have a look around!" },
  { id: 'contact', label: 'Contact', world: 'universe', title: 'Get in touch.', number: '06', description: 'Send me an email, find me online, or take a look at my resume.' },
]

export interface MediaAsset {
  id: string
  kind?: 'image' | 'gif' | 'video'
  src?: string // /media/portrait.webp corresponds to public/media/portrait.webp
  alt: string
  caption?: string
  placeholder: string
  shape?: 'portrait' | 'square' | 'landscape'
  fit?: 'cover' | 'contain'
  position?: string
  width?: number
  height?: number
  srcSet?: string
  sizes?: string
  poster?: string // Still image for GIF / video previews.
  captionsSrc?: string // WebVTT for videos with speech.
  pixelated?: boolean // Photographs stay clear unless explicitly enabled.
  presentation?: 'logo' // Compact institutional marks, not gallery photographs.
}
export interface ContentLink { label: string; url: string }
export type SocialKind = 'github' | 'linkedin' | 'itch' | 'instagram' | 'email' | 'whatsapp'
export interface Social { kind: SocialKind; label: string; url?: string }
export interface DetailBlock { heading: string; paragraphs?: string[]; items?: string[] }
export interface Favorite { title: string; note?: string; category?: string; media?: MediaAsset }
export interface DetailContent {
  id: string
  title: string
  subtitle?: string
  location?: string
  summary: string
  placeholderNote?: string
  media: MediaAsset
  details: DetailBlock[]
  gallery?: MediaAsset[]
  links?: ContentLink[]
  favorites?: Favorite[]
}
export interface Education extends DetailContent { dates?: string; degree: string; credential?: string; credits?: number; gpa?: string }
export interface Experience extends DetailContent { dates?: string; role: string; highlights?: string[]; technologies?: string[] }
export type ProjectCategory = 'Graphics' | 'Vision' | 'AI' | 'Games' | 'Other'
export interface Project extends DetailContent {
  category: ProjectCategory
  featured: boolean // Array order sets editorial order.
  year?: string
  contribution?: string
  technologies?: string[]
}
export type Hobby = DetailContent

const photo = (id: string, placeholder: string, shape: MediaAsset['shape'] = 'landscape'): MediaAsset => ({ id, alt: '', placeholder, shape })

export const profile = {
  name: 'Bogdan Djukic', initials: 'BD', greeting: 'HELLO, WORLD!',
  introduction: "I'm an MScT student in Visual and Creative Artificial Intelligence at École Polytechnique.",
  description: "I'm interested in computer graphics, computer vision, creative AI, and building interactive experiences.",
  portrait: { id: 'portrait', src: portraitImage, alt: 'Bogdan Djukic by the sea', placeholder: 'Bogdan Djukic', shape: 'portrait', fit: 'cover', position: '50% 30%', width: 3200, height: 4000 } satisfies MediaAsset,
  // Fill only with real destinations; missing links render as plain text.
  socials: [
    { kind: 'github', label: 'GitHub', url: 'https://github.com/bgdj11' },
    { kind: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/bogdandjukic25' },
    { kind: 'itch', label: 'itch.io' },
    { kind: 'email', label: 'Email', url: 'mailto:bogdandjukic25@gmail.com' },
    { kind: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/33746418215' },
    { kind: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/bgdj11/' },
  ] as Social[],
  resume: {
    url: '/Bogdan_Djukic_CV.pdf',
    filename: 'Bogdan_Djukic_CV.pdf',
    thumbnail: photo('resume', 'Resume preview to come', 'portrait'),
  },
}

// Dates, grades, awards and experience below are transcribed from Bogdan_CV.pdf.
// Sep 2028 is the planned end of the current degree, not a completed qualification.
export const education: Education[] = [
  {
    id: 'polytechnique', title: 'École Polytechnique', subtitle: 'Institut Polytechnique de Paris', credential: 'Master of Science and Technology', degree: 'Visual and Creative Artificial Intelligence (ViCAI)', dates: 'Sep 2026–Sep 2028 (expected)', location: 'Paris, France', credits: 140,
    summary: '',
    media: { id: 'polytechnique-logo', src: '/media/education/ecole.svg', alt: 'École Polytechnique logo', placeholder: 'École Polytechnique', presentation: 'logo', shape: 'square', fit: 'cover', width: 186, height: 263 },
    details: [
      { heading: 'Degree', paragraphs: ['MScT in Visual and Creative Artificial Intelligence (ViCAI), started in September 2026. Expected completion: September 2028. The two-year program carries 140 ECTS credits.'] },
      { heading: 'Scholarship', items: ['École Polytechnique Excellence Scholarship — École Polytechnique Foundation, 2026.'] },
    ],
    gallery: [], links: [],
  },
  {
    id: 'bachelors', title: 'Faculty of Technical Sciences', subtitle: 'University of Novi Sad', credential: 'Bachelor of Science', degree: 'Control and Computing Engineering', dates: 'Oct 2021–Jun 2026', location: 'Novi Sad, Serbia', credits: 240, gpa: '9.55/10',
    summary: 'Applied Computer Science — Intelligent Systems module.',
    media: { id: 'ftn-logo', src: '/media/education/ftn.jpg', alt: 'Faculty of Technical Sciences, University of Novi Sad logo', placeholder: 'FTN', presentation: 'logo', shape: 'square', fit: 'cover' },
    details: [
      { heading: 'Academic background', paragraphs: ['BSc in Control and Computing Engineering (240 ECTS), with the Applied Computer Science — Intelligent Systems module. Cumulative GPA: 9.55/10.'] },
      { heading: 'Bachelor thesis', paragraphs: ['Visual Scene Understanding through Neurosymbolic Reasoning (2025–2026).'] },
      { heading: 'Awards & scholarships', items: [
        'Dositeja Scholarship for Academic Excellence — Fund for Young Talents of the Republic of Serbia, 2025.',
        'Don Walker Scholarship — Magna International, 2022–2025.',
        'Student Scholarship — Ministry of Education, Republic of Serbia, 2022–2024.',
        'Award for Excellence — Municipality of Odžaci, 2022–2025.',
      ] },
      { heading: 'Projects & activities during my studies', items: ['Federated Actor Learning — February 2026.', 'AI Nation Hackathon — Reputeo & Yandex, November 2025.', 'AIBG V4.0 Hackathon — May 2024.'] },
      { heading: 'Languages', items: ['Serbian — native.', 'English — TOEFL iBT: 100/120.'] },
    ],
    gallery: [], links: [],
  },
  {
    id: 'gymnasium', title: 'Gymnasium “Jovan Jovanović Zmaj”', degree: 'High School Diploma', dates: 'Sep 2017–Jun 2021', location: 'Odžaci, Serbia', gpa: '5.0/5.0',
    summary: 'Secondary education in Odžaci.',
    media: { id: 'gymnasium-school', src: '/media/education/gimnazija-school.jpg', alt: 'Gimnazija i ekonomska škola Jovan Jovanović Zmaj in Odžaci', placeholder: 'Jovan Jovanović Zmaj', presentation: 'logo', shape: 'square', fit: 'cover' },
    details: [{ heading: 'Secondary education', paragraphs: ['High School Diploma, September 2017–June 2021. Cumulative GPA: 5.0/5.0.'] }],
    gallery: [], links: [{ label: 'School website', url: 'https://www.gesjjz.edu.rs/' }],
  },
]

export const experience: Experience[] = [
  {
    id: 'comtrade', title: 'Comtrade System Integration', role: 'Junior AI Engineer', dates: 'Jan 2026–Aug 2026', location: 'Belgrade, Serbia',
    summary: 'Built enterprise RAG systems and AI agents on Azure and on-premises, including multilingual email automation and real-time voice interaction for humanoid robots.',
    media: { id: 'comtrade', src: comtradeLogo, alt: 'Comtrade logo', placeholder: 'Comtrade', presentation: 'logo', shape: 'square', fit: 'contain' },
    details: [
      { heading: 'Enterprise RAG systems', items: [
        'Architected end-to-end RAG pipelines on Azure and on-premises, covering document ingestion, retrieval, generation and observability.',
        'Optimized retrieval through hybrid search, semantic reranking and semantic chunking tailored to legal, military, HR and regulatory documents.',
        'Implemented document-level role-based access control and automated SharePoint synchronization using Entra ID group filtering, Microsoft Graph webhooks and the Delta API.',
      ] },
      { heading: 'Reliability and model evaluation', items: [
        'Designed guardrails to reduce hallucinations through context grounding, confidence-based routing and structured fallback logic.',
        'Evaluated LLMs and embedding models on multilingual and domain-specific datasets, using Serbian retrieval benchmarks to select the production embedding model.',
      ] },
      { heading: 'Deployment and infrastructure', paragraphs: [
        'Managed containerized workloads across Azure and on-premises environments, working with Azure Container Apps, App Service and Functions.',
      ] },
      { heading: 'Multilingual email automation', paragraphs: [
        'Developed a multi-agent pipeline for classifying and responding to high-volume enterprise email in 10 languages, with dynamic guidelines loaded from blob storage.',
      ] },
      { heading: 'Real-time voice agents', paragraphs: [
        'Built a voice agent for humanoid robots with a streaming speech-to-text → LLM → text-to-speech pipeline using LiveKit, Soniox and ElevenLabs, supported by RAG over a vector database.',
      ] },
    ],
    highlights: ['AI agents', 'LLM & RAG', 'Microsoft Azure'],
    technologies: ['Microsoft Azure', 'Microsoft Graph', 'Entra ID', 'SharePoint', 'LiveKit', 'Soniox', 'ElevenLabs'], gallery: [], links: [],
  },
  {
    id: 'daze-solutions', title: 'Daze Solutions Limited', role: 'Data Science Intern', dates: 'Dec 2024', location: 'Remote, Serbia',
    summary: 'Built an end-to-end real-estate analytics pipeline, from PostgreSQL data to market segmentation.',
    media: { id: 'daze-solutions', src: '/media/experience/daze-initial.svg', alt: 'Letter D placeholder for Daze Solutions Limited', placeholder: 'Daze Solutions Limited', presentation: 'logo', shape: 'square', fit: 'contain' },
    details: [{ heading: 'Real-estate analytics pipeline', items: ['Extracted and cleaned PostgreSQL data in Python.', 'Engineered domain-specific features for real-estate analysis.', 'Applied K-means clustering and visualized the resulting market segments.'] }],
    highlights: ['Data processing', 'Feature engineering', 'Market segmentation'],
    technologies: ['Python', 'PostgreSQL', 'K-means clustering'], gallery: [], links: [],
  },
  {
    id: 'petnica', title: 'Petnica Science Center', role: 'Research Intern', dates: 'Apr 2019–Sep 2020', location: 'Petnica, Serbia',
    summary: 'Conducted mentored research in biology and chemistry, from experimental design to analysis and scientific reporting.',
    media: { id: 'petnica', src: petnicaLogo, alt: 'Petnica Science Center logo', placeholder: 'Petnica Science Center', presentation: 'logo', shape: 'square', fit: 'contain' },
    details: [{ heading: 'Research experience', paragraphs: ['Conducted mentored research in biology and chemistry, covering experimental design, analysis and scientific reporting.'] }],
    highlights: ['Experimental design', 'Research reporting'],
    technologies: [], gallery: [], links: [],
  },
]

// Candidate entries are labeled drafts, never claims of finished work.
// Reorder entries / toggle featured here, without editing components.
export const projects: Project[] = [
  {
    id: 'visual-reasoning', title: 'Visual Scene Understanding through Neurosymbolic Reasoning', category: 'Vision', featured: true, year: '2025–2026',
    summary: 'Bachelor thesis on visual scene understanding and neuro-symbolic reasoning.',
    contribution: 'Bachelor thesis',
    media: photo('thesis-preview', 'Thesis preview to come'),
    placeholderNote: 'Case study in preparation. Methods, contribution and results have not been added.',
    details: [{ heading: 'About the thesis', paragraphs: ['The detailed account of the research question, implementation and evaluation will be added here.'] }],
    gallery: [], links: [],
  },
  {
    id: 'graphics-project', title: 'Graphics / vision project', category: 'Graphics', featured: true,
    summary: 'A place for a selected graphics or computer vision project.',
    media: photo('graphics-preview', 'Project preview to come'),
    placeholderNote: 'Selection pending. This is a reserved feature, not a completed project.', details: [], gallery: [], links: [],
  },
  {
    id: 'interactive-worlds', title: 'Game development project', category: 'Games', featured: true,
    summary: 'A place for a substantial interactive or game development project.',
    media: photo('game-preview', 'Gameplay preview to come'),
    placeholderNote: 'Selection pending. This is a reserved feature, not a completed project.', details: [], gallery: [], links: [],
  },
  {
    id: 'applied-ai', title: 'AI engineering project', category: 'AI', featured: true,
    summary: 'A place for a non-confidential AI engineering case study.',
    media: photo('ai-preview', 'System preview to come'),
    placeholderNote: 'Selection pending. This is a reserved feature, not a completed project.', details: [], gallery: [], links: [],
  },
  ...([
    ['space-shooter', 'Space Shooter', 'Games', 'Game overview and playable build to follow.'],
    ['botanica', 'Botanica Algorithmica', 'Graphics', 'Algorithmic growth and branching forms; details to follow.'],
    ['graphics-coursework', 'Computer Graphics coursework', 'Graphics', 'A collection for exercises and rendering studies.'],
    ['vision-studies', 'Computer Vision labs', 'Vision', 'A collection for notebooks and visual results.'],
    ['curve-studies', 'Animation & curve experiments', 'Graphics', 'A collection for smaller motion experiments.'],
    ['ai-experiments', 'AI & software experiments', 'AI', 'A collection for smaller engineering projects.'],
  ] as const).map(([id, title, category, summary]): Project => ({
    id, title, category, summary, featured: false,
    media: photo(id + '-thumbnail', 'Preview to come', 'square'),
    placeholderNote: 'Draft entry. Original media, project details and links will be added.',
    details: [], gallery: [], links: [],
  })),
]

// Import original files so Vite watches replacements and hashes build URLs.
export const hobbies: Hobby[] = [
{ id: 'basketball', title: 'Basketball', summary: '', media: { id: 'basketball', src: basketballImage, alt: 'Pixel-art basketball player dribbling a ball', placeholder: 'Basketball', shape: 'square', fit: 'contain', pixelated: true }, details: [] },
  { id: 'board-games', title: 'Board games', summary: '', media: { id: 'board-games', src: boardGamesImage, alt: 'Pixel-art character playing a board game', placeholder: 'Board games', shape: 'square', fit: 'contain', pixelated: true }, details: [], favorites: [] },
  { id: 'games', title: 'Video games', summary: '', media: { id: 'games', src: videoGamesImage, alt: 'Pixel-art character playing video games with a controller', placeholder: 'Video games', shape: 'square', fit: 'contain', pixelated: true }, details: [], favorites: [] },
  { id: 'fishing', title: 'Fishing', summary: '', media: { id: 'fishing', src: fishingImage, alt: 'Pixel-art angler holding a fishing rod and a fish', placeholder: 'Fishing', shape: 'square', fit: 'contain', pixelated: true }, details: [] },
]
