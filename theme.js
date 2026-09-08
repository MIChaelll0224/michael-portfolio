"use strict";

// Run in the head so the saved palette is selected before styles and content paint.
(() => {
  const root = document.documentElement;
  const storageKey = "munzon-theme";
  const devicePreference = window.matchMedia("(prefers-color-scheme: dark)");
  const validTheme = (value) => value === "dark" || value === "light";
  let preference = null;
  let currentTheme;

  try {
    const stored = localStorage.getItem(storageKey);
    if (validTheme(stored)) preference = stored;
  } catch {
    // Restricted storage must not prevent theme switching.
  }

  function applyTheme(theme) {
    currentTheme = theme;
    root.dataset.theme = theme;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const schemeMeta = document.querySelector('meta[name="color-scheme"]');
    if (themeMeta) themeMeta.content = theme === "dark" ? "#0b0d10" : "#f5f7f9";
    if (schemeMeta) schemeMeta.content = theme;

    const button = document.querySelector(".theme-toggle");
    if (button) {
      const nextTheme = theme === "dark" ? "light" : "dark";
      const label = "Switch to " + nextTheme + " mode";
      button.setAttribute("aria-label", label);
      button.title = label;
      button.querySelector(".theme-label").textContent = nextTheme === "light" ? "Light" : "Dark";
    }
  }

  const preferredTheme = () => preference || (devicePreference.matches ? "dark" : "light");
  applyTheme(preferredTheme());

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;
    button.hidden = false;
    applyTheme(currentTheme);
    button.addEventListener("click", () => {
      preference = currentTheme === "dark" ? "light" : "dark";
      applyTheme(preference);
      try {
        localStorage.setItem(storageKey, preference);
      } catch {
        // The selected mode still works for this visit.
      }
    });
  });

  devicePreference.addEventListener("change", () => {
    if (!preference) applyTheme(preferredTheme());
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = validTheme(event.newValue) ? event.newValue : null;
    applyTheme(preferredTheme());
  });
})();
