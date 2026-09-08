"use strict";

const navigation = document.querySelector("#primary-nav");
const menuButton = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const navigationLinks = [...document.querySelectorAll("[data-nav]")];
const sections = [...document.querySelectorAll("main > section[id]")];
const mobileViewport = window.matchMedia("(max-width: 680px)");

function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", open);
  if (restoreFocus) menuButton.focus();
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
  if (!header.contains(event.target)) setMenu(false);
});

header.addEventListener("focusout", (event) => {
  if (!header.contains(event.relatedTarget)) setMenu(false);
});

mobileViewport.addEventListener("change", () => setMenu(false));

sections.forEach((section) => section.setAttribute("tabindex", "-1"));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    setMenu(false);
    // Native anchors preserve deep links and browser Back/Forward behavior.
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
  });
});

let framePending = false;
function updateActiveSection() {
  const threshold = header.getBoundingClientRect().height + 130;
  let currentSection = "home";
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) currentSection = section.id;
  }
  for (const link of navigationLinks) {
    if (link.hash === "#" + currentSection) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  framePending = false;
}

function scheduleNavigationUpdate() {
  if (!framePending) {
    framePending = true;
    requestAnimationFrame(updateActiveSection);
  }
}

window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
window.addEventListener("resize", scheduleNavigationUpdate);
window.addEventListener("hashchange", scheduleNavigationUpdate);
window.addEventListener("pageshow", scheduleNavigationUpdate);
document.querySelector("#year").textContent = new Date().getFullYear();
document.documentElement.classList.add("js");
updateActiveSection();
