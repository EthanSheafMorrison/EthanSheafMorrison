import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

/** Visible projects in explicit display order (the `number` field). */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", (p) => p.data.visible !== false);
  return projects.sort((a, b) => a.data.number.localeCompare(b.data.number));
}

/** The destination for a project card: external site if set, else its page. */
export function projectHref(p: Project): string {
  return p.data.externalUrl ?? `/projects/${p.id}`;
}
