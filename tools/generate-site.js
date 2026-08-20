/* Dev-time build script — generates static HTML for the whole site.
   Run with: node tools/generate-site.js
   Output is plain, hardcoded HTML (no runtime templating). Not shipped as-is;
   only the generated .html files + styles.css + main.js + lib/ are deployed. */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const V = "20260731"; // cache-buster, bump on every deploy

const BRAND = {
  name: "Seriart",
  email: "alexitosivera@gmail.com",
  phoneDisplay: "966 43 30 33",
  phoneHref: "+34966433033",
  whatsappNumber: "34651358822",
  whatsappDisplay: "651 35 88 22",
  address: "Ronda de les Muralles, 20, 03700 Dénia (Alicante)",
  hours: "Lunes a viernes, 8:00–14:00. Tardes con cita previa.",
  siteUrl: "https://www.seriart.es"
};

/* ===========================================================================
   Helpers
   =========================================================================== */
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

/* ===========================================================================
   Navigation data (used for header mega-menu + mobile nav + footer + sitemap)
   =========================================================================== */
const CATEGORIES = [
  {
    slug: "serigrafia", label: "Serigrafía", overview: "servicios/serigrafia.html",
    items: [
      { label: "Serigrafía textil", href: "serigrafia/textil.html" },
      { label: "Ropa laboral personalizada", href: "serigrafia/ropa-laboral.html" },
      { label: "Merchandising", href: "serigrafia/merchandising.html" }
    ]
  },
  {
    slug: "rotulacion", label: "Rotulación", overview: "servicios/rotulacion.html",
    items: [
      { label: "Vehículos", href: "rotulacion/vehiculos.html" },
      { label: "Rótulos para negocios", href: "rotulacion/rotulos-negocios.html" },
      { label: "Letras corpóreas", href: "rotulacion/letras-corporeas.html" },
      { label: "Escaparates", href: "rotulacion/escaparates.html" },
      { label: "Vinilos decorativos", href: "rotulacion/vinilos.html" }
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

/* ===========================================================================
   Shared partials
   =========================================================================== */
function headBlock(depth, opts) {
  const canonical = BRAND.siteUrl + "/" + (opts.canonical || "");
  const ogImage = rel(depth, "assets/img/" + (opts.ogImage || "hero-vehicle-wrap.jpg"));
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(opts.title)}</title>
  <meta name="description" content="${esc(opts.description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Seriart">
  <meta property="og:title" content="${esc(opts.title)}">
  <meta property="og:description" content="${esc(opts.description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="es_ES">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#2b98d8">
  <link rel="icon" href="${rel(depth, "assets/img/favicon.svg")}" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap">
  <link rel="preload" as="image" href="${rel(depth, "assets/img/" + (opts.heroPreload || opts.ogImage || "hero-vehicle-wrap.jpg"))}" fetchpriority="high">
  <link rel="stylesheet" href="${rel(depth, "styles.css")}?v=${V}">`;
}

function schemaBlock() {
  return `<script type="application/ld+json">
${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Seriart",
    "image": BRAND.siteUrl + "/assets/img/hero-vehicle-wrap.jpg",
    "url": BRAND.siteUrl + "/",
    "telephone": BRAND.phoneHref,
    "email": BRAND.email,
    "priceRange": "€€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ronda de les Muralles, 20",
      "addressLocality": "Dénia",
      "addressRegion": "Alicante",
      "postalCode": "03700",
      "addressCountry": "ES"
    },
    "areaServed": "ES",
    "foundingDate": "2002",
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "14:00"
    }],
    "description": "Taller de serigrafía, personalización textil, ropa laboral, merchandising, rotulación y gran formato en Denia, Alicante. Más de 20 años de experiencia, clientes en toda España."
  }, null, 2)}
  </script>`;
}

function svgIcon(name) {
  const icons = {
    shirt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3 3 7l3 3 2-1.5V21h8V8.5L18 10l3-3-5-4-2 2h-4L8 3Z" stroke-linejoin="round"/></svg>',
    signage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="9" rx="2"/><path d="M8 19h8M12 15v4"/></svg>',
    banner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4v13l4-2 4 2 4-2 4 2V4H4Z" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 13 4 4 10-10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" stroke-linejoin="round"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="13" height="9"/><path d="M15 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/></svg>',
    palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a9 8 0 1 0 0 16c1.2 0 2-.9 2-2 0-.6-.3-1-.6-1.4-.3-.4-.5-.7-.5-1.2 0-.9.7-1.4 1.6-1.4H16a4 4 0 0 0 4-4c0-3.3-3.6-6-8-6Z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 9 5-9 5-9-5 9-5Z" stroke-linejoin="round"/><path d="m3 13 9 5 9-5M3 8l9 5 9-5" stroke-linejoin="round"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16 16 3l5 5L8 21 3 16Z" stroke-linejoin="round"/><path d="m9 10 2 2M12 7l2 2M6 13l2 2" stroke-linecap="round"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6l-8-3Z" stroke-linejoin="round"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" stroke-linecap="round"/></svg>',
    whatsapp: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9 3 3 9 3 16c0 2.4.7 4.7 1.9 6.7L3 29l6.5-1.8A13 13 0 0 0 16 29c7 0 13-6 13-13S23 3 16 3Zm0 23.6c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 26.6 16 10.6 10.6 0 0 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4C10 11 9.5 12 9.5 13.4S10.6 16.3 10.8 16.6c.1.2 2.2 3.4 5.4 4.7 2 .8 2.8.9 3.8.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg>'
  };
  return icons[name] || icons.check;
}

function headerNav(depth) {
  const L = (p) => rel(depth, p);
  const megaCols = CATEGORIES.map(function (cat) {
    const links = cat.items.map(function (it) {
      return `<li><a class="mega-link" href="${L(it.href)}">${esc(it.label)}</a></li>`;
    }).join("");
    return `<div class="mega-col">
            <p class="mega-col-title">${esc(cat.label)}</p>
            <ul>${links}</ul>
            <div class="mega-col-all"><a class="btn-ghost" href="${L(cat.overview)}">Ver ${esc(cat.label.toLowerCase())}</a></div>
          </div>`;
  }).join("");

  const mobileSubs = CATEGORIES.map(function (cat, i) {
    const links = cat.items.map(function (it) {
      return `<a href="${L(it.href)}">${esc(it.label)}</a>`;
    }).join("");
    return `<button class="nav-mobile-link" data-nav-mobile-sub-toggle aria-expanded="false" aria-controls="mob-sub-${i}">${esc(cat.label)} <span class="nav-mobile-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>
        <div class="nav-mobile-sub" id="mob-sub-${i}">
          <a href="${L(cat.overview)}">Ver todo ${esc(cat.label.toLowerCase())}</a>
          ${links}
        </div>`;
  }).join("");

  return `<a class="skip-link" href="#main">Ir al contenido</a>
  <header class="site-header" data-header>
    <div class="nav-inner">
      <a class="brand" href="${L("index.html")}" aria-label="Seriart — inicio">
        <img class="brand-logo" src="${L("assets/img/logo.png")}" alt="Seriart — taller de serigrafía" width="160" height="160">
        <span class="brand-sub">Denia · Alicante</span>
      </a>
      <nav class="nav-primary" aria-label="Principal">
        <a class="nav-link" href="${L("index.html")}">Inicio</a>
        <a class="nav-link" href="${L("servicios.html")}" data-mega-trigger aria-haspopup="true" aria-expanded="false">Servicios <span class="nav-link-caret" aria-hidden="true">▾</span></a>
        <a class="nav-link" href="${L("trabajos.html")}">Trabajos</a>
        <a class="nav-link" href="${L("nosotros.html")}">Nosotros</a>
        <a class="nav-link" href="${L("contacto.html")}">Contacto</a>
      </nav>
      <div class="nav-actions">
        <a class="btn btn-primary nav-cta" data-magnetic href="${L("presupuesto.html")}">Pedir presupuesto</a>
        <button class="nav-toggle" data-nav-toggle aria-label="Abrir menú" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mega-menu" data-mega-menu>
      <div class="mega-menu-inner">${megaCols}</div>
    </div>
  </header>
  <div class="nav-mobile" data-nav-mobile>
    <a class="nav-mobile-link" href="${L("index.html")}">Inicio</a>
    ${mobileSubs}
    <a class="nav-mobile-link" href="${L("servicios.html")}">Todos los servicios</a>
    <a class="nav-mobile-link" href="${L("trabajos.html")}">Trabajos</a>
    <a class="nav-mobile-link" href="${L("nosotros.html")}">Nosotros</a>
    <a class="nav-mobile-link" href="${L("contacto.html")}">Contacto</a>
    <a class="btn btn-primary btn-block nav-mobile-cta" href="${L("presupuesto.html")}">Pedir presupuesto</a>
  </div>`;
}

function footer(depth) {
  const L = (p) => rel(depth, p);
  const catCols = CATEGORIES.map(function (cat) {
    const links = cat.items.map(function (it) {
      return `<li><a href="${L(it.href)}">${esc(it.label)}</a></li>`;
    }).join("");
    return `<div class="footer-col"><h4>${esc(cat.label)}</h4><ul>${links}</ul></div>`;
  }).join("");

  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img class="footer-logo" src="${L("assets/img/logo.png")}" alt="Seriart" width="140" height="140">
          <p class="footer-about">Taller de serigrafía, rotulación e impresión de gran formato en Denia. Trabajamos para empresas, comercios y particulares de toda España desde 2002.</p>
          <div class="badge-row">
            <a class="btn btn-secondary" href="${L("presupuesto.html")}" style="font-size:.85rem;padding:.6rem 1.1rem;">Pedir presupuesto</a>
          </div>
        </div>
        ${catCols}
        <div class="footer-col">
          <h4>Contacto</h4>
          <ul>
            <li><a href="https://www.google.com/maps?q=${encodeURIComponent(BRAND.address)}" target="_blank" rel="noopener">${esc(BRAND.address)}</a></li>
            <li><a href="mailto:${BRAND.email}">${BRAND.email}</a></li>
            <li><a href="tel:${BRAND.phoneHref}">${esc(BRAND.phoneDisplay)}</a></li>
            <li><a href="${L("nosotros.html")}">Sobre el taller</a></li>
            <li><a href="${L("contacto.html")}">Cómo llegar</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Seriart · Denia, Alicante</span>
        <div class="footer-bottom-links">
          <a href="${L("creditos.html")}">Créditos fotográficos</a>
          <a href="${L("legal.html")}#aviso-legal">Aviso legal</a>
          <a href="${L("legal.html")}#privacidad">Privacidad</a>
          <a href="${L("legal.html")}#cookies">Cookies</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function whatsappFloat() {
  return `<a class="whatsapp-float" data-whatsapp-link href="#" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C9 3 3 9 3 16c0 2.4.7 4.7 1.9 6.7L3 29l6.5-1.8A13 13 0 0 0 16 29c7 0 13-6 13-13S23 3 16 3Zm0 23.6c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 26.6 16 10.6 10.6 0 0 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4C10 11 9.5 12 9.5 13.4S10.6 16.3 10.8 16.6c.1.2 2.2 3.4 5.4 4.7 2 .8 2.8.9 3.8.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg>
  </a>`;
}

function cookieBanner(depth) {
  const L = (p) => rel(depth, p);
  return `<div class="cookie-banner" data-cookie-banner role="dialog" aria-label="Aviso de cookies">
    <p>Usamos cookies propias y de terceros para el funcionamiento de la web y para medir la audiencia. Puedes aceptarlas, rechazarlas o leer más en nuestra <a href="${L("legal.html")}#cookies">política de cookies</a>.</p>
    <div class="cookie-actions">
      <button class="btn btn-primary" data-cookie-action="accepted">Aceptar</button>
      <button class="btn btn-secondary" data-cookie-action="rejected">Rechazar</button>
    </div>
  </div>`;
}

function lightboxMarkup() {
  return `<div class="lightbox" data-lightbox>
    <button class="lightbox-close" aria-label="Cerrar">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/></svg>
    </button>
    <img data-lightbox-img src="" alt="">
    <div class="compare lightbox-compare" data-compare data-lightbox-compare hidden>
      <img class="compare-before-img" src="" alt="">
      <img class="compare-after compare-after-img" src="" alt="">
      <span class="compare-label label-before">Antes</span>
      <span class="compare-label label-after">Después</span>
      <div class="compare-handle">
        <div class="compare-handle-btn" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 7 4 12l4 5M16 7l4 5-4 5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </div>
  </div>`;
}

function scriptsBlock(depth) {
  const L = (p) => rel(depth, p);
  return `<script defer src="${L("lib/gsap.min.js")}"></script>
  <script defer src="${L("lib/ScrollTrigger.min.js")}"></script>
  <script defer src="${L("lib/manifest.js")}"></script>
  <script defer src="${L("main.js")}?v=${V}"></script>`;
}

function breadcrumb(depth, items) {
  const L = (p) => rel(depth, p);
  const parts = items.map(function (it, i) {
    const isLast = i === items.length - 1;
    if (isLast) return `<span class="current">${esc(it.label)}</span>`;
    return `<a href="${L(it.href)}">${esc(it.label)}</a><span aria-hidden="true">/</span>`;
  });
  return `<nav class="breadcrumb" aria-label="Migas de pan">${parts.join("")}</nav>`;
}

function page(depth, opts, bodyHtml) {
  return `<!doctype html>
