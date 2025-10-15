import Link from "next/link";
import Image from "next/image";
import { getAllProjectsMeta } from "@/lib/projects";

export default async function ProjectsIndex() {
  const projects = await getAllProjectsMeta();
  return (
    <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
      {projects.map((p) => (
        <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
          {p.cover ? (
            <Image
              src={p.cover}
              alt={p.title}
              width={1200}
              height={675}
              className="rounded"
            />
          ) : null}
          <h2 className="mt-3 text-xl font-semibold group-hover:underline">{p.title}</h2>
          {p.summary ? (
            <p className="text-zinc-600 dark:text-zinc-400">{p.summary}</p>
          ) : null}
        </Link>
      ))}
    </div>
  );
}


