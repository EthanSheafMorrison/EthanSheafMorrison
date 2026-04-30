// Shared init for cinematic project pages:
// - injects the site header
// - injects the lightbox markup
// - wires lightbox event handlers (click, prev/next, esc, arrow keys)
(function () {
  function injectHeader() {
    var slot = document.getElementById('site-header');
    if (!slot) return;
    fetch('../header.html')
      .then(function (res) { return res.text(); })
      .then(function (html) { slot.innerHTML = html; })
      .catch(function () {});
  }

  function injectLightbox() {
    if (document.getElementById('lightbox')) return;
    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.innerHTML =
      '<span class="lightbox-close">&times;</span>' +
      '<div class="lightbox-content">' +
        '<img class="lightbox-img" id="lightbox-img" alt="">' +
        '<div class="lightbox-nav">' +
          '<span class="lightbox-prev">&#10094;</span>' +
          '<span class="lightbox-next">&#10095;</span>' +
        '</div>' +
      '</div>' +
      '<div class="lightbox-caption" id="lightbox-caption"></div>';
    document.body.appendChild(lb);
  }

  function initLightbox() {
    var images = document.querySelectorAll('.cin-inline-figure img, .cin-gallery img');
    if (!images.length) return;

    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var lightboxClose = lightbox.querySelector('.lightbox-close');
    var lightboxPrev = lightbox.querySelector('.lightbox-prev');
    var lightboxNext = lightbox.querySelector('.lightbox-next');

    var imageArray = Array.from(images);
    var currentIndex = 0;

    function show(index) {
      currentIndex = (index + imageArray.length) % imageArray.length;
      var img = imageArray[currentIndex];
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.alt || '';
    }

    function open(index) {
      show(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    images.forEach(function (img, index) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function () { open(index); });
    });

    lightboxClose.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    lightboxPrev.addEventListener('click', function () { show(currentIndex - 1); });
    lightboxNext.addEventListener('click', function () { show(currentIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(currentIndex - 1);
      else if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  function init() {
    injectHeader();
    injectLightbox();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
