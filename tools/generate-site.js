/* Build helpers — shared partials for every page.
   Pages are assembled in tools/build.js. Editable content lives in content/
   (edited from Pages CMS) and is loaded by tools/content.js.
   Output is plain, static HTML written to _site/ (the folder that is deployed). */
"use strict";
const fs = require("fs");
const path = require("path");
const { load } = require("./content.js");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "_site");
const V = String(Date.now()).slice(0, 10); // cache-buster, new on every build

const CONTENT = load();
const S = CONTENT.site;

/* Public URL: the custom domain once a CNAME file exists, GitHub Pages until then */
function siteUrl() {
  try {
    const cname = fs.readFileSync(path.join(ROOT, "CNAME"), "utf8").trim();
    if (cname) return "https://" + cname.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  } catch (e) { /* no custom domain yet */ }
  return "https://alexsivera.github.io/seriart";
}

/* ---------------------------------------------------------------------------
   Business data — from content/sitio.json (also written to lib/manifest.js)
   --------------------------------------------------------------------------- */
const BRAND = {
  name: "Seriart",
  email: S.email,
  phoneDisplay: S.phoneDisplay,
  phoneHref: S.phoneHref,
  whatsappNumber: S.whatsappNumber,
  whatsappDisplay: S.whatsappDisplay,
  whatsappText: "Hola, me gustaría pedir presupuesto para un trabajo.",
  street: S.street,
  postalCode: S.postalCode,
  city: S.city,
  province: S.province,
  address: S.address,
  hours: S.hours,
  hoursNote: S.hoursNote,
  legalName: S.legalName,
  taxId: S.taxId,
  founded: 2002,
  geo: { lat: 38.840666, lng: 0.1021857 }, // Google Maps pin of the shop
  instagram: "https://www.instagram.com/seriart_denia/",
  facebook: "https://www.facebook.com/SeriartDenia/",
  siteUrl: siteUrl(),
  /* Web3Forms access key (https://web3forms.com). While empty, forms fall back
     to opening the visitor's mail app with the message already written. */
  web3formsKey: S.web3formsKey,
  heroVideo: S.heroVideo
};
BRAND.mapsLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Seriart, " + BRAND.address);

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
/* Titles from the panel mark the heavy word with *asterisks* (the logo's
   "seri" light / "art" heavy contrast). em() renders it, plain() strips it. */
function em(s) { return esc(s).replace(/\*([^*]+)\*/g, "<strong>$1</strong>"); }
function plain(s) { return String(s == null ? "" : s).replace(/\*/g, ""); }
function rel(depth, p) { return (depth > 0 ? "../".repeat(depth) : "") + p; }
function write(filePath, html) {
  const full = path.join(OUT, filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
}
function waHref(text) {
  return "https://wa.me/" + BRAND.whatsappNumber + "?text=" + encodeURIComponent(text || BRAND.whatsappText);
}
const pad = (n) => String(n).padStart(2, "0");

/* Responsive images: manifest written by tools/optimize-images.js, keyed by
   source path ("assets/uploads/foto.jpg"). WebP files end up in assets/opt/. */
let IMG_MANIFEST = {};
try { IMG_MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, ".cache/img/manifest.json"), "utf8")); } catch (e) { /* not generated yet */ }
const usedOriginals = new Set();

