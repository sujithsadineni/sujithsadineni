// Builds the header and contact buttons, one SVG per GitHub theme (README picks with <picture>).
// Run: node scripts/assets.mjs
import fs from "node:fs";

const OUT = new URL("../assets/", import.meta.url).pathname;
fs.mkdirSync(`${OUT}buttons`, { recursive: true });

const SANS = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace`;
const esc = (s) => s.replace(/&/g, "&amp;");

const THEMES = {
  dark: {
    bg: ["#0b0f14", "#111827"], glowO: 0.28, dots: 0.05, hair: "#ffffff", hairO: 0.08,
    text: "#f0f6fc", sub: "#9198a1", accent: "#00c9a7", accent2: "#818cf8",
    glass: "#ffffff", glassO: 0.07, glassStroke: "#ffffff", glassStrokeO: 0.14, edge: 0.35,
    well: "#161b22", wellStroke: "#30363d", onAccent: "#04130f",
  },
  light: {
    bg: ["#f6f8fa", "#ffffff"], glowO: 0.18, dots: 0.06, hair: "#1f2328", hairO: 0.1,
    text: "#1f2328", sub: "#59636e", accent: "#00806a", accent2: "#4f46e5",
    glass: "#1f2328", glassO: 0.04, glassStroke: "#1f2328", glassStrokeO: 0.12, edge: 0.9,
    well: "#f3f4f6", wellStroke: "#d1d9e0", onAccent: "#ffffff",
  },
};

// enter once: fade + slight scale, critically damped feel (no overshoot); reduced motion gets a plain fade
const ENTER = `.in{opacity:0;transform-box:fill-box;transform-origin:center;animation:in .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes in{from{opacity:0;transform:scale(.97) translateY(6px)}to{opacity:1;transform:none}}`;
const ENTER_RM = `.in{animation:fade .2s forwards}@keyframes fade{to{opacity:1}}`;

const glassPill = (t, x, y, w, h, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${t.glass}" fill-opacity="${t.glassO}" stroke="${t.glassStroke}" stroke-opacity="${t.glassStrokeO}" ${extra}/>` +
  `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="${h / 2 - 1}" fill="none" stroke="url(#edge)"/>`;

// ---------- header ----------
const ROLES = ["Senior Full-Stack Engineer", "Cloud & Microservices Architect", "React, Java & AWS Specialist", "AI-Powered Product Builder", "Open-Source Project Builder"];
const CH = 12; // px per letter; textLength pins every font to this so the typing cover always fits

function header(t) {
  const roles = ROLES.map((r, i) => {
    const n = r.length, w = n * CH, delay = i === 0 ? 0 : -(ROLES.length - i) * 4;
    return `<g class="role" style="animation-delay:${delay}s">
      <text x="110" y="264" textLength="${w}" lengthAdjust="spacingAndGlyphs">${esc(r)}</text>
      <g class="cover" style="animation-delay:${delay}s;animation-timing-function:steps(${n},end);--w:${w + 4}px"><rect x="108" y="243" width="470" height="30" fill="${t.well}"/><rect class="caret" x="108" y="246" width="10" height="23" rx="1.5" fill="${t.accent}"/></g>
    </g>`;
  }).join("\n    ");

  // labels ride ellipses (wide, not tall) so inner and outer never touch; CSS keyframes trace the path, labels stay upright
  const ring = (name, rx, ry, labels, dur, reverse) => {
    const steps = 72, kf = Array.from({ length: steps + 1 }, (_, k) => { const a = (k / steps) * 2 * Math.PI - Math.PI / 2;
      return `${((k / steps) * 100).toFixed(2)}%{transform:translate(${(rx * Math.cos(a)).toFixed(1)}px,${(ry * Math.sin(a)).toFixed(1)}px)}`; }).join("");
    return `<style>@keyframes ${name}{${kf}}.${name}{animation:${name} ${dur}s linear infinite${reverse ? " reverse" : ""}}@media (prefers-reduced-motion:reduce){.${name}{animation-play-state:paused}}</style>
      <ellipse cx="950" cy="160" rx="${rx}" ry="${ry}" fill="none" stroke="${t.hair}" stroke-opacity="${t.hairO * 1.6}" stroke-dasharray="3 6"/>
      ${labels.map((l, i) => { const w = l.length * 7.8 + 24;
        return `<g class="${name}" style="animation-delay:${(-(i / labels.length) * dur).toFixed(2)}s">${glassPill(t, +(950 - w / 2).toFixed(1), 145, +w.toFixed(1), 30)}<text x="950" y="165" text-anchor="middle" font-size="13" font-weight="600" letter-spacing=".01em" fill="${t.text}">${esc(l)}</text></g>`;
      }).join("\n      ")}`;
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="320" viewBox="0 0 1200 320" role="img" aria-labelledby="t">
  <title id="t">Sujith Kumar Sadineni, Senior Full-Stack Engineer</title>
  <style>
    text { font-family: ${SANS}; }
    .mono text, text.mono { font-family: ${MONO}; }
    ${ENTER}
    .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.35s}.d4{animation-delay:.5s}
    /* five roles, 4s each: shared keyframes, negative delays give each its own slot */
    .role { animation: slot 20s linear infinite; }
    @keyframes slot { 0%, 19% { opacity: 1; } 19.01%, 100% { opacity: 0; } }
    .cover { animation: type 20s infinite; }
    @keyframes type { 0% { transform: translateX(0); } 9%, 100% { transform: translateX(var(--w)); } }
    .caret { animation: blink 1.06s steps(1) infinite; }
    @keyframes blink { 50% { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) {
      ${ENTER_RM}
      .caret { animation: none; }
      .role { animation: none; opacity: 0; } .role:first-child { opacity: 1; }
      .cover { animation: none; transform: translateX(var(--w)); }
    }
  </style>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/></linearGradient>
    <radialGradient id="g1"><stop offset="0" stop-color="${t.accent}" stop-opacity="${t.glowO}"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2"><stop offset="0" stop-color="${t.accent2}" stop-opacity="${t.glowO}"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="${t.hair}" fill-opacity="${t.dots}"/></pattern>
    <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${t.edge}"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent}" stop-opacity=".82"/></linearGradient>
    <clipPath id="card"><rect width="1200" height="320" rx="24"/></clipPath>
    <clipPath id="well"><rect x="100" y="238" width="520" height="40"/></clipPath>
  </defs>

  <g clip-path="url(#card)">
    <rect width="1200" height="320" fill="url(#bg)"/>
    <rect width="1200" height="320" fill="url(#dots)"/>
    <circle cx="1000" cy="70" r="280" fill="url(#g1)"/>
    <circle cx="780" cy="320" r="260" fill="url(#g2)"/>
  </g>
  <rect x=".5" y=".5" width="1199" height="319" rx="24" fill="none" stroke="${t.hair}" stroke-opacity="${t.hairO}"/>

  <!-- app-icon style mark -->
  <g class="in d1">
    <rect x="64" y="46" width="48" height="48" rx="12" fill="url(#tile)"/>
    <rect x="64.5" y="46.5" width="47" height="47" rx="11.5" fill="none" stroke="url(#edge)"/>
    <text x="88" y="77" text-anchor="middle" font-size="18" font-weight="700" letter-spacing="-.01em" fill="${t.onAccent}">SS</text>
    <text x="126" y="76" font-size="15" letter-spacing=".01em" fill="${t.sub}">github.com/sujithsadineni</text>
  </g>

  <text class="in d2" x="64" y="146" font-size="20" font-weight="500" letter-spacing=".005em" fill="${t.sub}">👋 Hi, I'm</text>
  <text class="in d2" x="62" y="200" font-size="52" font-weight="700" letter-spacing="-.022em" fill="${t.text}">Sujith Kumar Sadineni</text>

  <!-- typed role in an inset well -->
  <g class="in d3">
    <rect x="64" y="230" width="560" height="56" rx="16" fill="${t.well}" stroke="${t.wellStroke}"/>
    <rect x="65" y="231" width="558" height="54" rx="15" fill="none" stroke="url(#edge)" stroke-opacity=".5"/>
    <text class="mono" x="86" y="264" font-size="20" font-weight="600" fill="${t.accent}">$</text>
    <g class="mono" font-size="20" fill="${t.text}" clip-path="url(#well)">
    ${roles}
    </g>
  </g>

  <!-- orbit -->
  <g class="in d4">
    <rect x="922" y="132" width="56" height="56" rx="14" fill="url(#tile)"/>
    <rect x="922.5" y="132.5" width="55" height="55" rx="13.5" fill="none" stroke="url(#edge)"/>
    <text class="mono" x="950" y="166" text-anchor="middle" font-size="17" font-weight="700" fill="${t.onAccent}">&lt;/&gt;</text>
    ${ring("oi", 92, 64, ["React", "Java", "AWS"], 40, false)}
    ${ring("oo", 190, 132, ["Node.js", "GraphQL", "Docker", "Spring", "Claude API"], 64, true)}
    
  </g>
</svg>
`;
}

// ---------- buttons (glass capsules, Portfolio is the one prominent action) ----------
const LI = "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z";
const GLYPH = {
  globe: (c) => `<g fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"><circle cx="10" cy="10" r="8"/><ellipse cx="10" cy="10" rx="3.4" ry="8"/><path d="M2.6 7h14.8M2.6 13h14.8"/></g>`,
  linkedin: (c) => `<g transform="translate(2.2 1.6) scale(.035)"><path fill="${c}" d="${LI}"/></g>`,
  doc: (c) => `<g fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2.5h6.5L16 7v10.5H5z"/><path d="M11.5 2.5V7H16M7.8 11h5.4M7.8 14h5.4"/></g>`,
  mail: (c) => `<g fill="none" stroke="${c}" stroke-width="1.7" stroke-linejoin="round"><rect x="2.5" y="4.5" width="15" height="11" rx="2.2"/><path d="M3 5.5l7 5.5 7-5.5"/></g>`,
};
export const BUTTONS = [
  { id: "portfolio", label: "Portfolio", icon: "globe", primary: true },
  { id: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { id: "resume", label: "Résumé", icon: "doc" },
  { id: "email", label: "Email me", icon: "mail" },
];

// Apple-style push button: soft drop shadow, top-lit gradient body, bright rim, one glint sweep after it lands
function button(b, i, t) {
  const W = 164, H = 48, tw = b.label.length * 8.6, gx = (W - (20 + 9 + tw)) / 2, dark = t.text === "#f0f6fc";
  const ink = b.primary ? t.onAccent : t.text, at = (0.15 + i * 0.06).toFixed(2), glint = (0.9 + i * 0.12).toFixed(2);
  const top = b.primary ? (dark ? "#3ff0cf" : "#14a88c") : dark ? "#ffffff" : "#ffffff";
  const bottom = b.primary ? t.accent : dark ? "#ffffff" : "#f3f4f6";
  const [to, bo] = b.primary ? [1, 1] : dark ? [0.13, 0.05] : [1, 1];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W + 28}" height="${H + 36}" viewBox="-14 -12 ${W + 28} ${H + 36}" role="img" aria-label="${esc(b.label)}">
  <style>${ENTER}.in{animation-delay:${at}s}
  .glint{transform:translateX(-120px);animation:glint 1.1s cubic-bezier(.4,0,.2,1) ${glint}s forwards}
  @keyframes glint{to{transform:translateX(${W + 120}px)}}
  @media (prefers-reduced-motion:reduce){${ENTER_RM}.glint{animation:none;opacity:0}}</style>
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}" stop-opacity="${to}"/><stop offset="1" stop-color="${bottom}" stop-opacity="${bo}"/></linearGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${b.primary ? 0.6 : dark ? 0.32 : 1}"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${dark ? 0.22 : 0.55}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <filter id="sh" x="-12%" y="-40%" width="124%" height="200%"><feDropShadow dx="0" dy="${b.primary ? 6 : 4}" stdDeviation="${b.primary ? 7 : 5}" flood-color="${b.primary ? t.accent : "#000"}" flood-opacity="${b.primary ? 0.35 : dark ? 0.45 : 0.1}"/></filter>
    <clipPath id="cap"><rect width="${W}" height="${H}" rx="24"/></clipPath>
  </defs>
  <g class="in">
    <rect width="${W}" height="${H}" rx="24" fill="url(#body)" filter="url(#sh)"/>
    <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="23.5" fill="none" stroke="${b.primary ? t.accent : t.glassStroke}" stroke-opacity="${b.primary ? 0.9 : t.glassStrokeO}"/>
    <rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="22.5" fill="none" stroke="url(#rim)"/>
    <g clip-path="url(#cap)"><g transform="skewX(-20)"><rect class="glint" x="0" y="-10" width="70" height="${H + 20}" fill="url(#sheen)"/></g></g>
    <g transform="translate(${gx.toFixed(1)} 14)">${GLYPH[b.icon](ink)}</g>
    <text x="${(gx + 29).toFixed(1)}" y="30" font-family="${SANS}" font-size="15" font-weight="600" letter-spacing=".01em" fill="${ink}">${esc(b.label)}</text>
  </g>
</svg>
`;
}

for (const [name, t] of Object.entries(THEMES)) {
  fs.writeFileSync(`${OUT}header-${name}.svg`, header(t));
  BUTTONS.forEach((b, i) => fs.writeFileSync(`${OUT}buttons/${b.id}-${name}.svg`, button(b, i, t)));
}

// ---------- shared card material (sits on the GitHub page, so it matches GitHub's own surfaces) ----------
const CARD = {
  dark: { fill: "#161b22", stroke: "#30363d", edge: 0.18, text: "#f0f6fc", sub: "#9198a1", accent: "#00c9a7", shadow: "#000", shadowO: 0.35 },
  light: { fill: "#f6f8fa", stroke: "#d1d9e0", edge: 0.9, text: "#1f2328", sub: "#59636e", accent: "#00806a", shadow: "#1f2328", shadowO: 0.08 },
};
const wrap = (text, max) => text.split(" ").reduce((lines, w) => {
  const last = lines[lines.length - 1];
  if (last && (last + " " + w).length <= max) lines[lines.length - 1] = last + " " + w; else lines.push(w);
  return lines;
}, []);
const cardRect = (c, x, y, w, h, r = 20) =>
  `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${r}" fill="${c.fill}" stroke="${c.stroke}"/>` +
  `<rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="${r - 1}" fill="none" stroke="url(#edge)"/>`;
const svgOpen = (w, h, label, c, extraCss = "") => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
  <style>text{font-family:${SANS}}${ENTER}${extraCss}@media (prefers-reduced-motion:reduce){${ENTER_RM}}</style>
  <defs><linearGradient id="edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${c.edge}"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;


// ---------- Intro: bento of who I am + what I use (replaces About + Stack) ----------
const ICONS = new URL("./icons/", import.meta.url).pathname;
const INTRO = {
  dark: { ...CARD.dark, ai1: "#5e5ce6", ai2: "#00c9a7" },
  light: { ...CARD.light, ai1: "#5e5ce6", ai2: "#00a88c" },
};
const card = (c, x, y, w, h, r = 22, fill = c.fill) => cardRect({ ...c, fill }, x, y, w, h, r);
const t = (x, y, s, size, weight, fill, extra = "") => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(s)}</text>`;
const open = (w, h, label, c) => svgOpen(w, h, label, c) + `
<defs><linearGradient id="ai" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.ai1}"/><stop offset="1" stop-color="${c.ai2}"/></linearGradient>
<linearGradient id="aiSoft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.ai1}" stop-opacity=".22"/><stop offset="1" stop-color="${c.ai2}" stop-opacity=".12"/></linearGradient></defs>
<style>/* logos pop in one by one as their box arrives, once */
.pop{opacity:0;transform-box:fill-box;transform-origin:center;animation:pop .45s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
/* the only thing that keeps moving: a short twinkle on the AI sparkle, then a long rest */
.tw{transform-box:fill-box;transform-origin:center;animation:tw 4.5s ease-in-out 1.2s infinite}
@keyframes tw{0%,16%,100%{transform:none;opacity:1}6%{transform:scale(1.18) rotate(12deg);opacity:.85}}
@media (prefers-reduced-motion:reduce){.pop{animation:none;opacity:1}.tw{animation:none}}</style>`;
const d = (i) => `style="animation-delay:${(i * 0.07).toFixed(2)}s"`;
const LABEL = "Senior Full-Stack Engineer, 7+ years, Cognizant, Morgan Stanley and NC DHHS. React, Next.js, Angular, TypeScript, Redux, Java, Spring Boot, Node.js, Express, GraphQL, AWS, Jenkins, Docker, Kubernetes, Kafka, PostgreSQL, Grafana, Jest, Cypress, Claude API.";
let uid = 0;
// skillicons ship ids inside; suffix them so the same logo can appear twice in one file
const logo = (id, x, y, s, c, delay) => {
  const wrap = (inner) => delay === undefined ? inner : `<g class="pop" style="animation-delay:${delay.toFixed(2)}s">${inner}</g>`;
  if (id === "claude") return wrap(`<g transform="translate(${x} ${y}) scale(${s / 48})"><rect width="48" height="48" rx="11" fill="url(#ai)"/><g transform="translate(9 9) scale(1.5)"><path class="tw" fill="#fff" d="M10 1.5l1.9 5 5 1.9-5 1.9-1.9 5-1.9-5-5-1.9 5-1.9zM16 12.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></g></g>`);
  const n = ++uid;
  return wrap(fs.readFileSync(`${ICONS}si-${id}.svg`, "utf8").replace(/id="([^"]+)"/g, `id="$1-${n}"`).replace(/url\(#([^)]+)\)/g, `url(#$1-${n})`).replace(/href="#([^"]+)"/g, `href="#$1-${n}"`)
    .replace(/<svg width="[\d.]+" height="[\d.]+"/, `<svg x="${x}" y="${y}" width="${s}" height="${s}"`));
};
// A. Bento: identity tile + AI tile + one tile per area, logos large
function bento(c) {
  const area = (i, x, y, w, h, title, ids, note) => `<g class="in" ${d(i)}>${card(c, x, y, w, h)}${t(x + 24, y + 38, title, 17, 600, c.sub, 'letter-spacing=".02em"')}
    ${ids.map((id, j) => logo(id, x + 24 + j * 54, y + 58, 44, c, i * 0.07 + 0.3 + j * 0.07)).join("")}${note ? t(x + 24, y + h - 22, note, 14.5, 400, c.sub) : ""}</g>`;
  return open(1200, 540, LABEL, c) + `
  <g class="in">${card(c, 0, 0, 560, 340)}
    ${t(32, 54, "SENIOR FULL-STACK ENGINEER", 15, 700, c.accent, 'letter-spacing=".08em"')}
    ${t(30, 150, "7+ years", 84, 800, c.text, 'letter-spacing="-.035em"')}
    ${t(32, 200, "shipping web apps end to end:", 22, 500, c.sub)}
    ${t(32, 230, "UI, APIs, cloud and now AI.", 22, 500, c.sub)}
    <path d="M32 268h496" stroke="${c.stroke}"/>
    ${t(32, 306, "Cognizant  ·  Morgan Stanley  ·  NC DHHS", 18, 600, c.text)}</g>
  <g class="in" ${d(1)}><rect x="584.5" y=".5" width="615" height="159" rx="22" fill="url(#aiSoft)" stroke="${c.ai1}" stroke-opacity=".5"/>
    ${logo("claude", 608, 28, 56, c, 0.3)}${t(684, 54, "AI Engineering & LLM apps", 22, 700, c.text, 'letter-spacing="-.01em"')}
    ${t(684, 82, "Claude API · tool use · agent loops", 16.5, 400, c.sub)}${t(684, 106, "prompt caching · Claude Code", 16.5, 400, c.sub)}
    ${t(608, 140, "Shipped in cashflow: a grounded assistant over real data", 14.5, 600, c.accent)}</g>
  ${area(2, 584, 180, 300, 160, "FRONTEND", ["react", "nextjs", "angular", "ts", "redux"])}
  ${area(3, 900, 180, 300, 160, "BACKEND", ["java", "spring", "nodejs", "express", "graphql"])}
  ${area(4, 0, 364, 384, 176, "CLOUD & CONTAINERS", ["aws", "jenkins", "docker", "kubernetes"], "ECS · EC2 · S3 · CloudWatch · EKS")}
  ${area(5, 408, 364, 384, 176, "DATA & SCALE", ["kafka", "postgres", "grafana"], "SQL indexing · code splitting")}
  ${area(6, 816, 364, 384, 176, "TESTING & QUALITY", ["jest", "cypress"], "RTL · JUnit · Mockito · SonarQube")}
</svg>`;
}


