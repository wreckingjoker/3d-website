import puppeteer from "puppeteer";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3737;

const MIME = {
  ".html":"text/html",".css":"text/css",".js":"application/javascript",
  ".mjs":"application/javascript",".webp":"image/webp",".png":"image/png",
};
const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const file = path.join(__dirname, urlPath);
  const ext  = path.extname(file).toLowerCase();
  if (!fs.existsSync(file)) { res.writeHead(404); res.end("Not found"); return; }
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

const PNG1x1 = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==","base64");
await new Promise(r => server.listen(PORT, r));
console.log("[server] http://localhost:" + PORT);

const browser = await puppeteer.launch({ headless:true, args:["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width:1440, height:900, deviceScaleFactor:1 });

await page.setRequestInterception(true);
page.on("request", req => {
  if (req.url().includes("/frames/frame_")) req.respond({ status:200, contentType:"image/png", body:PNG1x1 });
  else req.continue();
});

await page.goto("http://localhost:" + PORT + "/", { waitUntil:"networkidle0" });

// Wait for loader or force it hidden
await page.waitForFunction(
  () => document.getElementById("loader")?.classList.contains("hidden"),
  { timeout:15000 }
).catch(() => page.evaluate(() => {
  document.getElementById("loader")?.classList.add("hidden");
  if(typeof initAll==="function") initAll();
}));
await new Promise(r => setTimeout(r, 800));

// Inject a persistent override stylesheet that forces section elements visible
await page.addStyleTag({ content: `
  .scroll-section.preview-active {
    pointer-events: auto !important;
  }
  .scroll-section.preview-active .section-label,
  .scroll-section.preview-active .section-heading,
  .scroll-section.preview-active .section-body,
  .scroll-section.preview-active .section-sub,
  .scroll-section.preview-active .section-note,
  .scroll-section.preview-active .cta-button,
  .scroll-section.preview-active .stat,
  .scroll-section.preview-active .stat-number,
  .scroll-section.preview-active .stat-suffix,
  .scroll-section.preview-active .stat-label {
    opacity: 1 !important;
    transform: none !important;
    clip-path: none !important;
  }
` });

// Section data: enter%, leave%, scrollPct (mid of range within ScrollTrigger 0-1)
// ScrollTrigger range: scrollTop = heroH + progress * (contH - vpH) = 900 + p * 7200
// Section bounding tops (from debug): [1908, 3042, 4778, 5891, 6849, 8166]
// To center each section: scrollTop = sectionCenter - 450
const sections = [
  { name:"00-hero",       scrollTop:0,    enter:null, leave:null },
  { name:"01-origin",     scrollTop:1664, enter:"8",  leave:"22" },
  { name:"02-process",    scrollTop:2788, enter:"22", leave:"36" },
  { name:"03-stats",      scrollTop:4520, enter:"40", leave:"58" },
  { name:"04-experience", scrollTop:5628, enter:"58", leave:"70" },
  { name:"05-freshness",  scrollTop:6596, enter:"70", leave:"82" },
  { name:"06-cta",        scrollTop:7902, enter:"84", leave:"100" },
];
// Dark overlay sections (38%-60% of ScrollTrigger range)
// 38% → scrollTop = 900+0.38*7200=3636; 60% → 900+0.60*7200=5220

fs.mkdirSync(path.join(__dirname,"screenshots"), { recursive:true });

for (const { name, scrollTop, enter, leave } of sections) {
  await page.evaluate(({ scrollTop, enter, leave }) => {
    // Reset all preview-active
    document.querySelectorAll(".preview-active").forEach(el => el.classList.remove("preview-active"));

    // Activate matching section
    if (enter && leave) {
      document.querySelectorAll(".scroll-section").forEach(s => {
        if (s.dataset.enter === enter && s.dataset.leave === leave) {
          s.classList.add("preview-active");
        }
      });
    }

    // Scroll
    window.scrollTo({ top: scrollTop, behavior: "instant" });

    // Dark overlay (visible between 38-60% → scrollTop 3636-5220)
    const dark = document.getElementById("dark-overlay");
    const marquee = document.getElementById("marquee");
    const inDark = scrollTop >= 3636 && scrollTop <= 5220;
    if (dark) dark.style.opacity = inDark ? "0.90" : "0";
    if (marquee) {
      const mOpacity = inDark ? Math.min(1, (scrollTop - 3636) / (0.03 * 7200)) : 0;
      marquee.style.opacity = mOpacity.toString();
    }

    // Canvas clip-path
    const cw = document.getElementById("canvas-wrap");
    if (cw) cw.style.clipPath = scrollTop > 100 ? "circle(80% at 50% 50%)" : "circle(0% at 50% 50%)";

    // Hero opacity
    const hero = document.getElementById("hero");
    if (hero) hero.style.opacity = scrollTop > 200 ? "0" : "1";
  }, { scrollTop, enter, leave });

  await new Promise(r => setTimeout(r, 400));
  const fp = path.join(__dirname, "screenshots", "section-" + name + ".png");
  await page.screenshot({ path: fp });
  console.log("[screenshot] " + fp);
}

await browser.close();
server.close();
console.log("\nDone!");
