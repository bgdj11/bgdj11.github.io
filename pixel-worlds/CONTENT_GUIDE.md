# Editing the portfolio

All personal content and file paths live in `src/data/portfolio.ts`. No layout changes are needed to add media or fill out entries. Current draft entries do not claim finished work, dates, results or preferences that have not been supplied.

## Sections and content

`chapters` defines the six stable anchors in order: `home`, `education`, `experience`, `projects`, `beyond-code`, `contact`. Each chapter has its own editable heading, optional description and theme mapping. All six currently use the existing continuous space background; there is no extra canvas per chapter and no replacement of the planet renderer.

- `profile`: introduction, portrait, social links and resume configuration.
- `education`: institution name in `title`, parent university in `subtitle`, separate `credential` and `degree`, optional dates/location, `credits` and `gpa`. The institution and small logo sit alongside the degree and summary on desktop, stacking on mobile. Use `presentation: 'logo'` in its media object; leave its `src` absent if no verified logo is available. Whole education, experience and hobby entries open details, including through the keyboard-focusable title; no separate “View details” label is shown.
- `experience`: employer, role, optional dates, technologies, media and details.
- `projects`: category, summary, optional year/contribution/technologies, media and details. Set `featured: true` for the compact two-column selection with 150 px previews. More Work uses smaller thumbnail entries, three across on wide screens. Whole cards open details, with no extra action buttons. Array order controls ordering within each group.
- `hobbies`: Basketball, Board games, Video games and Fishing, with photographs, galleries and optional favorites.

Every entry supports `details`, `gallery` and `links`. Remove `placeholderNote` after replacing a draft with verified content. Optional fields and empty collections are omitted. Use unique, stable IDs; project URLs use `?project=visual-reasoning#projects` and support reload, Back and Forward.

## Local photographs and screenshots

The home portrait and four hobby illustrations are imported directly from the repository's `images/` folder (next to `pixel-worlds/`): `me.jpg`, `basketabll.png`, `board_games.png`, `gaming.png`, and `fishing.png`. Replace these files using the same names to update them in development and on the next build. If you rename a file, update its import at the top of `src/data/portfolio.ts`. Vite generates content-hashed production URLs so changed images get new URLs. Keep `images/` in the repository when building on another machine. Old copies in `public/media/` are no longer used for these five images.

Put files in `public/media/`, then use `/media/filename.webp` as `src` (do not include `public` in the URL). The directory is yours to organize into subfolders. Filenames are case-sensitive on many hosts.

Replace a media object with, for example:

```ts
portrait: {
  id: 'portrait',
  src: '/media/portrait.webp',
  alt: 'Describe your actual portrait here',
  placeholder: 'Portrait photograph',
  shape: 'portrait',
  width: 900,
  height: 1200,
  fit: 'cover',
  position: '50% 35%',
}
```

Supported shapes are `portrait`, `square`, and `landscape`. Explicit `width`/`height` reserve the original aspect ratio; otherwise the shape supplies a ratio. Use `fit: 'contain'` for screenshots and photographs that must be shown completely; use `cover` and `position` for intentional cropping. Project list previews use a consistent landscape crop; the detail view contains the full image. Actual photos remain clear; `pixelated: true` is an explicit opt-in.

Leave `src` absent until you have a file. The frame then shows a local CSS/SVG placeholder without an external image request. Failed media uses a readable fallback. Always supply meaningful `alt` text when adding real content. Optional `caption` appears below the frame.

The home portrait loads eagerly with high priority. Other images and gallery thumbnails load lazily and decode asynchronously. Animated media does not autoplay. To avoid shipping camera-sized originals, export appropriately sized WebP/AVIF or JPEG files before placing them in `public/`; Vite copies these assets without recompressing them. For responsive alternatives:

```ts
src: '/media/campus-1200.webp',
srcSet: '/media/campus-600.webp 600w, /media/campus-1200.webp 1200w',
sizes: '(max-width: 600px) 90vw, 40vw',
```

Only reference variants you have actually exported. Use roughly 600–900 px images for cards and 1200–1600 px for larger detail images, adjusting to your content and file size.

## Galleries, GIFs and video

