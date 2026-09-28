/* ============================================================
   ICT Dreambooster — interactions
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  var CONTACT = {
    email: 'ictdreambooster@gmail.com',
    whatsapp: '2348062559689'
  };

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------------- Header: sticky state + mobile nav ---------------- */
  var header = document.getElementById('siteHeader');
  var nav = document.getElementById('primaryNav');
  var navToggle = document.getElementById('navToggle');

  function onScroll() {
    if (window.scrollY > 12) header.classList.add('is-stuck');
    else header.classList.remove('is-stuck');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeNav() {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }
  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- Animated counters ---------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-to'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var start = performance.now();

    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var value = target * eased;
      el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      var d = parseInt(el.getAttribute('data-decimals') || '0', 10);
      el.textContent = (d ? parseFloat(el.getAttribute('data-to')).toFixed(d) : el.getAttribute('data-to')) + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------------- Active nav link highlight ---------------- */
  var sections = ['services', 'pricing', 'work', 'results', 'process', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = nav.querySelector('a[href="#' + entry.target.id + '"]');
        if (!link) return;
        nav.querySelectorAll('a:not(.btn)').forEach(function (a) { a.classList.remove('is-active'); });
        link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------------- Portfolio masonry layout ---------------- */
  var workGrid = document.getElementById('workGrid');
  var cards = document.querySelectorAll('.work-card');
  var GAP = 24;

  function columnCount() {
    var w = window.innerWidth;
    if (w <= 760) return 1;
    if (w <= 1080) return 2;
    return 3;
  }

  function layoutMasonry() {
    if (!workGrid) return;
    var visible = Array.prototype.filter.call(cards, function (c) {
      return !c.classList.contains('is-hidden');
    });
    if (!visible.length) { workGrid.style.height = '0px'; return; }

    var cols = columnCount();
    var total = workGrid.clientWidth;
    if (!total) return; // not laid out yet (e.g. hidden) — try again later
    var colW = Math.floor((total - GAP * (cols - 1)) / cols);
    var heights = [];
    var i;
    for (i = 0; i < cols; i++) heights.push(0);

    workGrid.classList.add('is-masonry');

    visible.forEach(function (card) {
      var img = card.querySelector('img');
      var w = parseFloat(img.getAttribute('width')) || 4;
      var h = parseFloat(img.getAttribute('height')) || 3;
      var cardH = Math.round(colW / (w / h));
      var shortest = 0;
      for (i = 1; i < cols; i++) if (heights[i] < heights[shortest]) shortest = i;

      card.style.width = colW + 'px';
      card.style.left = Math.round(shortest * (colW + GAP)) + 'px';
      card.style.top = Math.round(heights[shortest]) + 'px';
      heights[shortest] += cardH + GAP;
    });

    workGrid.style.height = (Math.max.apply(null, heights) - GAP) + 'px';
  }

  if (workGrid) {
    layoutMasonry();
    window.addEventListener('load', layoutMasonry);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutMasonry);
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layoutMasonry, 120);
    });
    // keep layout correct as images finish decoding
    Array.prototype.forEach.call(workGrid.querySelectorAll('img'), function (img) {
      if (!img.complete) img.addEventListener('load', layoutMasonry);
    });
  }

  /* ---------------- Portfolio filter ---------------- */
  var chips = document.querySelectorAll('.chip');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        var active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(' ');
        var show = filter === 'all' || cats.indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          card.classList.remove('is-in');
          // re-trigger the reveal animation for a satisfying reflow
          void card.offsetWidth;
          card.classList.add('is-in');
        }
      });
      layoutMasonry();
    });
  });

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lbImg = document.getElementById('lbImg');
    var lbTitle = document.getElementById('lbTitle');
    var lbClient = document.getElementById('lbClient');
    var lbBrief = document.getElementById('lbBrief');
    var lbResult = document.getElementById('lbResult');
    var lbCta = document.getElementById('lbCta');
    var lastFocused = null;

    cards.forEach(function (card) {
      // add the zoom affordance (progressive enhancement)
      var hint = document.createElement('span');
      hint.className = 'zoom-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/></svg>';
      card.appendChild(hint);

      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');

      function open() {
        var img = card.querySelector('img');
        lastFocused = card;
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lbTitle.innerHTML = card.getAttribute('data-title') || '';
        lbClient.textContent = card.getAttribute('data-client') || '';
        lbBrief.innerHTML = card.getAttribute('data-brief') || '';
        lbResult.innerHTML = card.getAttribute('data-result') || '';
        lbCta.href = '#contact';
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        document.getElementById('lbClose').focus();
      }

      card.addEventListener('click', open);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    lightbox.querySelector('[data-close]').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
    lbCta.addEventListener('click', closeLightbox);
  }

  /* ---------------- Package buttons prefill the form ---------------- */
  var packageSelect = document.getElementById('package');
  document.querySelectorAll('[data-package]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-package');
      var option = Array.prototype.find.call(packageSelect.options, function (o) {
        return o.value.indexOf(value) === 0;
      });
      if (option) packageSelect.value = option.value;
    });
  });

  /* ---------------- Multi-step quote form ---------------- */
  var form = document.getElementById('quoteForm');
  if (form) {
    var steps = form.querySelectorAll('.form-step');
    var nextBtn = document.getElementById('nextBtn');
    var backBtn = document.getElementById('backBtn');
    var submitBtn = document.getElementById('submitBtn');
    var stepNow = document.getElementById('stepNow');
    var progressBar = document.getElementById('progressBar');
    var successPanel = document.getElementById('formSuccess');
    var current = 1;
    var last = steps.length;

    var FIELDS = [
      { step: 1, name: 'name', label: 'Your name' },
      { step: 1, name: 'business', label: 'Business name' },
      { step: 1, name: 'email', label: 'Email', type: 'email' },
      { step: 2, name: 'service', label: 'Services needed', type: 'checkbox-group' },
      { step: 3, name: 'goal', label: 'Your main goal' }
    ];

    function setStep(n) {
      current = Math.min(Math.max(n, 1), last);
      steps.forEach(function (s) {
        s.classList.toggle('is-active', parseInt(s.getAttribute('data-step'), 10) === current);
      });
      stepNow.textContent = String(current);
      progressBar.style.width = (current / last * 100) + '%';
      backBtn.hidden = current === 1;
      nextBtn.hidden = current === last;
      submitBtn.hidden = current !== last;
      var firstField = steps[current - 1].querySelector('input, select, textarea');
      if (firstField && !reduceMotion) firstField.focus({ preventScroll: true });
    }

    function showError(name, message) {
      var el = form.querySelector('[data-error-for="' + name + '"]');
      var input = form.querySelector('[name="' + name + '"]');
      if (el) { el.textContent = message; el.classList.add('is-visible'); }
      if (input && input.closest('.field')) input.closest('.field').classList.add('has-error');
      return false;
    }

    function clearError(name) {
      var el = form.querySelector('[data-error-for="' + name + '"]');
      var input = form.querySelector('[name="' + name + '"]');
      if (el) { el.textContent = ''; el.classList.remove('is-visible'); }
      if (input && input.closest('.field')) input.closest('.field').classList.remove('has-error');
    }

    function validateStep(step) {
      var valid = true;
      FIELDS.filter(function (f) { return f.step === step; }).forEach(function (f) {
        clearError(f.name);
        if (f.type === 'checkbox-group') {
          var checked = form.querySelectorAll('[name="' + f.name + '"]:checked');
          if (checked.length === 0) valid = showError(f.name, 'Pick at least one thing you need help with.');
        } else {
          var input = form.querySelector('[name="' + f.name + '"]');
          var value = (input.value || '').trim();
          if (!value) {
            valid = showError(f.name, f.label + ' is required.');
          } else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
            valid = showError(f.name, 'Enter a valid email so I can reply with your quote.');
          }
        }
      });
      return valid;
    }

    nextBtn.addEventListener('click', function () {
      if (validateStep(current)) setStep(current + 1);
      else {
        var bad = form.querySelector('.field.has-error input, .field.has-error textarea');
        if (bad) bad.focus();
      }
    });
    backBtn.addEventListener('click', function () { setStep(current - 1); });

    // clear errors as the user types
    form.addEventListener('input', function (e) {
      if (e.target.name) clearError(e.target.name);
    });

    function collectData() {
      var data = {};
      new FormData(form).forEach(function (value, key) {
        if (key === 'service') { (data.service = data.service || []).push(value); }
        else data[key] = value;
      });
      return data;
    }

    function buildSummary(data) {
      var services = (data.service || []).join(', ');
      return [
        'New project enquiry — ICT Dreambooster',
        '',
        'Name: ' + data.name,
        'Business: ' + data.business,
        'Email: ' + data.email,
        'WhatsApp: ' + (data.whatsapp || 'not provided'),
        'Location: ' + (data.country || 'not provided'),
        '',
        'Services needed: ' + services,
        'Package considering: ' + data.package,
        'Monthly budget: ' + data.budget,
        'Monthly ad spend: ' + data.spend,
        '',
        'Main goal:',
        data.goal,
        '',
        'Links: ' + (data.links || 'not provided'),
        'Ideal start: ' + data.start
      ].join('\n');
    }

    var mailHref = '#';
    var waHref = '#';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = [1, 2, 3].every(function (n) { return validateStep(n); });
      if (!allValid) {
        var firstBad = FIELDS.find(function (f) { return form.querySelector('[data-error-for="' + f.name + '"].is-visible'); });
        if (firstBad) {
          setStep(firstBad.step);
          var el = form.querySelector('[name="' + firstBad.name + '"]');
          if (el) el.focus();
        }
        return;
      }

      var data = collectData();
      var summary = buildSummary(data);
      var subject = 'Quote request — ' + data.business + ' (' + (data.service || []).join(' + ') + ')';

      mailHref = 'mailto:' + CONTACT.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(summary);
      waHref = 'https://wa.me/' + CONTACT.whatsapp +
        '?text=' + encodeURIComponent(summary);

      var mailLink = document.getElementById('mailFallback');
      var waLink = document.getElementById('waFallback');
      mailLink.href = mailHref;
      waLink.href = waHref;

      // hide the step UI and show the success state
      steps.forEach(function (s) { s.classList.remove('is-active'); });
      form.querySelector('.form-actions').hidden = true;
      form.querySelector('.form-head').hidden = true;
      form.querySelector('.progress').hidden = true;
      successPanel.hidden = false;
      document.getElementById('successText').textContent =
        'Thanks, ' + data.name.split(' ')[0] + '! Your email app is opening with everything filled in. ' +
        'If nothing happens, use one of the buttons below — I reply within 24 hours.';

      // try to open the visitor's mail client
      try { window.location.href = mailHref; } catch (err) { /* fallbacks below */ }

      if (!reduceMotion && successPanel.scrollIntoView) {
        successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    document.getElementById('resetForm').addEventListener('click', function () {
      form.reset();
      form.querySelectorAll('.error').forEach(function (el) { el.classList.remove('is-visible'); el.textContent = ''; });
      form.querySelectorAll('.field').forEach(function (el) { el.classList.remove('has-error'); });
      successPanel.hidden = true;
      form.querySelector('.form-actions').hidden = false;
      form.querySelector('.form-head').hidden = false;
      form.querySelector('.progress').hidden = false;
      setStep(1);
      if (form.scrollIntoView) {
        form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
    });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
