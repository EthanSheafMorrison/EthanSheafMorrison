'use client';

import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    let raf = 0;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);

    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);
    const hoverables = () => Array.from(document.querySelectorAll('a, button, [data-hover]')) as HTMLElement[];
    const attach = () => hoverables().forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave); });
    const detach = () => hoverables().forEach(el => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); });
    attach();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      detach();
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className={`pointer-events-none fixed left-0 top-0 z-[100] will-change-transform transition-transform duration-150`}
      aria-hidden
    >
      <div className={`-translate-x-1/2 -translate-y-1/2 rounded-full border border-black/50`} style={{ width: active ? 28 : 16, height: active ? 28 : 16, transition: 'width 150ms ease, height 150ms ease', background: 'transparent' }} />
    </div>
  );
}


