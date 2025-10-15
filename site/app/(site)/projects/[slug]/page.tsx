import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import { renderMDX, type MDXComponentsMap } from "@/lib/mdx";
import MDXComponents from "@/components/MDXComponents";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { meta } = await getProjectBySlug(params.slug);
  return {
    title: meta.title,
    description: meta.summary,
    openGraph: { images: meta.cover ? [meta.cover] : [] },
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return notFound();
  const { meta, content } = project;
  return (
    <article className="prose prose-zinc mx-auto dark:prose-invert">
      {meta.cover ? (
        <Image src={meta.cover} alt={meta.title} width={1600} height={900} priority />
      ) : null}
      <h1 className="mt-6">{meta.title}</h1>
      {renderMDX(content, MDXComponents as unknown as MDXComponentsMap)}
    </article>
  );
}


