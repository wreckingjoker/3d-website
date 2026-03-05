---
name: scroll-video
description: Use when someone asks to add scroll-driven video animation, sync video playback to scroll position, or create a scroll-to-scrub video effect.
---

## What This Skill Does

Generates `scroll-video.js` and `scroll-video.css` — a standalone vanilla JS module that maps the user's scroll progress to a video's `currentTime`, creating a frame-accurate scroll-scrub effect. No libraries, no autoplay, mobile-safe.

---

## Steps

### 1. Read the existing HTML

Scan the project's HTML file(s) to find the `<video>` element. Extract:
- Its `id` or a unique selector
- The scroll container (default: `window`)
- The section or wrapper the video lives in

If no HTML file exists yet, ask the user for the video element's selector before continuing.

### 2. Generate `scroll-video.js`

Create the file at `scroll-video.js` in the project root (or alongside `index.html` if in a subfolder).

The script must:
- Select the video element found in Step 1
- Set `video.preload = 'auto'`, `video.muted = true`, `video.playsInline = true`
- Wait for `video.readyState >= 2` (HAVE_CURRENT_DATA) before activating sync
- Attach a **passive** scroll listener to `window` (or the scroll container)
- On each scroll event, calculate progress:
  ```
  progress = scrollY / (document.body.scrollHeight - window.innerHeight)
  progress = Math.min(1, Math.max(0, progress))
  video.currentTime = progress * video.duration
  ```
- Throttle with `requestAnimationFrame` to avoid jank
- Clean up the listener when the video element leaves the viewport (IntersectionObserver)

### 3. Generate `scroll-video.css`

Create `scroll-video.css` with:
- The video container set to `position: sticky; top: 0`
- Video sized to `width: 100%; height: 100vh; object-fit: cover`
- A tall scroll spacer on the parent element (default `height: 500vh`) to give room to scrub through the full video

### 4. Output a `<script>` and `<link>` snippet

After generating the files, print the HTML snippet the user needs to add to their `<head>` and end of `<body>`:

```html
<!-- In <head> -->
<link rel="stylesheet" href="scroll-video.css">

<!-- Before </body> -->
<script src="scroll-video.js"></script>
```

---

## Output

| File | Location |
|------|----------|
| `scroll-video.js` | Project root (next to `index.html`) |
| `scroll-video.css` | Project root (next to `index.html`) |

---

## Notes

- **Never** add autoplay, `play()`, or unmute the video. The scroll listener is the only driver.
- **Never** introduce external libraries (GSAP, jQuery, etc.) even if the user asks — keep it vanilla.
- If `video.duration` is `NaN` (video not loaded), defer sync until the `loadedmetadata` event fires.
- For sections that should only scrub while visible, use `IntersectionObserver` to enable/disable the scroll listener.
- If the project uses a bundler (Vite, Webpack), generate the JS as an ES module (`export default`) and note the import path for the user.
