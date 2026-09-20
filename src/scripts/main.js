// JS сайта.

import Lenis from "lenis";

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Плавный скролл (Lenis) ---
// Выключить полностью: поставь SMOOTH_SCROLL = false.
const SMOOTH_SCROLL = true;
let lenis = null;
if (SMOOTH_SCROLL && !prefersReduced) {
  // duration — «тягучесть», wheelMultiplier — насколько резво реагирует колесо
  lenis = new Lenis({ duration: 1.0, wheelMultiplier: 1.3 });
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // якорные ссылки (#final, #top …) — плавно через Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return; // просто "#"
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // цель и её блоки показываем сразу: иначе reveal-сдвиг (translateY)
      // уводит точку прокрутки, и попадаешь мимо заголовка
      [target, ...target.children, ...target.querySelectorAll("[data-reveal]")].forEach((el) => {
        el.style.transition = "none";
        el.classList.add("is-visible");
      });
      lenis.scrollTo(target, {
        offset: -24,
        onComplete: () => {
          // подстраховка от смещений из-за подгрузки картинок по пути
          const y = target.getBoundingClientRect().top + window.scrollY - 24;
          if (Math.abs(y - window.scrollY) > 3) lenis.scrollTo(y, { duration: 0.35 });
        },
      });
    });
  });
}

// прокрутка наверх — через Lenis, иначе нативно
const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
};

// --- Кнопка «наверх» (страницы кейсов) ---
const toTop = document.querySelector(".to-top");
if (toTop) {
  const update = () => {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight;
    const nearBottom = window.innerHeight + y > docH - 260;
    toTop.classList.toggle("is-visible", y > 500 && !nearBottom);
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
  toTop.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTop();
  });
}

// --- Тогл «Главная ДО» / «User Flow ДО» (кейс 1) ---
document.querySelectorAll("[data-tabs]").forEach((group) => {
  const tabs = [...group.querySelectorAll("[data-tab]")];
  const panels = [...group.querySelectorAll("[data-tab-panel]")];
  const indicator = group.querySelector(".tab-indicator");

  // сдвигает и растягивает плашку-индикатор под размер активной кнопки —
  // у «Главная «ДО»» и «User Flow «ДО»» разная длина текста
  const moveIndicator = (tab) => {
    if (!indicator) return;
    indicator.style.width = tab.offsetWidth + "px";
    indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
  };

  const activate = (key) => {
    const active = tabs.find((t) => t.dataset.tab === key);
    tabs.forEach((t) => t.classList.toggle("tab--active", t === active));
    if (active) moveIndicator(active);
    panels.forEach((p) => {
      p.hidden = p.dataset.tabPanel !== key;
    });
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => activate(tab.dataset.tab)));

  const initial = tabs.find((t) => t.classList.contains("tab--active")) || tabs[0];
  if (initial) {
    // без transition на первый кадр — иначе плашка «прилетает» из угла при загрузке
    if (indicator) indicator.style.transition = "none";
    activate(initial.dataset.tab);
    if (indicator) requestAnimationFrame(() => (indicator.style.transition = ""));
  }
});