// ---------- Journey: rail draws in, stops pop as it reaches them, "Now" breathes ----------
const STOPS = [
  ["2015", "B.E. Computer Science", "St Joseph's College of Engineering", "2015 – 2019"],
  ["2019", "Full-Stack Developer", "Cognizant", "2019 – 2022"],
  ["2022", "MS Computer Science", "Southern Arkansas University", "2022 – 2024"],
  ["2022", "Senior Full-Stack Developer", "Morgan Stanley", "2022 – 2025"],
  ["2025", "Senior Full-Stack Developer", "NC DHHS", "2025 – now", "now"],
  ["Today", "Building AI products", "Open source: cashflow, patchpilot", "", "today"],
];
function journey(c) {
  const W = 1200, H = 268, RAIL = 64, CW = 184, G = 16;
  const css = `.rail{stroke-dasharray:1100;stroke-dashoffset:1100;animation:draw 1.6s cubic-bezier(.2,.8,.2,1) .2s forwards}@keyframes draw{to{stroke-dashoffset:0}}
.pop{opacity:0;transform-box:fill-box;transform-origin:center;animation:pop .5s cubic-bezier(.2,.8,.2,1) forwards}@keyframes pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}
.breathe{transform-box:fill-box;transform-origin:center;animation:breathe 2.8s ease-in-out 2s infinite}@keyframes breathe{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:0;transform:scale(2.2)}}
@media (prefers-reduced-motion:reduce){.rail{animation:none;stroke-dashoffset:0}.pop{animation:none;opacity:1}.breathe{animation:none;opacity:0}}`;
  return svgOpen(W, H, `Journey: ${STOPS.map((s) => `${s[1]}, ${s[2]}${s[3] ? ` (${s[3]})` : ""}`).join("; ")}.`, c, css) + `
  <defs><linearGradient id="railg" gradientUnits="userSpaceOnUse" x1="100" y1="0" x2="1100" y2="0"><stop offset="0" stop-color="${c.accent}"/><stop offset=".8" stop-color="${c.accent}"/><stop offset="1" stop-color="#5e5ce6"/></linearGradient></defs>
  <path d="M100 ${RAIL}H1100" stroke="${c.stroke}" stroke-width="4" stroke-linecap="round"/>
  <path class="rail" d="M100 ${RAIL}H1100" stroke="url(#railg)" stroke-width="4" stroke-linecap="round" pathLength="1100"/>
  ${STOPS.map(([year, role, org, period, kind], i) => {
    const cx = 100 + i * 200, x = cx - CW / 2, at = (0.2 + i * 0.27).toFixed(2), col = kind === "today" ? "#5e5ce6" : c.accent;
    const roles = wrap(role, 17), orgs = wrap(org, 22);
    let y = 128; const body = [];
    roles.forEach((l) => { body.push(t(x + 16, y, l, 16, 700, c.text, 'letter-spacing="-.01em"')); y += 20; });
    y += 4; orgs.forEach((l) => { body.push(t(x + 16, y, l, 14, 400, c.sub)); y += 18; });
    return `<g class="pop" style="animation-delay:${at}s">
    <rect x="${cx - 30}" y="${RAIL - 50}" width="60" height="26" rx="13" fill="${col}" fill-opacity=".14"/>${t(cx, RAIL - 32, year, 13.5, 800, col, 'text-anchor="middle" letter-spacing=".02em"')}
    ${kind === "now" ? `<circle class="breathe" cx="${cx}" cy="${RAIL}" r="9" fill="${col}"/>` : ""}
    <circle cx="${cx}" cy="${RAIL}" r="9" fill="${c.fill}" stroke="${col}" stroke-width="3.5"/>${kind ? `<circle cx="${cx}" cy="${RAIL}" r="4" fill="${col}"/>` : ""}
    ${cardRect(c, x, RAIL + 30, CW, H - RAIL - 30, 18)}
    ${body.join("")}
    ${period ? t(x + 16, H - 22, period, 13, 600, c.sub, 'letter-spacing=".02em"') : ""}
    ${kind === "now" ? `<rect x="${x + CW - 62}" y="${H - 38}" width="46" height="22" rx="11" fill="${c.accent}" fill-opacity=".16"/>${t(x + CW - 39, H - 22.5, "Now", 12.5, 800, c.accent, 'text-anchor="middle"')}` : ""}
  </g>`; }).join("\n  ")}
</svg>
`;
}

