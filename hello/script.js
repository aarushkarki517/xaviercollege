// =============================================================
// Xavier International College — site interactions
// =============================================================
(function () {
  'use strict';

  // ---------- Loader ----------
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    if (loader) setTimeout(function () { loader.classList.add('hidden'); }, 400);
  });

  // ---------- Dark mode ----------
  var root = document.documentElement;
  var darkToggles = document.querySelectorAll('.dark-toggle');
  function applyDarkPref() {
    var saved = localStorage.getItem('xic-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) root.classList.add('dark');
  }
  applyDarkPref();
  darkToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      root.classList.toggle('dark');
      localStorage.setItem('xic-theme', root.classList.contains('dark') ? 'dark' : 'light');
    });
  });

  // ---------- Sticky nav shadow ----------
  var nav = document.getElementById('mainNav');
  function onScrollNav() {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // ---------- Mobile menu ----------
  var mobileToggle = document.getElementById('mobileMenuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
      document.body.classList.toggle('no-scroll');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  // ---------- Animated counters ----------
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var isDecimal = target % 1 !== 0;
    var duration = 1600;
    var startTime = null;
    function format(n) {
      return isDecimal ? n.toFixed(1) : Math.floor(n).toLocaleString('en-US');
    }
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = format(target) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(function (el) { counterObserver.observe(el); });

  // ---------- Back to top ----------
  var backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    if (!backToTop) return;
    if (window.scrollY > 500) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  }, { passive: true });
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- FAB menu ----------
  var fabToggle = document.getElementById('fabToggle');
  var fabMenu = document.getElementById('fabMenu');
  if (fabToggle && fabMenu) {
    fabToggle.addEventListener('click', function () {
      fabMenu.classList.toggle('open');
      fabToggle.classList.toggle('open');
    });
  }

  // ---------- Live chat widget ----------
  var chatBubble = document.getElementById('chatBubble');
  var chatPanel = document.getElementById('chatPanel');
  var chatClose = document.getElementById('chatClose');
  var chatForm = document.getElementById('chatForm');
  var chatBody = document.getElementById('chatBody');
  if (chatBubble && chatPanel) {
    chatBubble.addEventListener('click', function () { chatPanel.classList.toggle('hidden'); });
  }
  if (chatClose) chatClose.addEventListener('click', function () { chatPanel.classList.add('hidden'); });
  if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = chatForm.querySelector('input');
      if (!input.value.trim()) return;
      var msg = document.createElement('div');
      msg.className = 'bg-navy text-white text-sm rounded-2xl rounded-br-sm px-3 py-2 ml-auto max-w-[80%]';
      msg.textContent = input.value;
      chatBody.appendChild(msg);
      input.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;
      setTimeout(function () {
        var reply = document.createElement('div');
        reply.className = 'bg-gray-100 text-sm rounded-2xl rounded-bl-sm px-3 py-2 mr-auto max-w-[80%] text-gray-700';
        reply.textContent = "Thanks for reaching out! A student counselor will reply shortly. For urgent queries call +977-1-4412345.";
        chatBody.appendChild(reply);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 700);
    });
  }

  // ---------- Search overlay ----------
  var searchTriggers = document.querySelectorAll('.search-trigger');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchClose = document.getElementById('searchClose');
  var searchInput = document.getElementById('searchInput');
  searchTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      searchOverlay.classList.add('active');
      document.body.classList.add('no-scroll');
      setTimeout(function () { searchInput.focus(); }, 300);
    });
  });
  function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSearch();
      closeAllModals();
      if (lightbox) { lightbox.style.display = 'none'; document.body.classList.remove('no-scroll'); }
    }
  });

  // ---------- Modals (generic) ----------
  var modalTriggers = document.querySelectorAll('[data-modal-target]');
  var modalCloses = document.querySelectorAll('[data-modal-close]');
  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(function (m) {
      m.classList.remove('active');
    });
    document.body.classList.remove('no-scroll');
  }
  modalTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-modal-target');
      var modal = document.getElementById(id);
      if (!modal) return;
      // optional prefill (event registration)
      var prefill = btn.getAttribute('data-prefill');
      if (prefill) {
        var field = modal.querySelector('[data-prefill-target]');
        if (field) field.value = prefill;
      }
      modal.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  });
  modalCloses.forEach(function (btn) {
    btn.addEventListener('click', closeAllModals);
  });
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeAllModals();
    });
  });

  // ---------- Portal login tabs ----------
  var tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('[data-tab-group]');
      if (!group) return;
      group.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var target = btn.getAttribute('data-tab');
      group.querySelectorAll('[data-tab-panel]').forEach(function (panel) {
        panel.classList.toggle('hidden', panel.getAttribute('data-tab-panel') !== target);
      });
    });
  });

  // ---------- Toast helper ----------
  var toastEl = document.getElementById('toast');
  var toastTimer;
  window.showToast = function (message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  };

  // ---------- Fake-submit forms (no backend) ----------
  document.querySelectorAll('form[data-fake-submit]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var message = form.getAttribute('data-success-message') || 'Submitted successfully!';
      showToast(message);
      form.reset();
      var parentModal = form.closest('.modal-overlay');
      if (parentModal) setTimeout(closeAllModals, 900);
    });
  });

  // ---------- Newsletter ----------
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('Subscribed! Watch your inbox for updates.');
      newsletterForm.reset();
    });
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var header = item.querySelector('.accordion-header');
    var panel = item.querySelector('.accordion-panel');
    header.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.closest('.accordion-group').querySelectorAll('.accordion-item').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // ---------- Testimonial carousel ----------
  var testiTrack = document.getElementById('testiTrack');
  var testiDots = document.querySelectorAll('.testi-dot');
  var testiPrev = document.getElementById('testiPrev');
  var testiNext = document.getElementById('testiNext');
  var testiIndex = 0;
  var testiCount = testiDots.length;
  function goToSlide(i) {
    testiIndex = (i + testiCount) % testiCount;
    if (testiTrack) testiTrack.style.transform = 'translateX(-' + (testiIndex * 100) + '%)';
    testiDots.forEach(function (d, idx) { d.classList.toggle('active', idx === testiIndex); });
  }
  testiDots.forEach(function (dot, idx) {
    dot.addEventListener('click', function () { goToSlide(idx); });
  });
  if (testiPrev) testiPrev.addEventListener('click', function () { goToSlide(testiIndex - 1); });
  if (testiNext) testiNext.addEventListener('click', function () { goToSlide(testiIndex + 1); });
  if (testiCount) {
    setInterval(function () { goToSlide(testiIndex + 1); }, 6000);
  }

  // ---------- Gallery lightbox ----------
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('[data-lightbox]').forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      if (!img || !lightbox) return;
      lightboxImg.src = img.src.replace(/w=\d+/, 'w=1400');
      lightbox.style.display = 'flex';
      document.body.classList.add('no-scroll');
    });
  });
  if (lightboxClose) {
    lightboxClose.addEventListener('click', function () {
      lightbox.style.display = 'none';
      document.body.classList.remove('no-scroll');
    });
  }
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.classList.remove('no-scroll');
      }
    });
  }

  // ---------- Course / program search filter ----------
  var courseSearch = document.getElementById('courseSearch');
  if (courseSearch) {
    courseSearch.addEventListener('input', function () {
      var q = courseSearch.value.trim().toLowerCase();
      document.querySelectorAll('[data-program-card]').forEach(function (card) {
        var name = card.getAttribute('data-program-name').toLowerCase();
        card.style.display = name.indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }

  // ---------- Department filter chips ----------
  var deptChips = document.querySelectorAll('[data-dept-filter]');
  deptChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      deptChips.forEach(function (c) { c.classList.remove('bg-navy', 'text-white'); c.classList.add('bg-gray-100'); });
      chip.classList.add('bg-navy', 'text-white');
      chip.classList.remove('bg-gray-100');
      var filter = chip.getAttribute('data-dept-filter');
      document.querySelectorAll('[data-dept-card]').forEach(function (card) {
        var cat = card.getAttribute('data-dept-card');
        card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
    });
  });

  // ---------- Current year ----------
  var yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

})();
