# 3D Website Project

# CLAUDE.md — [BRAND NAME] Website

# TEMPLATE — Fill every [PLACEHOLDER] before starting Session 1

---

## ALWAYS DO FIRST (Every Session, No Exceptions)

1. Read `.claude/skills/video-to-website/SKILL.md` — PRIMARY skill, governs all scroll + frame logic
2. Read `.claude/skills/styling/SKILL.md` before writing any frontend code
3. Read `.claude/skills/styling/tokens-template.md` before setting up any CSS tokens
4. Read this entire CLAUDE.md before starting any task
5. Check `brand_assets/` folder for logo, product images, and video file first
6. Never start coding without completing steps 1–5

---

## ⚙️ PROJECT IDENTITY — Fill This Before Session 1

```
BRAND NAME:      [e.g. Mango Splash / NovaSkin / StormBrew]
TAGLINE:         [e.g. "Feel the Splash" / "Skin Reimagined"]
PRODUCT TYPE:    [e.g. beverage / skincare / sneaker / tech gadget / fragrance]
TARGET AUDIENCE: [e.g. young adults 18–30 / professionals 25–45]
NICHE VIBE:      [e.g. tropical & vibrant / dark luxury / clean & clinical / streetwear bold]
PRIMARY COLOR:   [e.g. #FFB800]
ACCENT COLOR:    [e.g. #FF5C1A]
FONT MOOD:       [e.g. loud & punchy / refined & editorial / techy & minimal]
VIDEO FILE:      [e.g. public/video/product.mp4]
```

> ⚠️ Claude Code: Read `brand_assets/` and extract all values above before writing anything.
> If brand_assets/ is empty, ask the user to confirm identity values before proceeding.

---

## Visual Reference

- **Primary reference:** Apple product pages — https://www.apple.com/iphone/
- Frame-by-frame video scrub controlled by scroll is the centerpiece of this site
- After every component: screenshot → compare → list exact mismatches → fix → re-screenshot
- Never stop after one pass — iterate until it matches premium product site quality

---

## Local Server & Screenshot Workflow

```bash
# Serve locally — NEVER open via file://
npx serve .       # serves at http://localhost:3000
# OR
python -m http.server 8000

# Screenshot workflow after EVERY component:
# 1. Screenshot at localhost
# 2. Visually inspect colors, spacing, animation timing
# 3. Scroll fully through — verify frame scrub is smooth, every section has DIFFERENT animation
# 4. List exact mismatches: "section 2 and 3 both use fade-up", "counter doesn't animate", "marquee missing"
# 5. Fix all mismatches
# 6. Re-screenshot
# 7. Repeat until premium quality
```

**Screenshot checklist — tick ALL before moving to next component:**

- [ ] Lenis smooth scroll active — scroll feels like an "experience" not a web page
- [ ] Video frames advance smoothly — zero jumps or stutters
- [ ] Every section uses a DIFFERENT `data-animation` type — never two consecutive the same
- [ ] Text is side-aligned (left 40% or right 40%) — never centered over canvas
- [ ] Staggered reveals: label → heading → body → CTA (never all at once)
- [ ] Marquee text is 12vw+ and slides on scroll
- [ ] All numbers/stats count up from 0 — never appear statically
- [ ] CTA section has `data-persist="true"` — never disappears
- [ ] Hero circle-wipe reveals canvas as hero scrolls away
- [ ] No console errors or warnings
- [ ] Mobile layout works — text collapses to centered with dark backdrop

---

## Tech Stack (NEVER deviate)

| Layer   | Technology                                          |
| ------- | --------------------------------------------------- |
| Core    | Vanilla HTML + CSS + JS — NO framework, NO bundler  |
| Scroll  | Lenis (CDN) + GSAP ScrollTrigger (CDN)              |
| Video   | FFmpeg for frame extraction → WebP frames on canvas |
| Styling | CSS custom properties (`:root` variables)           |
| Fonts   | Fontshare CDN — [SPECIFY based on brand mood]       |
| Serve   | `npx serve .` or `python -m http.server 8000`       |
| Deploy  | Vercel (free)                                       |

