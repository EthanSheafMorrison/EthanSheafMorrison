import Link from "next/link";

export default function Header() {
  return (
    <nav className="mx-auto max-w-6xl w-full px-4 py-4 flex items-center justify-between">
      <Link href="/" className="font-semibold">Ethan Sheaf-Morrison</Link>
      <div className="flex gap-4 text-sm">
        <a href="#hero">Home</a>
        <a href="#featured">Featured</a>
        <a href="#projects">Projects</a>
      </div>
    </nav>
  );
}


