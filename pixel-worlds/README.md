# Pixel Worlds — Bogdan Djukic

A React + TypeScript + Vite portfolio based on `../PORTFOLIO_PIXEL_WORLDS_FINAL_BRIEF.md`, with a shared pixel-art visual system and first-pass animated procedural worlds.

## Run

With Node.js 22.12+ (24 LTS recommended):

```sh
npm install
npm run dev
```

This Windows workspace also includes a verified portable Node runtime in `../.tools/`. Use the launcher if Node is not on your PATH:

```powershell
powershell -ExecutionPolicy Bypass -File .\dev.ps1
```

The server prints its local URL, usually `http://127.0.0.1:5173`.

```sh
npm run typecheck
npm run build
npm run preview
```

## What is implemented

- Five semantic chapters: Universe/Home, Sky/About, Mountains/Journey, Botanical/Projects, and Underwater/Contact.
- A fixed responsive navigation bar, smooth anchor links, active section tracking, desktop chapter navigation, and a skip link.
- Shared typography, spacing, colors, buttons, framed opaque panels, and coordinated biome accents.
- Data-driven featured projects and an archive with category filters, empty states, and keyboard-accessible native detail dialogs.
- Independent decorative scene slots and seeded low-resolution canvas backgrounds. One shared animation loop; no WebGL, animation dependencies, or continuous scroll handlers.
- Locally bundled fonts and reduced-motion support. Text remains separate from artwork.

## Add real content

Edit `src/data/portfolio.ts`:

- `profile` contains identity, email, social destinations, and `cvUrl`. Add a real PDF under `public/`, then set `cvUrl` to its path (for example `/bogdan-djukic-cv.pdf`).
- `milestones` contains education and experience. Exact dates and accomplishments were not supplied and are not fabricated.
- `projects` supports category, featured status, year, summary, longer description, role, technologies, preview artwork, images, links, and status.
- Select 3–4 featured projects by changing `featured`. Botanica stays in More Work by default.
- Add original screenshots under `public/projects/` and supply image paths and alt text. The first image replaces the concept artwork. Add verified repository/demo links and update the status after the content is ready.

The supplied brief establishes Bogdan's identity, institutions, role, and direction. Project candidates are **explicit editorial placeholders**, not completed case studies or claims of results. Missing contact links are shown as unavailable, and the CV action explains that the PDF has not been attached. No invented addresses or dead links are used.

## Shared visual system

`src/styles/tokens.css` is the source of truth for the color palette, fluid type scale, line heights, spacing rhythm, content measure, panel surfaces/borders/corners, control sizes, focus rings, pixel grid, and motion durations. Responsive changes adjust these tokens rather than shrinking metadata throughout individual components.

Five `data-theme` palettes share the same dark pixel-art UI while varying the panel tint, primary/secondary accents, and scene atmosphere:

| Chapter | Palette |
| --- | --- |
| Universe | Violet, gold, and cyan highlights |
| Sky | Blue and peach |
| Mountains | Indigo and coral |
| Botanical | Forest green, lime, and amber |
| Underwater | Deep teal, cyan, and periwinkle |

Semantic surface and border tokens resolve at each theme boundary; buttons, archive cards, timeline markers, and panels inherit the same palette. The fixed navigation and dialog inherit the active chapter's theme. Editorial panels remain opaque.

Headings use **Pixelify Sans**; navigation, buttons, and technical labels use **Silkscreen**. Paragraphs use Inter for readability. All fonts are bundled locally. Their license notices are included in `public/font-licenses/` and copied into the production build.

The pixel UI includes stepped panel corners, beveled buttons with pressed states, crisp 16×16 icons, chapter emblems, and hard offset shadows. Editorial frames have an 8px black outer rim and a 3px biome-colored inner bevel; project cards retain thinner borders. The same reusable polygon token provides the frame shape, with separate notch sizes for large panels and small controls. Only decorative pseudo-elements are clipped, preserving keyboard focus outlines on real controls.

