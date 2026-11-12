"use strict";

(() => {
  const explorer = document.querySelector("details.explorer-panel");
  const narrowScreen = window.matchMedia("(max-width: 63.999rem)");
  function fitExplorer() {
    if (explorer) explorer.open = !narrowScreen.matches;
  }
  fitExplorer();
  narrowScreen.addEventListener("change", fitExplorer);

  // Real anchor links remain usable when this enhancement is unavailable.
  const outlineLinks = [...document.querySelectorAll("[data-section]")];
  const sections = outlineLinks.map(link => document.getElementById(link.dataset.section));
  if (outlineLinks.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      const active = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id;
      for (const link of outlineLinks) {
        if (link.dataset.section === active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    }, { rootMargin: "-15% 0px -45% 0px", threshold: [0, 0.1, 0.25] });
    sections.filter(Boolean).forEach(section => observer.observe(section));
  }

  const toolkit = document.querySelector(".toolkit");
  const motionButton = document.querySelector("#skills-motion");
  if (!toolkit || !motionButton) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;

  // Duplicate only the visual strip. Assistive technology gets one complete list.
  for (const track of toolkit.querySelectorAll(".skill-track")) {
    const copy = track.querySelector(".skill-list").cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    copy.inert = true;
    track.append(copy);
  }

  function updateMotion() {
    if (reducedMotion.matches) {
      delete toolkit.dataset.skillsMotion;
      motionButton.hidden = true;
      return;
    }
    toolkit.dataset.skillsMotion = paused ? "paused" : "running";
    motionButton.hidden = false;
    motionButton.setAttribute("aria-pressed", String(paused));
    motionButton.textContent = paused ? "Resume skill rotation" : "Pause skill rotation";
  }

  motionButton.addEventListener("click", () => {
    paused = !paused;
    updateMotion();
  });
  reducedMotion.addEventListener("change", updateMotion);
  updateMotion();
})();
