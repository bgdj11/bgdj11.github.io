export type SectionId = 'home' | 'about' | 'journey' | 'projects' | 'contact'
export type World = 'universe' | 'sky' | 'mountains' | 'botanical' | 'underwater'

export const chapters: { id: SectionId; label: string; world: World; title: string; number: string }[] = [
  { id: 'home', label: 'Home', world: 'universe', title: 'Outer orbit', number: '01' },
  { id: 'about', label: 'About', world: 'universe', title: 'A closer look', number: '02' },
  { id: 'journey', label: 'Journey', world: 'universe', title: 'The trajectory', number: '03' },
  { id: 'projects', label: 'Projects', world: 'universe', title: 'Inner orbit', number: '04' },
  { id: 'contact', label: 'Contact', world: 'universe', title: 'New horizons', number: '05' },
]

// Identity and background come from the supplied portfolio brief.
// Fill these optional destinations with verified URLs before publishing publicly.
export const profile = {
  name: 'Bogdan Djukic',
  initials: 'BD',
  education: 'MScT Visual and Creative AI',
  institution: 'École Polytechnique',
  email: null as string | null,
  cvUrl: null as string | null,
  links: [
    { label: 'GitHub', url: null as string | null },
    { label: 'LinkedIn', url: null as string | null },
    { label: 'itch.io', url: null as string | null },
  ],
}

export const milestones = [
  { stage: 'The foundation', marker: '01', title: 'University of Novi Sad', subtitle: 'Faculty of Technical Sciences · Bachelor’s degree', description: 'A foundation in computing, with a thesis direction in neuro-symbolic visual question answering.', tags: ['Computer science', 'Visual reasoning'] },
  { stage: 'Into practice', marker: '02', title: 'Comtrade System Integration', subtitle: 'Junior AI Engineer', description: 'Moving from academic foundations into applied AI engineering and intelligent systems.', tags: ['AI engineering', 'Applied systems'] },
  { stage: 'The present', marker: '03', title: 'École Polytechnique', subtitle: 'MScT Visual and Creative AI', description: 'Bringing graphics, computer vision, and creative AI together through advanced study.', tags: ['Visual computing', 'Creative AI'] },
  { stage: 'What comes next', marker: '04', title: 'A new point of view', subtitle: 'Graphics · Vision · Animation · Creative AI', description: 'Looking toward research and development internships where technical depth meets visual imagination.', tags: ['R&D', 'Internship interests'] },
]

export type ProjectCategory = 'Research & vision' | 'Graphics & games' | 'Applied AI'
export type ProjectArt = 'reasoning' | 'terrain' | 'network' | 'botanical' | 'orbit' | 'vision' | 'shader'
export interface Project {
  id: string
  title: string
  category: ProjectCategory
  featured: boolean
  year?: string
  summary: string
  description: string
  role: string
  technologies: string[]
  art: ProjectArt
  status: 'Placeholder' | 'In progress' | 'Complete'
  images: { src: string; alt: string }[]
  links: { label: string; url: string }[]
}

// Editorial placeholders based on the brief's candidate list; no invented results,
// screenshots, dates, or repository URLs. Replace these as projects are curated.
export const projects: Project[] = [
  {
    id: 'visual-reasoning', title: 'Beyond what meets the eye', category: 'Research & vision', featured: true,
    summary: 'Neuro-symbolic visual question answering: connecting what a system sees with how it reasons.',
    description: 'Reserved for the thesis-related visual reasoning project. The final case study will explain the research question, the approach, and evaluation with real outputs.',
    role: 'Thesis / research project', technologies: ['Computer vision', 'Neuro-symbolic AI', 'VQA'], art: 'reasoning', status: 'Placeholder', images: [], links: [],
  },
  {
    id: 'interactive-worlds', title: 'Worlds you can step into', category: 'Graphics & games', featured: true,
    summary: 'A space for the strongest interactive project, where graphics and game development come together.',
    description: 'Reserved for a selected Godot or graphics project. Gameplay footage, implementation details, and the exact contribution will be added after curation.',
    role: 'Game development / graphics', technologies: ['Godot', 'Interactive systems', 'Graphics'], art: 'terrain', status: 'Placeholder', images: [], links: [],
  },
  {
    id: 'applied-ai', title: 'Intelligence, put to work', category: 'Applied AI', featured: true,
    summary: 'An applied engineering case study focused on building useful, dependable intelligent systems.',
    description: 'Reserved for a non-confidential AI engineering project. The final case study will include the problem, system design, personal contribution, and verified outcomes.',
    role: 'AI engineering', technologies: ['Machine learning', 'System design', 'Applied AI'], art: 'network', status: 'Placeholder', images: [], links: [],
  },
  {
    id: 'botanica', title: 'Botanica Algorithmica', category: 'Graphics & games', featured: false,
    summary: 'An exploration of algorithmic growth and branching forms.', description: 'A secondary project from the brief. Add the actual plant outputs, generation methods, and repository here.', role: 'Procedural graphics', technologies: ['Generative forms', 'Plants'], art: 'botanical', status: 'Placeholder', images: [], links: [],
  },
  {
    id: 'space-shooter', title: 'Space Shooter', category: 'Graphics & games', featured: false,
    summary: 'A smaller game exploring movement, interaction, and play.', description: 'A secondary game from the brief. Add the actual game screenshots, engine details, and playable build here.', role: 'Game development', technologies: ['Games', 'Interaction'], art: 'orbit', status: 'Placeholder', images: [], links: [],
  },
  {
    id: 'vision-studies', title: 'Vision studies', category: 'Research & vision', featured: false,
    summary: 'A place for panorama, feature detection, and vision coursework.', description: 'An archive slot for selected computer vision exercises. Exact methods, example outputs, and notebooks will follow curation.', role: 'Coursework / experiments', technologies: ['Computer vision', 'Image processing'], art: 'vision', status: 'Placeholder', images: [], links: [],
  },
  {
    id: 'shader-sketchbook', title: 'Shader sketchbook', category: 'Graphics & games', featured: false,
    summary: 'Small studies in light, texture, and computational form.', description: 'An archive slot for rendering and shader experiments. Add selected sketches and their technical notes here.', role: 'Graphics experiments', technologies: ['Rendering', 'Shaders'], art: 'shader', status: 'Placeholder', images: [], links: [],
  },
]
