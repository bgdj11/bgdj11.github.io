# Pixel Worlds Portfolio — Final Build Brief

> **Status:** final concept brief for implementation with Codex  
> **Version:** 2.0  
> **Date:** 11 Oct 2026  
> **Owner:** Bogdan Djukic  
> **Goal:** build a memorable, scroll-driven personal portfolio that presents education, experience, projects and CV through a unified **dark pixel-art procedural world**.

---

## 1) Executive summary

This portfolio is **not** a generic personal website and **not** just a graphics sandbox.
It is a **single-page portfolio told as a journey through five generated worlds**:

1. **Universe** — hero / identity / first impression  
2. **Sky** — about / interests / current focus  
3. **Mountains** — journey / education / experience  
4. **Botanical World** — featured projects + more work  
5. **Underwater** — contact / links / closing section  

Every section should feel like a complete scene, with its own procedural background and subtle animation, but the whole site must still feel like **one coherent product**.

### Core creative decision

Even if the underlying generation technique differs per scene, the final visual output should be unified through a **shared dark pixel-art / pixelized treatment**:

- dark atmosphere overall  
- pixel-art feeling or pixelized rendering  
- limited palettes per biome  
- soft animation  
- consistent UI panels and typography  
- readable text, not overwhelmed by effects  

### Core UX rule

The site must work in **two parallel modes**:

- **Fast recruiter mode**: click navbar → instantly reach About / Journey / Projects / Contact / CV  
- **Exploration mode**: scroll through generated scenes, enjoy animation and atmosphere  

The procedural scenes create memorability; the navigation guarantees usability.

---

## 2) Final positioning

The portfolio should communicate the following:

- You are not just a student with a few demos.
- You have background across **AI engineering, visual computing, computer vision, procedural graphics and game development**.
- You can build visually interesting systems, not just talk about them.
- You care about both **technical depth** and **artistic presentation**.
- You are aiming toward **computer graphics / vision / animation / creative AI / R&D-type internships**.

The site should leave the impression:

> “This person has taste, technical ability, and a strong graphics/vision identity.”

---

## 3) What should be shown vs. what should not

### 3.1 Featured vs secondary hierarchy

One of the most important changes from the previous draft:

**Botanica should NOT be the main featured project by default.**  
It is a nice project, especially because it aligns with the botanical section, but it is not necessarily your strongest flagship item.

Instead, split your work into **three levels**.

### Tier A — Main featured projects

These should appear as the primary highlighted case studies.
Choose **3 or 4 maximum**.

A Tier A project should satisfy most of the following:

- visually presentable  
- technically meaningful  
- relevant to graphics / vision / AI / games  
- easy to explain in 1–2 sentences  
- ideally has real screenshots, demo footage or outputs  
- represents your current or intended direction  

**Likely Tier A candidates** (final choice to be confirmed by you):

1. **Neuro-symbolic VQA / thesis-related visual reasoning project**  
   Strong academic/technical anchor. Good for “serious” side of the portfolio.

2. **Best game-dev / graphics project**  
   Most likely your Godot game project or another visually presentable interactive work.

3. **One strongest AI engineering / applied systems project**  
   Could represent your Comtrade background or another technically heavy project, described non-confidentially.

4. **One strongest visual / graphics / CV project**  
   Example: panorama / vision pipeline / graphics coursework / rendering-related piece / current best course project.

> If you do not yet have 4 strong polished projects, show **3 strong featured projects** instead of forcing a weak fourth.

### Tier B — Secondary projects / More Work

These are real and valuable, but should not dominate the landing impression.

Examples:

- Botanica Algorithmica  
- Space Shooter  
- smaller games  
- computer graphics dumps / exercises  
- computer vision notebooks / assignments  
- shader sketches  
- curve / particle experiments  
- course mini-projects  
- systems / backend / other technical work worth preserving

These should appear in a **More Work** or **Archive / Small Projects** grid inside the Projects section.

### Tier C — Micro-experiments / decorative technique demos

These are not really “portfolio projects” in the same sense. They can be:

- tiny particle demos  
- standalone plant variations  
- isolated shader playgrounds  
- one-off rendering tests  
- tiny proof-of-concept interactions

These should support the vibe of the site and maybe appear as mini previews or part of the background, but they should not crowd the core portfolio story.

---

## 4) Unified visual direction

### 4.1 Main art direction

The entire site should feel like:

