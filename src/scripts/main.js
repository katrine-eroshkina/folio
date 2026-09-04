// JS сайта.

// --- Кнопка «наверх» (страницы кейсов) ---
const toTop = document.querySelector(".to-top");
if (toTop) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
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
    window.scrollTo({ top: 0, behavior: reduce.matches ? "auto" : "smooth" });
  });
}

// --- Табы «Главная ДО» / «User Flow ДО» (кейс 1) ---
document.querySelectorAll("[data-tabs]").forEach((group) => {
  const tabs = [...group.querySelectorAll("[data-tab]")];
  const panels = [...group.querySelectorAll("[data-tab-panel]")];

  // рамка подстраивает пропорцию под показанную картинку (снимки разной формы)
  const fitFrame = (panel) => {
    if (panel.tagName !== "IMG") return;
    const frame = panel.closest(".media-frame");
    if (!frame) return;
    const apply = () => {
      if (panel.naturalWidth) {
        frame.style.setProperty("--ratio", panel.naturalWidth + " / " + panel.naturalHeight);
      }
    };
    panel.complete ? apply() : panel.addEventListener("load", apply, { once: true });
  };

  const activate = (key) => {
    tabs.forEach((t) => t.classList.toggle("tab--active", t.dataset.tab === key));
    panels.forEach((p) => {
      p.hidden = p.dataset.tabPanel !== key;
      if (!p.hidden) fitFrame(p);
    });
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => activate(tab.dataset.tab)));

  const initial = tabs.find((t) => t.classList.contains("tab--active")) || tabs[0];
  if (initial) activate(initial.dataset.tab);
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

// --- Появление блоков при скролле ---
// главная: [data-reveal]; кейсы: каждый прямой блок внутри .case-section
const revealables = document.querySelectorAll("[data-reveal], .case .case-section > *");
if (revealables.length) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
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
    revealables.forEach((el) => io.observe(el));
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
