import { writeFile, readdir, readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content", "projects");

const entries = await readdir(contentDir).catch(() => []);
const slugs = entries.filter((e) => e.endsWith(".mdx")).map((e) => e.replace(/\.mdx$/, ""));

const metas = await Promise.all(
  slugs.map(async (slug) => {
    const file = await readFile(path.join(contentDir, `${slug}.mdx`), "utf8");
    const { data } = matter(file);
    return { slug, ...data };
  })
);
metas.sort((a, b) => {
  const aTime = a?.date ? new Date(a.date).getTime() : 0;
  const bTime = b?.date ? new Date(b.date).getTime() : 0;
  return bTime - aTime;
});

const dataDir = path.join(process.cwd(), "data");
await mkdir(dataDir, { recursive: true });
const outPath = path.join(dataDir, "projects.json");
await writeFile(outPath, JSON.stringify(metas, null, 2), "utf8");
console.log(`Wrote ${metas.length} projects to ${outPath}`);