> ⚠️ This is a vanilla project — NO React, NO Vite, NO Tailwind, NO bundler.
> Single `index.html` + `css/style.css` + `js/app.js` + `frames/` folder.

---

## CDN Scripts (End of body — THIS ORDER, no exceptions)

```html
<script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="js/app.js"></script>
```

---

## Font Selection by Brand Mood

> Pick ONE pair. Delete the others after choosing.

```html
<!-- LOUD & PUNCHY — beverages, streetwear, energy brands -->
<link
  href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700,800&f[]=satoshi@400,500,700&display=swap"
  rel="stylesheet"
/>
<!-- display: Clash Display | body: Satoshi -->

<!-- REFINED & EDITORIAL — skincare, fashion, lifestyle -->
<link
  href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&f[]=satoshi@400,500&display=swap"
  rel="stylesheet"
/>
<!-- display: Cabinet Grotesk | body: Satoshi -->

<!-- DARK LUXURY — spirits, fragrance, watches -->
<link
  href="https://api.fontshare.com/v2/css?f[]=array@600,700&f[]=satoshi@300,400&display=swap"
  rel="stylesheet"
/>
<!-- display: Array | body: Satoshi (light) -->

<!-- TECHY & MINIMAL — gadgets, SaaS, fintech -->
<link
  href="https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700&f[]=dm-mono@400,500&display=swap"
  rel="stylesheet"
/>
<!-- display: General Sans | body: DM Mono -->
```

---

## Design System

> ⚠️ Replace ALL hex placeholders with real brand values from `brand_assets/` before Session 1.

### CSS Custom Properties (`:root` in `css/style.css`)

```css
:root {
  /* ── Core Brand ──────────────────────────── */
  --color-primary: [BRAND_PRIMARY]; /* main brand color */
  --color-primary-deep: [BRAND_DARK]; /* darker — depth, shadows */
  --color-primary-light: [BRAND_LIGHT]; /* lighter — highlights */
  --color-accent: [BRAND_ACCENT]; /* CTA — contrasts with primary */

  /* ── Backgrounds ─────────────────────────── */
  --bg-light: [BG_COLOR]; /* main page bg (light sections) */
  --bg-dark: [BG_DARK]; /* dark overlay + contrast sections */
  --color-surface: [SURFACE_COLOR]; /* card backgrounds */

  /* ── Text ────────────────────────────────── */
  --text-on-light: [TEXT_DARK]; /* primary text on light bg — min #666 for body */
  --text-on-dark: #f0ede8; /* text on dark sections */
  --color-muted: [TEXT_MUTED]; /* secondary text — NEVER #999 on light bg */

  /* ── Borders ─────────────────────────────── */
  --color-border: [BORDER_COLOR];

  /* ── Typography ──────────────────────────── */
  --font-display: "[CHOSEN_DISPLAY]", sans-serif;
  --font-body: "[CHOSEN_BODY]", sans-serif;
}
```

### Typography Scale (non-negotiable sizing)

```css
/* Hero heading: 12rem minimum */
.hero-heading {
  font-size: clamp(5rem, 12vw, 14rem);
  font-weight: 800;
}

/* Section headings: 4rem minimum */
.section-heading {
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 700;
}

/* Marquee: 10vw minimum */
.marquee-text {
  font-size: clamp(6rem, 12vw, 16rem);
  font-weight: 800;
}

/* Section label: small, tracked, DM Mono or body font */
.section-label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
```

### Side-Aligned Text Zones (MANDATORY — never center text over canvas)

```css
.align-left {
  padding-left: 5vw;
  padding-right: 55vw;
}
.align-right {
  padding-left: 55vw;
  padding-right: 5vw;
}
.align-left .section-inner,
.align-right .section-inner {
  max-width: 40vw;
}

/* Exception: stats section with full dark overlay (#overlay opacity 0.88-0.92) */
.section-stats {
  justify-content: center;
  text-align: center;
}
```

