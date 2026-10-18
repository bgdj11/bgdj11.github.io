import portraitImage from '../../../images/me2.jpg'
import basketballImage from '../../../images/basketabll.png'
import boardGamesImage from '../../../images/board_games.png'
import videoGamesImage from '../../../images/gaming.png'
import fishingImage from '../../../images/fishing.png'
import comtradeLogo from '../../../images/comtrade.png'
import petnicaLogo from '../../../images/petnica.jpg'
import zmajPortrait from '../../../images/Jovan_Jovanović_Zmaj.jpg'
import { comtradeDetails } from './comtrade'
export { projects } from './projects'

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
  background?: string // Matte behind transparent media; does not alter the original artwork.
}
export interface ContentLink { label: string; url: string }
export type SocialKind = 'github' | 'linkedin' | 'itch' | 'instagram' | 'email' | 'whatsapp'
export interface Social { kind: SocialKind; label: string; url?: string }
export interface DetailBlock { heading: string; paragraphs?: string[]; items?: string[]; subsections?: DetailBlock[]; links?: ContentLink[] }
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
export interface Education extends DetailContent { dates?: string; cardDates?: string; degree: string; credential?: string; credits?: number; gpa?: string; status?: string; aboutProgram?: string[]; coursework?: DetailBlock[]; involvement?: { title: string; description: string }[] }
export interface Experience extends DetailContent { dates?: string; cardDates?: string; role: string; highlights?: string[]; technologies?: string[] }
export type ProjectCategory = 'Graphics' | 'Vision' | 'AI' | 'Games' | 'Other'
export type ProjectCollection = 'Graphics & Computer Vision' | 'AI & Other Projects'
export interface ProjectChart {
  display?: 'table'
  label: string
  unit: string
  max: number
  series: string[]
  rows: { label: string; values: number[] }[]
  note: string
}
export interface ProjectSection extends DetailBlock {
  comparison?: { label: string; media: MediaAsset }[]
  navLabel?: string
  code?: string
  table?: { caption: string; columns: string[]; rows: string[][] }
  media?: MediaAsset[]
  chart?: ProjectChart
  source?: ContentLink
}
export interface ProjectDocument { title: string; description: string; url: string; preview: string; format: string; slides?: boolean; original?: string }
export interface Project extends DetailContent {
  cardMedia?: MediaAsset
  category: ProjectCategory
  featured: boolean // Array order sets editorial order.
  year?: string
  contribution?: string
  technologies?: string[]
  collection?: ProjectCollection
  caseStudy?: ProjectSection[]
  documents?: ProjectDocument[]
}
export type Hobby = DetailContent

const photo = (id: string, placeholder: string, shape: MediaAsset['shape'] = 'landscape'): MediaAsset => ({ id, alt: '', placeholder, shape })

