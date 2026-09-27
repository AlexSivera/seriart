/* Dev-time build helpers — shared partials for every page.
   Pages are assembled in tools/build.js; copy lives in tools/content-data.js.
   Output is plain, hardcoded HTML (no runtime templating). Only the generated
   .html files + styles.css + main.js + lib/ + assets/ are deployed. */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const V = "20260926"; // cache-buster, bump on every deploy

/* ---------------------------------------------------------------------------
   Business data — single source of truth (also written to lib/manifest.js)
   --------------------------------------------------------------------------- */
const BRAND = {
  name: "Seriart",
  email: "alexitosivera@gmail.com",
  phoneDisplay: "966 43 30 33",
  phoneHref: "+34966433033",
  whatsappNumber: "34651358822",
  whatsappDisplay: "651 35 88 22",
  whatsappText: "Hola, me gustaría pedir presupuesto para un proyecto.",
  street: "Ronda de les Muralles, 20",
  postalCode: "03700",
  city: "Dénia",
  province: "Alicante",
  address: "Ronda de les Muralles, 20, 03700 Dénia (Alicante)",
  hours: "Lunes a viernes, 8:00–14:00",
  hoursNote: "Tardes con cita previa",
  founded: 2002,
  siteUrl: "https://www.seriart.es",
  /* Web3Forms access key (https://web3forms.com → create key with the email
     that must receive the requests). While empty, forms fall back to opening
     the visitor's mail app with the message already written. */
  web3formsKey: "",
  /* Hero timelapse. Put the file in assets/video/ and fill `src` (mp4, H.264,
     1920px wide max, no audio, ideally < 8 MB). `poster` is shown until it
     plays and whenever the visitor prefers reduced motion. */
  heroVideo: {
    src: "",
    poster: "hero-vehicle-wrap.jpg",
    caption: "Timelapse: rotulación de una furgoneta en el taller"
  }
};

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function rel(depth, p) { return (depth > 0 ? "../".repeat(depth) : "") + p; }
function write(filePath, html) {
  const full = path.join(ROOT, filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  console.log("  wrote", filePath);
}
function waHref(text) {
  return "https://wa.me/" + BRAND.whatsappNumber + "?text=" + encodeURIComponent(text || BRAND.whatsappText);
}

/* Responsive images: reads the manifest written by tools/optimize-images.js */
let IMG_MANIFEST = {};
try { IMG_MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, "assets/img/opt/manifest.json"), "utf8")); } catch (e) { /* not generated yet */ }

function imgBase(file) { return file.replace(/\.(jpe?g|png)$/i, ""); }
function imgLargest(depth, file) {
  const m = IMG_MANIFEST[file];
  if (!m || !m.widths.length) return rel(depth, "assets/img/" + file);
  return rel(depth, "assets/img/opt/" + imgBase(file) + "-" + m.widths[m.widths.length - 1] + ".webp");
}
/* <img> with srcset. opts: sizes, eager, cls, attrs */
function pic(depth, file, alt, opts) {
  opts = opts || {};
  const m = IMG_MANIFEST[file];
  const load = opts.eager ? 'fetchpriority="high"' : 'loading="lazy"';
  const cls = opts.cls ? ` class="${opts.cls}"` : "";
  const extra = opts.attrs ? " " + opts.attrs : "";
  if (!m || !m.widths.length) {
    return `<img${cls} src="${rel(depth, "assets/img/" + file)}" alt="${esc(alt)}" ${load} decoding="async"${extra}>`;
  }
  const b = imgBase(file);
  const srcset = m.widths.map((w) => `${rel(depth, "assets/img/opt/" + b + "-" + w + ".webp")} ${w}w`).join(", ");
  const small = rel(depth, "assets/img/opt/" + b + "-" + m.widths[0] + ".webp");
  return `<img${cls} src="${small}" srcset="${srcset}" sizes="${opts.sizes || "100vw"}" width="${m.w}" height="${m.h}" alt="${esc(alt)}" ${load} decoding="async"${extra}>`;
}

/* ---------------------------------------------------------------------------
   Navigation data (header mega-menu, mobile nav, footer, sitemap)
   Rotulación first: it's the core of the business.
   --------------------------------------------------------------------------- */
