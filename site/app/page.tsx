import Hero from "@/components/Hero";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import ProjectsList from "@/components/ProjectsList";
import { getAllProjectsMeta } from "@/lib/projects";

export default async function Home() {
  const projects = await getAllProjectsMeta();
  const featured = projects
    .filter((p) => p.featured)
    .slice(0, 8)
    .map((p) => ({ slug: p.slug, title: p.title, cover: p.cover, summary: p.summary }));
  return (
    <div className="h-dvh overflow-y-auto snap-y snap-mandatory">
      <section id="hero" className="h-dvh snap-start snap-always flex items-center">
        <div className="mx-auto max-w-5xl px-4 w-full">
          <Hero />
        </div>
      </section>
      <section id="featured" className="h-dvh snap-start snap-always flex items-center">
        <div className="mx-auto max-w-5xl px-4 w-full">
          <FeaturedCarousel items={featured} />
        </div>
      </section>
      <section id="projects" className="h-dvh snap-start snap-always flex items-center">
        <div className="mx-auto max-w-5xl px-4 w-full">
          <h2 className="text-2xl md:text-3xl font-semibold">Projects</h2>
          <div className="mt-6 max-h-[70vh] overflow-auto pr-2">
            <ProjectsList projects={projects} />
          </div>
        </div>
      </section>
    </div>
  );
}