function optUrl(depth, m, w) { return rel(depth, "assets/opt/" + m.base + "-" + w + ".webp"); }
function srcUrl(depth, file) { usedOriginals.add(file); return rel(depth, file.split("/").map(encodeURIComponent).join("/")); }
function imgLargest(depth, file) {
  const m = IMG_MANIFEST[file];
  if (!m || !m.widths.length) return srcUrl(depth, file);
  return optUrl(depth, m, m.widths[m.widths.length - 1]);
}
/* Absolute URL for og:image (social previews) */
function imgAbsolute(file) {
  const m = IMG_MANIFEST[file];
  if (!m || !m.widths.length) { usedOriginals.add(file); return BRAND.siteUrl + "/" + file; }
  return BRAND.siteUrl + "/assets/opt/" + m.base + "-" + m.widths[Math.min(1, m.widths.length - 1)] + ".webp";
}
/* <img> with srcset. file = repo path; opts: sizes, eager, cls, attrs */
function pic(depth, file, alt, opts) {
  opts = opts || {};
  if (!file) return "";
  const m = IMG_MANIFEST[file];
  const load = opts.eager ? 'fetchpriority="high"' : 'loading="lazy"';
  const cls = opts.cls ? ` class="${opts.cls}"` : "";
  const extra = opts.attrs ? " " + opts.attrs : "";
  if (!m || !m.widths.length) {
    return `<img${cls} src="${srcUrl(depth, file)}" alt="${esc(alt)}" ${load} decoding="async"${extra}>`;
  }
  const srcset = m.widths.map((w) => `${optUrl(depth, m, w)} ${w}w`).join(", ");
  return `<img${cls} src="${optUrl(depth, m, m.widths[0])}" srcset="${srcset}" sizes="${opts.sizes || "100vw"}" width="${m.w}" height="${m.h}" alt="${esc(alt)}" ${load} decoding="async"${extra}>`;
}

/* ---------------------------------------------------------------------------
   Navigation data (mobile nav, footer, services sheet, sitemap)
   Structure fixed in tools/content.js; labels come from the content files.
   --------------------------------------------------------------------------- */
const CODES = { rotulacion: "R", serigrafia: "S", "gran-formato": "G" };
const CATEGORIES = CONTENT.categories.map((cat) => ({
  slug: cat.slug, label: cat.label, overview: "servicios/" + cat.slug + ".html", code: CODES[cat.slug] || "X",
  items: cat.subs.map((s, i) => ({ slug: s.slug, label: s.label, lead: s.lead, href: cat.slug + "/" + s.slug + ".html", code: (CODES[cat.slug] || "X") + pad(i + 1) }))
}));

/* ---------------------------------------------------------------------------
   Icons — only functional ones (one stroke weight for the whole set)
   --------------------------------------------------------------------------- */
const ICONS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="square"/>',
  phone: '<path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" stroke-linejoin="round"/>',
  close: '<path d="M6 6l12 12M18 6 6 18" stroke-linecap="square"/>',
  prev: '<path d="m15 6-6 6 6 6" stroke-linecap="square"/>',
  next: '<path d="m9 6 6 6-6 6" stroke-linecap="square"/>',
  play: '<path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" stroke-linejoin="round"/>',
  pause: '<path d="M8 5v14M16 5v14" stroke-width="2.5"/>',
  plus: '<path d="M12 5v14M5 12h14" stroke-linecap="square"/>',
  mail: '<path d="M3 5h18v14H3z"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/>'
};
function svgIcon(name, size) {
  const s = size || 20;
  return `<svg class="icon" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">${ICONS[name] || ICONS.arrow}</svg>`;
}
const WHATSAPP_SVG = '<svg class="icon" viewBox="0 0 32 32" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M16 3C9 3 3 9 3 16c0 2.4.7 4.7 1.9 6.7L3 29l6.5-1.8A13 13 0 0 0 16 29c7 0 13-6 13-13S23 3 16 3Zm0 23.6c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 26.6 16 10.6 10.6 0 0 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4C10 11 9.5 12 9.5 13.4S10.6 16.3 10.8 16.6c.1.2 2.2 3.4 5.4 4.7 2 .8 2.8.9 3.8.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg>';

/* ---------------------------------------------------------------------------
   Brand devices
   --------------------------------------------------------------------------- */
/* Livery band: cyan / ink / orange stripes, wiped in like a squeegee */
function livery(cls) {
  return `<div class="livery${cls ? " " + cls : ""}" aria-hidden="true"><i class="livery-c"></i><i class="livery-k"></i><i class="livery-o"></i></div>`;
}
/* Rally door roundel */
function roundel(n, cls) {
  return `<span class="roundel${cls ? " " + cls : ""}" aria-hidden="true">${esc(n)}</span>`;
}
/* Technical caption on photos */
function tag(parts) {
  const p = parts.filter(Boolean).map(esc);
  return p.length ? `<span class="photo-tag">${p.join('<span class="photo-tag-sep">·</span>')}</span>` : "";
}