### Shadow System (layered brand-tinted — never flat)

```css
/* Replace [RGB] with brand color RGB equivalents */
.card-shadow {
  box-shadow:
    0 4px 6px -1px rgba([PRIMARY_RGB], 0.12),
    0 20px 40px -8px rgba([ACCENT_RGB], 0.1);
}
.cta-glow {
  box-shadow:
    0 0 30px rgba([PRIMARY_RGB], 0.35),
    0 8px 32px rgba([ACCENT_RGB], 0.25);
}
```

---

## Anti-Generic Hard Rules

- **NEVER** use `transition-all` — animate `transform` and `opacity` only
- **NEVER** use Inter, Roboto, Arial, system-ui — brand fonts only
- **NEVER** use glassmorphism cards — text hierarchy via font size/weight/color
- **NEVER** use #999 for body text on light backgrounds — minimum #666
- **NEVER** center text over the canvas — side-aligned only (outer 40% zones)
- **NEVER** use the same `data-animation` type for two consecutive sections
- **NEVER** let numbers appear statically — all counters count up from 0
- **NEVER** let the CTA section scroll away — `data-persist="true"` always
- **NEVER** set `FRAME_SPEED` below 1.8 — feels sluggish. Range: 1.8–2.2
- **NEVER** set total scroll height below 800vh for a 6-section site
- **NEVER** give hero less than 20% of scroll range — first impression needs room
- **ALWAYS** use Lenis smooth scroll — mandatory, no exceptions
- **ALWAYS** use 4+ different animation types across sections — variety is non-negotiable
- **ALWAYS** stagger child reveals: label → heading → body → CTA
- **ALWAYS** include at least one horizontal marquee at 12vw+ font size
- **ALWAYS** implement circle-wipe to reveal canvas as hero scrolls away
- **ALWAYS** add grain/noise texture overlay on hero at 3–5% opacity
- **DO NOT** add sections not listed in this file
- **DO NOT** deviate from the brand color palette once confirmed

---

## THE CORE MECHANIC — Video Frame Scrub

> Read `.claude/skills/video-to-website/SKILL.md` for full implementation details.
> This section is a summary — the skill file is the authority.

### Step 1 — Analyze Video First

```bash
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,duration,r_frame_rate,nb_frames \
  -of csv=p=0 "[VIDEO_PATH]"
```

Determine: duration, fps, total frames. Then decide target frame count (150–300).

### Step 2 — Extract Frames

```bash
mkdir -p frames
ffmpeg -i "[VIDEO_PATH]" \
  -vf "fps=[CALCULATED_FPS],scale=[WIDTH]:-1" \
  -c:v libwebp -quality 80 \
  "frames/frame_%04d.webp"
```

Rule: short <10s → original fps capped at 300 | medium 10–30s → 10–15fps | long 30s+ → 5–10fps

### Step 3 — Scroll Height Formula

```
Total scroll height = number of sections × 130–150vh minimum
Minimum for 6 sections = 800vh
Hero section alone = 20%+ of total scroll range
```

### Step 4 — Frame Speed

```js
const FRAME_SPEED = 2.0; // 1.8–2.2 — product animation ends by ~55% scroll
// Higher = product finishes faster, more scroll range for text sections
```

### Step 5 — Canvas Render (Padded Cover Mode)

```js
const IMAGE_SCALE = 0.85; // 0.82–0.90 sweet spot — product doesn't clip into header
// Auto-sample bg color from frame edges every ~20 frames
// Fill canvas with sampled color BEFORE drawing frame (hides padding seam)
```

---

## Required HTML Structure (in this exact order)

