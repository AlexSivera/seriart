/* SERIART — main.js. Classic script, no dependencies.
   Every feature is optional: if one fails the rest still boot, and the HTML is
   fully usable without JavaScript. */
(function () {
  "use strict";

  var cfg = window.__SERIART__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  /* Show an element that uses [hidden] + an .is-open class for its transition */
  function openPanel(el) {
    el.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("is-open"); }); });
  }
  function closePanel(el) {
    el.classList.remove("is-open");
    var done = false;
    function finish() { if (done) return; done = true; if (!el.classList.contains("is-open")) el.hidden = true; }
    el.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 350);
  }

  /* ---------------------------------------------------------------------
     Header: shadow on scroll, solid background once past the home hero
     --------------------------------------------------------------------- */
  var header = $("[data-header]");
  function setSolid() {
    if (!header) return;
    var megaOpen = $("[data-mega-trigger]") && $("[data-mega-trigger]").getAttribute("aria-expanded") === "true";
    var navOpen = document.body.classList.contains("nav-open");
    var scrolled = window.scrollY > 24;
    header.classList.toggle("is-scrolled", scrolled);
    header.classList.toggle("is-solid", scrolled || megaOpen || navOpen);
  }
  function initHeader() {
    if (!header) return;
    setSolid();
    window.addEventListener("scroll", setSolid, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Mega menu (desktop): hover with small delays, click / keyboard toggle
     --------------------------------------------------------------------- */
  function initMega() {
    var trigger = $("[data-mega-trigger]");
    var menu = $("[data-mega]");
    if (!trigger || !menu) return;
    var openTimer, closeTimer;
    var canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

    function open() {
      clearTimeout(closeTimer);
      if (trigger.getAttribute("aria-expanded") === "true") return;
      trigger.setAttribute("aria-expanded", "true");
      openPanel(menu);
      setSolid();
    }
    function close(returnFocus) {
      clearTimeout(openTimer);
      if (trigger.getAttribute("aria-expanded") !== "true") return;
      trigger.setAttribute("aria-expanded", "false");
      closePanel(menu);
      setSolid();
      if (returnFocus) trigger.focus();
    }
    trigger.addEventListener("click", function () {
      if (trigger.getAttribute("aria-expanded") === "true") close(); else open();
    });
    if (canHover) {
      [trigger, menu].forEach(function (el) {
        el.addEventListener("mouseenter", function () { clearTimeout(closeTimer); openTimer = setTimeout(open, 80); });
        el.addEventListener("mouseleave", function () { clearTimeout(openTimer); closeTimer = setTimeout(close, 220); });
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") close(true);
    });
    document.addEventListener("click", function (e) {
      if (!trigger.contains(e.target) && !menu.contains(e.target)) close();
    });
    menu.addEventListener("focusout", function (e) {
      if (e.relatedTarget && !menu.contains(e.relatedTarget) && e.relatedTarget !== trigger) close();
    });
  }

  /* ---------------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = $("[data-nav-toggle]");
    var panel = $("[data-mnav]");
    if (!toggle || !panel) return;

    function set(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.classList.toggle("nav-open", open);
      if (open) {
        openPanel(panel);
        var first = $("a, button", panel);
        if (first) setTimeout(function () { first.focus(); }, 60);
      } else {
        closePanel(panel);
      }
      setSolid();
    }
    toggle.addEventListener("click", function () { set(toggle.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { set(false); toggle.focus(); }
    });
    $$("[data-mnav-sub]", panel).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sub = document.getElementById(btn.getAttribute("aria-controls"));
        var open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (sub) sub.hidden = !open;
      });
    });
    $$("a", panel).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    matchMedia("(min-width: 960px)").addEventListener("change", function (e) { if (e.matches) set(false); });
  }

  /* ---------------------------------------------------------------------
     Scroll reveals. Content is only hidden once this runs (html.reveal-on),
     so a JS failure never leaves the page blank. Stagger resets per grid.
     --------------------------------------------------------------------- */
  function initReveals() {
    var targets = $$(".reveal, .reveal-wipe, .step");
    if (!targets.length || reduced || typeof IntersectionObserver === "undefined") return;
    var groups = new Map();
    targets.forEach(function (el) {
      var parent = el.parentElement;
      var i = groups.get(parent) || 0;
      groups.set(parent, i + 1);
      if (i) el.style.setProperty("--d", Math.min(i, 5) * 90 + "ms");
    });
    document.documentElement.classList.add("reveal-on");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-visible");
        io.unobserve(el);
        // Drop the stagger delay afterwards so hover transitions stay instant
        setTimeout(function () { el.style.removeProperty("--d"); }, 1600);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Hero timelapse video: autoplay muted (unless reduced motion), pause
     button, and pause while off-screen to save battery.
     --------------------------------------------------------------------- */
  function initHeroVideo() {
    var video = $("[data-hero-video]");
    var btn = $("[data-hero-video-toggle]");
    if (!video) return;
    var userPaused = reduced;

    function play() {
      var p = video.play();
      if (p && p.catch) p.catch(function () { setState(false); });
    }
    function setState(playing) {
      if (!btn) return;
      btn.classList.toggle("is-paused", !playing);
      btn.setAttribute("aria-label", playing ? "Pausar vídeo" : "Reproducir vídeo");
    }
    video.addEventListener("playing", function () { video.classList.add("is-playing"); setState(true); });
    video.addEventListener("pause", function () { setState(false); });

    if (btn) btn.addEventListener("click", function () {
      if (video.paused) { userPaused = false; video.preload = "auto"; play(); }
      else { userPaused = true; video.pause(); }
    });
    setState(false);
    if (userPaused) return;

    video.preload = "auto";
    if (typeof IntersectionObserver !== "undefined") {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !userPaused) play(); else if (!entry.isIntersecting) video.pause();
        });
      }, { threshold: 0.2 }).observe(video);
    } else {
      play();
    }
  }

  /* ---------------------------------------------------------------------
     Portfolio filter
     --------------------------------------------------------------------- */
  function initFilter() {
    var bar = $("[data-filter-bar]");
    var grid = $("[data-filter-grid]");
    if (!bar || !grid) return;
    var items = $$("[data-filter-item]", grid);
    var empty = $("[data-filter-empty]");
    $$("[data-filter]", bar).forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$("[data-filter]", bar).forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        var key = btn.getAttribute("data-filter");
        var shown = 0;
        items.forEach(function (item) {
          var show = key === "all" || item.getAttribute("data-filter-item").split(" ").indexOf(key) !== -1;
          item.classList.toggle("is-hidden", !show);
          if (show) { shown++; item.classList.add("is-visible"); }
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  /* ---------------------------------------------------------------------
     Lightbox with prev / next, keyboard, swipe and focus handling.
     Items: <a data-lightbox-item="group" href="big.webp" data-caption="…">
     --------------------------------------------------------------------- */
  function initLightbox() {
    var box = $("[data-lightbox]");
    var all = $$("[data-lightbox-item]");
    if (!box || !all.length) return;
    var img = $("[data-lb-img]", box);
    var caption = $("[data-lb-caption]", box);
    var count = $("[data-lb-count]", box);
    var prevBtn = $("[data-lb-prev]", box);
    var nextBtn = $("[data-lb-next]", box);
    var list = [], index = 0, opener = null;

    function visibleGroup(group) {
      return all.filter(function (a) {
        return a.getAttribute("data-lightbox-item") === group && !a.classList.contains("is-hidden");
      });
    }
    function show(i) {
      index = (i + list.length) % list.length;
      var a = list[index];
      var thumb = $("img", a);
      img.classList.add("is-loading");
      img.onload = function () { img.classList.remove("is-loading"); };
      img.src = a.getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      caption.textContent = a.getAttribute("data-caption") || "";
      count.textContent = list.length > 1 ? (index + 1) + " / " + list.length : "";
      prevBtn.hidden = nextBtn.hidden = list.length < 2;
    }
    function open(a) {
      opener = a;
      list = visibleGroup(a.getAttribute("data-lightbox-item"));
      show(list.indexOf(a));
      document.body.classList.add("lb-open");
      openPanel(box);
      setTimeout(function () { $("[data-lb-close]", box).focus(); }, 30);
    }
    function close() {
      document.body.classList.remove("lb-open");
      closePanel(box);
      if (opener) opener.focus();
    }
    all.forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        open(a);
      });
    });
    prevBtn.addEventListener("click", function () { show(index - 1); });
    nextBtn.addEventListener("click", function () { show(index + 1); });
    $("[data-lb-close]", box).addEventListener("click", close);
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
      else if (e.key === "Tab") {
        var f = $$("button:not([hidden])", box);
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var startX = null;
    box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (startX === null || list.length < 2) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  /* ---------------------------------------------------------------------
     Forms: inline validation + Web3Forms. Without an access key, fall back
     to the visitor's mail app with the message already written.
     --------------------------------------------------------------------- */
  var MESSAGES = {
    valueMissing: "Este campo es obligatorio.",
    typeMismatch: "Revisa el formato (por ejemplo, nombre@correo.com).",
    checkbox: "Necesitamos tu aceptación para poder responderte."
  };
  function fieldError(input) {
    if (input.validity.valid) return "";
    if (input.type === "checkbox") return MESSAGES.checkbox;
    if (input.validity.typeMismatch) return MESSAGES.typeMismatch;
    return MESSAGES.valueMissing;
  }
  function showError(input) {
    var wrap = input.closest(".field");
    if (!wrap) return;
    var msg = fieldError(input);
    var el = $(".field-error", wrap);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg && !el) {
      el = document.createElement("p");
      el.className = "field-error";
      el.id = input.id + "-error";
      wrap.appendChild(el);
      input.setAttribute("aria-describedby", el.id);
    }
    if (el) el.textContent = msg;
    if (!msg && el) { el.remove(); input.removeAttribute("aria-describedby"); }
  }
  function formToText(form) {
    var lines = [];
    new FormData(form).forEach(function (value, key) {
      if (["access_key", "subject", "from_name", "botcheck"].indexOf(key) !== -1 || !String(value).trim()) return;
      lines.push(key + ": " + value);
    });
    return lines.join("\n");
  }
  function initForms() {
    $$("[data-form]").forEach(function (form) {
      var status = $("[data-form-status]", form);
      var submit = $("[data-submit]", form);
      var inputs = $$("input[required], select[required], textarea[required]", form);
      var tried = false;
      inputs.forEach(function (input) {
        input.addEventListener(input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "blur", function () { if (tried || input.value) showError(input); });
        input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") showError(input); });
      });

      function setStatus(kind, html) {
        status.className = "form-status" + (kind ? " is-" + kind : "");
        status.innerHTML = html || "";
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        tried = true;
        var invalid = inputs.filter(function (i) { showError(i); return !i.validity.valid; });
        if (invalid.length) {
          invalid[0].focus();
          setStatus("error", "Revisa los campos marcados.");
          return;
        }
        var kind = form.getAttribute("data-form-kind") || "contacto";
        var key = cfg.web3formsKey;

        if (!key) {
          var subject = $("input[name=subject]", form).value;
          var href = "mailto:" + cfg.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(formToText(form));
          window.location.href = href;
          setStatus("ok", "Se ha abierto tu programa de correo con el mensaje ya escrito: solo tienes que darle a enviar. Si no se ha abierto, escríbenos a <a href=\"mailto:" + cfg.email + "\">" + cfg.email + "</a> o por WhatsApp.");
          return;
        }

        submit.setAttribute("aria-busy", "true");
        var label = submit.textContent;
        submit.textContent = "Enviando…";
        setStatus("", "");
        var data = new FormData(form);
        data.set("access_key", key);
        var replyTo = $("input[type=email]", form);
        if (replyTo) data.set("replyto", replyTo.value);
        fetch("https://api.web3forms.com/submit", { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (r) { return r.json(); })
          .then(function (json) {
            if (!json.success) throw new Error(json.message || "error");
            window.location.href = (form.getAttribute("data-thanks") || "gracias.html") + "?tipo=" + kind;
          })
          .catch(function () {
            submit.removeAttribute("aria-busy");
            submit.textContent = label;
            setStatus("error", "No hemos podido enviar el mensaje. Inténtalo de nuevo o escríbenos por <a href=\"https://wa.me/" + cfg.whatsappNumber + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a>.");
          });
      });
    });
  }

  /* Preselect the service from ?servicio=slug */
  function initServicePreselect() {
    var select = $("[data-service-select]");
    if (!select) return;
    var slug = new URLSearchParams(window.location.search).get("servicio");
    if (!slug) return;
    var match = $$("option[data-slug]", select).filter(function (o) { return o.getAttribute("data-slug") === slug; })[0];
    if (match) select.value = match.value;
  }

  /* Thank-you page copy depends on which form was sent */
  function initThanks() {
    var title = $("[data-thanks-title]");
    if (!title) return;
    var tipo = new URLSearchParams(window.location.search).get("tipo");
    if (tipo === "presupuesto") {
      title.textContent = "Solicitud recibida";
      $("[data-thanks-text]").textContent = "Gracias. Revisamos tu proyecto y te enviamos el presupuesto lo antes posible. Si tienes logo o diseño, puedes mandárnoslo ya por WhatsApp o email.";
    }
  }

  /* Google Maps only loads after an explicit click (no third-party cookies before) */
  function initMap() {
    var wrap = $("[data-map]");
    if (!wrap) return;
    var btn = $("[data-map-load]", wrap);
    btn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = wrap.getAttribute("data-map-src");
      iframe.title = "Ubicación del taller de Seriart en Dénia";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      wrap.appendChild(iframe);
      $(".map-facade-inner", wrap).hidden = true;
    });
  }

  /* Credits page */
  function initCredits() {
    var list = $("[data-credits]");
    if (!list) return;
    fetch(list.getAttribute("data-credits-base")).then(function (r) { return r.json(); }).then(function (credits) {
      list.innerHTML = "";
      Object.keys(credits).forEach(function (id) {
        var c = credits[id];
        var li = document.createElement("li");
        var strong = document.createElement("strong");
        strong.textContent = c.title || id;
        li.appendChild(strong);
        li.appendChild(document.createTextNode(" — " + c.creator + " (" + c.source + ") · "));
        var lic = document.createElement("a");
        lic.href = c.license_url; lic.target = "_blank"; lic.rel = "noopener";
        lic.textContent = String(c.license).toUpperCase();
        li.appendChild(lic);
        li.appendChild(document.createTextNode(" · "));
        var orig = document.createElement("a");
        orig.href = c.foreign_landing_url; orig.target = "_blank"; orig.rel = "noopener";
        orig.textContent = "Ver original";
        li.appendChild(orig);
        list.appendChild(li);
      });
    }).catch(function () { list.innerHTML = "<li>No se pudieron cargar los créditos.</li>"; });
  }

  function boot() {
    safe(initHeader, "header");
    safe(initMega, "mega");
    safe(initMobileNav, "mobileNav");
    safe(initReveals, "reveals");
    safe(initHeroVideo, "heroVideo");
    safe(initFilter, "filter");
    safe(initLightbox, "lightbox");
    safe(initForms, "forms");
    safe(initServicePreselect, "servicePreselect");
    safe(initThanks, "thanks");
    safe(initMap, "map");
    safe(initCredits, "credits");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