const CATEGORIES = [
  {
    slug: "rotulacion", label: "Rotulación y vinilo", overview: "servicios/rotulacion.html",
    items: [
      { label: "Vehículos", href: "rotulacion/vehiculos.html" },
      { label: "Rótulos para negocios", href: "rotulacion/rotulos-negocios.html" },
      { label: "Letras corpóreas", href: "rotulacion/letras-corporeas.html" },
      { label: "Escaparates", href: "rotulacion/escaparates.html" },
      { label: "Vinilos decorativos", href: "rotulacion/vinilos.html" }
    ]
  },
  {
    slug: "serigrafia", label: "Serigrafía", overview: "servicios/serigrafia.html",
    items: [
      { label: "Serigrafía textil", href: "serigrafia/textil.html" },
      { label: "Ropa laboral personalizada", href: "serigrafia/ropa-laboral.html" },
      { label: "Merchandising", href: "serigrafia/merchandising.html" }
    ]
  },
  {
    slug: "gran-formato", label: "Gran formato", overview: "servicios/gran-formato.html",
    items: [
      { label: "Lonas publicitarias", href: "gran-formato/lonas.html" },
      { label: "Banners y pancartas", href: "gran-formato/banners.html" },
      { label: "Roll-ups", href: "gran-formato/roll-ups.html" },
      { label: "Cartelería", href: "gran-formato/carteleria.html" }
    ]
  }
];

/* ---------------------------------------------------------------------------
   Icons — one stroke weight (1.75) for the whole set
   --------------------------------------------------------------------------- */
const ICONS = {
  shirt: '<path d="M8 3 3 7l3 3 2-1.5V21h8V8.5L18 10l3-3-5-4-2 2h-4L8 3Z" stroke-linejoin="round"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  phone: '<path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" stroke-linejoin="round"/>',
  truck: '<path d="M2 6h12v10H2zM14 9h4l4 4v3h-8z" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z" stroke-linejoin="round"/><path d="m3 13 9 5 9-5" stroke-linejoin="round"/>',
  ruler: '<path d="M3 16 16 3l5 5L8 21 3 16Z" stroke-linejoin="round"/><path d="m9 10 2 2M12 7l2 2M6 13l2 2" stroke-linecap="round"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6l-8-3Z" stroke-linejoin="round"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" stroke-linecap="round"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>',
  chevron: '<path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>',
  close: '<path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/>',
  prev: '<path d="m15 6-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/>',
  next: '<path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>',
  play: '<path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" stroke-linejoin="round"/>',
  pause: '<path d="M8 5v14M16 5v14" stroke-linecap="round" stroke-width="2.5"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16v4Z" stroke-linejoin="round"/><path d="m13.5 6.5 4 4"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5Z" stroke-linejoin="round"/>',
  map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" stroke-linejoin="round"/><path d="M9 4v14M15 6v14"/>'
};
function svgIcon(name, size) {
  const s = size || 20;
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">${ICONS[name] || ICONS.check}</svg>`;
}
const WHATSAPP_SVG = '<svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M16 3C9 3 3 9 3 16c0 2.4.7 4.7 1.9 6.7L3 29l6.5-1.8A13 13 0 0 0 16 29c7 0 13-6 13-13S23 3 16 3Zm0 23.6c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 26.6 16 10.6 10.6 0 0 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4C10 11 9.5 12 9.5 13.4S10.6 16.3 10.8 16.6c.1.2 2.2 3.4 5.4 4.7 2 .8 2.8.9 3.8.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg>';

/* ---------------------------------------------------------------------------
   <head>
   --------------------------------------------------------------------------- */
