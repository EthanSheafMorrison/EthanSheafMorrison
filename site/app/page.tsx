import Hero from "@/components/Hero";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import ProjectsList from "@/components/ProjectsList";
import { getAllProjectsMeta } from "@/lib/projects";
export const dynamic = "force-static";
export const revalidate = false;

export default async function Home() {
  const projects = await getAllProjectsMeta();
  const featured = projects
    .filter((p) => p.featured)
    .slice(0, 8)
    .map((p) => ({ slug: p.slug, title: p.title, cover: p.cover, summary: p.summary, accent: p.accent }));
  return (
  <div className="h-dvh overflow-y-auto snap-y snap-mandatory" style={{ background: "var(--background)" }}>
      <section id="hero" className="h-dvh snap-start snap-always flex items-center" style={{ background: "var(--background)" }}>
        <div className="w-full">
          <Hero />
        </div>
      </section>
      <section id="featured" className="snap-start snap-always" style={{ background: "var(--background)" }}>
        <FeaturedShowcase items={featured} />
      </section>
      <section id="projects" className="h-dvh snap-start snap-always flex items-center" style={{ background: "var(--background)" }}>
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-semibold">Projects</h2>
          <div className="mt-6 max-h-[70vh] overflow-auto pr-2">
            <ProjectsList projects={projects} />
          </div>
        </div>
      </section>
    </div>
  );
}