`src/styles/global.css` contains shared layout and controls. `src/styles/scenes.css` isolates decorative CSS and concept artwork. All worlds use flat colours and integer raster geometry: there are no CSS/canvas gradients or blur effects. Every chapter shares a nearly black background and a centered, opaque editorial frame occupying 68% of the desktop viewport. Large procedural forms are anchored to the frame edges and intentionally extend behind it. Below 900px panels use the available width, with a short area of scenery above them. Paragraphs remain at least 15px.

Chapter entry and exit move the scene camera along alternating arcs, with zoom and depth-dependent parallax. Universe and Botanical also have restrained camera rotation; cloud and water horizons stay level. The scenes stay intact throughout the transition: there is no pixel dissolve or blackout. Layered foreground contours take the shape of the next biome and move at different speeds in browsers supporting scroll timelines. Reduced motion disables all of these effects. Neither transitions nor procedural renderers cover or transform text panels, and normal anchor scrolling remains intact.

## Extend the worlds

`WorldSection` in `src/components/WorldSection.tsx` owns the chapter line, heading, readable panel, content body, and decorative scene. All five sections use this component, including Home and Contact.

```tsx
<WorldSection
  id="about"
  chapterTitle="Sky"
  theme="sky"
  eyebrow="A little perspective"
  heading={<>Curiosity is the common thread.</>}
  description="An engineering foundation. A visual imagination."
  scene={<YourDecorativeScene />}
>
  <YourAboutContent />
</WorldSection>
```

`chapterTitle` and `theme` default to chapter data. Omit `scene` for the biome's built-in procedural background. `children` provides body content; `lead`, `aside`, `panelFooter`, and `footer` provide optional composition slots. `layout` accepts `editorial` (default), `hero`, or `closing` while retaining the same typography/panel system. Home receives the page's single `h1`; other chapters receive `h2` headings associated with their sections.

Every scene slot is automatically wrapped in a decorative, inert, clipped layer that ignores input, even for a custom renderer. All code-native illustrations are original placeholders.

### Procedural backgrounds

`ProceduralScene` owns canvas sizing, palette resolution, visibility, camera transitions, and cleanup. Renderer factories in `src/scenes/` receive a `SceneFrame` containing the drawing context, logical size, active animation time, scroll position, biome palette, frame-relative focal coordinates, scene width, and a compact-layout flag. `seeds.ts` draws fresh seeds once per page load with `crypto.getRandomValues`: worlds vary after reloading but stay stable through resizing, navigation, and React StrictMode. A custom `scene` replaces the default renderer and should follow the same motion and resource limits.

| World | Procedural effects |
| --- | --- |
| Universe | Two generated spherical terrain atlases, rotating planets with quantized lighting, depth-sorted rings, sparse stars and orbital details, an occasional comet |
| Sky | Seeded, layered cumulus clouds with a limited slate palette, visible lateral drift, gentle vertical movement and depth-dependent parallax |
| Mountains | Four cached alpine ranges with asymmetric summits, chipped shoulders, diagonal shadows, branching erosion cuts, fractured ledges, small snowcaps and sparse fog/snow |
| Botanical | Two independently grown 3D space-colonization trees framing the panel, dark silhouette outlines, tapered branches, depth-sorted leaves, curved fern fronds and sparse fireflies |
| Underwater | Side-on water cross-section with four seeded wave frequencies, low rolling contours, moving cyan/mint surface reflections, broken ripple rings, refracted light shafts and sparse rising bubbles |

