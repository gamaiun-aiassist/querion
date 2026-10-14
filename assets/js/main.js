// Мобильное меню: открытие по кнопке, закрытие по Esc, по клику на пункт и повторному нажатию
(function () {
  var toggle = document.querySelector('.header__toggle');
  var menu = document.getElementById('menu');
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
    setOpen(false);
    toggle.focus();
  });

  // При переходе на десктопную ширину меню сбрасывается
  var mq = window.matchMedia('(min-width: 768px)');
  mq.addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
})();

// Ряд сценариев фокусируемый только там, где он прокручивается (мобильная раскладка)
(function () {
  var list = document.querySelector('.scenarios__list');
  if (!list) return;
  var mq = window.matchMedia('(max-width: 767px)');
  function sync() {
    if (mq.matches) list.setAttribute('tabindex', '0');
    else list.removeAttribute('tabindex');
  }
  sync();
  mq.addEventListener('change', sync);
})();

// Подсветка найденного фрагмента: проявляется, когда фрагмент попадает в экран
(function () {
  var marks = document.querySelectorAll('[data-hl]');
  if (!marks.length) return;
  function found(el) { el.classList.add('is-found'); }
  if (!('IntersectionObserver' in window)) {
    marks.forEach(found);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      setTimeout(found, 150, entry.target);
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -15% 0px' });
  marks.forEach(function (el) { io.observe(el); });
})();

// Переключатель ролей в блоке безопасности (WAI-ARIA tabs)
(function () {
  var root = document.querySelector('[data-roles]');
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  });
})();

// Ленивые изображения: класс is-loaded после загрузки (мягкое проявление в CSS)
(function () {
  document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
    function done() { img.classList.add('is-loaded'); }
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  });
})();