/* ---------------------------------------------------------------------------
   <head>
   --------------------------------------------------------------------------- */
function headBlock(depth, opts) {
  const canonical = BRAND.siteUrl + "/" + (opts.canonical || "");
  const ogImage = imgAbsolute(opts.ogImage || BRAND.heroVideo.poster);
  const title = plain(opts.title);
  const preload = opts.preload
    ? (() => {
        const m = IMG_MANIFEST[opts.preload];
        if (!m || !m.widths.length) return `\n  <link rel="preload" as="image" href="${srcUrl(depth, opts.preload)}" fetchpriority="high">`;
        const set = m.widths.map((w) => `${optUrl(depth, m, w)} ${w}w`).join(", ");
        return `\n  <link rel="preload" as="image" type="image/webp" imagesrcset="${set}" imagesizes="${opts.preloadSizes || "100vw"}" fetchpriority="high">`;
      })()
    : "";
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(opts.description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="${opts.noindex ? "noindex, follow" : "index, follow"}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Seriart">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(opts.description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="es_ES">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#f2f0eb">
  <link rel="icon" href="${rel(depth, "assets/img/favicon.svg")}" type="image/svg+xml">
  <link rel="preload" href="${rel(depth, "assets/fonts/archivo-var.woff2")}" as="font" type="font/woff2" crossorigin>${preload}
  <link rel="stylesheet" href="${rel(depth, "styles.css")}?v=${V}">
  <script>document.documentElement.classList.add("js")</script>`;
}

function schemaBlock() {
  return `<script type="application/ld+json">
${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Seriart",
    "alternateName": "Seriart Taller de Serigrafía",
    "image": imgAbsolute(BRAND.heroVideo.poster),
    "logo": BRAND.siteUrl + "/assets/img/logo-trim.png",
    "url": BRAND.siteUrl + "/",
    "telephone": BRAND.phoneHref,
    "email": BRAND.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BRAND.street,
      "addressLocality": BRAND.city,
      "addressRegion": BRAND.province,
      "postalCode": BRAND.postalCode,
      "addressCountry": "ES"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": BRAND.geo.lat, "longitude": BRAND.geo.lng },
    "areaServed": { "@type": "City", "name": BRAND.city },
    "foundingDate": String(BRAND.founded),
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "14:00"
    }],
    "sameAs": [BRAND.instagram, BRAND.facebook],
    "description": "Taller de rotulación, vinilo y serigrafía en Dénia (Alicante) desde 2002: vehículos, escaparates, rótulos, textil y gran formato."
  }, null, 2)}
  </script>`;
}

/* ---------------------------------------------------------------------------
   Header + mobile panel. `current` = top-level section key for aria-current
   --------------------------------------------------------------------------- */
function headerNav(depth, current) {
  const L = (p) => rel(depth, p);
  const cur = (k) => (current === k ? ' aria-current="page"' : "");
  const links = [
    { k: "trabajos", label: "Trabajos", href: "trabajos.html" },
    { k: "servicios", label: "Servicios", href: "servicios.html" },
    { k: "nosotros", label: "El taller", href: "nosotros.html" },
    { k: "contacto", label: "Contacto", href: "contacto.html" }
  ];
  const mobileServices = CATEGORIES.map((cat) => `<div class="mnav-group">
          <a class="mnav-cat" href="${L(cat.overview)}">${esc(cat.label)}</a>
          <ul>${cat.items.map((it) => `<li><a href="${L(it.href)}">${esc(it.label)}</a></li>`).join("")}</ul>
        </div>`).join("");

  return `<a class="skip-link" href="#main">Ir al contenido</a>
  <header class="site-header" data-header>
    <div class="wrap header-inner">
      <a class="brand" href="${L("index.html")}" aria-label="Seriart, ir al inicio">
        <img src="${L("assets/img/logo-trim.png")}" alt="" width="177" height="160">
      </a>
      <nav class="nav-primary" aria-label="Principal">
        ${links.map((l) => `<a class="nav-link" href="${L(l.href)}"${cur(l.k)}>${l.label}</a>`).join("\n        ")}
      </nav>
      <div class="header-actions">
        <a class="header-phone" href="tel:${BRAND.phoneHref}">${svgIcon("phone", 16)}<span>${esc(BRAND.phoneDisplay)}</span></a>
        <a class="btn btn-sm" href="${L("presupuesto.html")}"${cur("presupuesto")}>Presupuesto</a>
        <button class="nav-toggle" type="button" data-nav-toggle aria-label="Abrir menú" aria-expanded="false" aria-controls="mnav">
          <span></span><span></span>
        </button>
      </div>
    </div>
  </header>
  <div class="mnav" id="mnav" data-mnav hidden>
    <nav class="mnav-inner wrap" aria-label="Menú móvil">
      <ul class="mnav-main">
        ${links.map((l, i) => `<li><a href="${L(l.href)}"${cur(l.k)}><span class="mnav-num">${pad(i + 1)}</span>${l.label}</a></li>`).join("\n        ")}
      </ul>
      <div class="mnav-services">${mobileServices}</div>
      <div class="mnav-actions">
        <a class="btn btn-block" href="${waHref()}" target="_blank" rel="noopener">${WHATSAPP_SVG} WhatsApp</a>
        <a class="btn btn-line btn-block" href="tel:${BRAND.phoneHref}">${svgIcon("phone", 18)} ${esc(BRAND.phoneDisplay)}</a>
      </div>
    </nav>
  </div>`;
}

/* ---------------------------------------------------------------------------
   Footer
   --------------------------------------------------------------------------- */
function footer(depth) {
  const L = (p) => rel(depth, p);
  const cols = CATEGORIES.map((cat) => `<div class="footer-col">
          <h2><a href="${L(cat.overview)}">${esc(cat.label)}</a></h2>
          <ul>${cat.items.map((it) => `<li><a href="${L(it.href)}">${esc(it.label)}</a></li>`).join("")}</ul>
        </div>`).join("");
  return `<footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <div class="footer-visit">
          <p class="label">La tienda</p>
          <p class="footer-address"><a href="${BRAND.mapsLink}" target="_blank" rel="noopener">${esc(BRAND.street)}<br>${esc(BRAND.postalCode)} ${esc(BRAND.city)} (${esc(BRAND.province)})</a></p>
          <p class="footer-hours">${esc(BRAND.hours)}${BRAND.hoursNote ? "<br>" + esc(BRAND.hoursNote) : ""}</p>
          <ul class="footer-contact">
            <li><a href="tel:${BRAND.phoneHref}">${esc(BRAND.phoneDisplay)}</a></li>
            <li><a href="${waHref()}" target="_blank" rel="noopener">WhatsApp ${esc(BRAND.whatsappDisplay)}</a></li>
            <li><a href="mailto:${BRAND.email}">${esc(BRAND.email)}</a></li>
          </ul>
        </div>
        ${cols}
        <div class="footer-col">
          <h2>Seriart</h2>
          <ul>
            <li><a href="${L("trabajos.html")}">Trabajos</a></li>
            <li><a href="${L("nosotros.html")}">El taller</a></li>
            <li><a href="${L("presupuesto.html")}">Pedir presupuesto</a></li>
            <li><a href="${L("contacto.html")}">Contacto</a></li>
            <li><a href="${BRAND.instagram}" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="${BRAND.facebook}" target="_blank" rel="noopener">Facebook</a></li>
          </ul>
        </div>
      </div>
      <p class="wordmark" aria-hidden="true"><span>seri</span><strong>art</strong></p>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Seriart · Taller de rotulación y serigrafía · ${esc(BRAND.city)} desde ${BRAND.founded}</span>
        <nav class="footer-legal" aria-label="Legal">
          <a href="${L("legal.html")}#aviso-legal">Aviso legal</a>
          <a href="${L("legal.html")}#privacidad">Privacidad</a>
          <a href="${L("legal.html")}#cookies">Cookies</a>
        </nav>
      </div>
    </div>
  </footer>`;
}

/* Mobile-only action bar (WhatsApp + call). The page reserves its height. */
function actionBar() {
  return `<div class="action-bar" data-action-bar>
    <a href="${waHref()}" target="_blank" rel="noopener">${WHATSAPP_SVG}<span>WhatsApp</span></a>
    <a href="tel:${BRAND.phoneHref}">${svgIcon("phone", 18)}<span>Llamar</span></a>
  </div>`;
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
    if (i === items.length - 1) return `<li><span aria-current="page">${esc(plain(it.label))}</span></li>`;
    return `<li><a href="${rel(depth, it.href)}">${esc(plain(it.label))}</a></li>`;
  });
  return `<nav class="breadcrumb" aria-label="Migas de pan"><ol>${parts.join("")}</ol></nav>`;
}

/* Full page shell. opts: title, description, canonical, ogImage, preload,
   preloadSizes, current, noindex, bodyClass */
function page(depth, opts, bodyHtml) {
  return `<!doctype html>
