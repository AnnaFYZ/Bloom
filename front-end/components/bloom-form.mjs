import {apiService} from "../index.mjs";

/**
 * Create a bloom form component
 * @param {string} templateId - The ID of the <template> to clone
 * @param {boolean} isLoggedIn - only logged in users see the bloom form
 * @returns {DocumentFragment|null}
 */
function createBloomForm(templateId, isLoggedIn) {
  if (!isLoggedIn) return null;
  if (!templateId) throw new Error("Missing templateId");

  const el = document.getElementById(templateId);
  if (!el) throw new Error(`Template not found: #${templateId}`);
  if (!(el instanceof HTMLTemplateElement)) {
    throw new Error(`#${templateId} is not a <template> element`);
  }

  return el.content.cloneNode(true);
}

/**
 * Handle bloom form submission
 * @param {SubmitEvent} event
 */
async function handleBloomSubmit(event) {
  event.preventDefault();

  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  const submitButton = form.querySelector("[data-submit]");
  const textarea = form.querySelector("textarea");

  if (!(submitButton instanceof HTMLButtonElement)) return;
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  const content = textarea.value.trim();
  if (!content) return;

  const originalText = submitButton.textContent;

  try {
    form.inert = true;
    submitButton.disabled = true;
    submitButton.textContent = "Posting...";

    await apiService.postBloom(content);

    textarea.value = "";
    // optionally: update counter here by calling handleTyping({ target: textarea })
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    form.inert = false;
  }
}

/**
 * Handle textarea input for bloom form
 * @param {InputEvent} event
 */
function handleTyping(event) {
  const textarea = event.target;
  if (!(textarea instanceof HTMLTextAreaElement)) return;

  const formRoot = textarea.closest("[data-form]");
  const counter = formRoot?.querySelector("[data-counter]");
  if (!(counter instanceof HTMLElement)) return;

  const maxAttr = textarea.getAttribute("maxlength");
  const maxLength = maxAttr ? Number.parseInt(maxAttr, 10) : null;

  const current = textarea.value.length;
  counter.textContent = maxLength ? `${current} / ${maxLength}` : `${current}`;
}

export {createBloomForm, handleBloomSubmit, handleTyping};
