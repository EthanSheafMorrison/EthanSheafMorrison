import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type ProjectMeta = {
  slug: string;
  title: string;
  date?: string | Date;
  summary?: string;
  cover?: string;
  tags?: string[];
};

const contentDir = path.join(process.cwd(), "content", "projects");

export async function getProjectSlugs(): Promise<string[]> {
  const entries = await fs.readdir(contentDir);
  return entries.filter((e) => e.endsWith(".mdx")).map((e) => e.replace(/\.mdx$/, ""));
}

export async function getAllProjectsMeta(): Promise<ProjectMeta[]> {
  const slugs = await getProjectSlugs();
  const metas = await Promise.all(
    slugs.map(async (slug) => {
      const file = await fs.readFile(path.join(contentDir, `${slug}.mdx`), "utf8");
      const { data } = matter(file);
      return { slug, ...(data as Omit<ProjectMeta, "slug">) };
    })
  );
  const toTime = (d: unknown): number => {
    if (!d) return 0;
    if (d instanceof Date) return d.getTime();
    if (typeof d === "string") return new Date(d).getTime() || 0;
    if (typeof d === "number") return new Date(d).getTime() || 0;
    return 0;
  };
  return metas.sort((a, b) => toTime(b.date) - toTime(a.date));
}

export async function getProjectBySlug(slug: string) {
  const raw = await fs.readFile(path.join(contentDir, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  return { meta: { slug, ...(data as Omit<ProjectMeta, "slug">) }, content };
}


