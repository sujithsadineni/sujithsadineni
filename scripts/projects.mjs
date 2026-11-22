// Featured projects: one big card that rotates through every project + a reverse L of small cards.
// Run: node scripts/projects.mjs  (writes assets/projects-dark.svg and assets/projects-light.svg)
import fs from "node:fs";
const OUT = new URL("../assets", import.meta.url).pathname;
const LOGOS = new URL("./logos/", import.meta.url).pathname;
const SHOTS = new URL("./shots/", import.meta.url).pathname;
const SANS = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif`;
const esc = (s) => s.replace(/&/g, "&amp;");
const T = {
  dark: { fill: "#161b22", stroke: "#30363d", edge: 0.18, text: "#f0f6fc", sub: "#9198a1", accent: "#00c9a7", chip: "#21262d", ai1: "#5e5ce6" },
  light: { fill: "#f6f8fa", stroke: "#d1d9e0", edge: 0.9, text: "#1f2328", sub: "#59636e", accent: "#00806a", chip: "#eaeef2", ai1: "#5e5ce6" },
};
const P = [
  { n: "cashflow", logo: "cashflow", shot: "cashflow-overview", line: "Local-first household expense tracker with a grounded Claude assistant.", tags: ["React 19", "Node.js", "PostgreSQL", "Claude API"], hard: ["Claude tool use over read-only queries", "Money as integer cents, never floats"], featured: true },
  { n: "aws-dropvault", logo: "dropvault", shot: "dropvault-vault", line: "Serverless private file vault: S3, Cognito, Lambda, DynamoDB.", tags: ["AWS CDK", "S3", "Lambda", "Cognito"], hard: ["Presigned uploads straight to S3", "Whole stack as code with CDK"] },
  { n: "postdeck", logo: "postdeck", shot: "postdeck-dashboard", line: "Posts admin console: tables, charts, forms and themes in Ant Design 6.", tags: ["React 19", "Ant Design 6", "TypeScript"], hard: ["Design-token theming: dark, compact, brand", "Safe spreadsheet export, no formula injection"] },
  { n: "aisle", logo: "aisle", shot: "aisle-home", line: "Storefront with filters, cart maths and a three-step checkout.", tags: ["React 19", "TypeScript", "A11y"], hard: ["Cart maths: stock, promos, shipping and GST", "Checkout that validates every field"] },
  { n: "doorway", logo: "doorway", shot: "doorway-gallery", line: "Ten 2026 design styles for log in, sign up and checkout.", tags: ["React 19", "CSS", "A11y"], hard: ["One form layer, ten looks, all in CSS", "Luhn, card-brand detection and formatting"] },
  { n: "PosterWall", logo: "posterwall", shot: "posterwall-wall", line: "Movie-poster board: ratings, likes and comments in five languages.", tags: ["GraphQL", "PostgreSQL", "Playwright"], hard: ["REST + MySQL rebuilt as GraphQL + PostgreSQL", "Uploads checked by their bytes"] },
  { n: "Portfolio", logo: "portfolio", shot: "portfolio-home", line: "React 19 portfolio with light and dark themes and five mini-games.", tags: ["React 19", "TypeScript", "SCSS"], hard: ["View Transitions without libraries", "Keyboard, contrast and reduced motion"] },
  { n: "patchpilot", logo: "patchpilot", shot: "patchpilot-soon", line: "Finds vulnerable npm packages and the safe version to move to.", tags: ["Node.js", "npm audit"], hard: ["Reads npm audit, proposes n-1 upgrades"], wip: true },
];
let uid = 0;
const logo = (p, x, y, s) => {
  if (p.logo === "portfolio") return `<image x="${x}" y="${y}" width="${s}" height="${s}" href="data:image/png;base64,${fs.readFileSync(LOGOS + "portfolio-logo.png").toString("base64")}"/>`;
  const n = ++uid;
  return fs.readFileSync(`${LOGOS}${p.logo}-logo.svg`, "utf8").replace(/<\?xml[^>]*>/, "").replace(/id="([^"]+)"/g, `id="$1-${n}"`).replace(/url\(#([^)]+)\)/g, `url(#$1-${n})`).replace(/href="#([^"]+)"/g, `href="#$1-${n}"`)
    .replace(/<svg\b/, `<svg x="${x}" y="${y}" width="${s}" height="${s}"`);
};
const card = (c, x, y, w, h, r = 20) => `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${r}" fill="${c.fill}" stroke="${c.stroke}"/><rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="${r - 1}" fill="none" stroke="url(#edge)"/>`;
const t = (x, y, s, size, weight, fill, extra = "") => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(s)}</text>`;
const chip = (c, x, y, s) => { const w = s.length * 7.4 + 20; return [`<rect x="${x}" y="${y}" width="${w}" height="26" rx="13" fill="${c.chip}"/>${t(x + 10, y + 17.5, s, 13, 600, c.sub)}`, w]; };
const chips = (c, x, y, tags, right = false) => { let out = "", cx = x; const ws = tags.map((s) => s.length * 7.4 + 20); if (right) cx = x - ws.reduce((a, b) => a + b + 8, -8);
  tags.forEach((s) => { const [h, w] = chip(c, cx, y, s); out += h; cx += w + 8; }); return out; };
const badge = (c, p, x, y) => p.featured ? `<rect x="${x}" y="${y}" width="80" height="22" rx="11" fill="${c.accent}" fill-opacity=".15"/>${t(x + 11, y + 15.5, "Featured", 12.5, 700, c.accent)}` : p.wip ? `<rect x="${x}" y="${y}" width="94" height="22" rx="11" fill="${c.ai1}" fill-opacity=".15"/>${t(x + 11, y + 15.5, "In progress", 12.5, 700, c.ai1)}` : "";
const open = (w, h, label, c) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
<style>text{font-family:${SANS}}.in{opacity:0;transform-box:fill-box;transform-origin:center;animation:in .6s cubic-bezier(.2,.8,.2,1) forwards}@keyframes in{from{opacity:0;transform:scale(.97) translateY(6px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.in{animation:fade .2s forwards}@keyframes fade{to{opacity:1}}}</style>
<defs><linearGradient id="edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${c.edge}"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
const d = (i) => `style="animation-delay:${(i * 0.06).toFixed(2)}s"`;
const LABEL = `Featured projects: ${P.map((p) => `${p.n}, ${p.line}`).join(" ")}`;


// Hero + reverse L: cashflow leads; every 6s the next project fills the big card and its small card lights up.
const SLOT = 6, N = P.length, CYCLE = SLOT * N, END = (100 / N).toFixed(2);
const big = (p) => `data:image/jpeg;base64,${fs.readFileSync(`${SHOTS}${p.shot}.jpg`).toString("base64")}`;
function hero(c) {
  const HW = 860, HH = 470, G = 24, RW = 1200 - HW - G, SH = (HH - 3 * 16) / 4, BH = 128, IB = 104; // IB: info bar height (~20%)
  const dark = c.fill === "#161b22";
  const css = `
