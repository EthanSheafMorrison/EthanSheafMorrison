import Link from "next/link";

export default function Header() {
  return (
    <nav className="mx-auto max-w-6xl w-full px-4 py-4 flex items-center justify-between">
      <Link href="/" className="font-semibold">Ethan Sheaf-Morrison</Link>
      <div className="flex gap-4 text-sm">
        <Link href="/projects">Projects</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
}