```html
<!-- 1. Loader -->
<div id="loader">
  <span class="loader-brand">[BRAND NAME]</span>
  <div id="loader-bar"></div>
  <span id="loader-percent">0%</span>
</div>

<!-- 2. Fixed Header -->
<header class="site-header">
  <nav>[LOGO] + [NAV LINKS]</nav>
</header>

<!-- 3. Hero — standalone 100vh, solid bg, circle-wipe transition -->
<section class="hero-standalone">
  <span class="section-label">001 / [BRAND]</span>
  <h1 class="hero-heading">
    [BRAND NAME — words wrapped in spans for split animation]
  </h1>
  <p class="hero-tagline">[TAGLINE]</p>
  <div class="scroll-indicator">Scroll ↓</div>
</section>

<!-- 4. Canvas — fixed, full viewport, reveals via circle clip-path -->
<div class="canvas-wrap">
  <canvas id="canvas"></canvas>
</div>

<!-- 5. Dark Overlay — fixed, full viewport, pointer-events: none -->
<div id="dark-overlay"></div>

<!-- 6. Marquee(s) — fixed position, 12vw+ font -->
<div class="marquee-wrap" data-scroll-speed="-25">
  <span class="marquee-text">[BRAND STATEMENT — repeated] ·</span>
</div>

<!-- 7. Scroll Container — 800vh+ total -->
<div id="scroll-container">
  <!-- Content sections go here — see section specs below -->
</div>
```

---

## Site Sections (BUILD IN THIS ORDER)

### 1. Hero (standalone — 100vh, outside scroll container)

- Solid brand bg color — no canvas showing yet
- Large split-word heading with GSAP word-by-word reveal on load
- `hero-heading` font: `clamp(5rem, 12vw, 14rem)`, display font 800
- Tagline below in body font, muted color
- Scroll indicator arrow, animated bounce
- Circle-wipe: as hero scrolls away, canvas reveals below via `clip-path: circle(0%→75%)`

### 2. Feature 1 — First Product Feature

```html
<section
  class="scroll-section section-content align-left"
  data-enter="8"
  data-leave="22"
  data-animation="slide-left"
>
  <div class="section-inner">
    <span class="section-label">002 / [FEATURE LABEL]</span>
    <h2 class="section-heading">[FEATURE HEADLINE]</h2>
    <p class="section-body">[FEATURE DESCRIPTION]</p>
  </div>
</section>
```

- **[PLACEHOLDER: Feature 1 headline + description to be provided]**

### 3. Feature 2 — Second Product Feature

```html
<section
  class="scroll-section section-content align-right"
  data-enter="24"
  data-leave="38"
  data-animation="fade-up"
></section>
```

- DIFFERENT animation from section 2 — must not repeat
- **[PLACEHOLDER: Feature 2 headline + description to be provided]**

### 4. Feature 3 — Third Product Feature

```html
<section
  class="scroll-section section-content align-left"
  data-enter="40"
  data-leave="52"
  data-animation="clip-reveal"
></section>
```

- DIFFERENT animation from sections 2 and 3
- **[PLACEHOLDER: Feature 3 headline + description to be provided]**

### 5. Stats / Social Proof — Dark Overlay Section

```html
<section
  class="scroll-section section-stats"
  data-enter="54"
  data-leave="70"
  data-animation="stagger-up"
>
  <div class="stats-grid">
    <div class="stat">
      <span class="stat-number" data-value="[VALUE]" data-decimals="0">0</span>
      <span class="stat-suffix">[UNIT]</span>
      <span class="stat-label">[LABEL]</span>
    </div>
    <!-- repeat for each stat -->
  </div>
</section>
```

- Dark overlay opacity 0.88–0.92 during this section
- ALL numbers count up from 0 — `data-value` sets target
- Center text is OK ONLY here because of full dark overlay
- **[PLACEHOLDER: Stats values + labels to be provided]**

### 6. Marquee Section

- Oversized brand statement slides horizontally on scroll
- Font: `clamp(6rem, 12vw, 16rem)`, display font 800
- Position: fixed, slides via `xPercent` GSAP + ScrollTrigger scrub
- Fades in/out based on scroll range
- **[PLACEHOLDER: Marquee text phrase to be provided]**

### 7. CTA — Final Section (PERSISTS)

