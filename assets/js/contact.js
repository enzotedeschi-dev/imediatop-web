document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("YOUR_PUBLIC_KEY");

  const form = document.getElementById("contactForm");
  if (!form) return;

  const popup = document.getElementById("contactSuccess");
  const closeBtn = document.getElementById("successClose");
  const okBtn = document.getElementById("successOk");

  /* ---------- Popup helpers ---------- */
  function openPopup() {
    popup.removeAttribute("aria-hidden");
    popup.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }

  function closePopup() {
    popup.classList.remove("is-visible");
    popup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closePopup);
  if (okBtn) okBtn.addEventListener("click", closePopup);

  /* Chiudi cliccando sul backdrop */
  popup
    ?.querySelector(".success-popup__backdrop")
    ?.addEventListener("click", closePopup);

  /* Chiudi con Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("is-visible")) {
      closePopup();
    }
  });

  /* ---------- Submit ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      company: form.company.value.trim() || "Non specificata",
      service: form.service.value,
      message: form.message.value.trim(),
      privacy: form.querySelector('[name="privacy"]').checked
        ? "Accettata"
        : "—",
      time: new Date().toLocaleString("it-IT"),
    };

    const btn = form.querySelector(".contact__submit");
    const btnText = btn?.querySelector(".contact__submit-text");
    const originalText = btnText?.textContent;

    if (btn) {
      btn.classList.add("is-loading");
      btn.disabled = true;
    }

    if (btnText) btnText.textContent = "Invio in corso";

    try {
      await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData);

      form.reset();
      openPopup();
    } catch (error) {
      console.error("Errore invio:", error);
      alert("Si è verificato un errore. Riprova.");
    } finally {
      if (btn) {
        btn.classList.remove("is-loading");
        btn.disabled = false;
      }

      if (btnText) btnText.textContent = originalText || "Invia messaggio";
    }
  });
});