function headBlock(depth, opts) {
  const canonical = BRAND.siteUrl + "/" + (opts.canonical || "");
  const ogImage = BRAND.siteUrl + "/assets/img/" + (opts.ogImage || "hero-vehicle-wrap.jpg");
  const preload = opts.preload
    ? (() => {
        const m = IMG_MANIFEST[opts.preload];
        if (!m || !m.widths.length) return `\n  <link rel="preload" as="image" href="${rel(depth, "assets/img/" + opts.preload)}" fetchpriority="high">`;
        const b = imgBase(opts.preload);
        const set = m.widths.map((w) => `${rel(depth, "assets/img/opt/" + b + "-" + w + ".webp")} ${w}w`).join(", ");
        return `\n  <link rel="preload" as="image" type="image/webp" imagesrcset="${set}" imagesizes="${opts.preloadSizes || "100vw"}" fetchpriority="high">`;
      })()
    : "";
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(opts.title)}</title>
  <meta name="description" content="${esc(opts.description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="${opts.noindex ? "noindex, follow" : "index, follow"}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Seriart">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(opts.title)}">
  <meta property="og:description" content="${esc(opts.description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="es_ES">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0d1822">
  <link rel="icon" href="${rel(depth, "assets/img/favicon.svg")}" type="image/svg+xml">
  <link rel="preload" href="${rel(depth, "assets/fonts/barlow-sc-700.woff2")}" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${rel(depth, "assets/fonts/barlow-400.woff2")}" as="font" type="font/woff2" crossorigin>${preload}
  <link rel="stylesheet" href="${rel(depth, "styles.css")}?v=${V}">
  <script>document.documentElement.classList.add("js")</script>`;
}

function schemaBlock() {
  return `<script type="application/ld+json">
