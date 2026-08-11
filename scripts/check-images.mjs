// Case-sensitive validation of every image referenced by the content against
// /public (macOS is case-insensitive; Vercel/Linux is not).
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "src/content/projects");
const PUBLIC = path.join(ROOT, "public");

const refs = new Set();
for (const file of fs.readdirSync(CONTENT)) {
  if (!file.endsWith(".mdx")) continue;
  const txt = fs.readFileSync(path.join(CONTENT, file), "utf8");
  // cover:, gallery src:, and src="..." on any component (Figure, Video, FigureRow
  // items, poster frames). The unquoted-key form `src: "..."` covers both YAML
  // gallery entries and the object literals inside <FigureRow images={[...]}>.
  for (const m of txt.matchAll(/(?:cover:|src:)\s*["']([^"']+)["']/g)) refs.add(`${file}\t${m[1]}`);
  for (const m of txt.matchAll(/\b(?:src|poster)=["']([^"']+)["']/g)) refs.add(`${file}\t${m[1]}`);
}

function existsCaseSensitive(rel) {
  // Validate every path segment exactly, so directory case mismatches
  // (silently resolved on macOS) are caught the way Linux would.
  const segments = decodeURIComponent(rel).replace(/^\//, "").split("/");
  let dir = PUBLIC;
  for (const seg of segments) {
    let listing;
    try {
      listing = fs.readdirSync(dir);
    } catch {
      return false;
    }
    if (!listing.includes(seg)) return false;
    dir = path.join(dir, seg);
  }
  return true;
}

let bad = 0;
for (const entry of [...refs].sort()) {
  const [file, ref] = entry.split("\t");
  if (!ref.startsWith("/images/")) continue;
  if (!existsCaseSensitive(ref)) {
    bad++;
    console.log(`BROKEN  ${file}\n        ${ref}`);
  }
}
console.log(`\n${refs.size} refs checked, ${bad} broken (case-sensitive).`);
