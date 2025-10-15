import { getAllProjectsMeta } from "@/lib/projects";
import ProjectsList from "@/components/ProjectsList";

export default async function ProjectsIndex() {
  const projects = await getAllProjectsMeta();
  return (
    <div className="mx-auto max-w-5xl px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Projects</h1>
      <div className="mt-8">
        <ProjectsList projects={projects} />
      </div>
    </div>
  );
}


