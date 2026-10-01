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
    const focusTarget = target instanceof HTMLDetailsElement ? target.querySelector("summary") : target;
    if (target instanceof HTMLDetailsElement) target.open = true;
    revealWithin(target);
    // Preserve native anchors, browser history, and deep links.
    requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
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

// Keep project screenshots in a bounded, keyboard-accessible project dialog.
const masterlistDialog = document.querySelector("#masterlist-project-dialog");
const masterlistScreens = [...document.querySelectorAll(".masterlist-gallery figure")];
const masterlistTriggers = [...document.querySelectorAll(".masterlist-preview, .masterlist-gallery a")];
const masterlistImage = document.querySelector("#masterlist-dialog-image");
let masterlistOpener;

const masterlistScreenDetails = {
  "overview.png": {
    purpose: "Give the team a quick view of the catalog and the items that need attention before rollout.",
    features: ["Catalog totals and product mix", "Product group summaries", "Team rollout checks"]
  },
  "products.png": {
    purpose: "Help the team find and compare products in the catalog using the details relevant to their work.",
    features: ["Product search and category tabs", "Filters for format, brand, owner, status, and data checks", "Prices and stock status in the results"]
  },
  "product-record.png": {
    purpose: "Review a product's operational details in one record while keeping the catalog in view.",
    features: ["Product details in a side panel", "Minimum order quantities, pricing, and stock", "Old SKU references and source tabs"]
  },
  "new-product.png": {
    purpose: "Create new catalog records through a consistent product entry form.",
    features: ["Brand, format, and product type fields", "Pricing and minimum order quantity levels", "Automatic SKU generation"]
  },
  "inventory.png": {
    purpose: "Track how stock changes over time and trace movements back to their operational records.",
    features: ["Opening inventory counts", "Receipts, sales, returns, and adjustments", "Movement dates, locations, and references"]
  },
  "data-checks.png": {
    purpose: "Identify catalog records that need review so the team can focus on incomplete or conflicting data.",
    features: ["Duplicate legacy code checks", "Missing price and cost flags", "Product classification review queues"]
  },
  "reports.png": {
    purpose: "Prepare catalog and inventory outputs for sales, internal reviews, and record keeping.",
    features: ["Sales price lists and internal masterlist exports", "Source reconciliation and count sheets", "Database backups"]
  }
};

function showMasterlistScreen(index) {
  const screen = masterlistScreens[index];
  const source = screen.querySelector("img");
  const details = masterlistScreenDetails[source.getAttribute("src").split("/").pop()];
  masterlistImage.src = source.src;
  masterlistImage.alt = source.alt;
  document.querySelector("#masterlist-screen-title").textContent = screen.querySelector("strong").textContent.replace(/^\d+ \/ /, "");
  document.querySelector("#masterlist-screen-purpose").textContent = details.purpose;
  document.querySelector("#masterlist-screen-features").replaceChildren(...details.features.map((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    return item;
  }));
}

masterlistTriggers.forEach((trigger) => {
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-controls", masterlistDialog.id);
  // Capture before the page's anchor handler so opening a preview never scrolls the page.
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    masterlistOpener = trigger;
    const index = masterlistScreens.indexOf(trigger.closest("figure"));
    showMasterlistScreen(Math.max(0, index));
    root.classList.add("masterlist-dialog-open");
    masterlistDialog.showModal();
    masterlistDialog.scrollTop = 0;
  }, { capture: true });
});

masterlistDialog.querySelector(".masterlist-dialog-close").addEventListener("click", () => masterlistDialog.close());
let masterlistBackdropPressed = false;
function isMasterlistBackdrop(event) {
  const bounds = masterlistDialog.getBoundingClientRect();
  return event.target === masterlistDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
}
masterlistDialog.addEventListener("pointerdown", (event) => { masterlistBackdropPressed = isMasterlistBackdrop(event); });
masterlistDialog.addEventListener("click", (event) => {
  if (masterlistBackdropPressed && isMasterlistBackdrop(event)) masterlistDialog.close();
  masterlistBackdropPressed = false;
});
masterlistDialog.addEventListener("close", () => {
  root.classList.remove("masterlist-dialog-open");
  masterlistOpener?.focus({ preventScroll: true });
});