${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Seriart",
    "image": BRAND.siteUrl + "/assets/img/hero-vehicle-wrap.jpg",
    "logo": BRAND.siteUrl + "/assets/img/logo-trim.png",
    "url": BRAND.siteUrl + "/",
    "telephone": BRAND.phoneHref,
    "email": BRAND.email,
    "priceRange": "€€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BRAND.street,
      "addressLocality": BRAND.city,
      "addressRegion": BRAND.province,
      "postalCode": BRAND.postalCode,
      "addressCountry": "ES"
    },
    "areaServed": "ES",
    "foundingDate": String(BRAND.founded),
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "14:00"
    }],
    "description": "Rotulación de vehículos y negocios, vinilo, serigrafía textil, ropa laboral e impresión de gran formato en Dénia, Alicante. Diseño, fabricación e instalación desde 2002."
  }, null, 2)}
  </script>`;
}

/* ---------------------------------------------------------------------------
   Header + mega menu + mobile panel
   `current` = top-level section key for aria-current
   --------------------------------------------------------------------------- */
function headerNav(depth, current, overHero) {
  const L = (p) => rel(depth, p);
  const cur = (k) => (current === k ? ' aria-current="page"' : "");
  const megaCols = CATEGORIES.map(function (cat) {
    const links = cat.items.map((it) => `<li><a href="${L(it.href)}">${esc(it.label)}</a></li>`).join("");
    return `<div class="mega-col">
          <a class="mega-title" href="${L(cat.overview)}">${esc(cat.label)} ${svgIcon("arrow", 16)}</a>
          <ul>${links}</ul>
        </div>`;
  }).join("");

  const mobileGroups = CATEGORIES.map(function (cat, i) {
    const links = cat.items.map((it) => `<a href="${L(it.href)}">${esc(it.label)}</a>`).join("");
    return `<div class="mnav-group">
        <button class="mnav-link" type="button" data-mnav-sub aria-expanded="false" aria-controls="mnav-sub-${i}">${esc(cat.label)} ${svgIcon("chevron", 18)}</button>
        <div class="mnav-sub" id="mnav-sub-${i}" hidden>
          <a href="${L(cat.overview)}">Todo ${esc(cat.label.toLowerCase())}</a>${links}
        </div>
      </div>`;
  }).join("");

  return `<a class="skip-link" href="#main">Ir al contenido</a>
  <header class="site-header${overHero ? " is-over-hero" : ""}" data-header>
    <div class="header-inner">
      <a class="brand" href="${L("index.html")}" aria-label="Seriart, ir al inicio">
        <img class="brand-logo brand-logo--color" src="${L("assets/img/logo-trim.png")}" alt="" width="177" height="160">
        <img class="brand-logo brand-logo--white" src="${L("assets/img/logo-white.png")}" alt="" width="177" height="160">
        <span class="brand-text"><strong>Rotulación y serigrafía</strong><span>Dénia · desde ${BRAND.founded}</span></span>
      </a>
      <nav class="nav-primary" aria-label="Principal">
        <button class="nav-link" type="button" data-mega-trigger aria-expanded="false" aria-controls="mega"${current === "servicios" ? ' data-current="true"' : ""}>Servicios ${svgIcon("chevron", 16)}</button>
        <a class="nav-link" href="${L("trabajos.html")}"${cur("trabajos")}>Trabajos</a>
        <a class="nav-link" href="${L("nosotros.html")}"${cur("nosotros")}>Nosotros</a>
        <a class="nav-link" href="${L("contacto.html")}"${cur("contacto")}>Contacto</a>
      </nav>
      <div class="header-actions">
        <a class="header-phone" href="tel:${BRAND.phoneHref}">${svgIcon("phone", 18)}<span>${esc(BRAND.phoneDisplay)}</span></a>
        <a class="btn btn-primary btn-sm" href="${L("presupuesto.html")}"><span class="hide-sm">Pedir presupuesto</span><span class="show-sm">Presupuesto</span></a>
        <button class="nav-toggle" type="button" data-nav-toggle aria-label="Abrir menú" aria-expanded="false" aria-controls="mnav">
          <span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mega" id="mega" data-mega hidden>
      <div class="mega-inner">
        ${megaCols}
        <a class="mega-promo" href="${L("servicios.html")}">
          ${pic(depth, "workshop-machine.jpg", "", { sizes: "320px" })}
          <span class="mega-promo-body"><strong>Todos los servicios</strong><span>Rotulación, vinilo, serigrafía y gran formato desde un mismo taller.</span></span>
        </a>
      </div>
    </div>
  </header>
  <div class="mnav" id="mnav" data-mnav hidden>
    <nav class="mnav-inner" aria-label="Menú móvil">
      ${mobileGroups}
      <a class="mnav-link" href="${L("servicios.html")}">Todos los servicios</a>
      <a class="mnav-link" href="${L("trabajos.html")}">Trabajos</a>
      <a class="mnav-link" href="${L("nosotros.html")}">Nosotros</a>
      <a class="mnav-link" href="${L("contacto.html")}">Contacto</a>
      <div class="mnav-actions">
        <a class="btn btn-primary btn-block" href="${L("presupuesto.html")}">Pedir presupuesto</a>
        <a class="btn btn-outline btn-block" href="tel:${BRAND.phoneHref}">${svgIcon("phone", 18)} Llamar al ${esc(BRAND.phoneDisplay)}</a>
      </div>
    </nav>
  </div>`;
}

/* ---------------------------------------------------------------------------
   Footer
   --------------------------------------------------------------------------- */
function footer(depth) {
  const L = (p) => rel(depth, p);
  const services = CATEGORIES.map((cat) => `<li><a href="${L(cat.overview)}">${esc(cat.label)}</a></li>`).join("")
    + `<li><a href="${L("rotulacion/vehiculos.html")}">Rotulación de vehículos</a></li>`
    + `<li><a href="${L("serigrafia/ropa-laboral.html")}">Ropa laboral</a></li>`;
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img class="footer-logo" src="${L("assets/img/logo-white.png")}" alt="Seriart" width="177" height="160" loading="lazy">
          <p>Rotulación, vinilo, serigrafía e impresión de gran formato. Diseñamos, fabricamos e instalamos desde nuestro taller de Dénia desde ${BRAND.founded}.</p>
        </div>
        <div class="footer-col">
          <h2>Servicios</h2>
          <ul>${services}</ul>
        </div>
        <div class="footer-col">
          <h2>Seriart</h2>
          <ul>
            <li><a href="${L("trabajos.html")}">Trabajos</a></li>
            <li><a href="${L("nosotros.html")}">Nosotros</a></li>
            <li><a href="${L("presupuesto.html")}">Pedir presupuesto</a></li>
            <li><a href="${L("contacto.html")}">Contacto y cómo llegar</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h2>Contacto</h2>
          <ul class="footer-contact">
            <li><a href="tel:${BRAND.phoneHref}">${svgIcon("phone", 16)} ${esc(BRAND.phoneDisplay)}</a></li>
            <li><a href="${waHref()}" target="_blank" rel="noopener">${svgIcon("chat", 16)} WhatsApp ${esc(BRAND.whatsappDisplay)}</a></li>
            <li><a href="mailto:${BRAND.email}">${svgIcon("mail", 16)} ${esc(BRAND.email)}</a></li>
            <li><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.address)}" target="_blank" rel="noopener">${svgIcon("pin", 16)} ${esc(BRAND.street)}, ${esc(BRAND.city)}</a></li>
            <li class="footer-hours">${svgIcon("clock", 16)} ${esc(BRAND.hours)}</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Seriart · ${esc(BRAND.city)}, ${esc(BRAND.province)}</span>
        <nav class="footer-legal" aria-label="Legal">
          <a href="${L("legal.html")}#aviso-legal">Aviso legal</a>
          <a href="${L("legal.html")}#privacidad">Privacidad</a>
          <a href="${L("legal.html")}#cookies">Cookies</a>
          <a href="${L("creditos.html")}">Créditos</a>
        </nav>
      </div>
    </div>
  </footer>`;
}

