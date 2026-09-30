"use strict";

const root = document.documentElement;
const header = document.querySelector(".site-header");
const navigation = document.querySelector("#primary-nav");
const menuButton = document.querySelector(".menu-toggle");
const navigationLinks = [...document.querySelectorAll("[data-nav]")];
const trackedSections = ["home", ...navigationLinks.map((link) => link.hash.slice(1))]
  .map((id) => document.getElementById(id));
const progress = document.querySelector(".reading-progress > span");
const mobileViewport = window.matchMedia("(max-width: 680px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let framePending = false;

function updateHeaderOffset() {
  root.style.setProperty("--header-offset", Math.ceil(header.getBoundingClientRect().height + 20) + "px");
}

function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", open);
  updateHeaderOffset();
  if (restoreFocus) menuButton.focus();
  scheduleNavigationUpdate();
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  setMenu(open);
  if (open) navigation.querySelector("a").focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenu(false, true);
  }
});
document.addEventListener("click", (event) => {
  if (menuButton.getAttribute("aria-expanded") === "true" && !header.contains(event.target)) {
    setMenu(false);
  }
});
header.addEventListener("focusout", (event) => {
  if (!header.contains(event.relatedTarget)) setMenu(false);
});
mobileViewport.addEventListener("change", () => setMenu(false));

document.querySelectorAll("main section[id]").forEach((section) => section.setAttribute("tabindex", "-1"));
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    setMenu(false);
    revealWithin(target);
    // Preserve native anchors, browser history, and deep links.
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
  });
});

function updateNavigation() {
  const threshold = header.getBoundingClientRect().height + 145;
  let current = "home";
  for (const section of trackedSections) {
    if (section.getBoundingClientRect().top <= threshold) current = section.id;
  }
  const scrollable = Math.max(0, document.documentElement.scrollHeight - innerHeight);
  if (scrollable > 0 && scrollY >= scrollable - 3) current = "contact";
  for (const link of navigationLinks) {
    if (link.hash === "#" + current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  const amount = scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
  progress.style.transform = "scaleX(" + amount + ")";
  framePending = false;
}
function scheduleNavigationUpdate() {
  if (!framePending) {
    framePending = true;
    requestAnimationFrame(updateNavigation);
  }
}
window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
window.addEventListener("resize", () => {
  updateHeaderOffset();
  scheduleNavigationUpdate();
});
window.addEventListener("hashchange", scheduleNavigationUpdate);
window.addEventListener("pageshow", scheduleNavigationUpdate);
document.addEventListener("toggle", scheduleNavigationUpdate, true);
if ("ResizeObserver" in window) {
  const layoutObserver = new ResizeObserver(() => {
    updateHeaderOffset();
    scheduleNavigationUpdate();
  });
  layoutObserver.observe(header);
  layoutObserver.observe(document.querySelector("main"));
}

// Filters are progressive enhancements: without JS, every project remains visible.
const filterGroup = document.querySelector(".project-filters");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll("[data-category]")];
const projectCount = document.querySelector("#project-count");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let count = 0;
    for (const card of projectCards) {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
      if (!card.hidden) count += 1;
    }
    for (const control of filterButtons) {
      control.setAttribute("aria-pressed", String(control === button));
    }
    projectCount.textContent = filter === "all"
      ? count + " projects & explorations"
      : filter === "development"
        ? count + " website" + (count === 1 ? "" : "s")
        : count + " UI exploration" + (count === 1 ? "" : "s");
    requestAnimationFrame(() => {
      for (const card of projectCards) {
        if (!card.hidden && card.getBoundingClientRect().top < innerHeight) revealWithin(card);
      }
      scheduleNavigationUpdate();
    });
  });
});
filterGroup.hidden = false;

// Only off-screen content gets an entrance; anchor navigation and keyboard focus reveal it immediately.
let revealObserver;
function revealWithin(element) {
  element.classList.remove("reveal-pending");
  element.querySelectorAll(".reveal-pending").forEach((child) => child.classList.remove("reveal-pending"));
}
function configureReveals() {
  if (revealObserver) revealObserver.disconnect();
  document.querySelectorAll(".reveal-pending").forEach((element) => element.classList.remove("reveal-pending"));
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
  revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove("reveal-pending");
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08, rootMargin: "0px 0px 30px 0px" });
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    if (element.getBoundingClientRect().top > innerHeight - 30) {
      element.classList.add("reveal-pending");
      revealObserver.observe(element);
    }
  });
}
document.addEventListener("focusin", (event) => {
  const container = event.target.closest("[data-reveal]");
  if (container) revealWithin(container);
});
reducedMotion.addEventListener("change", configureReveals);

root.classList.add("js");
document.querySelector("#year").textContent = new Date().getFullYear();
updateHeaderOffset();
updateNavigation();
configureReveals();