<html lang="es">
<head>
  ${headBlock(depth, opts)}
  ${schemaBlock()}
</head>
<body${opts.bodyClass ? ` class="${opts.bodyClass}"` : ""}>
  ${headerNav(depth, opts.current)}
  <main id="main">
${bodyHtml}
  </main>
  ${footer(depth)}
  ${actionBar()}
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
  return `<header class="section-head${opts.split ? " is-split" : ""}">
        <div class="section-head-main">
          ${opts.label ? `<p class="label">${esc(opts.label)}</p>` : ""}
          <h2 class="title">${em(opts.title)}</h2>
        </div>
        ${opts.text ? `<p class="section-lead">${esc(opts.text)}</p>` : ""}${opts.link || ""}
      </header>`;
}

function arrowLink(href, label, cls) {
  return `<a class="link-arrow${cls ? " " + cls : ""}" href="${href}"><span>${esc(label)}</span>${svgIcon("arrow", 18)}</a>`;
}

/* Interior page hero. opts: crumbs, label, title (may contain *heavy*), lead,
   image, imageAlt, imageTag: [parts], cta: {href,label} | false, secondary */
function pageHero(depth, opts) {
  const cta = opts.cta === false ? "" : `<a class="btn" href="${opts.cta ? opts.cta.href : rel(depth, "presupuesto.html")}">${esc(opts.cta ? opts.cta.label : "Pedir presupuesto")}</a>`;
  const sec = opts.secondary ? `<a class="btn btn-line" href="${opts.secondary.href}"${opts.secondary.external ? ' target="_blank" rel="noopener"' : ""}>${opts.secondary.icon || ""}${esc(opts.secondary.label)}</a>` : "";
  const actions = cta || sec ? `<div class="page-hero-actions">${cta}${sec}</div>` : "";
  const media = opts.image
    ? `<figure class="page-hero-media">${pic(depth, opts.image, opts.imageAlt || "", { eager: true, sizes: "(min-width: 960px) 42vw, 100vw" })}${tag(opts.imageTag || [])}</figure>`
    : `<div class="page-hero-livery">${livery("is-hero")}</div>`;
  return `  <section class="page-hero${opts.image ? " has-media" : " no-media"}">
    <div class="wrap page-hero-grid">
      <div class="page-hero-text">
        ${breadcrumb(depth, opts.crumbs)}
        ${opts.label ? `<p class="label">${esc(opts.label)}</p>` : ""}
        <h1 class="display">${em(opts.title)}</h1>
        ${opts.lead ? `<p class="page-hero-lead">${esc(opts.lead)}</p>` : ""}
        ${actions}
      </div>
      ${media}
    </div>
  </section>`;
}

