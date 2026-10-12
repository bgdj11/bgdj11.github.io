# A Personal Universe — Bogdan Djukic

A React + TypeScript + Vite portfolio with an interactive procedural pixel-art universe. Version two retains the real portfolio content and five navigation destinations, replacing the separate biomes with one continuous flight past six celestial bodies.

## Run

With Node.js 22.12 or newer:

```sh
npm install
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

Home, About, Journey, Projects and Contact retain semantic headings, fixed navigation, smooth anchor links and active-section tracking. Featured Projects and More Work come from structured data, with category filters and accessible native project dialogs. CV and contact destinations remain explicitly unavailable until verified links are supplied.

Edit `src/data/portfolio.ts` to update:

- `profile`: name, biography details, email, social URLs and `cvUrl`. Put a real CV PDF in `public/` before attaching it.
- `milestones`: education, experience and interests grounded in the supplied brief.
- `projects`: featured status, category, description, role, technologies, real images and verified links.
- `chapters`: navigation labels and the five stages of the space journey.

Project candidates are labeled placeholders; they are not claims of finished work. Concept artwork is code-native and does not stand in for actual project screenshots. No addresses, results, dates or repository links have been invented.

## Visual system

`src/styles/tokens.css` defines the shared palette, type scale, spacing, surfaces, controls and frame dimensions. All chapters use near-black opaque text panels with stepped gold frames: a black outer outline, bright upper/left bevel, bronze lower/right bevel and dark inner separation. Headings use Pixelify Sans, interface labels use Silkscreen and paragraphs use Inter. Fonts are locally bundled with licenses in `public/font-licenses/`.

Panels occupy approximately 68% of the desktop viewport and the available width on small screens. Text remains a normal DOM layer above the scene: it is never drawn, warped, rotated or scaled by the camera. There are no CSS or canvas gradients, blurry glows, separate biome backgrounds or blackout transitions.

`WorldSection` provides the chapter label, heading, description, framed body and optional footers/aside. Optional custom `scene` content is decorative and inert; the default background is the shared `SpaceScene` mounted once by `App`.

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

## Hosting status

The Sites `create_site` request for `bogdan-pixel-worlds` timed out on 11 October 2026. A subsequent complete owner listing did not contain that site. No project ID or deployment URL was returned, and nothing was published. Do not repeat `create_site` blindly; reconcile the existing registration attempt before trying to host this project. The local Vite application and production build are independent of Sites.
