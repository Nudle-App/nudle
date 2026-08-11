const toggle = document.querySelector("[data-nav-toggle]");
const mobile = document.querySelector("[data-nav-mobile]");
const iconOpen = document.querySelector("[data-icon-open]");
const iconClose = document.querySelector("[data-icon-close]");
const nav = document.querySelector(".nav");

const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

const API_BASE = isLocal
  ? "http://localhost:3001"
  : "https://server-l3dm.onrender.com";

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

function syncNav() {
  nav?.classList.toggle("is-scrolled", window.scrollY > 8);
}

syncNav();
window.addEventListener("scroll", syncNav, { passive: true });

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

const form = document.querySelector("[data-demo-form]");
const statusEl = document.querySelector("[data-demo-status]");
const submitBtn = document.querySelector("[data-demo-submit]");
const successEl = document.querySelector("[data-demo-success]");

function setStatus(message, tone) {
  if (!statusEl) return;
  if (!message) {
    statusEl.hidden = true;
    statusEl.textContent = "";
    statusEl.removeAttribute("data-tone");
    return;
  }
  statusEl.hidden = false;
  statusEl.textContent = message;
  statusEl.setAttribute("data-tone", tone);
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!(form instanceof HTMLFormElement)) return;

  const data = new FormData(form);
  const payload = {
    fullName: String(data.get("fullName") || "").trim(),
    email: String(data.get("email") || "").trim(),
    organization: String(data.get("organization") || "").trim(),
    role: String(data.get("role") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    message: String(data.get("message") || "").trim(),
  };

  if (!payload.fullName || !payload.email || !payload.organization || !payload.role) {
    setStatus("Please fill in all required fields.", "error");
    return;
  }

  if (submitBtn instanceof HTMLButtonElement) {
    submitBtn.disabled = true;
  }
  setStatus("Sending…", "pending");

  try {
    const res = await fetch(`${API_BASE}/api/demo-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error || "Something went wrong. Please try again.");
    }

    form.hidden = true;
    setStatus("");
    if (successEl) successEl.hidden = false;
  } catch (err) {
    setStatus(
      err instanceof Error ? err.message : "Something went wrong. Please try again.",
      "error",
    );
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = false;
    }
  }
});
