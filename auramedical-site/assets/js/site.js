/* AuraMed — site behaviour */

/* ------------------------------------------------------------------
   EARLY-ACCESS FORM → KIT
   1. In Kit: Grow → Landing pages & forms → create an Inline form.
   2. Copy the number from the form's embed URL (…/forms/1234567/…).
   3. Paste it between the quotes below, commit, and the form goes live.
   Until then the form runs in preview mode: it shows the success
   message but doesn't send anything.
------------------------------------------------------------------- */
const KIT_FORM_ID = "9959315";

(function () {
  "use strict";

  /* Nav: border on scroll, mobile toggle */
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav-links a, .nav-cta").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* Fibre diagram: wash-count slider */
  const range = document.getElementById("wash-range");
  const out = document.getElementById("wash-out");
  const surface = Array.from(document.querySelectorAll(".ag-surface"));
  if (range && out) {
    const update = () => {
      const v = Number(range.value);
      out.textContent = v === 1 ? "1 wash" : `${v} washes`;
      range.style.setProperty("--fill", `${(v / Number(range.max)) * 100}%`);
      surface.forEach((dot) => dot.classList.toggle("is-gone", v >= Number(dot.dataset.life)));
    };
    range.addEventListener("input", update);
    update();
  }

  /* Tech sheet: link numbered callouts (front + back) with the spec list */
  const flats = document.getElementById("flats");
  const callouts = Array.from(document.querySelectorAll(".co"));
  const specs = Array.from(document.querySelectorAll(".spec-list li"));
  const setActive = (id) => {
    if (flats) flats.classList.toggle("has-active", Boolean(id));
    callouts.forEach((c) => c.classList.toggle("is-active", c.dataset.spot === id));
    specs.forEach((s) => s.classList.toggle("is-active", s.dataset.spot === id));
  };
  [...callouts, ...specs].forEach((el) => {
    el.addEventListener("mouseenter", () => setActive(el.dataset.spot));
    el.addEventListener("mouseleave", () => setActive(null));
    el.addEventListener("focus", () => setActive(el.dataset.spot));
    el.addEventListener("blur", () => setActive(null));
  });
  callouts.forEach((c) => {
    const go = () => {
      setActive(c.dataset.spot);
      const target = specs.find((s) => s.dataset.spot === c.dataset.spot);
      if (target && window.matchMedia("(max-width: 920px)").matches) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    c.addEventListener("click", go);
    c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  /* Early-access form */
  const form = document.getElementById("access-form");
  const panel = document.querySelector(".form-panel");
  const errorEl = document.getElementById("form-error");
  if (form && panel) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";

      // Honeypot: real people never fill this in.
      if (form.querySelector('[name="company_website"]').value) return;

      let firstInvalid = null;
      form.querySelectorAll("[required]").forEach((el) => {
        const ok = el.type === "checkbox" ? el.checked : el.checkValidity();
        el.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !firstInvalid) firstInvalid = el;
      });
      if (firstInvalid) {
        const consent = form.querySelector("#consent");
        errorEl.textContent =
          firstInvalid === consent
            ? "Tick the consent box so we're allowed to email you."
            : "Fill in the highlighted fields to join the list.";
        firstInvalid.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending";

      const data = new FormData(form);
      data.delete("company_website");
      data.delete("consent");

      try {
        if (KIT_FORM_ID) {
          await fetch(`https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`, {
            method: "POST",
            body: data,
            mode: "no-cors",
          });
        } else {
          console.info("[AuraMed] Preview mode: add KIT_FORM_ID in assets/js/site.js to send signups to Kit.");
          await new Promise((r) => setTimeout(r, 600));
        }
        panel.classList.add("is-done");
        const done = panel.querySelector(".form-done");
        done.setAttribute("tabindex", "-1");
        done.focus();
      } catch (err) {
        errorEl.textContent =
          "That didn't go through. Check your connection and try again, or email hello@auramedical.ca.";
        btn.disabled = false;
        btn.textContent = label;
      }
    });

    form.querySelectorAll("input, select").forEach((el) =>
      el.addEventListener("change", () => el.removeAttribute("aria-invalid"))
    );
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
