// Tag classification driving the Type/Topic filter facets, carried over verbatim
// from the original projects-renderer.js so filtering behaves identically.
export const TYPE_TAGS = [
  "Critical Cartography and Design Research",
  "Research",
  "Installation",
  "Web",
  "Web Design",
  "Data",
  "Photography",
  "Mapping",
  "Graphic Design",
  "Exhibition Design",
  "Typography",
  "Branding",
  "Video",
  "Creative Coding",
  "Digital Media",
  "Design",
] as const;

export const TOPIC_TAGS = [
  "Art",
  "Cultural",
  "Environmental",
  "Climate",
  "Digital",
  "Visual",
  "Spatial",
  "Sequential",
  "Policy",
] as const;

export type FacetGroup = "type" | "topic";

/** Ordered, counted facet entries for a group, given the visible projects' tags. */
export function buildFacet(group: FacetGroup, allTags: string[]) {
  const order = group === "type" ? TYPE_TAGS : TOPIC_TAGS;
  const counts = new Map<string, number>();
  for (const t of allTags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return order
    .filter((t) => counts.has(t))
    .map((t) => ({ tag: t, slug: t.toLowerCase(), count: counts.get(t)! }));
}