// ---------- Building now: one card per project, each its own link ----------
const LOGOS = new URL("./logos/", import.meta.url).pathname;
const BUILDING = [
  { id: "cashflow", name: "cashflow", status: "Open source · live", line: "Open-source, local-first finance app with a grounded Claude assistant.", tint: null },
  { id: "patchpilot", name: "patchpilot", status: "In progress", line: "Automatic vulnerability-fix and version-upgrade detection for npm projects.", tint: "#5e5ce6" },
];
function building(b, i, c) {
  const W = 588, H = 176, col = b.tint ?? c.accent;
  const css = `.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.4s ease-out ${1 + i * 0.6}s infinite}@keyframes pulse{0%{opacity:.6;transform:scale(1)}70%,100%{opacity:0;transform:scale(2.6)}}@media (prefers-reduced-motion:reduce){.pulse{animation:none;opacity:0}}`;
  const logoSvg = fs.readFileSync(`${LOGOS}${b.id}-logo.svg`, "utf8").replace(/<\?xml[^>]*>/, "").replace(/<svg\b/, `<svg x="24" y="24" width="64" height="64"`);
  const sw = b.status.length * 7.3 + 40;
  return svgOpen(W, H, `${b.name}: ${b.status}. ${b.line}`, c, css) + `
  <g class="in" style="animation-delay:${(i * 0.08).toFixed(2)}s">${cardRect(c, 0, 0, W, H, 22)}
    ${logoSvg}
    ${t(106, 54, b.name, 26, 800, c.text, 'letter-spacing="-.02em"')}
    <rect x="106" y="66" width="${sw}" height="24" rx="12" fill="${col}" fill-opacity=".14"/>
    <circle class="pulse" cx="120" cy="78" r="4" fill="${col}"/><circle cx="120" cy="78" r="4" fill="${col}"/>${t(132, 82.5, b.status, 12.5, 700, col)}
    ${wrap(b.line, 62).map((l, j) => t(24, 126 + j * 22, l, 16, 400, c.sub)).join("")}
    ${t(W - 24, 54, "View repo ↗", 14.5, 700, c.accent, 'text-anchor="end"')}
  </g>
</svg>
`;
}