- dark  
- atmospheric  
- slightly game-like  
- pixelized / pixel-art-inspired  
- procedural  
- tasteful rather than chaotic

Even though each world is different, they should all feel like part of the same universe.

### 4.2 Pixel-art strategy

Do **not** interpret “pixel art” as “everything must be hand-drawn sprite art.”

Instead, use a broader strategy:

- generate worlds procedurally  
- render them cleanly  
- then apply a **pixelization / palette / dithering treatment**  
- keep the final output stylized and consistent  

This avoids needing massive custom sprite production.

### 4.3 Shared style rules

Across all sections:

- dark background around content  
- readable framed content panel  
- same font system  
- same button system  
- same navbar  
- same spacing rhythm  
- same transition language  
- same pixelized rendering philosophy

### 4.4 Suggested style tokens

These are starting suggestions, not strict rules.

#### Fonts

- **Headings:** Space Grotesk or Sora  
- **Body:** Inter or IBM Plex Sans  
- **Technical labels / metadata:** IBM Plex Mono  
- optional very small pixel font only for in-scene labels, not long text

#### Global colors

Base dark colors:

- `#0B1020` — deep navy-black  
- `#141A2E` — dark blue  
- `#1C243B` — panel dark  
- `#F0E7D5` — warm off-white text panel content  
- `#A7B7D6` — cool light accent  

Biome accents can vary slightly, but stay within a coherent dark range.

#### Panels

Text should sit in a clear content frame:

- readable card/panel  
- mostly opaque or highly readable surface  
- subtle border  
- strong contrast  
- not too glassy  
- not a generic SaaS card look

#### Pixel treatment

Global visual treatment options:

- render low-res and upscale with nearest-neighbor  
- palette quantization  
- subtle ordered dithering  
- tiny amount of vignette  
- optional scanline-free pixel crispness (do not overdo retro filters)

---

## 5) Site structure

### Fixed navbar

Always visible top navigation:

- Home  
- About  
- Journey  
- Projects  
- Contact  
- CV

Behavior:

- smooth scroll to section  
- active section highlight  
- works on desktop and mobile  
- CV opens/downloads directly  
- navbar must remain readable regardless of scene background

### Page structure

A single-page scroll site with **five large sections**.
Each section should feel close to **100vh minimum**, but Projects and Journey may naturally expand beyond one screen because content matters more than strict visual symmetry.

---

## 6) Section-by-section design

# 6.1 Section 1 — Universe / Home

## Purpose

Immediate first impression and identity.

## Content

Must clearly show:

- **Bogdan Djukic**  
- MScT Visual and Creative AI @ École Polytechnique  
- specialization line: Computer Graphics · Computer Vision · Creative AI  
- short value statement  
- CTA buttons:
  - View Projects
  - Download CV
- small GitHub and LinkedIn links

### Suggested headline

> I build things that move, see and come alive.

or

> Visual computing, procedural worlds and intelligent systems.

## Scene idea

Generated outer-space scene:

- star field  
- 3–5 planets or one central planet with satellites  
- ambient particle effects  
- slow drift / orbit motion  
- subtle parallax  
- all rendered in unified dark pixelized style

## Animation behavior

- stars twinkle softly  
- planets orbit or rotate slowly  
- maybe one or two tiny moving particles / meteor streaks  
- no aggressive movement  
- should remain calm and elegant

## Algorithms / implementation ideas

Good sources to adapt or learn from:

- procedural planet generation refs  
- pixel planet shader concepts  
- starfield particles  
- seeded orbit motion

Potential directions:

1. **2D pixel-art style planet generator**  
   Use pre-existing shader/math references and port/adapt.

2. **3D procedural sphere rendered and pixelized**  
   Slightly more advanced, but more flexible.

3. **Hybrid**  
   Generate low-poly planets and apply pixel-style post-processing.

### Recommended practical route

Start with the easiest route that gives strong output quickly:

- render planets procedurally  
- apply pixelization/dithering  
- keep logic simple  
- do not over-engineer the first section

---

# 6.2 Section 2 — Sky / About

## Purpose

Introduce who you are in a personal but still professional way.

## Content

A compact About block:

- short intro  
- Serbia / Novi Sad background  
- now at École Polytechnique  
- interests: graphics, vision, animation, game-dev, creative AI  
- mention transition from AI engineering toward visual/creative computing  
- optional note on what kind of internship/work you are looking for

## Scene idea

