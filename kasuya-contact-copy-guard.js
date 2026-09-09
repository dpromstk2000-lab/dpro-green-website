(() => {
  "use strict";
  const READY_LABEL = "この内容で相談を送る";
  const button = document.querySelector("#submit-button");
  if (!button) return;

  const normalize = () => {
    const busy = button.getAttribute("aria-busy") === "true";
    if (!busy && button.textContent !== READY_LABEL) button.textContent = READY_LABEL;
  };

  normalize();
  const observer = new MutationObserver(normalize);
  observer.observe(button, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["aria-busy"] });
})();
