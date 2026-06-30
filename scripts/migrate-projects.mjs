// One-off migration: convert the authoritative /projects/*.html cinematic pages
// into MDX content-collection entries, reconciled with projects-data.js.
// Run from repo root: node scripts/migrate-projects.mjs
import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";

const ROOT = process.cwd();
const PROJECTS_HTML = path.join(ROOT, "projects");
const OUT = path.join(ROOT, "src/content/projects");
fs.mkdirSync(OUT, { recursive: true });

// filename (in /projects) -> slug (matches astro.config redirects)
const FILE_TO_SLUG = {
  "FindingKuku.html": "finding-kuku",
  "MappingHumanEarthSystems.html": "mapping-human-earth-systems",
  "WesternSahara.html": "western-sahara",
  "GoogleWarming.html": "google-warming",
  "SavingScreenTime.html": "saving-screen-time",
  "Tokotoko.html": "tokotoko",
  "Iterate.html": "iterate",
  "CollatedFrames.html": "collated-frames",
  "kihikihi.html": "kihikihi",
  "EmptyVesselsVideo.html": "empty-vessels-video",
  "EmptyVesselsInstall.html": "empty-vessels-install",
  "Pixaura.html": "pixaura",
  "herito.html": "he-rito",
  "dream-atlas.html": "dream-atlas",
};

// The featured projects get full research case-study treatment (Phase 3).
const FEATURED = new Set([
  "mapping-human-earth-systems",
  "tokotoko",
  "google-warming",
  "saving-screen-time",
  "western-sahara",
]);

// --- Load projects-data.js (plain script, not a module) ---
const dataTxt = fs.readFileSync(path.join(ROOT, "projects-data.js"), "utf8");
const projectsData = Function(dataTxt + "\nreturn projectsData;")();

function slugForEntry(entry) {
  if (/^https?:/i.test(entry.url)) return "embodied-cartographies";
  const base = entry.url.split("/").pop();
  return FILE_TO_SLUG[base] ?? base.replace(/\.html$/, "").toLowerCase();
}
const dataBySlug = new Map(projectsData.map((e) => [slugForEntry(e), e]));