<html lang="es">
<head>
  ${headBlock(depth, opts)}
  ${schemaBlock()}
</head>
<body class="${opts.bodyClass || ""}">
  ${headerNav(depth)}
  <main id="main">
${bodyHtml}
  </main>
  ${footer(depth)}
  ${whatsappFloat()}
  ${cookieBanner(depth)}
  ${lightboxMarkup()}
  ${scriptsBlock(depth)}
</body>
</html>
`;
}

/* ===========================================================================
   Reusable content blocks
   =========================================================================== */
function pageHero(depth, opts) {
  return `  <section class="page-hero">
    <div class="container">
      ${breadcrumb(depth, opts.crumbs)}
      <p class="eyebrow">${esc(opts.kicker)}</p>
      <h1 class="reveal">${opts.title}</h1>
      <p class="lead reveal">${esc(opts.lead)}</p>
      <div class="page-hero-actions reveal">
        <a class="btn btn-primary" data-magnetic href="${rel(depth, "presupuesto.html")}${opts.service ? "?servicio=" + opts.service : ""}">Solicita presupuesto</a>
        <a class="btn btn-secondary" href="${rel(depth, "trabajos.html")}">Ver trabajos realizados</a>
      </div>
    </div>
  </section>`;
}

function introBlock(depth, opts) {
  const paras = opts.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
  return `  <section class="section">
    <div class="container intro-grid">
      <img class="reveal" src="${rel(depth, "assets/img/" + opts.image)}" alt="${esc(opts.imageAlt)}" loading="lazy" decoding="async">
      <div class="intro-text reveal">
        <p class="eyebrow">${esc(opts.eyebrow || "En qué consiste")}</p>
        <h2 style="font-size:1.7rem;margin-bottom:1rem;">${esc(opts.heading)}</h2>
        ${paras}
      </div>
    </div>
  </section>`;
}

function typesGrid(depth, opts) {
  const cards = opts.items.map((it) => `<div class="type-card reveal"><h3>${esc(it.title)}</h3><p>${esc(it.desc)}</p></div>`).join("");
  return `  <section class="section section-tint">
    <div class="container">
      <div class="section-head"><p class="eyebrow">Qué hacemos</p><h2>${esc(opts.heading)}</h2></div>
      <div class="types-grid">${cards}</div>
    </div>
  </section>`;
}

function featureGrid(depth, opts) {
  const cards = opts.items.map((it) => `<div class="card feature-card card-lift reveal" data-tilt>
      <div class="feature-icon" aria-hidden="true">${svgIcon(it.icon)}</div>
      <h3>${esc(it.title)}</h3><p>${esc(it.desc)}</p>
    </div>`).join("");
  return `  <section class="section">
    <div class="container">
      <div class="section-head"><p class="eyebrow">Por qué Seriart</p><h2>${esc(opts.heading)}</h2></div>
      <div class="feature-grid">${cards}</div>
    </div>
  </section>`;
}

function galleryBlock(depth, opts) {
  const items = opts.images.map((im) => `<a class="gallery-item reveal" href="${rel(depth, "trabajos.html")}" data-lightbox-src="${rel(depth, "assets/img/" + im.src)}" data-lightbox-alt="${esc(im.alt)}">
      <img src="${rel(depth, "assets/img/" + im.src)}" alt="${esc(im.alt)}" loading="lazy" decoding="async">
      <div class="gallery-item-overlay"><span>${esc(im.alt)}</span></div>
    </a>`).join("");
  return `  <section class="section section-tint">
    <div class="container">
      <div class="section-head"><p class="eyebrow">Galería</p><h2>${esc(opts.heading)}</h2></div>
      <div class="gallery-grid">${items}</div>
      <div style="margin-top:2rem;"><a class="btn-ghost" href="${rel(depth, "trabajos.html")}">Ver todos los trabajos</a></div>
    </div>
  </section>`;
}

function processBlock(depth) {
  const steps = [
    { icon: "spark", title: "Idea", desc: "Nos cuentas qué necesitas, en qué cantidad y para cuándo. Te asesoramos sobre materiales y acabados." },
    { icon: "palette", title: "Diseño", desc: "Preparamos o ajustamos el diseño y te mostramos una prueba antes de producir nada." },
    { icon: "layers", title: "Fabricación", desc: "Producimos en nuestro taller de Denia, con control de calidad en cada pieza." },
    { icon: "truck", title: "Instalación", desc: "Entregamos o instalamos, en Denia o donde haga falta, y revisamos el resultado contigo." }
  ];
  const cards = steps.map((s, i) => `<div class="process-step reveal">
      <span class="process-num">0${i + 1}</span>
      <h3>${s.title}</h3><p>${s.desc}</p>
    </div>`).join("");
  return `  <section class="section">
    <div class="container">
      <div class="section-head"><p class="eyebrow">Cómo trabajamos</p><h2>De la idea a la instalación</h2></div>
      <div class="process-grid">${cards}</div>
    </div>
  </section>`;
}

function faqBlock(depth, items) {
  const list = items.map((it) => `<div class="faq-item">
      <button class="faq-question">${esc(it.q)}<span class="plus" aria-hidden="true"></span></button>
      <div class="faq-answer"><div class="faq-answer-inner">${esc(it.a)}</div></div>
    </div>`).join("");
  return `  <section class="section section-tint">
    <div class="container">
      <div class="section-head"><p class="eyebrow">Preguntas frecuentes</p><h2>Resolvemos tus dudas</h2></div>
      <div class="faq-list">${list}</div>
    </div>
  </section>`;
}

function ctaBand(depth, opts) {
  return `  <section class="section-tight">
    <div class="container">
      <div class="cta-band reveal">
        <div>
          <h2>${esc(opts.title)}</h2>
          <p>${esc(opts.text)}</p>
        </div>
        <div class="cta-band-actions">
          <a class="btn btn-primary" data-magnetic href="${rel(depth, "presupuesto.html")}${opts.service ? "?servicio=" + opts.service : ""}">Solicita presupuesto</a>
          <a class="btn btn-secondary" data-whatsapp-link href="#" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>
        </div>
      </div>
    </div>
  </section>`;
}

module.exports = {
  ROOT, V, BRAND, CATEGORIES, esc, rel, write, page, pageHero, introBlock, typesGrid,
  featureGrid, galleryBlock, processBlock, faqBlock, ctaBand, breadcrumb, svgIcon, headerNav, footer
};
