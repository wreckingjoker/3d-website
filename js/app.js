/* MANGO SPLASH -- app.js */
const FRAME_COUNT = 145;
const FRAME_SPEED = 2.0;
const IMAGE_SCALE = 0.87;
const BG_COLOR = "#FFD23F";
const frames = new Array(FRAME_COUNT);
let currentFrame = 0;
let allLoaded = false;
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

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawFrame(currentFrame);
}
window.addEventListener("resize", resizeCanvas);

function sampleBgColor(img) {
  const tmp = document.createElement("canvas");
  tmp.width = 4; tmp.height = 4;
  const tc = tmp.getContext("2d");
  tc.drawImage(img, 0, 0, 4, 4);
  const d = tc.getImageData(0, 0, 1, 1).data;
  return "rgb(" + d[0] + "," + d[1] + "," + d[2] + ")";
}

function drawFrame(index) {
  const img = frames[index];
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
  ctx.drawImage(img, dx, dy, dw, dh);
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
      if (loaded === FRAME_COUNT) { allLoaded = true; hideLoader(); }
    };
    img.src = "frames/frame_" + padded(i) + ".webp";
    frames[idx] = img;
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
  initDarkOverlay(0.38, 0.60);
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
      const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
      const index = Math.min(Math.floor(accelerated * FRAME_COUNT), FRAME_COUNT - 1);
      if (index !== currentFrame) {
        currentFrame = index;
        sampleCounter++;
        if (sampleCounter % 20 === 0 && frames[index] && frames[index].complete) {
          sampledBg = sampleBgColor(frames[index]);
        }
        requestAnimationFrame(function() { drawFrame(currentFrame); });
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
    ".section-label, .section-heading, .section-body, .section-sub, .section-note, .cta-button, .stat"
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