// --- helpers ---
const fixImg = (src) => {
  if (!src) return src;
  if (/^https?:/i.test(src)) return src;
  let s = src.replace(/^\.\.\//, "/").replace(/^\.\//, "/");
  if (!s.startsWith("/")) s = "/" + s;
  return s;
};

const fixHref = (href) => {
  if (!href) return href;
  if (/^https?:|^mailto:|^#/i.test(href)) return href;
  if (/index\.html(#projects)?$/.test(href)) {
    return href.includes("#projects") ? "/#projects" : "/";
  }
  const m = href.match(/([A-Za-z0-9_-]+\.html)$/);
  if (m && FILE_TO_SLUG[m[1]]) return "/projects/" + FILE_TO_SLUG[m[1]];
  return href.replace(/^\.\.\//, "/");
};

// inline HTML -> markdown for a node's children
function inline(node) {
  let out = "";
  for (const c of node.childNodes) {
    if (c.nodeType === 3) {
      out += c.rawText.replace(/\s+/g, " ");
    } else {
      const tag = c.rawTagName?.toLowerCase();
      if (tag === "strong" || tag === "b") out += `**${inline(c).trim()}**`;
      else if (tag === "em" || tag === "i") out += `_${inline(c).trim()}_`;
      else if (tag === "br") out += "  \n";
      else if (tag === "a")
        out += `[${inline(c).trim()}](${fixHref(c.getAttribute("href"))})`;
      else out += inline(c);
    }
  }
  return out;
}

const yaml = (v) => {
  if (Array.isArray(v)) return `[${v.map((x) => yaml(x)).join(", ")}]`;
  if (typeof v === "string") return JSON.stringify(v);
  return String(v);
};

function figureMDX(fig) {
  const img = fig.querySelector("img");
  const cap = fig.querySelector("figcaption");
  const src = fixImg(img?.getAttribute("src"));
  const alt = (img?.getAttribute("alt") || "").trim();
  const caption = cap ? inline(cap).trim() : "";
  const attrs = [`src=${yaml(src)}`, `alt=${yaml(alt)}`];
  if (caption) attrs.push(`caption=${yaml(caption)}`);
  return `<Figure ${attrs.join(" ")} />`;
}

let summary = [];

for (const [file, slug] of Object.entries(FILE_TO_SLUG)) {
  const html = fs.readFileSync(path.join(PROJECTS_HTML, file), "utf8");
  const doc = parse(html);

  const entry = dataBySlug.get(slug) || {};
  const headerTitle = doc.querySelector(".cin-header-title")?.text.trim();
  const headerMeta = doc.querySelector(".cin-header-meta")?.text.trim() || "";
  const [yearStr = "", rolesStr = "", typesStr = ""] = headerMeta
    .split("·")
    .map((s) => s.trim());

  // rail meta
  const rail = {};
  const dl = doc.querySelector(".cin-rail-meta");
  if (dl) {
    const dts = dl.querySelectorAll("dt");
    const dds = dl.querySelectorAll("dd");
    dts.forEach((dt, i) => (rail[dt.text.trim().toLowerCase()] = dds[i]?.text.trim()));
  }

  const year = rail.date || yearStr || "";
  const role = rail.role || rolesStr || "";

  // chapters
  const bodyParts = [];
  for (const ch of doc.querySelectorAll(".cin-chapter")) {
    const id = ch.getAttribute("id");
    if (id === "gallery") continue; // gallery lifted to frontmatter
    const label = ch.querySelector(".cin-chapter-label")?.text.trim() || "";
    bodyParts.push(`## ${label}`);
    for (const node of ch.childNodes) {
      if (node.nodeType !== 1) continue;
      const tag = node.rawTagName.toLowerCase();
      const cls = node.getAttribute("class") || "";
      if (cls.includes("cin-chapter-label")) continue;
      if (tag === "p") {
        const t = inline(node).trim();
        if (t) bodyParts.push(t);
      } else if (tag === "ul") {
        for (const li of node.querySelectorAll("li")) {
          bodyParts.push(`- ${inline(li).trim()}`);
        }
      } else if (tag === "figure") {
        bodyParts.push(figureMDX(node));
      }
    }
    bodyParts.push("");
  }

  // gallery (lift from .cin-gallery, fallback .cin-strip)
  let galleryFigs = doc.querySelectorAll(".cin-gallery .cin-gallery-figure");
  let gallery = [];
  if (galleryFigs.length) {
    gallery = galleryFigs.map((fig) => {
      const img = fig.querySelector("img");
      const cap = fig.querySelector("figcaption");
      const g = { src: fixImg(img?.getAttribute("src")) };
      const alt = (img?.getAttribute("alt") || cap?.text || "").trim();
      if (alt) g.alt = alt;
      return g;
    });
  } else {
    gallery = doc
      .querySelectorAll(".cin-strip img")
      .map((img) => ({ src: fixImg(img.getAttribute("src")) }))
      .filter((g) => g.src);
  }

  const title = entry.title || headerTitle || slug;
  const number = entry.number || "99";
  const tags = entry.tags || [];
  const cover = fixImg(entry.image) || gallery[0]?.src || "";
  const summaryText = entry.description || "";
  const yearNum = (year.match(/(\d{4})(?!.*\d{4})/) || [])[1] || "2024";

  const fm = [
    "---",
    `title: ${yaml(title)}`,
    `number: ${yaml(number)}`,
    `date: ${yearNum}-01-01`,
    `summary: ${yaml(summaryText)}`,
    `cover: ${yaml(cover)}`,
    `tags: ${yaml(tags)}`,
    `featured: ${FEATURED.has(slug)}`,
    `tier: ${FEATURED.has(slug) ? "case-study" : "project"}`,
    role ? `role: ${yaml(role)}` : null,
    year ? `year: ${yaml(year)}` : null,
    typesStr ? `# type line: ${typesStr}` : null,
    gallery.length ? "gallery:" : null,
    ...gallery.map((g) => `  - src: ${yaml(g.src)}${g.alt ? `\n    alt: ${yaml(g.alt)}` : ""}`),
    "---",
    "",
    "import Figure from '../../components/mdx/Figure.astro';",
    "",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const out = fm + "\n" + bodyParts.join("\n\n").replace(/\n{3,}/g, "\n\n") + "\n";
  fs.writeFileSync(path.join(OUT, `${slug}.mdx`), out);
  summary.push(`${slug.padEnd(30)} chapters:${doc.querySelectorAll(".cin-chapter").length - (doc.querySelector("#gallery") ? 1 : 0)} gallery:${gallery.length}`);
}

console.log("Migrated:\n" + summary.join("\n"));