The botanical geometry follows the attractor/branch influence approach described in [Modeling Trees with a Space Colonization Algorithm](https://algorithmicbotany.org/papers/colonization.egwnp2007.html). Each tree grows once per mount, bounded to 420 attractors, 380 nodes and 64 iterations, using an independent seeded stream. Both share a raster atlas and composed canopy cache. Terrain combines piecewise summit profiles, noise-chipped edges and scanline-rasterized faces; its erosion details are baked into the layer cache. Water uses seven refracted shafts, 120 seeded reflection strokes and ten bubbles, with fewer reflections and bubbles on compact screens. Its surface and clipped underwater detail follow the shared 24fps clock, using discrete palette steps without gradients or extra optical textures. All implementation and raster artwork are generated locally; no generated bitmap assets or remote textures are used.

Rendering is capped at 24 frames per second through a single shared scheduler. IntersectionObserver unsubscribes off-screen worlds; hidden tabs unsubscribe every world. Local animation clocks pause with their scenes, avoiding a catch-up jump. Reduced-motion users receive a still composition with no scroll parallax, including when the preference changes while the page is open. No animation frame is scheduled when there are no active scenes. Missing visibility observation also falls back to a still frame.

The canvas uses at least three CSS pixels per logical pixel, ignores device DPR, and caps buffers at 480 pixels wide, 1,200 pixels high, and 300,000 total pixels. ResizeObserver adapts the viewport-sized stage; adding content or changing project filters never stretches the scene. Drawing primitives snap to integer pixels and CSS uses nearest-neighbor enlargement. Theme surfaces use CSS tokens, with fixed detail palettes for each renderer. Mountain layers are raster-cached on resize and the planet terrain atlas is generated once. Static CSS silhouettes remain available if the 2D context is unavailable or lost.

All animation stays in the inert scene layer behind the opaque frames. Panels and typography are neither drawn onto the canvas nor transformed by the scene renderers. Observers, preference/visibility listeners, and frame subscriptions are removed on unmount.

## Scope

This implements the foundation, shared pixel-art visual style, content-centered composition, and procedural worlds. The botanical canopy is raster-cached at 10 updates per second while fireflies retain the shared 24fps clock. Leaf shapes reuse a bounded atlas (32 directions, at most two 1024×1024 pages) instead of rerasterizing every outline and vein on every frame. Final project curation/media, verified contact URLs, and the final CV still require real content.

## Validation

The TypeScript/production build passes. Chromium checks covered section navigation and highlighting, project filters and their empty state, native project/CV dialogs, Escape dismissal and focus restoration, reduced motion, and widths of 320, 375, 390, 600, 768, 1024, 1440, and 1920 pixels. No horizontal overflow or browser errors were found. Automated axe WCAG A/AA checks reported no violations for the page or the open project dialog; this does not replace a full manual accessibility audit.

The visual-system pass also verified normal-motion smooth navigation, headings remaining below the fixed navbar, finite chapter-entry animations, and switching reduced-motion preferences at runtime. The brighter pixel-art pass was checked again across all eight widths, including a fix for the 320px navigation layout, with automated accessibility scans passing for the page and project dialog. Screenshots of all five desktop biomes and the mobile layout were reviewed.

Local QA scripts and screenshots are retained in ignored `.qa/`; browser tooling is outside the application in `../.tools/qa/`.

The procedural pass additionally checks that all five visible canvases change over time, off-screen canvases freeze (including sections only touching viewport boundaries), reduced-motion changes freeze/resume rendering, and buffers stay within their limits at five viewport widths and DPR 1/2. Desktop and mobile screenshots were reviewed. Instrumented animation-frame checks found one shared pending frame while active and none when motion is paused. Short desktop runtime samples found no ongoing layout/style work from the scenes; these are development-mode observations, not a low-end-device benchmark. The visibility-change listener path was tested with controlled document visibility; headless Chrome did not provide a real hidden-tab state, so that browser behavior remains a manual check. Existing navigation, filters, dialogs, responsive layout, and automated accessibility checks still pass.

The composition revision also checks centered 68%-width panels, unchanged seeds through resize, fresh worlds on reload, desktop/mobile framing, the absence of rendered gradients and blur, and scroll-driven zoom/rotation isolated from text. Generated terrain, branches, leaves, planet shading and waves are all code-native.

## Hosting status

The Sites `create_site` request for `bogdan-pixel-worlds` timed out on 11 October 2026. A subsequent complete owner listing did not contain that site. No project ID or deployment URL was returned, and nothing was published. Do not repeat `create_site` blindly; reconcile the existing registration attempt before trying to host this project. The local Vite application and production build are independent of Sites.
