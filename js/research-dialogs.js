(() => {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-dialog-target]");
    if (trigger) {
      const dialog = document.getElementById(trigger.dataset.dialogTarget);
      if (dialog?.showModal) dialog.showModal();
      return;
    }

    const closeButton = event.target.closest("[data-dialog-close]");
    if (closeButton) {
      closeButton.closest("dialog")?.close();
      return;
    }

    if (event.target.tagName === "DIALOG" && event.target.open) {
      event.target.close();
    }
  });
})();