// ---------- Footer: calm waves, slower, tuned per theme ----------
function footer(c) {
  const dark = c.fill === "#161b22";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="110" viewBox="0 0 1200 110" role="img" aria-label="">
  <style>.w{animation:slide 16s linear infinite}.w2{animation-duration:24s;animation-direction:reverse}@keyframes slide{to{transform:translateX(-600px)}}@media (prefers-reduced-motion:reduce){.w{animation:none}}</style>
  <defs><linearGradient id="a" x1="0" x2="1"><stop offset="0" stop-color="${c.accent}"/><stop offset=".5" stop-color="#5e5ce6"/><stop offset="1" stop-color="${c.accent}"/></linearGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient>
  <mask id="m"><rect width="1200" height="110" fill="url(#fade)"/></mask></defs>
  <g mask="url(#m)">
    <path class="w w2" fill="url(#a)" fill-opacity="${dark ? 0.22 : 0.18}" d="M0 54 Q150 26 300 54 T600 54 T900 54 T1200 54 T1500 54 T1800 54 V110 H0 Z"/>
    <path class="w" fill="url(#a)" fill-opacity="${dark ? 0.5 : 0.38}" d="M0 70 Q150 96 300 70 T600 70 T900 70 T1200 70 T1500 70 T1800 70 V110 H0 Z"/>
  </g>
</svg>
`;
}

for (const [name, c] of Object.entries(CARD)) {
  fs.writeFileSync(`${OUT}intro-${name}.svg`, bento(INTRO[name]));
  fs.writeFileSync(`${OUT}journey-${name}.svg`, journey(c));
  fs.writeFileSync(`${OUT}footer-${name}.svg`, footer(c));
  BUILDING.forEach((b, i) => fs.writeFileSync(`${OUT}building-${b.id}-${name}.svg`, building(b, i, c)));
}
console.log("assets built");
