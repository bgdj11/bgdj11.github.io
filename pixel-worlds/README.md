# A Personal Universe — Bogdan Đukić

A React + TypeScript + Vite portfolio with an interactive procedural pixel-art universe. Six content sections share one continuous flight past six celestial bodies.

## Run

With Node.js 22.12 or newer:

```sh
npm ci
npm run dev
```

This Windows workspace also has a portable Node runtime in `../.tools/`. If Node is not on PATH:

```powershell
powershell -ExecutionPolicy Bypass -File .\dev.ps1
```

Vite prints the local preview address, normally `http://127.0.0.1:5173`.

```sh
npm run typecheck
npm run build
npm run preview
```

## Portfolio content

The interface opens as a retro desktop. All six content windows start open: About, Education and Experience side by side, Projects across the full workspace width, then compact Hobbies and Contact windows side by side. Desktop shortcuts and the taskbar reopen windows; there is no separate header navigation. A seventh desktop shortcut opens the CV in its PDF dialog. Title bars support mouse dragging on wider screens, minimizing, closing, and expanding to the workspace width. Double-clicking a title bar also expands it. The Start menu restores all windows or resets their positions; the small button at the far right of the taskbar shows the planetary desktop and restores the previous windows.

The page remains a normal scrollable document: wheel scrolling over an open window still moves the procedural camera, and exposed planets remain interactive. On narrow screens windows stack, dragging is disabled, and the seven shortcuts form two rows of up to four icons. On short desktop screens the sidebar scrolls so every shortcut remains reachable. Projects shows the complete collection immediately, with two compact featured cards, a three-column archive on wider screens, and the existing category filters. All original entry data, detail dialogs, project URLs, galleries, social destinations, and the resume are retained.

`src/components/Desktop.tsx` owns window state and desktop controls; `WorldSection.tsx` places existing content inside that window shell. `src/styles/desktop.css` supplies the desktop presentation, with local Pixelify Sans for interface labels, Press Start 2P headings, and Inter body copy. Desktop icons are copied from the supplied retro computer pack; the mapping is documented in `public/media/desktop/SOURCES.md`. The shared `SpaceScene` and planet renderers are unchanged.

Home, Education, Experience, Projects, Beyond Code and Contact have semantic headings, persistent navigation, smooth anchors and active-section tracking. Featured Work uses compact two-column cards with a small image and summary inside one frame. More Work uses a denser three-column thumbnail grid. Whole cards open details; both grids collapse on smaller screens. Education, experience, projects and hobbies share accessible detail dialogs. Every CV button opens the same in-page PDF window, with a persistent download action. Resume availability is verified before enabling the controls.

The app is self-contained: profile images are bundled from `src/assets/profile/`, with no build imports from the root design-asset folders. `src/components/Resume.tsx` owns shared CV state and actions; `ResumeDialog.tsx` opens the accessible modal and lazily loads the existing PDF renderer.

Edit `src/data/portfolio.ts` to update:

- `profile`: introduction, portrait, social URLs and resume settings. Put the actual PDF at `public/Bogdan_Djukic_CV.pdf`, or configure another path.
- `education`, `experience`, `hobbies`: entries and expandable details grounded in the supplied brief.
- `projects`: featured status, ordering, categories, descriptions, contribution, technologies, media and verified links.
- `chapters`: labels, headings and theme mapping for the six content sections.

Project candidates are labeled drafts; they are not claims of finished work. Missing photographs and screenshots use neutral framed placeholders. No addresses, results, dates or repository links have been invented. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for local asset paths, image sizing, galleries, GIF/video previews, detail blocks, favorites and the PDF resume.

## Visual system

`src/styles/tokens.css` defines the underlying design tokens; `src/styles/desktop.css` adds teal window frames, raised title-bar controls, inset records, desktop shortcuts, and the taskbar. Headings use Press Start 2P, desktop labels use Pixelify Sans, and paragraphs use Inter. Fonts are locally bundled with licenses in `public/font-licenses/`.

The desktop uses a two-column workspace with a centered About window, paired Education and Experience windows, a full-width Projects window, and paired Hobbies and Contact windows. On tablets and phones, windows stack into one column. Text remains a normal DOM layer above the scene; scrolling never draws, rotates, or scales it with the camera. Transparent gaps pass pointer input to the planetary background.

`WorldSection` provides the chapter heading, description, body, and optional footer/aside inside `DesktopWindow`. The shared `SpaceScene` is mounted once by `App`. Detail dialogs retain their independently scrollable content and nearly full-screen mobile layouts.

## Interactive space

