/* MANGO SPLASH -- app.js */
const FRAME_COUNT  = 145;
const FRAME_COUNT2 = 145;
const FRAME_SPEED  = 2.0;
const IMAGE_SCALE  = 0.87;
const BG_COLOR     = "#FFD23F";
// Video 1 occupies scroll 0–50%, 1-second hold 50–53%, video 2 starts at 53%
const VIDEO2_START = 0.50;
const VIDEO2_DELAY = 0.03; // hold last frame of video 1 before video 2 begins

const frames  = new Array(FRAME_COUNT);
const frames2 = new Array(FRAME_COUNT2);
let currentFrame = 0;
let allLoaded = false;
let frames2Loaded = false;
let sampledBg = BG_COLOR;
let sampleCounter = 0;
const loader      = document.getElementById("loader");
const loaderBar   = document.getElementById("loader-bar");
const loaderPct   = document.getElementById("loader-percent");
const canvas      = document.getElementById("canvas");
const canvasWrap  = document.getElementById("canvas-wrap");
const darkOverlay = document.getElementById("dark-overlay");
const heroSection = document.getElementById("hero");
const marqueeWrap = document.getElementById("marquee");
const scrollCont  = document.getElementById("scroll-container");
const ctx = canvas.getContext("2d");

let activeVideo = 1;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (activeVideo === 2) { drawFrame2(currentFrame); } else { drawFrame(currentFrame); }
}
window.addEventListener("resize", resizeCanvas);

function sampleBgColor(img) {
  // Sample 5 edge points and average them for a representative bg colour
  const tmp = document.createElement("canvas");
  tmp.width = img.naturalWidth; tmp.height = img.naturalHeight;
  const tc = tmp.getContext("2d");
  tc.drawImage(img, 0, 0);
  const w = img.naturalWidth, h = img.naturalHeight;
  const pts = [
    tc.getImageData(2, h - 3, 1, 1).data,           // bottom-left
    tc.getImageData(w - 3, h - 3, 1, 1).data,        // bottom-right
    tc.getImageData(Math.floor(w / 2), h - 3, 1, 1).data, // bottom-centre
    tc.getImageData(2, Math.floor(h / 2), 1, 1).data,     // mid-left
    tc.getImageData(w - 3, Math.floor(h / 2), 1, 1).data, // mid-right
  ];
  const r = Math.round(pts.reduce(function(s, p) { return s + p[0]; }, 0) / pts.length);
  const g = Math.round(pts.reduce(function(s, p) { return s + p[1]; }, 0) / pts.length);
  const b = Math.round(pts.reduce(function(s, p) { return s + p[2]; }, 0) / pts.length);
  return "rgb(" + r + "," + g + "," + b + ")";
}

