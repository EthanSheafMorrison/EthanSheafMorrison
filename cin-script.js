(function () {
  function initHeroCycle() {
    var slides = document.querySelectorAll('.cin-hero-bg');
    if (slides.length < 2) return;
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 4000);
  }

  function initCinematicScroll() {
    const chapters = document.querySelectorAll('.cin-chapter');
    const tocItems = document.querySelectorAll('.cin-toc-item');
    const imageWraps = document.querySelectorAll('.cin-feature-img-wrap');

    if (!chapters.length) return;

    function activate(id) {
      tocItems.forEach(function (item) {
        item.classList.toggle('active', item.dataset.chapter === id);
      });
      imageWraps.forEach(function (wrap) {
        wrap.classList.toggle('active', wrap.dataset.chapter === id);
      });
    }

    // Hero image cycle
    initHeroCycle();

    // Activate first chapter immediately
    if (chapters[0]) activate(chapters[0].id);

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activate(entry.target.id);
        });
      },
      { threshold: 0.35 }
    );

    chapters.forEach(function (ch) { observer.observe(ch); });

    // TOC click → smooth scroll
    tocItems.forEach(function (item) {
      var a = item.querySelector('a');
      if (!a) return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Reveal inline figures on scroll
    var figures = document.querySelectorAll('.cin-inline-figure');
    if (figures.length) {
      var figObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              figObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      figures.forEach(function (fig) {
        fig.classList.add('cin-anim-ready');
        figObserver.observe(fig);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCinematicScroll);
  } else {
    initCinematicScroll();
  }
})();
