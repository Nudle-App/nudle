const toggle = document.querySelector("[data-nav-toggle]");
const mobile = document.querySelector("[data-nav-mobile]");
const iconOpen = document.querySelector("[data-icon-open]");
const iconClose = document.querySelector("[data-icon-close]");

function setMenu(open) {
  mobile?.classList.toggle("is-open", open);
  toggle?.setAttribute("aria-expanded", String(open));
  if (iconOpen && iconClose) {
    iconOpen.hidden = open;
    iconClose.hidden = !open;
  }
}

toggle?.addEventListener("click", () => {
  setMenu(!mobile?.classList.contains("is-open"));
});

mobile?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