export const profile = {
  name: 'Bogdan Đukić', initials: 'BĐ', greeting: '',
  introduction: "I'm currently pursuing an MScT in Visual and Creative Artificial Intelligence at École Polytechnique, with previous experience working as an AI engineer.",
  description: "My interests lie in computer vision, computer graphics, and creative AI. Lately, I've also been exploring game development with Godot and diving deeper into real-time graphics. I'm especially drawn to research and R&D at the intersection of AI, computer graphics, and interactive technologies, from the technology behind video games and animated films to new ways of creating and interacting with digital worlds.",
  portrait: { id: 'portrait', src: portraitImage, alt: 'Bogdan Đukić by the sea', placeholder: 'Bogdan Đukić', shape: 'portrait', fit: 'cover', position: '50% 30%', width: 3200, height: 4000 } satisfies MediaAsset,
  // Fill only with real destinations; missing links render as plain text.
  socials: [
    { kind: 'github', label: 'GitHub', url: 'https://github.com/bgdj11' },
    { kind: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/bogdandjukic25' },
    { kind: 'itch', label: 'itch.io', url: 'https://bgdj11.itch.io' },
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
    id: 'polytechnique', title: 'École Polytechnique', subtitle: 'Institut Polytechnique de Paris', credential: 'Master of Science & Technology (MSc&T)', degree: 'Visual and Creative Artificial Intelligence (ViCAI)', dates: 'September 2026 – Present (expected graduation: 2028)', cardDates: 'Sep 2026 – Present', location: 'Palaiseau, France', credits: 140,
    summary: '',
    media: { id: 'polytechnique-logo', src: '/media/education/ecole.svg', alt: 'École Polytechnique logo', placeholder: 'École Polytechnique', presentation: 'logo', shape: 'square', fit: 'cover', width: 186, height: 263 },
    details: [
      { heading: 'About the Program', paragraphs: ["I am currently pursuing a Master's degree in Visual and Creative Artificial Intelligence at École Polytechnique, focusing on the intersection of computer vision, computer graphics, and machine learning. The program combines visual content analysis and synthesis with modern AI techniques, including deep learning, generative models, and reinforcement learning."] },
      { heading: 'Computer Vision & Graphics', items: ['Image Analysis and Computer Vision', 'Digital Representations and Analysis of Shapes', 'Computer Animation', 'Image Synthesis'] },
      { heading: 'Artificial Intelligence & Machine Learning', items: ['Foundations of Machine Learning', 'Advanced Deep Learning', 'Multimodal Generative AI', 'Reinforcement Learning and Autonomous Agents'] },
      { heading: 'Honors & Awards', items: ['École Polytechnique Foundation Excellence Scholarship'] },
    ],
    involvement: [{ title: 'Unibuddy Student Ambassador', description: 'Representing École Polytechnique on Unibuddy, connecting with prospective students, answering questions, and sharing firsthand insights into the MSc&T program and student life in France.' }],
    gallery: [], links: [],
  },
  {
    id: 'bachelors', title: 'Faculty of Technical Sciences', subtitle: 'University of Novi Sad', credential: 'Bachelor of Science (BSc)', degree: 'Computing and Control Engineering', dates: 'October 2021 – July 2026', cardDates: 'Oct 2021 – Jul 2026', location: 'Novi Sad, Serbia', credits: 240, gpa: '9.55/10', status: 'Graduated',
    summary: 'Applied Computer Science – Intelligent Systems',
    media: { id: 'ftn-logo', src: '/media/education/ftn.jpg', alt: 'Faculty of Technical Sciences, University of Novi Sad logo', placeholder: 'FTN', presentation: 'logo', shape: 'square', fit: 'cover' },
    aboutProgram: [
      "I completed my Bachelor's degree in Computing and Control Engineering at the Faculty of Technical Sciences, University of Novi Sad, within the Applied Computer Science and Informatics module, focusing on intelligent systems.",
      "The program provided me with a broad foundation in computer science, covering algorithms, mathematics, software development, and computer systems. During my studies, I developed a particular interest in artificial intelligence, computer graphics, and knowledge-based systems. These interests eventually came together in my Bachelor's thesis on neuro-symbolic visual scene understanding, which also influenced my decision to pursue further studies in Visual and Creative AI.",
    ],
    coursework: [
      { heading: 'Artificial Intelligence, Graphics & Interaction', items: ['Computational Intelligence Fundamentals', 'Knowledge Based Systems', 'Soft Computing', 'Computer Graphics', 'Human-Computer Interaction'] },
      { heading: 'Algorithms & Computational Methods', items: ['Programming Languages and Data Structures', 'Probability and Stochastic Processes', 'Methods of Optimization', 'Numerical Algorithms and Numerical Software', 'System Modelling and Simulation'] },
      { heading: 'Computer Systems & Software', items: ['Compilers', 'Operating Systems', 'Computer Architecture', 'Basics of Parallel Programming and Software Tools', 'Internet Software Architectures'] },
    ],
    details: [
      { heading: 'Bachelor Thesis', subsections: [{ heading: 'Visual Scene Understanding Through Neuro-Symbolic Reasoning', items: ['Explored neuro-symbolic approaches to visual scene understanding and reasoning.', 'Combined scene representations with symbolic reasoning for answering questions about visual content.'] }], links: [] },
      { heading: 'Awards & Scholarships', items: [
        'Dositeja Scholarship for Academic Excellence — Fund for Young Talents of the Republic of Serbia, 2025.',
        'Don Walker Scholarship — Magna International, 2022–2025.',
        'Student Scholarship — Ministry of Education, Republic of Serbia, 2022–2024.',
        'Award for Excellence — Municipality of Odžaci, 2022–2025.',
      ] },
      { heading: 'Hackathons', subsections: [
        { heading: 'AI Nation Hackathon — Reputeo × Yandex (2025)', items: ['36-hour AI hackathon.', 'Developed CheckMate, a Chrome extension for real-time scam risk detection.', 'Led backend and AI development, implementing semantic search and risk analysis.'] },
        { heading: 'AIBG v4.0 Hackathon (2024)', items: ['24-hour competitive AI programming hackathon.', 'Developed an autonomous Python bot for the AlienWarz strategy game.', 'Implemented BFS pathfinding and heuristic decision-making for resource management and combat.'] },
      ] },
      { heading: 'Student Activities', subsections: [{ heading: 'EESTEC LC Novi Sad — Member', items: ['Participated in student-led initiatives, technical events, and career fairs.', 'Contributed to the organization of KONTEH 2026 as part of the IT team.'] }] },
    ],
    gallery: [], links: [],
  },
  {
    id: 'gymnasium', title: 'Gymnasium “Jovan Jovanović Zmaj”', degree: 'High School Diploma', dates: 'Sep 2017–Jun 2021', location: 'Odžaci, Serbia', gpa: '5.0/5.0',
    summary: 'Secondary education in Odžaci.',
    media: { id: 'gymnasium-school', src: zmajPortrait, alt: 'Portrait of Jovan Jovanović Zmaj', placeholder: 'Jovan Jovanović Zmaj', presentation: 'logo', shape: 'square', fit: 'cover' },
    details: [{ heading: 'High School Years', paragraphs: [
      'I attended a general-program gymnasium, where I developed a broad academic foundation and an early interest in science. During high school, I participated in chemistry competitions and science fairs, organized chemistry demonstrations, and gave presentations on biology topics, including disease prevention.',
      'Beyond academics, I was involved in volunteering and peer tutoring, while also actively playing basketball. These experiences helped me develop my curiosity for science, teamwork, and an interest in sharing knowledge with others.',
    ] }],
    gallery: [], links: [],
  },
]

export const experience: Experience[] = [
  {
    id: 'comtrade', title: 'Comtrade System Integration', role: 'AI Engineer', dates: 'Jan 2026–Aug 2026', location: 'Belgrade, Serbia',
    summary: 'Developed enterprise AI solutions ranging from advanced RAG systems to real-time conversational agents. Worked on a no-code voice AI platform for large contact centers, with a focus on knowledge bases, conversation analytics, multilingual speech technologies, and LLM-powered applications.',
    media: { id: 'comtrade', src: comtradeLogo, alt: 'Comtrade logo', placeholder: 'Comtrade', presentation: 'logo', shape: 'square', fit: 'contain' },
    details: comtradeDetails,
    highlights: ['Python', 'Azure', 'Docker', 'RAG', 'LLMs', 'Voice AI'],
    technologies: ['Python', 'Azure', 'Docker', 'RAG', 'LLMs', 'Voice AI'], gallery: [], links: [],
  },
  {
    id: 'daze-solutions', title: 'Daze Solutions Limited', role: 'Data Science Intern', dates: 'December 2024 (4 weeks)', cardDates: 'December 2024', location: 'Remote',
    summary: 'Worked on real estate data analysis and machine learning using Python. Built data preprocessing pipelines, explored property datasets, and applied clustering techniques to identify patterns and visualize insights.',
    media: { id: 'daze-solutions', src: '/media/experience/daze-initial.svg', alt: 'Letter D placeholder for Daze Solutions Limited', placeholder: 'Daze Solutions Limited', presentation: 'logo', shape: 'square', fit: 'contain' },
    details: [
      { heading: 'About the Role', paragraphs: ['During my four-week internship at Daze Solutions Limited, I worked on a data science project focused on processing and analyzing real estate data. The experience gave me hands-on practice with Python-based data analysis, feature engineering, and applying machine learning techniques to real-world datasets.'] },
      { heading: 'Project — Real Estate Data Analysis & Clustering', paragraphs: ['Worked with property datasets stored in PostgreSQL, building a workflow for data preparation, exploratory analysis, and unsupervised machine learning.'] },
      { heading: 'Key Contributions', subsections: [
        { heading: 'Data Processing', paragraphs: ['Extracted, cleaned, and normalized real estate data from PostgreSQL using Python, Pandas, and NumPy.'] },
        { heading: 'Feature Engineering', paragraphs: ['Prepared and transformed property attributes into features suitable for further analysis and machine learning.'] },
        { heading: 'Clustering', paragraphs: ['Applied K-means clustering to group properties based on their characteristics and explore meaningful patterns within the dataset.'] },
        { heading: 'Data Visualization', paragraphs: ['Used Matplotlib to visualize clustering results, compare property groups, and interpret the resulting patterns.'] },
      ] },
      { heading: 'Technologies & Tools', subsections: [
        { heading: 'Programming & Analysis', paragraphs: ['Python, Pandas, NumPy, Jupyter Notebook'] },
        { heading: 'Machine Learning', paragraphs: ['Scikit-learn, K-means Clustering, Feature Engineering'] },
        { heading: 'Data & Visualization', paragraphs: ['PostgreSQL, Matplotlib'] },
      ] },
    ],
    highlights: ['Python', 'Pandas', 'NumPy', 'PostgreSQL', 'Scikit-learn', 'Matplotlib'],
    technologies: ['Python', 'Pandas', 'NumPy', 'PostgreSQL', 'Scikit-learn', 'Matplotlib'], gallery: [], links: [],
  },
  {
    id: 'petnica', title: 'Petnica Science Center', role: 'Research Intern', dates: 'April 2019 – September 2020', cardDates: 'Apr 2019 – Sep 2020', location: 'Petnica, Serbia',
    summary: 'My first experience with scientific research, through intensive seminars in biology and chemistry. Conducted laboratory experiments, explored research methodologies, and learned to document and present scientific findings.',
    media: { id: 'petnica', src: petnicaLogo, alt: 'Petnica Science Center logo', placeholder: 'Petnica Science Center', presentation: 'logo', shape: 'square', fit: 'contain' },
    details: [
      { heading: 'About the Experience', paragraphs: [
        'My first introduction to scientific research came during high school, when I attended several intensive, two-week research seminars at Petnica Science Center, focusing on biology and chemistry.',
        'Through hands-on experiments, research projects, and mentorship, I gained early exposure to the scientific process, from formulating research questions and designing experiments to analyzing results and communicating findings.',
        'The experience introduced me to scientific writing, research presentations, and the importance of critical thinking and evidence-based reasoning. It also sparked a lasting interest in research that continues to influence my academic and professional interests today.',
      ] },
      { heading: 'Research Activities', subsections: [
        { heading: 'Experimental Research', paragraphs: ['Participated in laboratory experiments and research activities in biology and chemistry, gaining practical experience with experimental procedures and scientific investigation.'] },
        { heading: 'Scientific Methodology', paragraphs: ['Learned the fundamentals of research design, hypothesis formulation, experimental methods, and interpretation of results.'] },
        { heading: 'Scientific Writing', paragraphs: ['Practiced structuring and writing research papers and reports, documenting experimental methods, observations, and conclusions.'] },
        { heading: 'Research Communication', paragraphs: ['Prepared and delivered presentations on research topics and experimental findings, developing skills in scientific communication and discussion.'] },
      ] },
      { heading: 'Fields & Skills', paragraphs: ['Biology, Chemistry, Experimental Research, Scientific Methodology, Scientific Writing, Research Presentations'] },
    ],
    highlights: ['Biology', 'Chemistry', 'Experimental Research', 'Scientific Methodology', 'Scientific Writing', 'Research Presentations'],
    technologies: [], gallery: [], links: [],
  },
]

// Import original files so Vite watches replacements and hashes build URLs.
export const hobbies: Hobby[] = [
{ id: 'basketball', title: 'Basketball', summary: '', media: { id: 'basketball', src: basketballImage, alt: 'Pixel-art basketball player dribbling a ball', placeholder: 'Basketball', shape: 'square', fit: 'contain', pixelated: true }, details: [] },
  { id: 'board-games', title: 'Board games', summary: '', media: { id: 'board-games', src: boardGamesImage, alt: 'Pixel-art character playing a board game', placeholder: 'Board games', shape: 'square', fit: 'contain', pixelated: true }, details: [], favorites: [] },
  { id: 'games', title: 'Video games', summary: '', media: { id: 'games', src: videoGamesImage, alt: 'Pixel-art character playing video games with a controller', placeholder: 'Video games', shape: 'square', fit: 'contain', pixelated: true }, details: [], favorites: [] },
  { id: 'fishing', title: 'Fishing', summary: '', media: { id: 'fishing', src: fishingImage, alt: 'Pixel-art angler holding a fishing rod and a fish', placeholder: 'Fishing', shape: 'square', fit: 'contain', pixelated: true }, details: [] },
]