```html
<section
  class="scroll-section section-cta align-left"
  data-enter="78"
  data-leave="95"
  data-animation="scale-up"
  data-persist="true"
>
  <div class="section-inner">
    <span class="section-label">00[N] / Get Yours</span>
    <h2 class="section-heading">[CTA HEADLINE]</h2>
    <p class="section-body">[CTA SUBTEXT]</p>
    <a href="[URL]" class="cta-button">[CTA LABEL] →</a>
  </div>
</section>
```

- `data-persist="true"` — stays visible once animated in, never reverses
- CTA button: `--color-accent` bg, pill shape, brand glow shadow on hover
- **[PLACEHOLDER: CTA headline, subtext, button label, link URL to be provided]**

---

## Animation Variety Rules

> Sections MUST use different animation types. Never two consecutive the same.

| Section    | Animation Type              | Direction        |
| ---------- | --------------------------- | ---------------- |
| Hero words | GSAP word split, stagger up | Up               |
| Feature 1  | `slide-left`                | Left             |
| Feature 2  | `fade-up`                   | Up               |
| Feature 3  | `clip-reveal`               | Clip from bottom |
| Stats      | `stagger-up`                | Up               |
| CTA        | `scale-up`                  | Scale            |

Available types: `fade-up` / `slide-left` / `slide-right` / `scale-up` / `rotate-in` / `stagger-up` / `clip-reveal`

All use stagger 0.1–0.15s, `ease: "power3.out"` (except `scale-up`: `power2.out`, `clip-reveal`: `power4.inOut`)

---

## js/app.js Structure (build in this order)

```
1. Lenis init + GSAP ticker connection (MANDATORY FIRST)
2. Frame preloader — 2-phase: first 10 frames → rest in background
3. Canvas renderer — padded cover mode with bg color sampling
4. Frame-to-scroll binding — FRAME_SPEED 1.8–2.2
5. Hero circle-wipe transition
6. Dark overlay fade in/out
7. Section animation system — reads data-animation, plays/reverses
8. Counter animations — all stat-number elements
9. Horizontal marquee — xPercent scroll-driven
10. Hero heading word-split animation on load
```

---

## Performance Rules — NON NEGOTIABLE

### Frame Extraction

- Target 150–300 frames — never more (memory issues on mobile)
- WebP at quality 80 — best size/quality ratio
- Max frame width 1920px — cap larger videos
- Mobile: reduce to <150 frames, resize to 1280px wide

### Canvas

- Apply `devicePixelRatio` scaling for crisp rendering on retina screens
- Sample bg color from frame corners every ~20 frames
- Fill canvas with sampled color BEFORE drawing image (no visible padding seam)
- `IMAGE_SCALE` 0.82–0.90 — never pure cover (1.0) or pure contain

### Preloader

- Two-phase: first 10 frames load immediately → rest load in background
- Show percentage progress bar during load
- Hide loader ONLY after ALL frames are ready — never show half-loaded canvas

### Device / Mobile

```js
const isMobile = window.innerWidth < 768;
// Mobile: reduce scroll container to ~550vh
// Mobile: collapse side alignment to centered text with dark backdrop
// Mobile: reduce frame count if >150
```

### Animation

- Animate `transform` and `opacity` only — never layout properties
- Never `transition-all`
- Kill ALL ScrollTrigger instances on page unload
- `gsap.ticker.lagSmoothing(0)` — always set this

### Performance Targets

- Lighthouse Performance: ≥ 80 (frame-based sites score lower — 80 is excellent)
- First Contentful Paint: < 2s (preloader hides this)
- 60fps scroll scrub on mid-tier laptop

---

## File Structure