function whatsappFloat() {
  return `<a class="wa-float" href="${waHref()}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">${WHATSAPP_SVG}</a>`;
}

function lightboxMarkup() {
  return `<div class="lightbox" data-lightbox role="dialog" aria-modal="true" aria-label="Imagen ampliada" hidden>
    <button class="lb-btn lb-close" type="button" data-lb-close aria-label="Cerrar">${svgIcon("close", 22)}</button>
    <button class="lb-btn lb-prev" type="button" data-lb-prev aria-label="Imagen anterior">${svgIcon("prev", 24)}</button>
    <figure class="lb-figure">
      <img data-lb-img src="" alt="">
      <figcaption><span data-lb-caption></span><span class="lb-count" data-lb-count></span></figcaption>
    </figure>
    <button class="lb-btn lb-next" type="button" data-lb-next aria-label="Imagen siguiente">${svgIcon("next", 24)}</button>
  </div>`;
}

function scriptsBlock(depth) {
  return `<script defer src="${rel(depth, "lib/manifest.js")}?v=${V}"></script>
  <script defer src="${rel(depth, "main.js")}?v=${V}"></script>`;
}

function breadcrumb(depth, items) {
  const parts = items.map(function (it, i) {
    if (i === items.length - 1) return `<li><span aria-current="page">${esc(it.label)}</span></li>`;
    return `<li><a href="${rel(depth, it.href)}">${esc(it.label)}</a></li>`;
  });
  return `<nav class="breadcrumb" aria-label="Migas de pan"><ol>${parts.join("")}</ol></nav>`;
}

/* Full page shell. opts: title, description, canonical, ogImage, preload,
   preloadSizes, current, overHero, noindex, bodyClass */
function page(depth, opts, bodyHtml) {
  return `<!doctype html>
<html lang="es">
<head>
  ${headBlock(depth, opts)}
  ${schemaBlock()}
</head>
<body${opts.bodyClass ? ` class="${opts.bodyClass}"` : ""}>
  ${headerNav(depth, opts.current, opts.overHero)}
  <main id="main">
${bodyHtml}
  </main>
  ${footer(depth)}
  ${whatsappFloat()}
  ${lightboxMarkup()}
  ${scriptsBlock(depth)}
</body>
</html>
`;
}

/* ---------------------------------------------------------------------------
   Reusable content blocks
   --------------------------------------------------------------------------- */
function sectionHead(opts) {
  return `<div class="section-head${opts.center ? " is-center" : ""}${opts.split ? " is-split" : ""}">
        <div>
          ${opts.kicker ? `<p class="kicker">${esc(opts.kicker)}</p>` : ""}
          <h2>${opts.title}</h2>
        </div>
        ${opts.text ? `<p class="section-lead">${esc(opts.text)}</p>` : ""}${opts.link ? opts.link : ""}
      </div>`;
}

function arrowLink(href, label, cls) {
  return `<a class="link-arrow${cls ? " " + cls : ""}" href="${href}">${esc(label)} ${svgIcon("arrow", 18)}</a>`;
}

/* Interior page hero. opts: crumbs, kicker, title, lead, image, imageAlt,
   cta: {href,label} | false, secondary: {href,label} */