Generated sky:

- clouds  
- layered atmosphere  
- maybe light precipitation or drifting particles  
- maybe a day/night-ish tonal variation, but keep dark overall

## Animation behavior

- clouds drifting  
- occasional light rain/snow if aesthetically appropriate  
- subtle ambient motion only

## Algorithms / implementation ideas

- layered Perlin/simplex/fBm cloud generation  
- cloud sprites generated or stylized via pixel post-process  
- light precipitation particles  
- gradient sky with palette control

## Design note

This section should feel lighter and more open than the space section, but still clearly part of the same site.

---

# 6.3 Section 3 — Mountains / Journey

## Purpose

Present education and experience as a journey.

## Content

Timeline / path structure:

1. **FTN / University of Novi Sad**  
   Bachelor’s degree, thesis theme, technical foundation.

2. **Comtrade System Integration**  
   Junior AI Engineer, key responsibilities and kinds of systems built.

3. **École Polytechnique**  
   MScT Visual and Creative AI, current studies and direction.

4. **Next step / internship goal**  
   Targeting graphics / vision / animation / creative AI R&D internships.

## Scene idea

Generated mountain landscape:

- layered silhouettes or terrain ridges  
- maybe fog or contour lines  
- maybe a path-like curve visually connecting milestones

## Animation behavior

- slow parallax between mountain layers  
- maybe moving mist  
- maybe subtle particle drift  
- maybe a small animated journey line/path

## Algorithms / implementation ideas

- 1D or 2D noise terrain generation  
- fBm ridge layers  
- parallax scrolling layers  
- optional contour-line post-process  
- SVG or canvas path line connecting timeline entries

## UX note

The text content here matters a lot.  
Do not bury the timeline in heavy visual noise.

---

# 6.4 Section 4 — Botanical World / Projects

## Purpose

This is the most important section after the hero.
It must showcase your strongest work clearly.

## Structure

This section should be split into:

1. **Featured Projects**  
2. **More Work / Project Archive**

## Scene idea

Generated plant / curves world:

- branching forms  
- L-system-inspired silhouettes  
- spline-based decorative growth  
- pixelized plants around the edges

## Animation behavior

- gentle growth/reveal when section enters viewport  
- maybe slight swaying motion  
- not constant chaotic regeneration

## Featured project layout

Use 3–4 large cards.
Each should include:

- title  
- one-line summary  
- tags / stack  
- screenshot or short gif  
- short role description  
- button or click to open details

### Important project-selection note

Do **not** automatically make Botanica one of the top 1–2 items unless it truly deserves it after visual review.
It can still appear in Featured if the presentation is strong, but it should not be forced as the main flagship.

### Suggested featured buckets

Instead of hard-locking exact final projects too early, Codex should allow content to be data-driven.
Prepare placeholders for these four types:

1. **Research / vision project**  
2. **Graphics / game project**  
3. **Engineering / applied AI project**  
4. **Best additional technical visual project**

Then plug in the real projects you choose.

## More Work / Archive

Smaller cards for:

- Space Shooter  
- Botanica Algorithmica  
- smaller Godot experiments  
- graphics exercises / course work  
- CV exercises / panoramas / feature detection / etc.  
- useful older repos that still show range

This archive is important because:

- it shows breadth  
- it preserves your smaller explorations  
- it prevents the site from pretending you have only 3 projects

## Algorithms / implementation ideas

- L-systems for decorative plant generation  
- turtle graphics  
- Bézier / Catmull–Rom curves  
- stable seeded growth animation  
- pixel post-processing for consistency

---

# 6.5 Section 5 — Underwater / Contact

## Purpose

Calm ending and clear contact area.

## Content

- email  
- GitHub  
- LinkedIn  
- itch.io  
- resume/CV  
- optional short line inviting collaboration or internship opportunities

## Scene idea

Underwater environment:

- subtle water motion  
- bubbles  
- caustic-like lighting or soft wave distortion  
- dark teal / blue palette  
- pixelized final look

## Animation behavior

- bubbles rising slowly  
- very soft water movement  
- no text distortion  
- calm final scene

## Algorithms / implementation ideas

- background wave distortion  
- simple bubble particle system  
- layered underwater gradient  
- optional caustic pattern simulation

---

## 7) Coherence rules across all sections

Even if each world uses a different procedural method, the site must remain coherent.
Use these rules:

