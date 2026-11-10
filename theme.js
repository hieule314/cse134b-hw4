"use strict";

(() => {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentTheme = "light";
  let activeTransition;

  function applyTheme(theme) {
    currentTheme = theme;
    root.dataset.theme = theme;
    button.textContent = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  }

  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      currentTheme = savedTheme;
    }
  } catch {
    // The readable default works even when browser storage is unavailable.
  }
  applyTheme(currentTheme);

  button.addEventListener("click", () => {
    const update = () => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        localStorage.setItem("theme", nextTheme);
      } catch {
        // The theme has already changed; saving is optional when storage fails.
      }
    };

    if (document.startViewTransition && !reducedMotion.matches) {
      // Finish a previous fade before starting another keyboard/click action.
      if (activeTransition) activeTransition.skipTransition();
      activeTransition = document.startViewTransition(update);
      activeTransition.ready.catch(() => {});
    } else {
      update();
    }
  });

  button.hidden = false;
})();