/* each project owns one ${SLOT}s slot of the ${CYCLE}s loop; negative delays place it */
.slot{opacity:0;animation:slot ${CYCLE}s linear infinite}
@keyframes slot{0%{opacity:0}1.5%{opacity:1}${(END - 1.5).toFixed(2)}%{opacity:1}${END}%{opacity:0}100%{opacity:0}}
/* slow push-in on the screenshot while it is shown */
.kb{transform-box:fill-box;transform-origin:50% 40%;animation:kb ${CYCLE}s linear infinite}
@keyframes kb{0%{transform:scale(1.0)}${END}%{transform:scale(1.07)}100%{transform:scale(1.07)}}
/* info rises in a beat after the picture */
.info{animation:info ${CYCLE}s cubic-bezier(.2,.8,.2,1) infinite}
@keyframes info{0%{opacity:0;transform:translateY(24px)}0.6%{opacity:0;transform:translateY(24px)}3%{opacity:1;transform:none}100%{opacity:1;transform:none}}
/* progress bar fills during each slot */
.bar{transform-box:fill-box;transform-origin:left;animation:bar ${SLOT}s linear infinite}
@keyframes bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
/* small cards: logos pop in once, then the active one lifts */
.pop{opacity:0;transform-box:fill-box;transform-origin:center;animation:pop .5s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes pop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:none}}
.lift{transform-box:fill-box;transform-origin:center;animation:lift ${CYCLE}s cubic-bezier(.2,.8,.2,1) infinite}
@keyframes lift{0%{transform:none}2%{transform:scale(1.2) rotate(-6deg)}4%{transform:scale(1.12)}${(END - 1).toFixed(2)}%{transform:scale(1.12)}${END}%{transform:none}100%{transform:none}}
@media (prefers-reduced-motion:reduce){.slot,.kb,.info,.bar,.lift{animation:none}.pop{animation:none;opacity:1}.s0{opacity:1}}`;
  const delay = (i) => `animation-delay:${i === 0 ? 0 : -(N - i) * SLOT}s`;
  const small = [];
  for (let i = 0; i < 4; i++) small.push([HW + G, i * (SH + 16), RW, SH]);
  const bw = (HW - 2 * 16) / 3;
  for (let i = 0; i < 3; i++) small.push([i * (bw + 16), HH + G, bw, BH]);
  small.push([HW + G, HH + G, RW, BH]);
  return open(1200, HH + G + BH, LABEL, c).replace("</style>", css + "</style>") + `
  <defs><clipPath id="hc"><rect x="1" y="1" width="${HW - 2}" height="${HH - 2}" rx="23"/></clipPath><clipPath id="ib"><rect x="1" y="${HH - IB}" width="${HW - 2}" height="${IB - 1}" rx="0"/></clipPath>
  <filter id="frost" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="14"/></filter></defs>
  <g class="in">${card(c, 0, 0, HW, HH, 24)}</g>
  <g clip-path="url(#hc)">
  ${P.map((p, i) => `<g class="slot${i === 0 ? " s0" : ""}" style="${delay(i)}">
    <g class="kb" style="${delay(i)}"><image id="img${i}" x="0" y="0" width="${HW}" height="${HH}" preserveAspectRatio="xMidYMin slice" href="${big(p)}"/></g>
    <!-- frosted info bar: the same picture blurred under a tinted layer -->
    <g clip-path="url(#ib)"><use href="#img${i}" filter="url(#frost)"/><rect x="0" y="${HH - IB}" width="${HW}" height="${IB}" fill="${c.fill}" fill-opacity="${dark ? 0.72 : 0.78}"/></g>
    <path d="M0 ${HH - IB + 0.5}H${HW}" stroke="#fff" stroke-opacity="${dark ? 0.14 : 0.7}"/>
    <g class="info" style="${delay(i)}">
      ${logo(p, 24, HH - IB + 22, 60)}
      ${t(100, HH - IB + 50, p.n, 28, 800, c.text, 'letter-spacing="-.02em"')}${badge(c, p, 110 + p.n.length * 15.5, HH - IB + 31)}
      ${t(100, HH - IB + 78, p.line, 16.5, 400, c.sub)}
      <rect x="${HW - 172}" y="${HH - IB + 30}" width="148" height="44" rx="22" fill="${c.accent}"/>${t(HW - 98, HH - IB + 58, p.wip ? "Preview ↗" : "Live demo ↗", 16, 700, dark ? "#04130f" : "#ffffff", 'text-anchor="middle"')}
    </g>
  </g>`).join("\n  ")}
  <rect class="bar" x="0" y="${HH - 4}" width="${HW}" height="3" fill="${c.accent}"/>
  </g>
  ${small.map(([x, y, w, h], i) => { const p = P[i]; return `<g class="in" ${d(i + 1)}>${card(c, x, y, w, h, 18)}
    <rect class="slot${i === 0 ? " s0" : ""}" style="${delay(i)}" x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="17" fill="${c.accent}" fill-opacity=".1" stroke="${c.accent}" stroke-width="2"/>
    <g class="pop" style="animation-delay:${(0.35 + i * 0.07).toFixed(2)}s"><g class="lift" style="${delay(i)}">${logo(p, x + 22, y + h / 2 - 28, 56)}</g></g>
    ${t(x + 94, y + h / 2 + 8, p.n, 22, 700, c.text, 'letter-spacing="-.015em"')}</g>`; }).join("\n  ")}
</svg>`;
}
for (const [th, c] of Object.entries(T)) fs.writeFileSync(`${OUT}/projects-${th}.svg`, hero(c));
console.log("projects built");
function wrap(text, max) { return text.split(" ").reduce((l, w) => { const last = l[l.length - 1]; if (last && (last + " " + w).length <= max) l[l.length - 1] = last + " " + w; else l.push(w); return l; }, []); }