function pageHero(depth, opts) {
  const cta = opts.cta === false ? "" : `<a class="btn btn-primary" href="${opts.cta ? opts.cta.href : rel(depth, "presupuesto.html")}">${esc(opts.cta ? opts.cta.label : "Pedir presupuesto")}</a>`;
  const sec = opts.secondary ? `<a class="btn btn-outline" href="${opts.secondary.href}">${esc(opts.secondary.label)}</a>` : "";
  const actions = cta || sec ? `<div class="page-hero-actions">${cta}${sec}</div>` : "";
  const media = opts.image
    ? `<div class="page-hero-media">${pic(depth, opts.image, opts.imageAlt || "", { eager: true, sizes: "(min-width: 960px) 46vw, 100vw" })}</div>`
    : "";
  return `  <section class="page-hero${opts.image ? " has-media" : ""}">
    <div class="container page-hero-grid">
      <div class="page-hero-text">
        ${breadcrumb(depth, opts.crumbs)}
        ${opts.kicker ? `<p class="kicker">${esc(opts.kicker)}</p>` : ""}
        <h1>${opts.title}</h1>
        ${opts.lead ? `<p class="page-hero-lead">${esc(opts.lead)}</p>` : ""}
        ${actions}
      </div>
      ${media}
    </div>
  </section>`;
}

/* Two columns: copy on the left, "qué incluye" checklist on the right */
function introBlock(depth, opts) {
  const paras = opts.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
  const list = (opts.types || []).map((t) => `<li>${svgIcon("check", 20)}<div><strong>${esc(t.title)}</strong><span>${esc(t.desc)}</span></div></li>`).join("");
  return `  <section class="section">
    <div class="container intro-split">
      <div class="intro-copy reveal">
        <p class="kicker">${esc(opts.kicker || "En qué consiste")}</p>
        <h2>${esc(opts.heading)}</h2>
        ${paras}
      </div>
      ${list ? `<div class="intro-list reveal">
        <h3>${esc(opts.listTitle || "Qué hacemos")}</h3>
        <ul class="checklist">${list}</ul>
      </div>` : ""}
    </div>
  </section>`;
}

function benefitsRow(depth, items, heading) {
  const cells = items.map((it) => `<div class="benefit reveal">
        <span class="benefit-icon">${svgIcon(it.icon, 22)}</span>
        <h3>${esc(it.title)}</h3>
        <p>${esc(it.desc)}</p>
      </div>`).join("");
  return `  <section class="section section-alt">
    <div class="container">
      ${sectionHead({ kicker: "Por qué Seriart", title: esc(heading || "Un solo taller, de principio a fin") })}
      <div class="benefits">${cells}</div>
    </div>
  </section>`;
}

/* Gallery that opens in the lightbox. images: [{src, alt}] */
function galleryBlock(depth, opts) {
  const group = opts.group || "g";
  const items = opts.images.map((im) => `<a class="gallery-item reveal-wipe" href="${imgLargest(depth, im.src)}" data-lightbox-item="${group}" data-caption="${esc(im.alt)}">
        ${pic(depth, im.src, im.alt, { sizes: "(min-width: 960px) 30vw, (min-width: 640px) 45vw, 100vw" })}
      </a>`).join("");
  return `  <section class="section">
    <div class="container">
      ${sectionHead({ kicker: "Galería", title: esc(opts.heading), link: arrowLink(rel(depth, "trabajos.html"), "Ver todos los trabajos", "section-head-link") })}
      <div class="gallery-grid">${items}</div>
    </div>
  </section>`;
}

const PROCESS_STEPS = [
  { title: "Nos cuentas la idea", desc: "Qué necesitas, en qué cantidad y para cuándo. Si hace falta, medimos o vemos el vehículo o la fachada." },
  { title: "Diseño y prueba", desc: "Preparamos o adaptamos el diseño y te enseñamos una prueba antes de producir nada." },
  { title: "Fabricación en taller", desc: "Producimos en nuestro taller de Dénia, con control de calidad en cada pieza." },
  { title: "Instalación y entrega", desc: "Instalamos en Dénia y alrededores o lo enviamos a cualquier punto de España." }
];
function processBlock(depth, opts) {
  opts = opts || {};
  const steps = PROCESS_STEPS.map((s, i) => `<li class="step reveal">
        <span class="step-num">${String(i + 1).padStart(2, "0")}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
      </li>`).join("");
  return `  <section class="section${opts.alt ? " section-alt" : ""}">
    <div class="container">
      ${sectionHead({ kicker: "Cómo trabajamos", title: "De la idea a la instalación", text: opts.text || "Un único equipo se encarga de todo el proceso, así que siempre sabes con quién hablar." })}
      <ol class="steps">${steps}</ol>
    </div>
  </section>`;
}