/* Copy on the left, "qué incluye" spec rows on the right */
function introBlock(depth, opts) {
  const paras = opts.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n        ");
  const rows = (opts.types || []).map((t, i) => `<li><span class="spec-code">${pad(i + 1)}</span><div><strong>${esc(t.title)}</strong>${t.desc ? `<span>${esc(t.desc)}</span>` : ""}</div></li>`).join("");
  return `  <section class="section">
    <div class="wrap intro-split">
      <div class="intro-copy reveal">
        <p class="label">${esc(opts.label || "Cómo lo hacemos")}</p>
        <h2 class="title">${em(opts.heading)}</h2>
        ${paras}
      </div>
      ${rows ? `<div class="intro-list reveal">
        <h3 class="label">${esc(opts.listTitle || "Qué hacemos")}</h3>
        <ul class="spec-list">${rows}</ul>
      </div>` : ""}
    </div>
  </section>`;
}

/* Gallery that opens in the lightbox. images: [{src, alt}] */
/* Closed compositions only: 1–5 photos (more live on /trabajos.html) */
function galleryBlock(depth, opts) {
  const group = opts.group || "g";
  const images = opts.images.slice(0, 5);
  const hasLead = images.length === 3 || images.length === 5;
  const items = images.map((im, i) => `<a class="gallery-item${i === 0 && hasLead ? " is-lead" : ""} reveal" href="${imgLargest(depth, im.src)}" data-lightbox-item="${group}" data-caption="${esc(im.alt)}">
        ${pic(depth, im.src, im.alt, { sizes: i === 0 ? "(min-width: 960px) 50vw, 100vw" : "(min-width: 960px) 25vw, 50vw" })}
        <span class="gallery-cap">${esc(im.alt)}</span>
      </a>`).join("");
  return `  <section class="section">
    <div class="wrap">
      ${sectionHead({ label: "Trabajos reales", title: opts.heading, link: arrowLink(rel(depth, "trabajos.html"), "Todos los trabajos", "section-head-link") })}
      <div class="gallery-grid is-n${images.length}">${items}</div>
    </div>
  </section>`;
}