```
[PROJECT-NAME]/
├── .claude/
│   └── skills/
│       ├── video-to-website/
│       │   └── SKILL.md         ← PRIMARY — read first every session
│       └── styling/
│           ├── SKILL.md         ← read before any CSS work
│           └── tokens-template.md
├── frames/
│   ├── frame_0001.webp          ← extracted by FFmpeg
│   ├── frame_0002.webp
│   └── ...
├── css/
│   └── style.css                ← all styles here
├── js/
│   └── app.js                   ← all JS here
├── brand_assets/                ← CHECK FIRST every session
│   ├── logo.svg
│   ├── colors.md
│   └── fonts.md
├── public/
│   └── video/
│       └── product.mp4          ← source video for FFmpeg
├── index.html                   ← single HTML file
└── CLAUDE.md                    ← this file
```

---

## Session Start Protocol

Say this at the start of EVERY session:

> _"Read CLAUDE.md first. Then read `.claude/skills/video-to-website/SKILL.md` in full. Then read `.claude/skills/styling/SKILL.md`. Check brand_assets/ and extract all identity values. Then read the current state of [file you're working on]. Only then begin."_

---

## Build Order (Follow Exactly)

```
Session 1 — Analyze + Setup
  → Fill all [PLACEHOLDERS] in CLAUDE.md from brand_assets/
  → Run FFprobe to analyze video (duration, fps, frames)
  → Run FFmpeg to extract frames into frames/ folder
  → Count extracted frames, confirm count
  → Scaffold index.html + css/style.css + js/app.js

Session 2 — Canvas + Frame Scrub (DO THIS BEFORE ANY STYLING)
  → Build preloader (2-phase)
  → Build canvas renderer (padded cover + bg sampling)
  → Build GSAP ScrollTrigger frame binding
  → Set FRAME_SPEED, test scrub is smooth
  → DO NOT proceed until scrub works perfectly

Session 3 — Hero + Circle-Wipe
  → Build hero-standalone section
  → Word-split heading animation
  → Circle-wipe transition to canvas
  → Lenis init + GSAP ticker

Session 4 — Navbar + Dark Overlay
  → Fixed header with scroll behavior
  → Dark overlay fade in/out for stats section

Session 5 — Content Sections (Features + Stats)
  → Build all scroll sections with correct data-animation types
  → Verify NO two consecutive sections share same animation type
  → Counter animations for stats

Session 6 — Marquee + CTA
  → Horizontal marquee scroll-driven
  → CTA section with data-persist="true"

Session 7 — Styling Pass
  → Apply full brand design system
  → Typography, colors, shadows, grain texture
  → Use styling/SKILL.md for creative direction

Session 8 — Mobile + Polish
  → Collapse to 550vh, centered text, dark backdrops
  → Reduced-motion support
  → Performance audit

Session 9 — Final Assets + QA
  → Confirm all brand colors, fonts, copy are final
  → Full scroll-through QA checklist

Session 10 — Deploy to Vercel
```

---

## Pending — To Be Provided

- [ ] Brand identity values → fill all [PLACEHOLDERS] above
- [ ] Source video file → `public/video/product.mp4`
- [ ] Brand logo → `brand_assets/logo.svg`
- [ ] Brand color palette → `brand_assets/colors.md`
- [ ] Feature section headlines + descriptions (×3)
- [ ] Stats values + labels
- [ ] Marquee text phrase
- [ ] CTA headline, subtext, button label, destination URL
- [ ] Social links

## Project Overview

A scroll-driven video animation website. Add specific stack, goals, and conventions here as the project grows.

## Skills

Custom skills for this project are in `.claude/skills/`. Invoke with `/skill-name`.

| Skill         | Command          | Trigger phrases                                                                   | Output                                |
| ------------- | ---------------- | --------------------------------------------------------------------------------- | ------------------------------------- |
| scroll-video  | `/scroll-video`  | "add scroll video sync", "scrub video on scroll", "scroll-driven video animation" | `scroll-video.js`, `scroll-video.css` |
| skill-builder | `/skill-builder` | "build a new skill", "create a skill", "audit this skill"                         | `.claude/skills/[name]/SKILL.md`      |

## Conventions

- Vanilla JS only — no external libraries
- Video elements must be muted, no autoplay
- Mobile-safe: use passive scroll listeners
