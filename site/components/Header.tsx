import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <nav className="w-full px-6 md:px-10 py-4 md:py-5 flex items-center justify-between uppercase tracking-widest text-xs md:text-sm">
        <Link href="/#projects" className="font-semibold">Work</Link>
        <div className="flex gap-6">
          <Link href="/#about" className="hover:opacity-70 transition-opacity">About</Link>
          <Link href="/#contact" className="hover:opacity-70 transition-opacity">Contact</Link>
        </div>
      </nav>
    </header>
  );
}