/* The process, told with the workshop's own photos */
const PROCESS_STEPS = [
  { title: "Nos cuentas la idea", desc: "Por WhatsApp, por teléfono o en la tienda. Con el logo y una foto de lo que hay que rotular ya podemos empezar.", img: "assets/uploads/martini-vinilo-impreso.jpg", tag: ["Librea Martini", "diseño listo"] },
  { title: "Diseño y prueba", desc: "Adaptamos el diseño a la medida real del soporte y te lo enseñamos antes de producir nada.", img: "assets/uploads/sellagas-caddy-replanteo.jpg", tag: ["Caddy Sellagas", "replanteo"] },
  { title: "Impresión en el taller", desc: "Imprimimos y cortamos el vinilo en nuestra propia impresora. Sin intermediarios.", img: "assets/uploads/martini-impresion-mimaki.jpg", tag: ["Mimaki del taller"] },
  { title: "Aplicación", desc: "Lo aplicamos nosotros: en el taller, en la acera de la tienda o en tu local.", img: "assets/uploads/sellagas-caddy-aplicacion.jpg", tag: ["Caddy Sellagas", "franja roja"] },
  { title: "Listo para salir", desc: "Revisamos cada borde y te lo entregamos. A partir de ahí, a trabajar.", img: "assets/uploads/sellagas-caddy-tienda.jpg", tag: ["Caddy Sellagas", "terminada"] }
];
function processBlock(depth, opts) {
  opts = opts || {};
  const steps = PROCESS_STEPS.map((s, i) => `<li class="step reveal">
          <figure class="step-media">${pic(depth, fs.existsSync(path.join(ROOT, s.img)) ? s.img : "", s.title, { sizes: "(min-width: 1100px) 20vw, (min-width: 640px) 40vw, 78vw" })}${tag(s.tag)}</figure>
          <div class="step-body">
            ${roundel(i + 1)}
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.desc)}</p>
          </div>
        </li>`).join("");
  return `  <section class="section section-process${opts.alt ? " section-alt" : ""}" aria-labelledby="proceso-title">
    <div class="wrap">
      <header class="section-head is-split">
        <div class="section-head-main">
          <p class="label">Cómo trabajamos</p>
          <h2 class="title" id="proceso-title">Del archivo <strong>a&nbsp;la carrocería</strong></h2>
        </div>
        <p class="section-lead">${esc(opts.text || "Un mismo taller se encarga de todo, así que siempre sabes con quién hablar. Te lo contamos con fotos de dos encargos reales: la Caddy de Sellagas y la librea Martini.")}</p>
      </header>
    </div>
    <ol class="steps" tabindex="0" aria-label="Pasos del proceso">${steps}</ol>
  </section>`;
}