`src/components/SpaceScene.tsx` owns a single fixed canvas, viewport sizing, the page camera, input and animation lifecycle. `src/scenes/space.ts` projects the seeded starfield, planets, rings, orbiting moons and a small distant sun. `planetSurface.ts` generates spherical surface atlases: terrestrial continents, rocky craters, icy plates, turbulent gas bands and volcanic fissures. `spaceTypes.ts` defines the renderer/input contract. Earlier biome renderers remain as unmounted source references; they are not imported by the version-two app.

Scrolling moves the camera along a curved path past Aurelia, Vesper, Nereid, Solis, Ember and Caelum. Depth projection makes approaching planets grow and passed planets leave the view; camera yaw, pitch and roll move their perspective together with the starfield. Planet trajectories follow the camera projection independently of the text panels, which can naturally occlude them. Subtle pointer parallax adds depth on devices with a mouse. The sun remains a distant reference rather than expanding over the final chapter.

The exposed parts of all six bodies are interactive:

- Drag horizontally to rotate around the axis and vertically to tilt the sphere.
- Focus a planet and use the arrow keys; Shift increases the step.
- Press Home to restore its orientation; Enter or Space advances rotation.
- Mouse-wheel scrolling remains normal over planets. Touch controls allow vertical page scrolling.

Rotation changes spherical texture sampling, not a CSS rotation of a flat image. Each planet retains its own orientation. Transparent hit areas follow the rendered sphere positions and depth ordering, stay behind the opaque content frames, and are hidden outside the view.

## Motion and performance

The shared scheduler limits animation to 24 frames per second. One viewport-sized canvas uses at least three CSS pixels per logical pixel, ignores device DPR and caps buffers at 480 pixels wide, 1,200 pixels high and 300,000 total pixels. Crisp nearest-neighbor enlargement preserves the pixel grid. Renderer loops and detail counts are bounded; sphere geometry and material textures are cached.

Seeds come from `crypto.getRandomValues` once per page load, preserving each generated planet through navigation, resizing and React StrictMode. Reloading varies coordinated colour families, continent scale, land coverage, clouds, polar ice, crater density, plate fractures, gas bands and storms. Opening and final terrestrial worlds always receive different palette families. Sizes vary within 87–113% of their base values; axial tilt, spin, ring presence/width/colour and zero to two moons also vary. The opening planet retains its rings. Traits are sampled once and textures are baked once: no new randomness is introduced during animation. Planet classes and flight-path coordinates remain fixed so this variety does not alter the continuous camera movement.

Hidden documents unsubscribe from animation. Reduced motion freezes automatic rotation, inertia, pointer parallax and the scroll camera, while deliberate drag/keyboard rotation still works. Preference changes take effect without reloading. Resize and content observers keep the camera range current after project filtering. Listeners, pointer capture and scheduler subscriptions are cleaned up on unmount.

If canvas rendering is unavailable, the portfolio content remains usable against a dark background.

## Validation

Run `npm run build` for TypeScript and the production bundle. Local browser checks and screenshots live in ignored `.qa/`; their Playwright tooling is outside the application in `../.tools/qa/`.

The version-two checks cover the continuous canvas, actual two-axis mouse rotation, keyboard/reset behavior, scroll camera, normal wheel scrolling, reduced motion, hidden-document event handling, stable seeds on resize, fresh seeds on reload and mobile/desktop layouts. The portfolio checks cover navigation, filters, dialogs, focus restoration and automated accessibility. A controlled visibility event in headless Chrome checks lifecycle code; it does not simulate an actual operating-system background tab.

## GitHub Pages deployment

The repository includes [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml). It builds `pixel-worlds/` and deploys the generated `dist/` artifact on every push to `main` or `v2`; it can also be started from the Actions tab.

Before the first deployment, open the GitHub repository’s **Settings → Pages** and set **Source** to **GitHub Actions**. Then commit and push the workflow together with the portfolio files:

```powershell
git add README.md .github pixel-worlds
git commit -m "Deploy portfolio with GitHub Pages"
git push origin v2
```

The workflow passes the actual Pages base path from `actions/configure-pages` to Vite using `PAGES_BASE_PATH`, supporting repository sites, user sites, and custom domains. Outside the workflow, local builds default to `/`. To test a repository path locally in PowerShell, set `$env:PAGES_BASE_PATH = "/website"` before `npm run build` and `npm run preview`. For `bgdj11/website`, the deployed portfolio URL will be `https://bgdj11.github.io/website/`. Public media, frames, PDFs, slide viewer resources and social icons are resolved through Vite’s base URL, so they work under that subpath as well as locally.