function drawImg(img) {
  if (!img || !img.complete) return;
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;
  ctx.fillStyle = sampledBg;
  ctx.fillRect(0, 0, cw, ch);
  document.body.style.background = sampledBg;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawFrame(index) {
  drawImg(frames[index]);
}

function drawFrame2(index) {
  drawImg(frames2[index]);
}

function padded(n) { return String(n).padStart(4, "0"); }

function loadFrames() {
  let loaded = 0;
  for (let i = 1; i <= FRAME_COUNT; i++) {
    const img = new Image();
    const idx = i - 1;
    img.onload = function() {
      loaded++;
      if (idx < 5) { sampledBg = sampleBgColor(img); }
      const pct = Math.round((loaded / FRAME_COUNT) * 100);
      loaderBar.style.width = pct + "%";
      loaderPct.textContent = pct + "%";
      if (loaded === 10) { resizeCanvas(); drawFrame(0); }
      if (loaded === FRAME_COUNT) { allLoaded = true; hideLoader(); loadFrames2(); }
    };
    img.src = "frames/frame_" + padded(i) + ".webp";
    frames[idx] = img;
  }
}

function loadFrames2() {
  let loaded2 = 0;
  for (let i = 1; i <= FRAME_COUNT2; i++) {
    const img = new Image();
    const idx = i - 1;
    img.onload = function() {
      loaded2++;
      if (loaded2 === FRAME_COUNT2) { frames2Loaded = true; }
    };
    img.src = "frames2/frame_" + padded(i) + ".webp";
    frames2[idx] = img;
  }
}

function hideLoader() {
  setTimeout(function() {
    loader.classList.add("hidden");
    initAll();
  }, 300);
}

function initAll() {
  resizeCanvas();
  initLenis();
  initHeroAnimation();
  initHeroTransition();
  initFrameScroll();
  positionSections();
  initSectionAnimations();
  // initDarkOverlay disabled — no dark shade over any section
  initMarquee();
  initCounters();
}

function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

function initHeroAnimation() {
  const words   = document.querySelectorAll(".hero-heading .word");
  const tagline = document.querySelector(".hero-tagline");
  const tl = gsap.timeline({ delay: 0.1 });
  tl.to(words,   { y: 0, opacity: 1, stagger: 0.14, duration: 1.1, ease: "power4.out" });
  tl.to(tagline, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4");
}

function initHeroTransition() {
  ScrollTrigger.create({
    trigger: scrollCont,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: function(self) {
      const p = self.progress;
      heroSection.style.opacity = Math.max(0, 1 - p * 18).toString();
      const wipeP  = Math.min(1, Math.max(0, (p - 0.005) / 0.07));
      const radius = wipeP * 80;
      canvasWrap.style.clipPath = "circle(" + radius + "% at 50% 50%)";
    },
  });
}

function initFrameScroll() {
  ScrollTrigger.create({
    trigger: scrollCont,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: function(self) {
      const p = self.progress;

      if (p < VIDEO2_START) {
        // Video 1: maps 0–VIDEO2_START scroll → full frame set 1
        activeVideo = 1;
        const localP = p / VIDEO2_START;
        const accelerated = Math.min(localP * FRAME_SPEED, 1);
        const index = Math.min(Math.floor(accelerated * FRAME_COUNT), FRAME_COUNT - 1);
        currentFrame = index;
        sampleCounter++;
        if (sampleCounter % 5 === 0 && frames[index] && frames[index].complete) {
          sampledBg = sampleBgColor(frames[index]);
        }
        requestAnimationFrame(function() { drawFrame(currentFrame); });
      } else if (p < VIDEO2_START + VIDEO2_DELAY) {
        // Hold on last frame of video 1 during the delay gap
        activeVideo = 1;
        requestAnimationFrame(function() { drawFrame(FRAME_COUNT - 1); });
      } else {
        // Video 2: maps (VIDEO2_START + VIDEO2_DELAY)–1.0 scroll → full frame set 2
        activeVideo = 2;
        const v2End = 1 - VIDEO2_START - VIDEO2_DELAY;
        const localP = (p - VIDEO2_START - VIDEO2_DELAY) / v2End;
        const accelerated = Math.min(localP * FRAME_SPEED, 1);
        const index = Math.min(Math.floor(accelerated * FRAME_COUNT2), FRAME_COUNT2 - 1);
        currentFrame = index;
        sampleCounter++;
        if (frames2Loaded && frames2[index] && frames2[index].complete) {
          if (sampleCounter % 5 === 0) { sampledBg = sampleBgColor(frames2[index]); }
          requestAnimationFrame(function() { drawFrame2(index); });
        }
      }
    },
  });
}

function positionSections() {
  const containerH = scrollCont.offsetHeight;
  document.querySelectorAll(".scroll-section").forEach(function(sec) {
    const enter = parseFloat(sec.dataset.enter);
    const leave = parseFloat(sec.dataset.leave);
    const mid   = ((enter + leave) / 2 / 100) * containerH;
    sec.style.top = mid + "px";
  });
}

function buildTimeline(type, children) {
  const tl = gsap.timeline({ paused: true });
  if      (type === "fade-up")     { tl.from(children, { y: 50,  opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" }); }
  else if (type === "slide-left")  { tl.from(children, { x: -80, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" }); }
  else if (type === "slide-right") { tl.from(children, { x: 80,  opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" }); }
  else if (type === "scale-up")    { tl.from(children, { scale: 0.85, opacity: 0, stagger: 0.12, duration: 1.0, ease: "power2.out" }); }
  else if (type === "rotate-in")   { tl.from(children, { y: 40, rotation: 3, opacity: 0, stagger: 0.1,  duration: 0.9, ease: "power3.out" }); }
  else if (type === "stagger-up")  { tl.from(children, { y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }); }
  else if (type === "clip-reveal") { tl.from(children, { clipPath: "inset(100% 0 0 0)", opacity: 0, stagger: 0.15, duration: 1.2, ease: "power4.inOut" }); }
  else                             { tl.from(children, { y: 40, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" }); }
  return tl;
}

function setupSectionAnimation(section) {
  const type    = section.dataset.animation;
  const persist = section.dataset.persist === "true";
  const enter   = parseFloat(section.dataset.enter) / 100;
  const leave   = parseFloat(section.dataset.leave) / 100;
  const children = section.querySelectorAll(
    ".section-label, .section-heading, .section-body, .section-sub, .section-note, .cta-button, .stat, .glass-card"
  );
  const tl = buildTimeline(type, children);
  let played = false;
  ScrollTrigger.create({
    trigger: scrollCont,
    start: "top top",
    end: "bottom bottom",
    onUpdate: function(self) {
      const p = self.progress;
      if (p >= enter && p < leave) {
        section.classList.add("visible");
        if (!played) { tl.play(0); played = true; }
      } else if (!persist) {
        section.classList.remove("visible");
        if (played) { tl.reverse(); played = false; }
      }
    },
  });
}

function initSectionAnimations() {
  document.querySelectorAll(".scroll-section").forEach(function(sec) {
    setupSectionAnimation(sec);
  });
}

function initDarkOverlay(enterP, leaveP) {
  const fadeRange = 0.04;
  ScrollTrigger.create({
    trigger: scrollCont,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: function(self) {
      const p = self.progress;
      let opacity = 0;
      if      (p >= enterP - fadeRange && p <= enterP)         { opacity = (p - (enterP - fadeRange)) / fadeRange; }
      else if (p > enterP && p < leaveP)                        { opacity = 0.90; }
      else if (p >= leaveP && p <= leaveP + fadeRange)          { opacity = 0.90 * (1 - (p - leaveP) / fadeRange); }
      darkOverlay.style.opacity = opacity.toString();
      let mOpacity = 0;
      if      (p >= enterP && p <= leaveP) { mOpacity = Math.min(1, (p - enterP) / 0.03); }
      else if (p > leaveP)                  { mOpacity = Math.max(0, 1 - (p - leaveP) / 0.03); }
      marqueeWrap.style.opacity = mOpacity.toString();
    },
  });
}

function initMarquee() {
  const speed = parseFloat(marqueeWrap.dataset.scrollSpeed) || -22;
  gsap.to(marqueeWrap.querySelector(".marquee-text"), {
    xPercent: speed,
    ease: "none",
    scrollTrigger: { trigger: scrollCont, start: "top top", end: "bottom bottom", scrub: true },
  });
}

function initCounters() {
  const statsSection = document.querySelector(".section-stats");
  if (!statsSection) return;
  const enter = parseFloat(statsSection.dataset.enter) / 100;
  const leave = parseFloat(statsSection.dataset.leave) / 100;
  const counters = statsSection.querySelectorAll(".stat-number");
  let animated = false;
  ScrollTrigger.create({
    trigger: scrollCont,
    start: "top top",
    end: "bottom bottom",
    onUpdate: function(self) {
      const p = self.progress;
      if (p >= enter && p < leave && !animated) {
        animated = true;
        counters.forEach(function(el) {
          const target = parseFloat(el.dataset.value);
          if (target === 0) { el.textContent = "0"; return; }
          gsap.fromTo(el, { textContent: 0 }, {
            textContent: target,
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            onUpdate: function() { el.textContent = Math.round(parseFloat(el.textContent)); },
          });
        });
      } else if (p < enter || p >= leave) {
        animated = false;
        counters.forEach(function(el) { el.textContent = "0"; });
      }
    },
  });
}

loadFrames();