function faqBlock(depth, items) {
  const list = items.map((it) => `<details class="faq-item">
          <summary>${esc(it.q)}<span class="faq-icon" aria-hidden="true"></span></summary>
          <div class="faq-answer"><p>${esc(it.a)}</p></div>
        </details>`).join("");
  return `  <section class="section section-alt">
    <div class="container faq-split">
      <div class="faq-aside">
        <p class="kicker">Preguntas frecuentes</p>
        <h2>Lo que suelen preguntarnos</h2>
        <p>¿Tienes otra duda? Escríbenos y te contestamos lo antes posible.</p>
        <a class="btn btn-outline" href="${waHref("Hola, tengo una duda sobre un trabajo.")}" target="_blank" rel="noopener">${WHATSAPP_SVG} Preguntar por WhatsApp</a>
      </div>
      <div class="faq-list">${list}</div>
    </div>
  </section>`;
}

/* Related services strip. items: [{label, href, img}] */
function relatedBlock(depth, title, items) {
  const cards = items.map((it) => `<a class="related-card" href="${rel(depth, it.href)}">
        ${pic(depth, it.img, "", { sizes: "(min-width: 960px) 22vw, 50vw" })}
        <span>${esc(it.label)} ${svgIcon("arrow", 16)}</span>
      </a>`).join("");
  return `  <section class="section">
    <div class="container">
      ${sectionHead({ kicker: "Relacionado", title: esc(title) })}
      <div class="related-grid">${cards}</div>
    </div>
  </section>`;
}

/* Closing contact block, same on every page. opts: title, text, service */
function contactCta(depth, opts) {
  opts = opts || {};
  const q = opts.service ? "?servicio=" + opts.service : "";
  return `  <section class="section section-cta">
    <div class="container">
      <div class="cta-box reveal">
        <div class="cta-copy">
          <p class="kicker">Presupuesto sin compromiso</p>
          <h2>${esc(opts.title || "Cuéntanos tu proyecto")}</h2>
          <p>${esc(opts.text || "Te respondemos con un presupuesto claro, detallado y sin compromiso.")}</p>
        </div>
        <div class="cta-actions">
          <a class="cta-action is-primary" href="${rel(depth, "presupuesto.html")}${q}">
            ${svgIcon("pen", 22)}<span><strong>Pedir presupuesto</strong><small>Formulario, 2 minutos</small></span>${svgIcon("arrow", 18)}
          </a>
          <a class="cta-action" href="${waHref()}" target="_blank" rel="noopener">
            ${WHATSAPP_SVG}<span><strong>WhatsApp</strong><small>${esc(BRAND.whatsappDisplay)}</small></span>${svgIcon("arrow", 18)}
          </a>
          <a class="cta-action" href="tel:${BRAND.phoneHref}">
            ${svgIcon("phone", 22)}<span><strong>Llamar</strong><small>${esc(BRAND.phoneDisplay)} · ${esc(BRAND.hours.replace("Lunes a viernes", "L–V"))}</small></span>${svgIcon("arrow", 18)}
          </a>
        </div>
      </div>
    </div>
  </section>`;
}

/* lib/manifest.js — runtime config for main.js, generated from BRAND */
function writeRuntimeConfig() {
  const cfg = {
    email: BRAND.email,
    whatsappNumber: BRAND.whatsappNumber,
    web3formsKey: BRAND.web3formsKey
  };
  write("lib/manifest.js", `/* Generated by tools/build.js from BRAND in tools/generate-site.js — do not edit by hand. */
window.__SERIART__ = ${JSON.stringify(cfg, null, 2)};
`);
}

module.exports = {
  ROOT, V, BRAND, CATEGORIES, IMG_MANIFEST, esc, rel, write, waHref, pic, imgLargest, svgIcon, WHATSAPP_SVG,
  page, pageHero, sectionHead, arrowLink, introBlock, benefitsRow, galleryBlock, processBlock, faqBlock,
  relatedBlock, contactCta, breadcrumb, writeRuntimeConfig
};
