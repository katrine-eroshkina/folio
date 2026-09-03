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
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.toggle("tab--active", t === tab));
      panels.forEach((p) => {
        p.hidden = p.dataset.tabPanel !== tab.dataset.tab;
      });
    });
  });
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
    if (box) box.classList.remove("is-open");
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
      document.body.appendChild(box);
    }
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
