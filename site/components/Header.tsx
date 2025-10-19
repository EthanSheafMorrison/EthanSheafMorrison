import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ background: "var(--background)" }}>
      <nav className="w-full px-6 md:px-10 py-4 md:py-5 flex items-center justify-center uppercase tracking-widest text-xs md:text-sm border-b border-black/20">
        <div className="flex items-center gap-8 md:gap-10">
          <Link href="/#projects" data-underline>Index</Link>
          <Link href="/#featured" data-underline>Experiment</Link>
          <Link href="/#about" data-underline>About</Link>
        </div>
      </nav>
    </header>
  );
}


