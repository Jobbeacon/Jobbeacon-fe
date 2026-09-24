document.querySelectorAll("[data-save]").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("is-saved");
    btn.setAttribute("aria-pressed", btn.classList.contains("is-saved"));
  });
});

document.querySelectorAll("[data-switch]").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("is-on");
    btn.setAttribute("aria-checked", btn.classList.contains("is-on"));
  });
});

const menuBtn = document.querySelector("[data-menu]");
const mobileNav = document.querySelector("[data-mobile-nav]");
if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("is-open");
  });
}

document.querySelectorAll("[data-reset-filters]").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest("form")?.querySelectorAll("input[type=checkbox]").forEach((el) => {
      el.checked = false;
    });
  });
});