1. **Shared pixelized rendering language**  
2. **Shared typography system**  
3. **Shared panel style for text**  
4. **Shared button style**  
5. **Shared navbar**  
6. **Shared pacing of animation**  
7. **Shared overall dark atmosphere**

So yes, worlds can differ, but they should differ like chapters of one game/art-book, not like 5 unrelated websites.

---

## 8) Transition strategy

Section transitions are important.
The scroll between sections should feel elegant.

### Suggested transitions

- **Universe → Sky**  
  stars fade, sky tones appear, cloud layers come in

- **Sky → Mountains**  
  horizon forms, mountain silhouettes rise

- **Mountains → Botanical**  
  landscape lowers toward the ground, vegetation emerges

- **Botanical → Underwater**  
  world sinks into teal tones, bubbles begin, water motion appears

### Technical advice

Do not try to build a cinematic AAA transition system first.
Simple crossfades, layered overlaps and palette interpolation are enough.

---

## 9) Rendering and architecture strategy

## Recommended stack

- React  
- TypeScript  
- Vite  
- CSS Modules or clean scoped CSS  
- GSAP only if really needed for section transitions  
- Canvas 2D and/or Three.js depending on scene needs

## Recommended rendering philosophy

Do **not** make 5 heavyweight independent 3D apps.
Instead:

- use lightweight techniques where possible  
- only use true 3D when it is justified  
- use procedural 2D/canvas for some worlds  
- pixelize the final output for consistency

### Suggested breakdown

- Universe: maybe Three.js or procedural canvas + post-process  
- Sky: likely 2D canvas / shader layer  
- Mountains: 2D layered canvas or simple 3D terrain  
- Botanical: 2D vector/canvas generation  
- Underwater: 2D shader/canvas-like effect

This is much more realistic than five full 3D worlds.

## Performance rules

- pause rendering when section is off-screen  
- use requestAnimationFrame, not React re-renders for animation  
- keep effects subtle  
- provide reduced-motion mode  
- provide graceful fallback if WebGL is not available  
- cap DPR if needed

---

## 10) Open-source / reusable algorithm strategy

Very important principle:

> Do not reinvent every generator from scratch.

Instead:

- study existing algorithms  
- adapt them  
- simplify them  
- combine them into a coherent site  
- clearly track attribution / licenses

### What can be reused or adapted

#### Universe / planets

Use existing planet generation ideas or implementations as a base.
Possible sources:

- pixel planet generators  
- shader-based procedural planets  
- low-poly planet generators  
- orbit systems

#### Sky

Use existing cloud generation approaches:

- noise-based cloud fields  
- layered parallax cloud systems  
- precipitation particles

#### Mountains

Use standard procedural terrain generation ideas:

- Perlin/simplex/fBm  
- midpoint displacement / ridges  
- layered silhouettes  
- contour effects

#### Botanical

Use:

- your own L-system knowledge  
- existing L-system implementations  
- turtle drawing logic  
- curve smoothing

#### Underwater

Use:

- simple particle systems  
- existing wave distortion techniques  
- procedural caustic approximations

### Important implementation rule

Codex should not blindly copy unknown GitHub code.
It should:

- reference techniques  
- implement simplified versions cleanly  
- document inspiration  
- verify licenses before direct reuse

---

## 11) Content strategy for projects

Because the featured selection still depends on your final curation, the site should be data-driven.

Each project entry should support fields like:

- title  
- category  
- featured (true/false)  
- year  
- tags  
- short summary  
- longer description  
- what I did  
- technologies  
- screenshots / gif / video preview  
- GitHub link  
- demo link  
- itch link  
- status

### Strong recommendation

Before or during implementation, prepare a short curated list:

#### Featured shortlist

- 6–8 candidate projects total  
- then narrow to top 3–4

#### Secondary shortlist

- 8–15 smaller projects  
- grouped by category

This will make the final site much better than improvising project hierarchy inside code.

---

## 12) Minimum viable version

The site does not need to launch with every advanced effect.

### MVP should include

- full single-page structure  
- fixed navbar  
- 5 sections  
- framed readable text  
- dark consistent style  
- at least simple procedural/dynamic backgrounds for all sections  
- featured projects section  
- more work/archive section  
- CV download  
- mobile support

### Post-MVP polish

- stronger transitions  
- better post-processing / pixelization  
- improved shaders  
- more subtle interactivity  
- quality tiers  
- project modal deep-linking  
- optional seed toggles / debug or “pixel mode” controls