function faqBlock(depth, items) {
  const list = items.map((it) => `<details class="faq-item">
          <summary><span>${esc(it.q)}</span>${svgIcon("plus", 20)}</summary>
          <div class="faq-answer"><p>${esc(it.a)}</p></div>
        </details>`).join("");
  return `  <section class="section section-alt">
    <div class="wrap faq-split">
      <div class="faq-aside">
        <p class="label">Preguntas frecuentes</p>
        <h2 class="title">Lo que <strong>suelen preguntarnos</strong></h2>
        <p>¿Tienes otra duda? Pregúntanos sin compromiso.</p>
        <a class="btn btn-line" href="${waHref("Hola, tengo una duda sobre un trabajo.")}" target="_blank" rel="noopener">${WHATSAPP_SVG} Preguntar por WhatsApp</a>
      </div>
      <div class="faq-list">${list}</div>
    </div>
  </section>`;
}

/* Related services as a ruled list. items: [{label, href, code}] */
function relatedBlock(depth, title, items) {
  if (!items.length) return "";
  const rows = items.map((it) => `<li><a href="${rel(depth, it.href)}"><span class="spec-code">${esc(it.code || "")}</span><span class="related-label">${esc(it.label)}</span>${svgIcon("arrow", 18)}</a></li>`).join("");
  return `  <section class="section section-tight">
    <div class="wrap related">
      <p class="label">${esc(title)}</p>
      <ul class="related-list">${rows}</ul>
    </div>
  </section>`;
}

/* Closing call to action, cyan plate. opts: title, text, service */
function contactCta(depth, opts) {
  opts = opts || {};
  const q = opts.service ? "?servicio=" + opts.service : "";
  return `  <section class="plate" aria-labelledby="plate-title">
    ${livery("is-plate")}
    <div class="wrap plate-inner">
      <div class="plate-copy reveal">
        <p class="label">Presupuesto sin compromiso</p>
        <h2 class="display" id="plate-title">${em(opts.title || "¿Tienes el logo? *Mándanoslo.*")}</h2>
        <p class="plate-text">${esc(opts.text || "Escríbenos por WhatsApp con el logotipo y una foto de lo que quieres rotular: la furgoneta, el escaparate, la prenda. Con eso empezamos a preparar el presupuesto.")}</p>
      </div>
      <div class="plate-actions reveal">
        <a class="plate-action is-main" href="${waHref()}" target="_blank" rel="noopener">${WHATSAPP_SVG}<span><strong>WhatsApp</strong><small>${esc(BRAND.whatsappDisplay)} · manda fotos y logo</small></span>${svgIcon("arrow", 20)}</a>
        <a class="plate-action" href="${rel(depth, "presupuesto.html")}${q}"><span><strong>Formulario de presupuesto</strong><small>Medidas, cantidad y fecha</small></span>${svgIcon("arrow", 20)}</a>
        <a class="plate-action" href="tel:${BRAND.phoneHref}">${svgIcon("phone", 20)}<span><strong>${esc(BRAND.phoneDisplay)}</strong><small>${esc(BRAND.hours)}</small></span>${svgIcon("arrow", 20)}</a>
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
  write("lib/manifest.js", `/* Generated by tools/build.js from content/sitio.json — do not edit by hand. */
window.__SERIART__ = ${JSON.stringify(cfg, null, 2)};
`);
}

module.exports = {
  ROOT, OUT, V, BRAND, CONTENT, CATEGORIES, IMG_MANIFEST, usedOriginals, esc, em, plain, pad, rel, write, waHref, pic, imgLargest, svgIcon, WHATSAPP_SVG,
  livery, roundel, tag, page, pageHero, sectionHead, arrowLink, introBlock, galleryBlock, processBlock, faqBlock,
  relatedBlock, contactCta, breadcrumb, writeRuntimeConfig
};
