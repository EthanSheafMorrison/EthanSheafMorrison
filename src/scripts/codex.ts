// Codex landing-page interaction: a fixed, paged "book/codex" with
// spine tabs, per-section footnotes, a folio pager, keyboard + swipe
// navigation. The Work pane reuses the original filtering + hover
// selection-bar + crossfading cover image behaviour (ported from
// home.ts). No framework — a small vanilla state machine.

const SECTIONS = [
  { roman: "§I", short: "Intro" },
  { roman: "§II", short: "Work" },
  { roman: "§III", short: "About" },
] as const;

export function initCodex() {
  const root = document.querySelector<HTMLElement>(".codex");
  if (!root) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // On mobile the codex unlocks into a normal vertically-scrolling page (see the
  // max-width:768px block in codex.css). Navigation scrolls to sections instead
  // of paging, and the desktop swipe/wheel/hover machinery is skipped.
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const total = SECTIONS.length;

  const panes = Array.from(root.querySelectorAll<HTMLElement>(".codex-pane"));
  const spinesLeft = root.querySelector<HTMLElement>("#codexSpinesLeft");
  const spinesRight = root.querySelector<HTMLElement>("#codexSpinesRight");
  const noteGroups = Array.from(root.querySelectorAll<HTMLElement>(".codex-notes-group"));
  const navButtons = Array.from(root.querySelectorAll<HTMLElement>("[data-goto]"));
  const folioLinks = Array.from(root.querySelectorAll<HTMLElement>(".codex-folio-links button"));
  const progressFill = root.querySelector<HTMLElement>("#codexProgressFill");
  const pageNum = root.querySelector<HTMLElement>("#codexPageNum");
  const prevBtn = root.querySelector<HTMLButtonElement>("#codexPrev");
  const nextBtn = root.querySelector<HTMLButtonElement>("#codexNext");

  // Map URL hashes (e.g. arriving from another page's nav) to sections.
  const HASH_SECTION: Record<string, number> = { intro: 0, work: 1, about: 2 };
  function sectionFromHash(): number | null {
    const key = location.hash.replace("#", "").toLowerCase();
    return key in HASH_SECTION ? HASH_SECTION[key] : null;
  }

  let section = sectionFromHash() ?? 0;

  function makeSpine(i: number): HTMLButtonElement {
    const s = SECTIONS[i];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "codex-spine";
    btn.setAttribute("aria-label", `Go to ${s.short}`);
    btn.innerHTML =
      `<span class="codex-spine-roman">${s.roman}</span>` +
      `<span class="codex-spine-tick"></span>` +
      `<span class="codex-spine-name">${s.short}</span>`;
    btn.addEventListener("click", () => goTo(i));
    return btn;
  }

  function renderSpines() {
    if (!spinesLeft || !spinesRight) return;
    spinesLeft.replaceChildren();
    spinesRight.replaceChildren();
    for (let i = 0; i < total; i++) {
      if (i < section) spinesLeft.appendChild(makeSpine(i));
      else if (i > section) spinesRight.appendChild(makeSpine(i));
    }
  }

  function render(dir: number) {
    panes.forEach((pane, i) => {
      pane.classList.toggle("is-active", i === section);
      pane.classList.remove("slide-left", "slide-right");
      if (i === section && !reduceMotion) {
        // force reflow so the animation restarts each time
        void pane.offsetWidth;
        pane.classList.add(dir >= 0 ? "slide-right" : "slide-left");
      }
    });

    noteGroups.forEach((g, i) => g.classList.toggle("is-active", i === section));

    navButtons.forEach((b) => {
      const target = Number(b.getAttribute("data-goto"));
      b.setAttribute("aria-current", String(target === section));
    });
    folioLinks.forEach((b, i) => b.setAttribute("aria-current", String(i === section)));

    if (progressFill) progressFill.style.width = `${((section + 1) / total) * 100}%`;
    if (pageNum) pageNum.textContent = String(section + 1);
    if (prevBtn) prevBtn.disabled = section === 0;
    if (nextBtn) nextBtn.disabled = section === total - 1;

    root!.setAttribute("data-section", String(section));
    renderSpines();
    clearHoverState();
  }

  function scrollToSection(i: number) {
    panes[i]?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function goTo(i: number) {
    const next = Math.max(0, Math.min(total - 1, i));
    // Mobile: every nav control becomes a scroll-to-section jump.
    if (isMobile) {
      scrollToSection(next);
      return;
    }
    if (next === section) return;
    const dir = next > section ? 1 : -1;
    section = next;
    render(dir);
  }

  navButtons.forEach((b) =>
    b.addEventListener("click", () => goTo(Number(b.getAttribute("data-goto"))))
  );
  folioLinks.forEach((b, i) => b.addEventListener("click", () => goTo(i)));
  prevBtn?.addEventListener("click", () => goTo(section - 1));
  nextBtn?.addEventListener("click", () => goTo(section + 1));

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goTo(section + 1);
    else if (e.key === "ArrowLeft") goTo(section - 1);
  });

  // Honor hash navigation (e.g. clicking "Work" from a project page lands on
  // "/#work", and same-page hash changes page the codex too).
  window.addEventListener("hashchange", () => {
    const s = sectionFromHash();
    if (s !== null) goTo(s);
  });

  // Horizontal swipe — desktop-only. On mobile the page scrolls natively, so we
  // must NOT hijack touch gestures here.
  if (!isMobile) {
    let touchX = 0;
    let touchY = 0;
    root.addEventListener(
      "touchstart",
      (e) => {
        touchX = e.changedTouches[0].clientX;
        touchY = e.changedTouches[0].clientY;
      },
      { passive: true }
    );
    root.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - touchX;
        const dy = e.changedTouches[0].clientY - touchY;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          goTo(section + (dx < 0 ? 1 : -1));
        }
      },
      { passive: true }
    );
  }

  // Trackpad / wheel paging (desktop) — a swipe fires `wheel`, not touch.
  // Horizontal gestures always page. Vertical gestures also page, EXCEPT when
  // the pointer is over the Work list/filters (which scroll internally) or over
  // an intro/about pane that still has its own content to scroll. A cooldown
  // keeps one gesture to a single page turn.
  let wheelLocked = false;
  let wheelTimer = 0;

  function triggerPage(step: number) {
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => (wheelLocked = false), 240);
    if (wheelLocked) return;
    wheelLocked = true;
    goTo(section + step);
  }

  // Walk up from the pointer target; if a scrollable ancestor can still move in
  // the wheel's direction, let it scroll natively instead of paging.
  function canScrollNatively(target: EventTarget | null, delta: number): boolean {
    let node = target instanceof Element ? (target as HTMLElement) : null;
    while (node && node !== root) {
      const oy = getComputedStyle(node).overflowY;
      if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 1) {
        const atTop = node.scrollTop <= 0;
        const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
        if (delta > 0 ? !atBottom : !atTop) return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  if (!isMobile) {
    root.addEventListener(
      "wheel",
      (e) => {
        // Horizontal-dominant → page.
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2) {
          if (Math.abs(e.deltaX) >= 24) triggerPage(e.deltaX > 0 ? 1 : -1);
          return;
        }
        // Vertical.
        if (Math.abs(e.deltaY) < 24) return;
        const target = e.target as Element | null;
        // Over the Work list/filters → scroll internally, never page.
        if (target?.closest(".codex-work-body")) return;
        // Pane with its own scrollable content → let it scroll.
        if (canScrollNatively(e.target, e.deltaY)) return;
        triggerPage(e.deltaY > 0 ? 1 : -1);
      },
      { passive: true }
    );
  }

  /* ── Work pane: filtering ──────────────────────────────────── */
  const checkboxes = root.querySelectorAll<HTMLInputElement>(
    '.filter-option input[type="checkbox"]'
  );
  const clearBtn = root.querySelector<HTMLButtonElement>(".clear-filters");
  const active = new Set<string>();

  function clearHoverState() {
    root!.querySelector("#projectSelectionBar")?.classList.remove("visible");
    root!.querySelector("#hoverBgA")?.classList.remove("visible");
    root!.querySelector("#hoverBgB")?.classList.remove("visible");
    root!.querySelector("#codexWorkSummary")?.classList.remove("visible");
  }

  function updateVisibility() {
    const rows = root!.querySelectorAll<HTMLElement>(".project-row");
    rows.forEach((row, i) => {
      if (active.size === 0) {
        row.style.transitionDelay = "";
        row.classList.remove("filter-hidden");
        return;
      }
      const tags = Array.from(row.querySelectorAll(".project-tags span")).map((s) =>
        (s.textContent || "").trim().toLowerCase()
      );
      const match = Array.from(active).some((f) => tags.includes(f));
      if (match) {
        row.style.transitionDelay = "";
        row.classList.remove("filter-hidden");
      } else {
        row.style.transitionDelay = `${i * 20}ms`;
        row.classList.add("filter-hidden");
      }
    });
    clearHoverState();
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const tag = cb.getAttribute("data-tag") || "";
      if (cb.checked) active.add(tag);
      else active.delete(tag);
      updateVisibility();
    });
  });
  clearBtn?.addEventListener("click", () => {
    checkboxes.forEach((cb) => (cb.checked = false));
    active.clear();
    updateVisibility();
  });

  /* ── Work pane: hover selection bar + crossfade + summary ──── */
  const selectionBar = root.querySelector<HTMLElement>("#projectSelectionBar");
  const bgA = root.querySelector<HTMLElement>("#hoverBgA");
  const bgB = root.querySelector<HTMLElement>("#hoverBgB");
  const container = root.querySelector<HTMLElement>(".projects-container");
  const summary = root.querySelector<HTMLElement>("#codexWorkSummary");
  const summaryRef = root.querySelector<HTMLElement>("#codexWorkSummaryRef");
  const summaryText = root.querySelector<HTMLElement>("#codexWorkSummaryText");
  const rows = root.querySelectorAll<HTMLElement>(".project-row");

  if (!isMobile && selectionBar && bgA && bgB && container && rows.length) {
    let useA = true;
    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        const r = row.getBoundingClientRect();
        const c = container.getBoundingClientRect();
        selectionBar.style.height = `${r.height}px`;
        selectionBar.style.transform = `translateY(${r.top - c.top}px)`;
        selectionBar.classList.add("visible");

        const url = row.getAttribute("data-image");
        if (url) {
          const incoming = useA ? bgB : bgA;
          const outgoing = useA ? bgA : bgB;
          incoming.style.backgroundImage = `url('${url}')`;
          incoming.classList.add("visible");
          outgoing.classList.remove("visible");
          useA = !useA;
        }

        if (summary && summaryRef && summaryText) {
          summaryRef.textContent =
            row.querySelector(".project-number")?.textContent?.trim() || "";
          summaryText.textContent =
            row.querySelector(".project-description")?.textContent?.trim() || "";
          summary.classList.add("visible");
        }
      });
    });
    container.addEventListener("mouseleave", () => {
      bgA.classList.remove("visible");
      bgB.classList.remove("visible");
      selectionBar.classList.remove("visible");
      selectionBar.style.height = "0";
      selectionBar.style.transform = "translateY(0)";
      summary?.classList.remove("visible");
    });
  }

  /* ── Mobile scroll-spy ─────────────────────────────────────── */
  // Highlight the section the reader is currently scrolled to (sticky nav +
  // folio dots) without any paging. The active pane is the last one whose top
  // has crossed an imaginary line ~35% down the viewport.
  function initMobile() {
    function setActive(i: number) {
      section = i;
      navButtons.forEach((b) =>
        b.setAttribute("aria-current", String(Number(b.getAttribute("data-goto")) === i))
      );
      folioLinks.forEach((b, idx) => b.setAttribute("aria-current", String(idx === i)));
      if (progressFill) progressFill.style.width = `${((i + 1) / total) * 100}%`;
      if (pageNum) pageNum.textContent = String(i + 1);
      root!.setAttribute("data-section", String(i));
    }

    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const line = window.innerHeight * 0.35;
        let cur = 0;
        panes.forEach((p, i) => {
          if (p.getBoundingClientRect().top <= line) cur = i;
        });
        if (cur !== section) setActive(cur);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (isMobile) initMobile();
  else render(1);
}
