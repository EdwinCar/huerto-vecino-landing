/* =====================================================================
   Huerto Vecino · Landing page
   Animaciones (GSAP + ScrollTrigger con respaldo en IntersectionObserver),
   catálogo de especies, QR de descarga y utilidades de navegación.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Configuración editable ---------- */
  const CONFIG = {
    // Ruta (relativa o absoluta) del APK. Si publicas el APK en GitHub Releases,
    // reemplaza por la URL del release, por ejemplo:
    // 'https://github.com/USUARIO/REPO/releases/latest/download/app-release.apk'
    apkUrl: 'https://github.com/EdwinCar/huerto-vecino-landing/releases/latest/download/app-release.apk',
    apkFileName: 'HuertoVecino-1.0.0.apk',
    shaUrl: 'download/app-release.apk.sha1',
    repoUrl: 'https://github.com/EdwinCar/huerto-vecino-landing',
  };

  const html = document.documentElement;
  html.classList.add('js');
  // Respeta "reducir movimiento" del sistema; ?motion=1 fuerza las animaciones (útil para revisar el diseño).
  const forceMotion = /[?&]motion=1/.test(window.location.search);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !forceMotion;
  if (forceMotion) html.classList.add('force-motion');
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Datos: 16 especies del catálogo agronómico ---------- */
  const SPECIES = [
    { key: 'lechuga',   name: 'Lechuga',        sci: 'Lactuca sativa',                 days: 60,  sun: 4, frost: false, diff: 1, kg: 0.4,  hue: '#8DBF6F' },
    { key: 'acelga',    name: 'Acelga',         sci: 'Beta vulgaris var. cicla',       days: 60,  sun: 4, frost: true,  diff: 1, kg: 1.2,  hue: '#5DAA6A' },
    { key: 'espinaca',  name: 'Espinaca',       sci: 'Spinacia oleracea',              days: 45,  sun: 3, frost: true,  diff: 1, kg: 0.3,  hue: '#2E7D3E' },
    { key: 'zanahoria', name: 'Zanahoria',      sci: 'Daucus carota',                  days: 90,  sun: 5, frost: true,  diff: 2, kg: 0.12, hue: '#E07A2F' },
    { key: 'albahaca',  name: 'Albahaca',       sci: 'Ocimum basilicum',               days: 50,  sun: 6, frost: false, diff: 2, kg: 0.2,  hue: '#A6D96A' },
    { key: 'perejil',   name: 'Perejil',        sci: 'Petroselinum crispum',           days: 75,  sun: 4, frost: true,  diff: 1, kg: 0.25, hue: '#4F9E5C' },
    { key: 'cilantro',  name: 'Cilantro',       sci: 'Coriandrum sativum',             days: 40,  sun: 4, frost: true,  diff: 1, kg: 0.08, hue: '#8CC47A' },
    { key: 'rabano',    name: 'Rábano',         sci: 'Raphanus sativus',               days: 30,  sun: 4, frost: true,  diff: 1, kg: 0.03, hue: '#D12B4F' },
    { key: 'tomate',    name: 'Tomate cherry',  sci: 'Solanum lycopersicum',           days: 90,  sun: 6, frost: false, diff: 3, kg: 1.5,  hue: '#D9412B' },
    { key: 'haba',      name: 'Haba',           sci: 'Vicia faba',                     days: 120, sun: 5, frost: true,  diff: 1, kg: 0.5,  hue: '#5DAA6A' },
    { key: 'papa',      name: 'Papa',           sci: 'Solanum tuberosum',              days: 110, sun: 6, frost: false, diff: 2, kg: 1.5,  hue: '#C9A26B' },
    { key: 'cebolla',   name: 'Cebolla verde',  sci: 'Allium fistulosum',              days: 70,  sun: 5, frost: true,  diff: 1, kg: 0.05, hue: '#BFD8A8' },
    { key: 'brocoli',   name: 'Brócoli',        sci: 'Brassica oleracea var. italica', days: 85,  sun: 5, frost: true,  diff: 2, kg: 0.5,  hue: '#2E7D3E' },
    { key: 'frutilla',  name: 'Frutilla',       sci: 'Fragaria × ananassa',            days: 90,  sun: 6, frost: true,  diff: 2, kg: 0.4,  hue: '#C83E5A' },
    { key: 'locoto',    name: 'Locoto',         sci: 'Capsicum pubescens',             days: 120, sun: 6, frost: false, diff: 3, kg: 1.0,  hue: '#E3562A' },
    { key: 'quinua',    name: 'Quinua',         sci: 'Chenopodium quinoa',             days: 150, sun: 6, frost: true,  diff: 2, kg: 0.15, hue: '#E8B400' },
  ];

  const ART = {
    leaf: '<svg viewBox="0 0 24 24"><path d="M5 20c0-9 5-14 14-14-1 9-6 14-14 14Z"/><path d="M5 20 15 10"/></svg>',
    root: '<svg viewBox="0 0 24 24"><path d="M12 3v5m-3-3 3 3 3-3"/><path d="M8 8h8l-1.5 12h-5z"/></svg>',
    fruit: '<svg viewBox="0 0 24 24"><circle cx="12" cy="14" r="7"/><path d="M12 7V4m0 3c2-2 4-2 5-1"/></svg>',
    herb: '<svg viewBox="0 0 24 24"><path d="M12 21V9"/><path d="M12 13c-4 0-6-2-6-6 4 0 6 2 6 6Zm0-4c0-4 2-6 6-6 0 4-2 6-6 6Zm0 8c-3 0-5-2-5-5 3 0 5 2 5 5Z"/></svg>',
    tuber: '<svg viewBox="0 0 24 24"><path d="M6 13c0-4 3-7 7-7s6 3 6 6-2 6-6 6-7-1-7-5Z"/><path d="M9 11h.01M13 13h.01M11 15h.01"/></svg>',
    grain: '<svg viewBox="0 0 24 24"><path d="M12 21V4"/><path d="M12 8c-3 0-4-2-4-4 3 0 4 2 4 4Zm0 0c3 0 4-2 4-4-3 0-4 2-4 4Zm0 5c-3 0-4-2-4-4 3 0 4 2 4 4Zm0 0c3 0 4-2 4-4-3 0-4 2-4 4Zm0 5c-3 0-4-2-4-4 3 0 4 2 4 4Zm0 0c3 0 4-2 4-4-3 0-4 2-4 4Z"/></svg>',
  };
  const ART_BY_KEY = { lechuga: 'leaf', acelga: 'leaf', espinaca: 'leaf', zanahoria: 'root', albahaca: 'herb', perejil: 'herb', cilantro: 'herb', rabano: 'root', tomate: 'fruit', haba: 'grain', papa: 'tuber', cebolla: 'herb', brocoli: 'leaf', frutilla: 'fruit', locoto: 'fruit', quinua: 'grain' };

  function renderSpecies() {
    const grid = document.getElementById('speciesGrid');
    if (!grid) return;
    grid.innerHTML = SPECIES.map(function (s) {
      var dots = [1, 2, 3].map(function (n) { return '<i class="' + (n <= s.diff ? 'on' : '') + '"></i>'; }).join('');
      var diffLabel = s.diff === 1 ? 'Fácil' : s.diff === 2 ? 'Media' : 'Exigente';
      return '<article class="sp" data-reveal data-days="' + s.days + '" data-frost="' + s.frost + '" data-diff="' + s.diff + '" data-kg="' + s.kg + '">' +
        '<div class="sp__top">' +
          '<span class="sp__art" style="background:' + s.hue + '22;color:' + s.hue + '">' + ART[ART_BY_KEY[s.key]] + '</span>' +
          '<div><div class="sp__name">' + s.name + '</div><div class="sp__sci">' + s.sci + '</div></div>' +
        '</div>' +
        '<div class="sp__meta">' +
          '<span>' + s.days + ' días a cosecha</span>' +
          '<span>☀ ' + s.sun + ' h de sol</span>' +
          (s.frost ? '<span class="frost">Tolera heladas</span>' : '') +
          '<span class="kg">' + String(s.kg).replace('.', ',') + ' kg/planta</span>' +
        '</div>' +
        '<div class="sp__diff">' + dots + '<span>&nbsp;' + diffLabel + '</span></div>' +
      '</article>';
    }).join('');

    var filters = document.querySelectorAll('.filter');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
        var f = btn.dataset.filter;
        grid.querySelectorAll('.sp').forEach(function (card, i) {
          var show = f === 'all' ||
            (f === 'easy' && card.dataset.diff === '1') ||
            (f === 'frost' && card.dataset.frost === 'true') ||
            (f === 'fast' && Number(card.dataset.days) <= 50) ||
            (f === 'yield' && Number(card.dataset.kg) >= 0.4);
          card.classList.toggle('is-hidden', !show);
          if (show && hasGsap && !reduceMotion) {
            gsap.fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, delay: i * .03, ease: 'power3.out', overwrite: true });
          }
        });
      });
    });
  }

  /* ---------- Navegación ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('burger');
    var menu = document.getElementById('mobileMenu');
    var progress = document.querySelector('.progress span');
    var lastY = window.scrollY;

    function onScroll() {
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 24);
      if (y > 320 && y > lastY + 6 && !menu.classList.contains('is-open')) nav.classList.add('is-hidden');
      else if (y < lastY - 6 || y < 120) nav.classList.remove('is-hidden');
      lastY = y;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); });
    });

    // Enlace activo según la sección visible
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
    var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }
  }

  /* ---------- Luz que sigue al cursor ---------- */
  function initCursor() {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    var glow = document.querySelector('.cursor-glow');
    if (!glow) return;
    document.body.classList.add('has-pointer');
    var x = window.innerWidth / 2, y = window.innerHeight / 3, tx = x, ty = y;
    window.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      x += (tx - x) * .08; y += (ty - y) * .08;
      glow.style.transform = 'translate(' + (x - 260) + 'px,' + (y - 260) + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Título del hero palabra por palabra ---------- */
  function splitTitle() {
    var title = document.querySelector('[data-split]');
    if (!title) return [];
    var out = [];
    function wrapWords(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'word';
            var inner = document.createElement('span'); inner.textContent = part;
            w.appendChild(inner); frag.appendChild(w); out.push(inner);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          wrapWords(child);
        }
      });
    }
    wrapWords(title);
    return out;
  }

  /* ---------- Contadores ---------- */
  function formatNumber(n, fmt) {
    if (fmt === 'miles') return n.toLocaleString('es-BO').replace(/,/g, '.');
    return String(n);
  }
  function animateCounter(el) {
    var target = Number(el.dataset.count), fmt = el.dataset.format;
    if (!hasGsap || reduceMotion) { el.textContent = formatNumber(target, fmt); return; }
    var obj = { v: 0 };
    gsap.to(obj, { v: target, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = formatNumber(Math.round(obj.v), fmt); } });
  }

  /* ---------- Animaciones de entrada ---------- */
  function initReveal(words) {
    var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

    if (!hasGsap || reduceMotion) {
      // Respaldo sin GSAP
      if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add('is-visible');
            e.target.querySelectorAll('[data-count]').forEach(animateCounter);
            io.unobserve(e.target);
          });
        }, { threshold: .15 });
        reveals.forEach(function (el) { io.observe(el); });
      } else {
        reveals.forEach(function (el) { el.classList.add('is-visible'); el.querySelectorAll('[data-count]').forEach(animateCounter); });
      }
      words.forEach(function (w) { w.style.transform = 'none'; });
      return;
    }

    // Hero: título + elementos iniciales
    var heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    heroTl.to(words, { y: 0, duration: 1.1, stagger: .06 }, .1);
    var heroReveals = reveals.filter(function (el) { return el.closest('.hero'); });
    heroReveals.forEach(function (el) { el.classList.add('is-visible'); });
    heroTl.from(heroReveals, { opacity: 0, y: 26, duration: .9, stagger: .12, clearProps: 'transform,opacity' }, .5)
      .add(function () { document.querySelectorAll('.hero [data-count]').forEach(animateCounter); }, '-=.6');
    heroTl.from('.phone', { y: 80, opacity: 0, rotate: -3, duration: 1.3, ease: 'expo.out', clearProps: 'all' }, .3)
      .from('.float-card, .chip-float', { scale: .6, opacity: 0, duration: .9, stagger: .12, ease: 'back.out(1.6)', clearProps: 'all' }, .8);

    // Resto de la página: por lotes
    var rest = reveals.filter(function (el) { return !el.closest('.hero'); });
    ScrollTrigger.batch(rest, {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        batch.forEach(function (el) { el.classList.add('is-visible'); });
        gsap.fromTo(batch, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out', clearProps: 'transform,opacity' });
        batch.forEach(function (el) { el.querySelectorAll('[data-count]').forEach(animateCounter); });
      },
    });

    // Parallax
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var amount = Number(el.dataset.parallax) || -30;
      gsap.to(el, { y: amount, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: .6 } });
    });
    document.querySelectorAll('[data-parallax-img]').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -10 }, { yPercent: 2, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: .6 } });
    });

    // Línea de tiempo (cómo funciona)
    var timeline = document.querySelector('.timeline');
    if (timeline) {
      var items = timeline.querySelectorAll('.timeline__item');
      ScrollTrigger.create({
        trigger: timeline, start: 'top 70%', end: 'bottom 55%', scrub: .4,
        onUpdate: function (self) {
          timeline.style.setProperty('--line', (self.progress * 100) + '%');
          items.forEach(function (it, i) { it.classList.toggle('is-active', self.progress >= (i / (items.length - 1)) - .02); });
        },
      });
    }

    // Chat de Sami: mensajes uno a uno
    var chat = document.getElementById('chatBody');
    if (chat) {
      var msgs = chat.querySelectorAll('.msg');
      gsap.set(msgs, { opacity: 0, y: 14, scale: .97 });
      ScrollTrigger.create({
        trigger: chat, start: 'top 75%', once: true,
        onEnter: function () { gsap.to(msgs, { opacity: 1, y: 0, scale: 1, duration: .55, stagger: .55, ease: 'back.out(1.4)' }); },
      });
    }

    // Botón de descarga: ligera "respiración" para llamar la atención
    gsap.to('#downloadBtn', { scale: 1.02, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

  /* ---------- Descarga: tamaño, SHA-1 y QR ---------- */
  function initDownload() {
    var btn = document.getElementById('downloadBtn');
    if (btn) { btn.href = CONFIG.apkUrl; btn.setAttribute('download', CONFIG.apkFileName); }
    var repo = document.getElementById('repoLink');
    if (repo) repo.href = CONFIG.repoUrl;

    var absolute = new URL(CONFIG.apkUrl, window.location.href).href;
    var qrBox = document.getElementById('qrcode');
    if (qrBox && typeof window.QRCode !== 'undefined') {
      try { new QRCode(qrBox, { text: absolute, width: 160, height: 160, colorDark: '#1F4D2A', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M }); }
      catch (e) { qrBox.textContent = absolute; }
    }

    if (window.location.protocol === 'file:') return; // sin servidor no hay fetch
    fetch(CONFIG.apkUrl, { method: 'HEAD' }).then(function (r) {
      var len = Number(r.headers.get('content-length'));
      if (!r.ok || !len) return;
      var mb = (len / 1048576).toFixed(0) + ' MB';
      var a = document.getElementById('apkSize'); if (a) a.textContent = mb;
      var b = document.getElementById('heroApkSize'); if (b) b.textContent = 'Android 8.0+ · ' + mb;
    }).catch(function () {});
    fetch(CONFIG.shaUrl).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) {
      var sha = (t || '').trim().split(/\s+/)[0];
      var el = document.getElementById('apkSha');
      if (sha && el && /^[0-9a-f]{40}$/i.test(sha)) { el.textContent = sha; el.title = 'SHA-1 del archivo'; }
    }).catch(function () {});
  }

  /* ---------- Arranque ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderSpecies();
    initNav();
    initCursor();
    var words = splitTitle();
    initReveal(words);
    initDownload();
    var y = document.getElementById('year'); if (y) y.textContent = String(new Date().getFullYear());
    if (hasGsap) window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  });
})();
