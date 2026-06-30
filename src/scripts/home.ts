// Home-page interactions, ported from the original simple-script.js,
// projects-renderer.js, and index.html inline scripts. Projects are now
// server-rendered, so this only wires behavior (no DOM templating).
export function initHome() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Desktop filtering ───────────────────────────────────────────── */
  const checkboxes = document.querySelectorAll<HTMLInputElement>(
    '.filter-option input[type="checkbox"]'
  );
  const clearBtn = document.querySelector<HTMLButtonElement>(".clear-filters");
  const active = new Set<string>();

  function clearHoverState() {
    document.getElementById("projectSelectionBar")?.classList.remove("visible");
    document.getElementById("hoverBgA")?.classList.remove("visible");
    document.getElementById("hoverBgB")?.classList.remove("visible");
  }

  function updateVisibility() {
    const rows = document.querySelectorAll<HTMLElement>(".project-row");
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

  /* ── Desktop hover: selection bar + crossfade background ──────────── */
  const selectionBar = document.getElementById("projectSelectionBar");
  const bgA = document.getElementById("hoverBgA");
  const bgB = document.getElementById("hoverBgB");
  const container = document.querySelector<HTMLElement>(".projects-container");
  const rows = document.querySelectorAll<HTMLElement>(".project-row");
  if (selectionBar && bgA && bgB && container && rows.length) {
    let useA = true;
    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        const r = row.getBoundingClientRect();
        const c = container.getBoundingClientRect();
        selectionBar.style.height = `${r.height}px`;
        selectionBar.style.transform = `translateY(${r.top - c.top}px)`;
        selectionBar.classList.add("visible");
        const url = row.getAttribute("data-image");
        if (!url) return;
        const incoming = useA ? bgB : bgA;
        const outgoing = useA ? bgA : bgB;
        incoming.style.backgroundImage = `url('${url}')`;
        incoming.classList.add("visible");
        outgoing.classList.remove("visible");
        useA = !useA;
      });
    });
    container.addEventListener("mouseleave", () => {
      bgA.classList.remove("visible");
      bgB.classList.remove("visible");
      selectionBar.classList.remove("visible");
      selectionBar.style.height = "0";
      selectionBar.style.transform = "translateY(0)";
    });
  }

  /* ── Mobile filter chips ─────────────────────────────────────────── */
  (function mobileFilters() {
    const chipsWrap = document.getElementById("mobileFilterChips");
    const clear = document.getElementById("mobileFilterClear");
    const items = Array.from(document.querySelectorAll<HTMLElement>(".mobile-project-item"));
    if (!chipsWrap || !items.length) return;

    const tags = new Set<string>();
    items.forEach((it) =>
      it.querySelectorAll(".mobile-project-tag").forEach((t) =>
        tags.add((t.textContent || "").trim().toLowerCase())
      )
    );
    const sel = new Set<string>();

    Array.from(tags)
      .sort()
      .forEach((tag) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "mobile-chip";
        chip.textContent = tag;
        chip.addEventListener("click", () => {
          if (sel.has(tag)) {
            sel.delete(tag);
            chip.classList.remove("active");
          } else {
            sel.add(tag);
            chip.classList.add("active");
          }
          apply();
        });
        chipsWrap.appendChild(chip);
      });

    clear?.addEventListener("click", () => {
      sel.clear();
      chipsWrap.querySelectorAll(".mobile-chip").forEach((c) => c.classList.remove("active"));
      apply();
    });

    function apply() {
      items.forEach((it) => {
        if (sel.size === 0) {
          it.style.display = "";
          return;
        }
        const t = Array.from(it.querySelectorAll(".mobile-project-tag")).map((x) =>
          (x.textContent || "").trim().toLowerCase()
        );
        it.style.display = Array.from(sel).some((s) => t.includes(s)) ? "" : "none";
      });
      window.updateMobileBgTight?.(true);
    }
  })();

  /* ── Mobile: background image follows the project nearest viewport centre ── */
  (function mobileBg() {
    const bg = document.getElementById("mobileHeroBg");
    const section = document.getElementById("projects-mobile") || document.getElementById("projects");
    if (!bg || !section) return;

    function update() {
      const vpH = window.innerHeight;
      const rect = section!.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vpH) {
        bg!.style.opacity = "0";
        return;
      }
      const items = Array.from(
        document.querySelectorAll<HTMLElement>(".mobile-project-item")
      ).filter((el) => el.style.display !== "none");
      let closest: HTMLElement | null = null;
      let dist = Infinity;
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - vpH / 2);
        if (d < dist) {
          dist = d;
          closest = el;
        }
      });
      const radius = Math.min(180, vpH * 0.25);
      if (closest && dist <= radius) {
        const url = (closest as HTMLElement).getAttribute("data-image");
        if (url) {
          if (bg!.dataset.currentUrl !== url) {
            bg!.style.backgroundImage = `url('${url}')`;
            bg!.dataset.currentUrl = url;
          }
          bg!.style.opacity = "0.12";
        } else bg!.style.opacity = "0";
      } else bg!.style.opacity = "0";
    }

    window.updateMobileBgTight = () => update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  if (reduceMotion) return;

  /* ── Scroll reveal for text blocks (desktop) ─────────────────────── */
  (function scrollReveal() {
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".all-projects p, .all-projects h3, .about-footer p, .about-footer h3, .bio-intro, .bio-column"
      )
    ).filter((el) => {
      if (el.closest(".hero, .intro-splash, .mobile-hero")) return false;
      return el.getBoundingClientRect().top > window.innerHeight * 0.1;
    });
    candidates.forEach((el) => el.classList.add("fade-in-element"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    candidates.forEach((el) => obs.observe(el));
  })();

  /* ── Parallax typography ─────────────────────────────────────────── */
  (function parallax() {
    const headers = Array.from(document.querySelectorAll<HTMLElement>(".parallax-header"));
    if (!headers.length) return;
    let ticking = false;
    function frame() {
      const vpH = window.innerHeight;
      headers.forEach((h) => {
        const r = h.getBoundingClientRect();
        if (r.bottom >= -vpH && r.top <= vpH * 2) {
          const offset = (r.top + r.height / 2 - vpH / 2) * 0.05;
          h.style.transform = `translateY(${offset}px)`;
        }
      });
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(frame);
          ticking = true;
        }
      },
      { passive: true }
    );
    frame();
  })();
}

declare global {
  interface Window {
    updateMobileBgTight?: (force?: boolean) => void;
  }
}