---

## 13) Recommended build order

### Phase 1 — structure first

Build:

- app shell  
- navbar  
- all section containers  
- content panels  
- project data model  
- featured and archive layouts

No need for fancy procedural rendering yet.

### Phase 2 — visual foundations

Build:

- shared dark style system  
- shared panel style  
- button system  
- pixel-art/pixelized look experiments

### Phase 3 — procedural scene pass

Add first-pass visuals to every world:

- universe  
- sky  
- mountains  
- botanical  
- underwater

Keep them simple but alive.

### Phase 4 — project content pass

Insert real content:

- actual featured projects  
- actual smaller projects  
- screenshots and gif previews  
- accurate descriptions

### Phase 5 — polish pass

- transitions  
- performance  
- mobile refinement  
- reduced motion  
- final typography tuning  
- final content edits

---

## 14) Final Codex instructions

Below are the prompts that should guide development.

### Prompt A — architecture and layout

```text
Build a single-page personal portfolio using React, TypeScript and Vite.

The website is a scroll-driven journey through five full-screen-ish procedural worlds:
1. Universe (Home)
2. Sky (About)
3. Mountains (Journey)
4. Botanical World (Projects)
5. Underwater (Contact)

Important constraints:
- The site must present real portfolio content first, visuals second.
- Keep a fixed top navbar with: Home, About, Journey, Projects, Contact, CV.
- Clicking nav items should smooth-scroll to sections.
- The site must use one unified visual system: dark, atmospheric, pixel-art / pixelized rendering aesthetic.
- All sections should use framed readable content panels.
- Build Featured Projects and More Work sections from structured data.
- Implement the layout, section structure, typography system, panel system and placeholder data first.
- Do not build heavy procedural scenes yet. Reserve clean scene layers for each section.
```

### Prompt B — shared visual system

```text
Enhance the portfolio with a unified visual style:
- dark atmosphere
- pixelized / pixel-art-inspired rendering
- readable editorial panels
- consistent buttons, metadata and spacing
- subtle transitions between sections

Implement a reusable design token system for colors, spacing, typography and panels.
Implement a reusable section component that supports:
- chapter title
- main heading
- body content
- decorative scene layer behind content
- theme accent variations per biome

Do not make sections feel like unrelated templates. They should feel like chapters of one coherent world.
```

### Prompt C — procedural worlds

```text
Implement first-pass animated procedural backgrounds for the five sections.

Rules:
- every world should be gently dynamic
- keep motion subtle and elegant
- prioritize performance and readability
- use a shared pixelized / nearest-neighbor / limited-palette look where possible
- do not distort text panels

Worlds:
1. Universe: stars, planets, particles, subtle orbital motion
2. Sky: clouds, atmospheric layers, optional light precipitation
3. Mountains: layered procedural ridges with parallax and fog
4. Botanical: L-system-inspired branching/curves around project layout
5. Underwater: wave motion, bubbles, underwater ambience

Use lightweight techniques where appropriate. Do not over-engineer all scenes as separate 3D games.
Pause or simplify effects when off-screen.
```

### Prompt D — project system

```text
Create a flexible project data model and build two project displays:
1. Featured Projects
2. More Work / Archive

Requirements:
- Featured Projects should support large cards or modal details.
- More Work should support smaller cards with categories/tags.
- Each project can have title, summary, role, technologies, images, links and featured status.
- Make the layout suitable for real portfolio content, including serious technical projects and smaller experiments.
- Do not hardcode Botanica as the flagship project.
- The design should allow curation of 3–4 featured projects and many smaller projects.
```

### Prompt E — polish and shipping

```text
Polish the portfolio for production quality.

Requirements:
- optimize performance
- support reduced motion
- ensure mobile responsiveness
- preserve readability over animated backgrounds
- improve transitions between worlds
- make CV download accessible
- ensure semantic HTML and keyboard accessibility
- keep the animated scene layer visually rich but secondary to content

The final result should feel memorable, technically impressive and recruiter-friendly.
```

---

## 15) Final product definition

The final site should feel like:

- a strong personal portfolio  
- a procedural visual narrative  
- a graphics-minded, tastefully artistic interface  
- a place where your best work is easy to find  
- a site that people remember after closing it

### In one sentence

> A dark, pixelized, scroll-driven portfolio journey through generated worlds that showcases Bogdan Djukic’s work, education, experience and technical identity.