// --- Разворот картинок кейса на весь экран ---
const caseRoot = document.querySelector(".case");
if (caseRoot) {
  const EXPAND_SVG =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 3H3v6M21 9V3h-6M15 21h6v-6M3 15v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const CLOSE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  let box;
  const closeLightbox = () => {
    if (box) box.classList.remove("is-open", "is-zoomed");
    document.body.style.overflow = "";
  };
  const openLightbox = (src) => {
    if (!src) return;
    if (!box) {
      box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("data-lenis-prevent", ""); // Lenis не перехватывает скролл над лайтбоксом
      box.innerHTML =
        '<button type="button" class="lightbox-close" aria-label="Закрыть">' +
        CLOSE_SVG +
        '</button><img alt="" />';
      box.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
      // клик по картинке — переключение «вписать ↔ натуральный размер» со скроллом
      box.querySelector("img").addEventListener("click", () => {
        box.classList.toggle("is-zoomed");
        box.scrollTo(0, 0);
      });
      document.body.appendChild(box);
    }
    box.classList.remove("is-zoomed");
    box.querySelector("img").src = src;
    box.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  caseRoot.querySelectorAll(".media-frame").forEach((frame) => {
    if (!frame.querySelector("img")) return; // видео не разворачиваем
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "media-expand";
    btn.setAttribute("aria-label", "Открыть во весь экран");
    btn.innerHTML = EXPAND_SVG;
    frame.appendChild(btn);
    frame.addEventListener("click", () => {
      // берём видимую картинку (в табах их несколько)
      const img = frame.querySelector("img:not([hidden])") || frame.querySelector("img");
      openLightbox(img.currentSrc || img.src);
    });
  });
}

// --- Появление блоков ---
// главная: [data-reveal]; кейсы: каждый прямой блок внутри .case-section.
// Интро-каскад (блоки, видимые сразу при загрузке) проигрывается ОДИН раз
// за сессию вкладки — при переходах между страницами больше не повторяется.
// Всё, что ниже сгиба, появляется по скроллу как обычно.
const revealables = document.querySelectorAll("[data-reveal], .case .case-section > *");
if (revealables.length) {
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    let introSeen = null;
    try {
      introSeen = sessionStorage.getItem("introSeen");
    } catch (_) {
      /* приватный режим и т. п. — считаем, что интро ещё не было */
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((entry, i) => {
            const el = entry.target;
            io.unobserve(el);
            el.style.transitionDelay = i * 80 + "ms"; // лёгкий стаггер, если появились разом
            requestAnimationFrame(() => el.classList.add("is-visible"));
            setTimeout(() => (el.style.transitionDelay = ""), 800); // потом ничего не ждёт
          });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    const vh = window.innerHeight;
    revealables.forEach((el) => {
      const r = el.getBoundingClientRect();
      const inView = r.top < vh && r.bottom > 0;
      if (inView && introSeen) {
        // интро уже видели в этой сессии — показываем без анимации
        el.style.transition = "none";
        el.classList.add("is-visible");
        requestAnimationFrame(() => (el.style.transition = ""));
      } else {
        io.observe(el);
      }
    });

    try {
      sessionStorage.setItem("introSeen", "1");
    } catch (_) {
      /* ignore */
    }
  }
}

// --- Затухание контента у верхнего края экрана (кейсы + главная) ---
if (document.querySelector(".case, .page")) {
  const topFade = document.createElement("div");
  topFade.className = "edge-fade--top";
  document.body.append(topFade);

  // на главной хедера нет — держим дымку скрытой, пока не прокрутили,
  // иначе она ложится на hero
  if (!document.querySelector(".site-header")) {
    const gateFade = () => topFade.classList.toggle("is-hidden", window.scrollY < 40);
    window.addEventListener("scroll", gateFade, { passive: true });
    gateFade();
  }
}

// --- Кнопка «Читать кейс»: чиним застревание при скролле колесом ---
// :hover в браузере не пересчитывается, если курсор физически стоит
// на месте — при скролле колесом карточки проезжают под ним, а hover
// остаётся на прошлой. Следим за последней позицией мыши и на scroll
// сами проверяем, что сейчас под курсором.
{
  const cards = document.querySelectorAll(".case-card");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (cards.length && canHover) {
    let mouseX = -1;
    let mouseY = -1;
    let hoveredCard = null;

    const setHovered = (card) => {
      if (card === hoveredCard) return;
      if (hoveredCard) hoveredCard.classList.remove("is-btn-hover");
      if (card) card.classList.add("is-btn-hover");
      hoveredCard = card;
    };

    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        setHovered(e.target.closest(".case-card"));
      },
      { passive: true },
    );

    window.addEventListener(
      "scroll",
      () => {
        if (mouseX < 0) return;
        const el = document.elementFromPoint(mouseX, mouseY);
        setHovered(el ? el.closest(".case-card") : null);
      },
      { passive: true },
    );
  }
}
