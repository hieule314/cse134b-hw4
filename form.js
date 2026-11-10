"use strict";

// Error history belongs to this page visit and never contains entered values.
const form_errors = [];

(() => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const fields = [...form.querySelectorAll("input[required], textarea[required]")];
  const comments = form.querySelector("#comments");
  const errorArea = form.querySelector("#error-area");
  const errorContent = form.querySelector("#error-content");
  const informationArea = form.querySelector("#information-area");
  const counter = form.querySelector("#comments-count");
  const historyField = form.querySelector("#form-errors");
  const edited = new Set();
  const reviewed = new Set();
  const labels = { name: "Name", email: "Email", comments: "Comments" };
  const requiredMessages = {
    name: "Name: please enter your name.",
    email: "Email: please enter an email address.",
    comments: "Comments: please enter a message."
  };
  const warningThreshold = 100;

  function validateField(field) {
    // A previous custom error must be cleared before inspecting native validity.
    field.setCustomValidity("");
    let message = "";

    if (field.validity.valueMissing) {
      message = requiredMessages[field.id];
    } else if (field.validity.typeMismatch) {
      message = "Email: enter an address such as alex@example.com.";
    } else if (
      field.validity.tooShort ||
      (field.minLength > 0 && field.value.length < field.minLength)
    ) {
      message = `${labels[field.id]}: enter at least ${field.minLength} characters.`;
    } else if (field.validity.tooLong) {
      message = `${labels[field.id]}: use no more than ${field.maxLength} characters.`;
    } else if (!field.validity.valid) {
      message = `${labels[field.id]}: check the instructions and correct this field.`;
    }

    field.setCustomValidity(message);
    return message;
  }

  function showFieldFeedback(field, message) {
    const error = document.querySelector(`#${field.id}-error`);
    error.textContent = message;
    error.hidden = !message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function updateErrorArea() {
    errorContent.hidden = !fields.some(field => field.getAttribute("aria-invalid") === "true");
  }

  function updateCounter() {
    const remaining = comments.maxLength - comments.value.length;
    const nearLimit = remaining <= warningThreshold;
    informationArea.classList.toggle("is-warning", nearLimit);

    if (remaining === 0) {
      counter.textContent = "Character limit reached. 0 characters remaining; delete text to add more.";
    } else if (nearLimit) {
      counter.textContent = `Near the limit: ${remaining} ${remaining === 1 ? "character" : "characters"} remaining.`;
    } else {
      counter.textContent = `${remaining} characters remaining.`;
    }
  }

  for (const field of fields) {
    field.addEventListener("input", () => {
      edited.add(field);
      const message = validateField(field);
      if (reviewed.has(field)) {
        showFieldFeedback(field, message);
        updateErrorArea();
      }
    });

    field.addEventListener("blur", () => {
      if (!edited.has(field)) return;
      reviewed.add(field);
      showFieldFeedback(field, validateField(field));
      updateErrorArea();
    });
  }

  comments.addEventListener("input", updateCounter);

  form.addEventListener("submit", event => {
    const invalidFields = [];

    for (const field of fields) {
      reviewed.add(field);
      const message = validateField(field);
      showFieldFeedback(field, message);
      if (message) {
        invalidFields.push(field);
        // This handler runs once for each attempt, including Enter submission.
        form_errors.push({ field: field.name, message });
      }
    }
    updateErrorArea();

    if (invalidFields.length > 0) {
      event.preventDefault();
      // Move focus only after submission, never while someone is typing.
      invalidFields[0].reportValidity();
      return;
    }

    historyField.value = JSON.stringify(form_errors);
    // Let the browser perform the form's normal POST navigation.
  });

  updateCounter();
  informationArea.hidden = false;
  errorArea.hidden = false;

  // Enable this only after the handler is ready. Native pre-submit validation
  // otherwise prevents submit events for invalid forms. With JS off (or if this
  // script fails to load), the HTML still uses its native validation and POST.
  form.noValidate = true;
})();
