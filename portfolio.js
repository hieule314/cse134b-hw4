"use strict";

(() => {
  const explorer = document.querySelector("details.explorer-panel");
  const narrowScreen = window.matchMedia("(max-width: 63.999rem)");
  function fitExplorer() {
    if (explorer) explorer.open = !narrowScreen.matches;
  }
  fitExplorer();
  narrowScreen.addEventListener("change", fitExplorer);

  const toolkit = document.querySelector(".toolkit");
  if (!toolkit) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;

  // Duplicate only the visual strip. Assistive technology gets one complete list.
  for (const track of toolkit.querySelectorAll(".skill-track")) {
    const copy = track.querySelector(".skill-list").cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    copy.inert = true;
    track.append(copy);
  }

  const skillWindows = [...toolkit.querySelectorAll(".skill-window")];
  const help = document.createElement("p");
  help.id = "skill-motion-help";
  help.className = "sr-only";
  help.textContent = "Select a skill row or press Enter or Space while focused to pause or resume rotation.";
  toolkit.append(help);

  function updateMotion() {
    if (reducedMotion.matches) delete toolkit.dataset.skillsMotion;
    else toolkit.dataset.skillsMotion = paused ? "paused" : "running";

    for (const window of skillWindows) {
      const label = window.closest(".skill-row").querySelector("h3").textContent;
      if (reducedMotion.matches) {
        window.removeAttribute("tabindex");
        window.removeAttribute("aria-describedby");
        window.removeAttribute("title");
        window.setAttribute("aria-label", label);
      } else {
        window.tabIndex = 0;
        window.setAttribute("aria-describedby", help.id);
        window.title = paused ? "Select to resume rotation" : "Select to pause rotation";
        window.setAttribute("aria-label", `${label}. Rotation ${paused ? "paused" : "running"}.`);
      }
    }
  }

  function toggleMotion() {
    if (reducedMotion.matches) return;
    paused = !paused;
    updateMotion();
  }

  for (const window of skillWindows) {
    window.setAttribute("role", "group");
    window.addEventListener("click", toggleMotion);
    window.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleMotion();
      }
    });
  }
  reducedMotion.addEventListener("change", updateMotion);
  updateMotion();
})();