Add media objects to an entry's `gallery`. The shared dialog offers a large preview, Previous/Next controls, selectable thumbnails and captions. It also supports portrait and square images without stretching.

```ts
gallery: [
  {
    id: 'result-one', src: '/media/project/result.webp',
    alt: 'Describe the real result', caption: 'Explain this image',
    placeholder: 'Result screenshot', shape: 'landscape', fit: 'contain',
  },
  {
    id: 'animation', kind: 'gif', src: '/media/project/preview.gif',
    poster: '/media/project/preview-still.webp',
    alt: 'Describe the animation', placeholder: 'Animation preview',
  },
  {
    id: 'demo', kind: 'video', src: '/media/project/demo.mp4',
    poster: '/media/project/demo-poster.webp',
    alt: 'Describe the demo', placeholder: 'Video preview',
    captionsSrc: '/media/project/demo.en.vtt',
  },
]
```

GIFs require an explicit Play action, even without reduced-motion preferences. Provide a still `poster` for a calm preview. Video uses native controls, `preload="none"`, and loads its source when visible. Off-screen/hidden-tab animations stop; videos pause. Project cards use posters for animated media, with playback inside the detail view. Prefer a compressed MP4/WebM over a large GIF for longer footage. Add WebVTT captions for speech and describe important visual information in the adjacent text. Codec compatibility depends on the supplied file and browser; actual footage should be checked when added.

## Rich detail content

Use blocks to cover the information appropriate to an entry. For a project, these can be Goal, Approach, Implementation, Technical challenges, My contribution and Results. For experience, use Overview, Responsibilities and Technical contributions. Education can use Coursework and Academic projects.

```ts
details: [
  { heading: 'Approach', paragraphs: ['Your verified explanation.'] },
  { heading: 'Responsibilities', items: ['Your actual responsibility.'] },
],
links: [
  // Add only real destinations:
  // { label: 'Source on GitHub', url: 'https://github.com/your-account/your-repo' },
  // { label: 'Live demo', url: 'https://your-demo.example' },
  // { label: 'Play on itch.io', url: 'https://your-account.itch.io/your-game' },
],
```

Hobbies additionally accept `favorites: [{ title, category?, note?, media? }]`. Fill these with your own games/books/collections; there are no invented favorites. Keep professional information concise on the main page and put longer material in the shared detail dialog.

## Contact and PDF resume

The supplied `Bogdan_CV.pdf` has been installed as `public/Bogdan_Djukic_CV.pdf`. Education, professional experience, scholarships, academic activities and contact links have been filled from that document. The first two hobby slots and unverified project details remain placeholders. The current master's degree ends in September 2028 in the CV; the site explicitly labels that as expected completion.

Set `profile.socials` URLs to verified `https://` addresses or a `mailto:` address. Missing URLs render as non-clickable text, not dead links. Add Instagram by adding an item with `kind: 'instagram'`.

Place the actual PDF at `public/Bogdan_Djukic_CV.pdf`. That is the default `profile.resume.url`; change it if you prefer another path. View CV / View Resume open that PDF in a new tab; Download PDF downloads the same file. A small signature check prevents the static host's HTML fallback from being mistaken for a PDF. Until the file exists, all actions are disabled with a clear missing-PDF state. Reload after adding or replacing the file.

Optionally export the PDF's first page to an image and put its path in `profile.resume.thumbnail.src` with suitable alt text. The thumbnail is separate from the actual PDF and is not generated automatically.

## Shared visual components

`WorldSection` and `ContentPanel` retain the chapter structure. `FramedImage`/`PixelFrame`, the academic and timeline entries, project cards, `HobbyCard`, `ImageGallery`, `SocialLink`, `ResumePreview` and `DetailDialog` are reused throughout. Frames use the same local nine-slice SVG at `public/frames/gold-pixel.svg`; palette and spacing remain in `src/styles/tokens.css`.

Dialogs are up to 1240 px wide and almost viewport-height, with scrollable content, a sticky close action, focus containment/restoration and Escape support. Mobile dialogs use nearly the full screen. There are no automatic blocking overlays. The procedural canvas, seeds, camera paths and planet interaction are unchanged.
