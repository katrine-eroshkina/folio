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
