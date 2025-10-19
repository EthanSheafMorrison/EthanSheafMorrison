import { getAllProjectsMeta } from "@/lib/projects";
import ProjectsList from "@/components/ProjectsList";
export const dynamic = "force-static";
export const revalidate = false;
export const metadata = {
  title: "Projects",
  description: "Selected projects and case studies.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsIndex() {
  const projects = await getAllProjectsMeta();
  return (
    <div className="mx-auto max-w-5xl px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Projects</h1>
      <div className="mt-8">
        <ProjectsList projects={projects} variant="panel" />
      </div>
    </div>
  );
}


