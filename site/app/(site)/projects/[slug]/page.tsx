import { notFound } from "next/navigation";
import { getPrevNext, getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import { renderMDX, type MDXComponentsMap } from "@/lib/mdx";
import MDXComponents from "@/components/MDXComponents";
import ProjectGallery from "@/components/ProjectGallery";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { meta } = await getProjectBySlug(params.slug);
  const url = `/projects/${params.slug}`;
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: url },
    openGraph: { url, title: meta.title, description: meta.summary, images: meta.cover ? [meta.cover] : [] },
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return notFound();
  const { meta, content } = project;
  const gallery = (meta as { gallery?: { src: string; alt?: string }[]; cover?: string }).gallery ?? (meta.cover ? [{ src: meta.cover }] : []);
  const neighbors = await getPrevNext(meta.slug);
  return (
    <article className="mx-auto max-w-6xl px-4">
      <header className="pb-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase">
          {meta.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          {meta.date ? (
            <span className="border px-2 py-0.5 uppercase">
              {new Date(meta.date as unknown as string).toLocaleDateString()}
            </span>
          ) : null}
          {(meta.tags ?? []).map((t) => (
            <span key={t} className="border px-2 py-0.5 uppercase tracking-wide">
              {t}
            </span>
          ))}
        </div>
      </header>
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7 md:sticky md:top-4 md:self-start">
          <ProjectGallery items={gallery} />
        </div>
        <div className="md:col-span-5">
          <div className="prose prose-zinc dark:prose-invert">
            {renderMDX(content, MDXComponents as unknown as MDXComponentsMap)}
          </div>
        </div>
      </div>
      <footer className="mt-12 flex justify-between text-sm">
        <div>
          {neighbors.prev ? (
            <Link href={`/projects/${neighbors.prev.slug}`} className="underline">← {neighbors.prev.title}</Link>
          ) : <span />}
        </div>
        <div>
          {neighbors.next ? (
            <Link href={`/projects/${neighbors.next.slug}`} className="underline">{neighbors.next.title} →</Link>
          ) : <span />}
        </div>
      </footer>
    </article>
  );
}


