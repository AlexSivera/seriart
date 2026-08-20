/* SERIART — main.js. Classic script, IIFE pattern. No modules, no imports. */
(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  /* ---------------------------------------------------------------------
     WhatsApp float — build href from brand data
     --------------------------------------------------------------------- */
  function initWhatsapp() {
    var links = $$("[data-whatsapp-link]");
    if (!links.length || !data.whatsappNumber) return;
    var text = encodeURIComponent(data.whatsappDefaultText || "");
    var href = "https://wa.me/" + data.whatsappNumber + "?text=" + text;
    links.forEach(function (link) { link.href = href; });
  }

  /* ---------------------------------------------------------------------
     Header scroll state
     --------------------------------------------------------------------- */
  function initHeaderScroll() {
    var header = $(".site-header");
    if (!header) return;
    function update() {
      if (window.scrollY > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Mega menu (desktop) — hover with delay + click for touch/keyboard
     --------------------------------------------------------------------- */
  function initMegaMenu() {
    var trigger = $("[data-mega-trigger]");
    var menu = $("[data-mega-menu]");
    if (!trigger || !menu) return;
    var closeTimer = null;

    function open() {
      clearTimeout(closeTimer);
      menu.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
    function close() {
      menu.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }
    function scheduleClose() {
      closeTimer = setTimeout(close, 220);
    }

    trigger.addEventListener("mouseover", function (e) {
      if (!trigger.contains(e.relatedTarget)) open();
    });
    trigger.addEventListener("mouseout", function (e) {
      if (!trigger.contains(e.relatedTarget) && !menu.contains(e.relatedTarget)) scheduleClose();
    });
    menu.addEventListener("mouseover", function () { clearTimeout(closeTimer); });
    menu.addEventListener("mouseout", function (e) {
      if (!menu.contains(e.relatedTarget) && !trigger.contains(e.relatedTarget)) scheduleClose();
    });
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      if (menu.classList.contains("is-open")) close(); else open();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    document.addEventListener("click", function (e) {
      if (!trigger.contains(e.target) && !menu.contains(e.target)) close();
    });
  }

  /* ---------------------------------------------------------------------
     Mobile nav panel
     --------------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = $("[data-nav-toggle]");
    var panel = $("[data-nav-mobile]");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    $$("[data-nav-mobile-sub-toggle]", panel).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sub = document.getElementById(btn.getAttribute("aria-controls"));
        if (!sub) return;
        var isOpen = sub.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
    $$("a", panel).forEach(function (a) {
      a.addEventListener("click", function () {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveals — threshold low + 6s safety net
     --------------------------------------------------------------------- */
  function initReveals() {
    var targets = $$(".reveal");
    if (!targets.length) return;
    if (typeof IntersectionObserver === "undefined") {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    targets.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
      io.observe(el);
    });
    setTimeout(function () {
      $$(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* ---------------------------------------------------------------------
     Card tilt — subtle, pointer-fine only, never gated by reduced-motion
     --------------------------------------------------------------------- */
  function initTilt() {
    if (!fineHover) return;
    $$("[data-tilt]").forEach(function (card) {
      var raf = null;
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.transform = "perspective(900px) rotateX(" + (py * -5) + "deg) rotateY(" + (px * 5) + "deg) translateY(-4px)";
        });
      });
      card.addEventListener("mouseleave", function () {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      });
    });
  }

  /* ---------------------------------------------------------------------
     Magnetic buttons — subtle strength
     --------------------------------------------------------------------- */
  function initMagnetic() {
    if (!fineHover) return;
    $$("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        var y = (e.clientY - rect.top - rect.height / 2) * 0.35;
        btn.style.transform = "translate(" + x + "px," + y + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------------------
     Count-up stats
     --------------------------------------------------------------------- */
  function initCountUp() {
    var items = $$("[data-count-to]");
    if (!items.length || typeof IntersectionObserver === "undefined") return;
    function run(el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var suffix = el.getAttribute("data-count-suffix") || "";
      var duration = reduced ? 400 : 1400;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------------------- */
  function initFaq() {
    $$(".faq-item").forEach(function (item) {
      var btn = $(".faq-question", item);
      if (!btn) return;
      btn.addEventListener("click", function () {
        var wasOpen = item.classList.contains("is-open");
        item.parentElement.querySelectorAll(".faq-item").forEach(function (i) { i.classList.remove("is-open"); });
        if (!wasOpen) item.classList.add("is-open");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Portfolio filter
     --------------------------------------------------------------------- */
  function initPortfolioFilter() {
    var bar = $("[data-filter-bar]");
    var items = $$("[data-filter-item]");
    if (!bar || !items.length) return;
    $$(".filter-btn", bar).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".filter-btn", bar).forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        var filter = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var cats = (item.getAttribute("data-filter-item") || "").split(" ");
          var show = filter === "all" || cats.indexOf(filter) !== -1;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Lightbox
     --------------------------------------------------------------------- */
  function initLightbox() {
    var lightbox = $("[data-lightbox]");
    if (!lightbox) return;
    var img = $("[data-lightbox-img]", lightbox);
    var compareBox = $("[data-lightbox-compare]", lightbox);
    var compareBeforeImg = compareBox && $(".compare-before-img", compareBox);
    var compareAfterImg = compareBox && $(".compare-after-img", compareBox);
    var compareHandle = compareBox && $(".compare-handle", compareBox);
    var triggers = $$("[data-lightbox-src], [data-compare-before]");
    if (!triggers.length) return;

    function openImage(src, alt) {
      img.src = src;
      img.alt = alt || "";
      img.style.display = "";
      if (compareBox) compareBox.hidden = true;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function openCompare(beforeSrc, beforeAlt, afterSrc, afterAlt) {
      if (!compareBox) return;
      compareBeforeImg.src = beforeSrc;
      compareBeforeImg.alt = beforeAlt || "";
      compareAfterImg.src = afterSrc;
      compareAfterImg.alt = afterAlt || "";
      compareAfterImg.style.clipPath = "inset(0 0 0 50%)";
      if (compareHandle) compareHandle.style.left = "50%";
      img.style.display = "none";
      compareBox.hidden = false;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    triggers.forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        if (el.hasAttribute("data-compare-before")) {
          openCompare(
            el.getAttribute("data-compare-before"), el.getAttribute("data-compare-before-alt"),
            el.getAttribute("data-compare-after"), el.getAttribute("data-compare-after-alt")
          );
        } else {
          openImage(el.getAttribute("data-lightbox-src"), el.getAttribute("data-lightbox-alt"));
        }
      });
    });
    $(".lightbox-close", lightbox).addEventListener("click", close);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------------------------------------------------------------------
     Before / after compare slider
     --------------------------------------------------------------------- */
  function initCompare() {
    $$("[data-compare]").forEach(function (wrap) {
      var after = $(".compare-after", wrap);
      var handle = $(".compare-handle", wrap);
      var btn = $(".compare-handle-btn", wrap);
      if (!after || !handle) return;
      var dragging = false;

      function setPos(clientX) {
        var rect = wrap.getBoundingClientRect();
        var pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1) * 100;
        after.style.clipPath = "inset(0 0 0 " + pct + "%)";
        handle.style.left = pct + "%";
      }
      function onMove(e) {
        if (!dragging) return;
        var x = e.touches ? e.touches[0].clientX : e.clientX;
        setPos(x);
      }
      function start(e) { dragging = true; onMove(e); }
      function stop() { dragging = false; }

      (btn || handle).addEventListener("mousedown", start);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", stop);
      (btn || handle).addEventListener("touchstart", start, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", stop);
    });
  }

  /* ---------------------------------------------------------------------
     Forms — mailto-based (static site, no backend). Progressive enhancement:
     native reportValidity + friendly success note. Works with JS disabled too
     since <form action="mailto:..." method="get"> is native browser behavior.
     --------------------------------------------------------------------- */
  function initForms() {
    $$("form[data-mailto-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        if (!form.reportValidity()) { e.preventDefault(); return; }
        var success = $("[data-form-success]", form.parentElement) || $("[data-form-success]");
        if (success) success.classList.add("is-visible");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Preselect service in budget form from ?servicio=slug in the URL
     --------------------------------------------------------------------- */
  function initServicePreselect() {
    var select = $("[data-service-select]");
    if (!select) return;
    var params = new URLSearchParams(window.location.search);
    var slug = params.get("servicio");
    if (!slug) return;
    var match = $$("option[data-slug]", select).filter(function (o) { return o.getAttribute("data-slug") === slug; })[0];
    if (match) select.value = match.value;
  }

  /* ---------------------------------------------------------------------
     Cookie / RGPD banner
     --------------------------------------------------------------------- */
  function initCookieBanner() {
    var banner = $("[data-cookie-banner]");
    if (!banner) return;
    var whatsapp = $(".whatsapp-float");
    var KEY = "seriart-cookie-consent";
    try {
      if (localStorage.getItem(KEY)) return;
    } catch (e) { /* localStorage unavailable — show banner anyway */ }
    setTimeout(function () {
      banner.classList.add("is-visible");
      if (whatsapp) whatsapp.classList.add("is-raised");
    }, 600);
    $$("[data-cookie-action]", banner).forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.setItem(KEY, btn.getAttribute("data-cookie-action")); } catch (e) {}
        banner.classList.remove("is-visible");
        if (whatsapp) whatsapp.classList.remove("is-raised");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Credits page — fetch + render (progressive: only on creditos.html)
     --------------------------------------------------------------------- */
  function initCredits() {
    var list = $("[data-credits]");
    if (!list) return;
    var base = list.getAttribute("data-credits-base") || "assets/credits.json";
    fetch(base).then(function (r) { return r.json(); }).then(function (credits) {
      var html = Object.keys(credits).map(function (id) {
        var c = credits[id];
        return "<li><strong>" + (c.title || id) + "</strong> — " +
          (c.creator_url ? "<a href=\"" + c.creator_url + "\" target=\"_blank\" rel=\"noopener\">" + c.creator + "</a>" : c.creator) +
          " (" + c.source + ") · <a href=\"" + c.license_url + "\" target=\"_blank\" rel=\"noopener\">" + c.license.toUpperCase() + "</a>" +
          " · <a href=\"" + c.foreign_landing_url + "\" target=\"_blank\" rel=\"noopener\">Ver original ↗</a></li>";
      }).join("");
      list.innerHTML = html;
    }).catch(function () { list.innerHTML = "<li>No se pudieron cargar los créditos.</li>"; });
  }

  function boot() {
    safe(initWhatsapp, "initWhatsapp");
    safe(initHeaderScroll, "initHeaderScroll");
    safe(initMegaMenu, "initMegaMenu");
    safe(initMobileNav, "initMobileNav");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initMagnetic, "initMagnetic");
    safe(initCountUp, "initCountUp");
    safe(initFaq, "initFaq");
    safe(initPortfolioFilter, "initPortfolioFilter");
    safe(initLightbox, "initLightbox");
    safe(initCompare, "initCompare");
    safe(initForms, "initForms");
    safe(initServicePreselect, "initServicePreselect");
    safe(initCookieBanner, "initCookieBanner");
    safe(initCredits, "initCredits");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
