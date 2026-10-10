"use strict";
/* Builds the whole static site into _site/. Run with: node tools/build.js
   (run tools/optimize-images.js first whenever photos change).
   Content comes from content/*.json — see tools/content.js. */
const fs = require("fs");
const path = require("path");
const G = require("./generate-site.js");
const { esc, em, plain, pad, rel, write, waHref, pic, imgLargest, svgIcon, WHATSAPP_SVG, livery, roundel, tag, page, pageHero,
  sectionHead, arrowLink, introBlock, galleryBlock, processBlock, faqBlock, relatedBlock, contactCta, BRAND, CATEGORIES,
  CONTENT, ROOT, OUT } = G;

console.log("Building Seriart static site...\n");
fs.rmSync(OUT, { recursive: true, force: true });

const CATEGORY_CONTENT = {};
CONTENT.categories.forEach((c) => { CATEGORY_CONTENT[c.slug] = c; });
const ALL_SUBSERVICES = CONTENT.services;
const subHref = (s) => s.cat.slug + "/" + s.slug + ".html";
const navItem = (slug) => CATEGORIES.reduce((f, c) => f || c.items.find((it) => it.slug === slug), null) || {};
/* Sections backed by editable lists are left out when the list is empty */
const when = (cond, html) => (cond ? html : "");
const hoursShort = BRAND.hours.replace("Lunes a viernes", "L–V");

/* ===========================================================================
   Forms — Web3Forms (static-friendly). Without an access key main.js falls
   back to opening the visitor's mail app with the message prefilled.
   =========================================================================== */
function formHidden(subject) {
  return `<input type="hidden" name="access_key" value="${esc(BRAND.web3formsKey)}">
          <input type="hidden" name="subject" value="${esc(subject)}">
          <input type="hidden" name="from_name" value="Web Seriart">
          <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">`;
}
function privacyCheck(depth, id) {
  return `<div class="field field-check">
            <input id="${id}" name="Privacidad" type="checkbox" value="Aceptada" required>
            <label for="${id}">He leído y acepto la <a href="${rel(depth, "legal.html")}#privacidad" target="_blank">política de privacidad</a>.</label>
          </div>`;
}
function formStatus() {
  return `<div class="form-status" data-form-status role="status" aria-live="polite"></div>`;
}

/* "La tienda" block: photo + address, hours and directions */
function visitBlock(depth, opts) {
  opts = opts || {};
  const img = opts.img || CONTENT.about.homeImg;
  return `  <section class="section visit" aria-labelledby="visit-title">
    <div class="wrap visit-grid">
      <figure class="visit-media reveal">${pic(depth, img, "Fachada de la tienda Seriart en Ronda de les Muralles, Dénia", { sizes: "(min-width: 960px) 50vw, 100vw" })}${tag(["seriart tenda", BRAND.street])}</figure>
      <div class="visit-copy reveal">
        <p class="label">La tienda</p>
        <h2 class="title" id="visit-title">${em(opts.title || "Pásate por *la tienda*")}</h2>
        <p>${esc(opts.text || "Estamos en el centro de Dénia, junto a las murallas. Trae el logo en un pendrive, una muestra de la prenda o las medidas del escaparate y lo vemos juntos.")}</p>
        <dl class="facts">
          <div><dt>Dirección</dt><dd>${esc(BRAND.street)}<br>${esc(BRAND.postalCode)} ${esc(BRAND.city)} (${esc(BRAND.province)})</dd></div>
          <div><dt>Horario</dt><dd>${esc(BRAND.hours)}${BRAND.hoursNote ? "<br>" + esc(BRAND.hoursNote) : ""}</dd></div>
          <div><dt>Teléfono</dt><dd><a href="tel:${BRAND.phoneHref}">${esc(BRAND.phoneDisplay)}</a></dd></div>
        </dl>
        <div class="btn-row">
          <a class="btn" href="${BRAND.mapsLink}" target="_blank" rel="noopener">${svgIcon("pin", 18)} Cómo llegar</a>
          <a class="btn btn-line" href="${rel(depth, "contacto.html")}">Contacto</a>
        </div>
      </div>
    </div>
  </section>`;
}

/* Services sheet (home + /servicios.html). full = show each service lead */
function servicesSheet(depth, opts) {
  opts = opts || {};
  const groups = CATEGORIES.map((cat) => {
    const c = CATEGORY_CONTENT[cat.slug];
    const rows = cat.items.map((it) => `<li><a href="${rel(depth, it.href)}">
              <span class="spec-code">${esc(it.code)}</span>
              <span class="sheet-name">${esc(it.label)}${opts.full && it.lead ? `<small>${esc(it.lead)}</small>` : ""}</span>
              ${svgIcon("arrow", 18)}
            </a></li>`).join("");
    return `<div class="sheet-group reveal">
          <${opts.full ? "h2" : "h3"} class="sheet-title"><a href="${rel(depth, cat.overview)}">${em(c.title)}</a></${opts.full ? "h2" : "h3"}>
          ${opts.full ? `<p class="sheet-lead">${esc(c.lead)}</p>` : ""}
          <ul class="sheet-list">${rows}</ul>
          ${arrowLink(rel(depth, cat.overview), "Ver " + cat.label.toLowerCase(), "sheet-more")}
        </div>`;
  }).join("");
  return `<div class="sheet">${groups}</div>
      <p class="sheet-also"><span class="label">También</span> Tampografía · Transfer · Vinilo termosoldable · Adhesivos · Termoimpresión · Reclamos publicitarios</p>`;
}

/* ===========================================================================
   Subservice pages (depth 1)
   =========================================================================== */
ALL_SUBSERVICES.forEach(function (sub) {
  const cat = sub.cat;
  const crumbs = [
    { label: "Inicio", href: "index.html" },
    { label: "Servicios", href: "servicios.html" },
    { label: cat.label, href: "servicios/" + cat.slug + ".html" },
    { label: sub.label }
  ];
  const siblings = CATEGORIES.find((c) => c.slug === cat.slug).items.filter((it) => it.slug !== sub.slug);
  const body = [
    pageHero(1, {
      crumbs, label: navItem(sub.slug).code + " — " + cat.label, title: sub.title, lead: sub.lead,
      image: sub.heroImg, imageAlt: plain(sub.title), imageTag: sub.gallery.length || sub.heroImg ? [plain(sub.title)] : [],
      cta: { href: rel(1, "presupuesto.html") + "?servicio=" + sub.slug, label: "Pedir presupuesto" },
      secondary: { href: waHref("Hola, quería información sobre " + sub.label.toLowerCase() + "."), label: "WhatsApp", icon: WHATSAPP_SVG, external: true }
    }),
    introBlock(1, { heading: "Cómo *lo hacemos*", paragraphs: sub.intro, types: sub.types, listTitle: "Tipos de trabajo" }),
    when(sub.gallery.length, galleryBlock(1, { heading: "Hecho en *el taller*", images: sub.gallery, group: sub.slug })),
    when(sub.faqs.length, faqBlock(1, sub.faqs)),
    relatedBlock(1, "Otros servicios de " + cat.label.toLowerCase(), siblings),
    contactCta(1, { service: sub.slug })
  ].join("\n");
  write(subHref(sub), page(1, {
    title: sub.metaTitle, description: sub.metaDescription, canonical: subHref(sub), current: "servicios",
    ogImage: sub.heroImg || undefined, preload: sub.heroImg, preloadSizes: "(min-width: 960px) 42vw, 100vw"
  }, body));
});

/* ===========================================================================
   Category overview pages (depth 1) — servicios/rotulacion.html etc.
   =========================================================================== */
Object.keys(CATEGORY_CONTENT).forEach(function (slug) {
  const cat = CATEGORY_CONTENT[slug];
  const nav = CATEGORIES.find((c) => c.slug === slug);
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Servicios", href: "servicios.html" }, { label: cat.label }];
  const rows = nav.items.map((it) => {
    const s = ALL_SUBSERVICES.find((x) => x.slug === it.slug);
    return `<li class="reveal"><a class="svc-row" href="${rel(1, it.href)}">
          <span class="spec-code">${esc(it.code)}</span>
          <span class="svc-row-name">${esc(it.label)}</span>
          <span class="svc-row-lead">${esc(s.lead)}</span>
          <span class="svc-row-media">${s.heroImg ? pic(1, s.heroImg, "", { sizes: "160px" }) : ""}</span>
          ${svgIcon("arrow", 20)}
        </a></li>`;
  }).join("");

  const body = [
    pageHero(1, {
      crumbs, label: "Servicios", title: cat.title, lead: cat.lead, image: cat.heroImg, imageAlt: cat.label, imageTag: [cat.label],
      cta: { href: rel(1, "presupuesto.html") + "?servicio=" + slug, label: "Pedir presupuesto" }
    }),
    `  <section class="section">
    <div class="wrap">
      ${sectionHead({ label: cat.label, title: "Elige *lo que necesitas*" })}
      <ul class="svc-rows">${rows}</ul>
    </div>
  </section>`,
    introBlock(1, { heading: "Un taller, *todo el proceso*", paragraphs: cat.intro, types: cat.types, label: "Cómo trabajamos", listTitle: "Lo que hacemos" }),
    when(cat.gallery.length, galleryBlock(1, { heading: "Algunos *trabajos*", images: cat.gallery, group: slug })),
    contactCta(1, { service: slug })
  ].join("\n");

  write("servicios/" + slug + ".html", page(1, {
    title: cat.metaTitle, description: cat.metaDescription, canonical: "servicios/" + slug + ".html", current: "servicios",
    ogImage: cat.heroImg, preload: cat.heroImg, preloadSizes: "(min-width: 960px) 42vw, 100vw"
  }, body));
});

/* ===========================================================================
   /servicios.html (depth 0)
   =========================================================================== */
(function buildServicios() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Servicios" }];
  const body = [
    pageHero(0, {
      crumbs, label: "Servicios", title: "Rotulación, vinilo, serigrafía *y gran formato*",
      lead: "Todo lo que tu negocio necesita para verse, diseñado, impreso y aplicado desde nuestro taller de Dénia."
    }),
    `  <section class="section">
    <div class="wrap">
      ${servicesSheet(0, { full: true })}
    </div>
  </section>`,
    processBlock(0, { alt: true }),
    contactCta(0, { title: "¿No sabes *qué necesitas?*", text: "Cuéntanos la idea tal cual la tienes en la cabeza y te orientamos sobre materiales, tamaños y presupuesto." })
  ].join("\n");

  write("servicios.html", page(0, {
    title: "Servicios | Rotulación, vinilo, serigrafía y gran formato en Dénia — Seriart",
    description: "Rotulación de vehículos y negocios, vinilo, serigrafía textil, ropa laboral, trofeos e impresión de gran formato en Dénia, Alicante. Un solo taller para todo.",
    canonical: "servicios.html", current: "servicios", ogImage: CATEGORY_CONTENT.rotulacion.heroImg
  }, body));
})();

/* ===========================================================================
   Home (depth 0)
   =========================================================================== */
(function buildHome() {
  const video = BRAND.heroVideo;
  const poster = video.poster;

  const hero = `  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="label hero-kicker">Taller de rotulación y serigrafía <span>·</span> ${esc(BRAND.city)} <span>·</span> desde ${BRAND.founded}</p>
        <h1 class="display hero-title" id="hero-title">Rotulación, vinilo y serigrafía <strong>hechos en Dénia</strong></h1>
        <p class="hero-lead">Diseñamos, imprimimos y aplicamos en nuestro taller de Ronda de les Muralles: furgonetas de empresa, escaparates, coches de rally y clásicos, ropa de trabajo y de fiesta.</p>
        <div class="hero-actions">
          <a class="btn btn-lg" href="presupuesto.html">Pedir presupuesto</a>
          <a class="btn btn-line btn-lg" href="${waHref()}" target="_blank" rel="noopener">${WHATSAPP_SVG} WhatsApp</a>
        </div>
        <dl class="hero-facts">
          <div><dt>Tienda</dt><dd><a href="${BRAND.mapsLink}" target="_blank" rel="noopener">${esc(BRAND.street)}</a></dd></div>
          <div><dt>Horario</dt><dd>${esc(hoursShort)}</dd></div>
          <div><dt>Teléfono</dt><dd><a href="tel:${BRAND.phoneHref}">${esc(BRAND.phoneDisplay)}</a></dd></div>
        </dl>
      </div>
      <figure class="hero-media">
        ${livery("is-hero")}
        <div class="hero-photo">${pic(0, poster, video.posterAlt || "Furgoneta rotulada por Seriart frente a la tienda", { eager: true, sizes: "(min-width: 960px) 44vw, 100vw" })}</div>
        <figcaption>${tag([video.posterAlt || "Trabajo de Seriart"])}</figcaption>
      </figure>
    </div>
  </section>`;

  /* Works marked "mostrar en inicio" first, topped up with the rest, max 6 */
  const homeWorks = CONTENT.works.filter((w) => w.home).concat(CONTENT.works.filter((w) => !w.home)).slice(0, 6);
  const rows = homeWorks.map((w, i) => `<li>
          <a class="windex-row" href="trabajos.html#${w.slug}" data-preview="${i}">
            <span class="windex-thumb">${pic(0, w.src, w.title, { sizes: "(min-width: 960px) 1px, 92vw" })}</span>
            ${roundel(i + 1)}
            <span class="windex-title">${esc(w.title)}</span>
            <span class="windex-meta"><span>${esc(w.tag)}</span>${w.year ? `<span>${esc(w.year)}</span>` : ""}</span>
            ${svgIcon("arrow", 22)}
          </a>
        </li>`).join("");
  const previews = homeWorks.map((w, i) => `<figure class="windex-fig${i === 0 ? " is-active" : ""}" data-preview-fig="${i}">
          ${pic(0, w.src, "", { sizes: "(min-width: 960px) 38vw, 1px" })}
          ${w.desc ? `<figcaption>${esc(w.desc)}</figcaption>` : ""}
        </figure>`).join("");

  const hasVideo = Boolean(video.src);
  const videoBlock = when(hasVideo, `  <section class="section section-tight film" aria-labelledby="film-title">
    <div class="wrap film-grid">
      <div class="film-copy reveal">
        <p class="label">En tiempo real</p>
        <h2 class="title" id="film-title">Una furgoneta, <strong>de principio a fin</strong></h2>
        <p>${esc((video.caption || "Timelapse de una rotulación en el taller").replace(/[.\s]*$/, "."))} Sin cortes de estudio ni efectos: así se trabaja el vinilo, centímetro a centímetro.</p>
      </div>
      <div class="film-media reveal">
        <video data-film muted loop playsinline preload="metadata" aria-label="${esc(video.caption || "Timelapse de rotulación")}">
          <source src="${rel(0, video.src)}" type="${/\.webm$/i.test(video.src) ? "video/webm" : "video/mp4"}">
        </video>
        <button class="film-toggle" type="button" data-film-toggle aria-label="Reproducir vídeo">
          <span class="i-play">${svgIcon("play", 18)}</span><span class="i-pause">${svgIcon("pause", 18)}</span>
        </button>
      </div>
    </div>
  </section>`);

  const body = [
    hero,
    when(homeWorks.length, `  <section class="section windex-section" aria-labelledby="works-title">
    <div class="wrap">
      <header class="section-head is-split">
        <div class="section-head-main">
          <p class="label">Trabajos</p>
          <h2 class="title" id="works-title">Recién salido <strong>del taller</strong></h2>
        </div>
        <p class="section-lead">Todo lo que ves aquí lo hemos diseñado, impreso o aplicado nosotros. Fotos hechas en el taller y en la acera de la tienda.</p>
      </header>
      <div class="windex" data-windex>
        <ol class="windex-list">${rows}</ol>
        <div class="windex-preview" aria-hidden="true">${previews}</div>
      </div>
      <div class="section-foot">${arrowLink("trabajos.html", "Ver todos los trabajos")}</div>
    </div>
  </section>`),
    processBlock(0, { alt: true }),
    videoBlock,
    `  <section class="section" aria-labelledby="services-title">
    <div class="wrap">
      ${sectionHead({ label: "Servicios", title: "Lo que *hacemos*", text: "Doce servicios en tres familias. Si lo tuyo no aparece, pregúntanos: probablemente también lo hacemos.", split: true }).replace("<h2 class=\"title\">", "<h2 class=\"title\" id=\"services-title\">")}
      ${servicesSheet(0)}
    </div>
  </section>`,
    contactCta(0),
    visitBlock(0)
  ].join("\n");

  write("index.html", page(0, {
    title: "Seriart | Rotulación, vinilo y serigrafía en Dénia, Alicante",
    description: "Taller de rotulación, vinilo y serigrafía en Dénia desde 2002: furgonetas y flotas, escaparates, rótulos, coches de rally y clásicos, ropa laboral y gran formato.",
    canonical: "", current: "inicio", bodyClass: "is-home",
    ogImage: poster, preload: poster, preloadSizes: "(min-width: 960px) 44vw, 100vw"
  }, body));
})();

/* ===========================================================================
   /trabajos.html (depth 0)
   =========================================================================== */
(function buildTrabajos() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Trabajos" }];
  const items = CONTENT.works; // content/trabajos.json, in the order set in the panel
  const entries = items.map((w, i) => {
    const all = [{ src: w.src, alt: w.title }].concat(w.photos);
    const photos = all.map((p, k) => `<a class="work-photo${k === 0 ? " is-lead" : ""}" href="${imgLargest(0, p.src)}" data-lightbox-item="${w.slug}" data-caption="${esc(p.alt)}">
            ${pic(0, p.src, p.alt, { sizes: k === 0 ? "(min-width: 960px) 46vw, 100vw" : "(min-width: 960px) 14vw, 30vw" })}
          </a>`).join("");
    return `<article class="work reveal" id="${w.slug}" data-filter-item="${w.cat}">
        <div class="work-meta">
          ${roundel(i + 1)}
          <h2 class="work-title">${w.title.includes(" · ") ? esc(w.title.split(" · ")[0]) + " <strong>" + esc(w.title.split(" · ").slice(1).join(" · ")) + "</strong>" : esc(w.title)}</h2>
          ${w.desc ? `<p>${esc(w.desc)}</p>` : ""}
          <dl class="facts is-compact">
            <div><dt>Tipo</dt><dd>${esc(w.tag)}</dd></div>
            ${w.year ? `<div><dt>Año</dt><dd>${esc(w.year)}</dd></div>` : ""}
            <div><dt>Fotos</dt><dd>${all.length}</dd></div>
          </dl>
        </div>
        <div class="work-photos${all.length === 1 ? " is-single" : ""}">${photos}</div>
      </article>`;
  }).join("");

  const filters = [{ key: "all", label: "Todos" }].concat(CONTENT.WORK_CATEGORIES.filter((c) => items.some((it) => it.cat === c.key)).map((c) => ({ key: c.key, label: c.filter })))
    .map((f, i) => `<button class="chip${i === 0 ? " is-active" : ""}" type="button" data-filter="${f.key}" aria-pressed="${i === 0}">${esc(f.label)}</button>`).join("");

  const body = [
    pageHero(0, {
      crumbs, label: "Trabajos", title: "Trabajos *reales*",
      lead: "Una muestra de lo que sale de nuestro taller: furgonetas de empresa, coches de rally y clásicos, stands, paredes, trofeos y textil. Pulsa cualquier foto para verla en grande."
    }),
    `  <section class="section section-flush">
    <div class="wrap">
      <div class="filter-bar" data-filter-bar role="group" aria-label="Filtrar trabajos por tipo">${filters}</div>
      <div class="works" data-filter-grid>${entries}</div>
      <p class="filter-empty" data-filter-empty${items.length ? " hidden" : ""}>Todavía no hay trabajos publicados en esta categoría.</p>
      <p class="works-more">Más trabajos en nuestro <a href="${BRAND.instagram}" target="_blank" rel="noopener">Instagram @seriart_denia</a>.</p>
    </div>
  </section>`,
    contactCta(0, { title: "¿Quieres *el tuyo?*", text: "Cuéntanos qué quieres rotular y mándanos una foto. Te decimos cómo lo haríamos y cuánto costaría." })
  ].join("\n");

  write("trabajos.html", page(0, {
    title: "Trabajos realizados | Rotulación, rally y serigrafía — Seriart Dénia",
    description: "Trabajos reales de Seriart en Dénia: rotulación de furgonetas, liberas de rally y clásicos, mobiliario de stand, paredes viniladas, trofeos y textil.",
    canonical: "trabajos.html", current: "trabajos", ogImage: items.length ? items[0].src : undefined
  }, body));
})();

/* ===========================================================================
   /nosotros.html (depth 0) — "El taller"
   =========================================================================== */
(function buildNosotros() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "El taller" }];
  const A = CONTENT.about; // content/nosotros.json
  const areas = A.areas.map((a, i) => `<li class="area reveal">
          <figure class="area-media">${pic(0, a.img, a.title, { sizes: "(min-width: 960px) 30vw, 100vw" })}</figure>
          ${roundel(i + 1)}
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.desc)}</p>
        </li>`).join("");
  const workshop = A.workshop.map((im) =>
    `<a class="gallery-item reveal" href="${imgLargest(0, im)}" data-lightbox-item="taller" data-caption="El taller de Seriart en Dénia">${pic(0, im, "El taller de Seriart en Dénia", { sizes: "(min-width: 960px) 25vw, 50vw" })}</a>`).join("");

  const body = [
    pageHero(0, {
      crumbs, label: "El taller", title: "Un taller de Dénia *desde 2002*",
      lead: "Diseñamos, imprimimos, cortamos y aplicamos desde la tienda de Ronda de les Muralles. Sin intermediarios: quien te atiende es quien hace el trabajo.",
      image: A.heroImg, imageAlt: "Impresora del taller de Seriart imprimiendo vinilo", imageTag: ["Mimaki del taller"]
    }),
    `  <section class="section">
    <div class="wrap story">
      <div class="story-copy reveal">
        <p class="label">Nuestra historia</p>
        <h2 class="title">${em(A.storyTitle)}</h2>
        ${A.story.map((p) => `<p>${esc(p)}</p>`).join("\n        ")}
      </div>
      <dl class="story-facts reveal">
        <div><dt>${BRAND.founded}</dt><dd>Año en que abrimos el taller en Dénia</dd></div>
        <div><dt>${ALL_SUBSERVICES.length}</dt><dd>Servicios de rotulación, serigrafía y gran formato</dd></div>
        <div><dt>1</dt><dd>Taller que diseña, imprime y aplica</dd></div>
      </dl>
    </div>
  </section>`,
    when(A.areas.length, `  <section class="section section-alt">
    <div class="wrap">
      ${sectionHead({ label: "Cómo nos organizamos", title: "Un mismo taller, *de principio a fin*" })}
      <ol class="areas">${areas}</ol>
    </div>
  </section>`),
    `  <section class="section section-tight">
    <div class="wrap also">
      <p class="label">Además de rotular</p>
      <p class="also-list">Serigrafía · Tampografía · Transfer · Vinilo termosoldable · Adhesivos · Termoimpresión · Reclamos publicitarios</p>
    </div>
  </section>`,
    when(A.workshop.length, `  <section class="section">
    <div class="wrap">
      ${sectionHead({ label: "Dentro", title: "Nuestro *espacio de trabajo*", text: "Impresión, corte, plancha y aplicación bajo el mismo techo: así controlamos cada fase sin depender de terceros." })}
      <div class="gallery-grid is-four is-n${Math.min(A.workshop.length, 4)}">${workshop}</div>
    </div>
  </section>`),
    visitBlock(0, { img: "assets/uploads/sellagas-caddy-tienda.jpg" }),
    contactCta(0)
  ].join("\n");

  write("nosotros.html", page(0, {
    title: "El taller | Rotulación y serigrafía en Dénia desde 2002 — Seriart",
    description: "Seriart es un taller de rotulación, vinilo y serigrafía en Ronda de les Muralles, Dénia, desde 2002. Diseño, impresión propia y aplicación.",
    canonical: "nosotros.html", current: "nosotros", ogImage: A.heroImg,
    preload: A.heroImg, preloadSizes: "(min-width: 960px) 42vw, 100vw"
  }, body));
})();

/* ===========================================================================
   /contacto.html (depth 0)
   =========================================================================== */
(function buildContacto() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Contacto" }];
  const mapEmbed = "https://www.google.com/maps?q=" + encodeURIComponent("Seriart, " + BRAND.address) + "&output=embed";
  const method = (href, label, value, note, ext) => `<li><a class="method" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}>
            <span class="method-label">${label}</span>
            <span class="method-value">${value}</span>
            ${note ? `<span class="method-note">${note}</span>` : ""}
            ${svgIcon("arrow", 20)}
          </a></li>`;
  const body = [
    pageHero(0, {
      crumbs, label: "Contacto", title: "Hablemos de *tu trabajo*",
      lead: "Escríbenos por WhatsApp, llámanos o pásate por la tienda. Si ya sabes lo que necesitas, pide presupuesto directamente.",
      cta: { href: rel(0, "presupuesto.html"), label: "Pedir presupuesto" },
      image: "assets/uploads/sellagas-caddy-tienda.jpg", imageAlt: "Fachada de la tienda Seriart en Ronda de les Muralles, Dénia", imageTag: ["seriart tenda", BRAND.street]
    }),
    `  <section class="section section-flush">
    <div class="wrap contact-grid">
      <ul class="methods reveal">
        ${method(waHref(), "WhatsApp", esc(BRAND.whatsappDisplay), "La forma más rápida. Puedes mandar fotos y el logo.", true)}
        ${method("tel:" + BRAND.phoneHref, "Teléfono", esc(BRAND.phoneDisplay), esc(BRAND.hours))}
        ${method("mailto:" + BRAND.email, "Email", esc(BRAND.email), "")}
        ${method(BRAND.mapsLink, "Tienda", esc(BRAND.street) + ", " + esc(BRAND.city), BRAND.hoursNote ? esc(BRAND.hoursNote) : "", true)}
      </ul>
      <div class="form-panel reveal">
        <h2 class="title">Escríbenos</h2>
        <p class="form-intro">Para un presupuesto detallado, mejor usa el <a href="${rel(0, "presupuesto.html")}">formulario de presupuesto</a>.</p>
        <form class="form" data-form data-form-kind="contacto" data-thanks="gracias.html" action="https://api.web3forms.com/submit" method="POST" novalidate>
          ${formHidden("Nuevo mensaje desde la web (contacto)")}
          <div class="form-row">
            <div class="field"><label for="c-nombre">Nombre</label><input id="c-nombre" name="Nombre" type="text" autocomplete="name" required></div>
            <div class="field"><label for="c-telefono">Teléfono <span class="opt">(opcional)</span></label><input id="c-telefono" name="Telefono" type="tel" autocomplete="tel"></div>
          </div>
          <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="c-mensaje">Mensaje</label><textarea id="c-mensaje" name="Mensaje" rows="5" required></textarea></div>
          ${privacyCheck(0, "c-privacidad")}
          <button class="btn btn-block btn-lg" type="submit" data-submit>Enviar mensaje</button>
          ${formStatus()}
        </form>
      </div>
    </div>
  </section>`,
    `  <section class="section section-alt">
    <div class="wrap">
      ${sectionHead({ label: "Cómo llegar", title: "En el centro de Dénia, *junto a las murallas*", text: BRAND.address })}
      <div class="map-facade reveal" data-map data-map-src="${esc(mapEmbed)}">
        <div class="map-facade-inner">
          <p class="label">${BRAND.geo.lat.toFixed(4)}° N · ${BRAND.geo.lng.toFixed(4)}° E</p>
          <p class="map-address"><strong>${esc(BRAND.street)}</strong><br>${esc(BRAND.postalCode)} ${esc(BRAND.city)} (${esc(BRAND.province)})</p>
          <div class="btn-row">
            <button class="btn" type="button" data-map-load>Ver mapa aquí</button>
            <a class="btn btn-line" href="${BRAND.mapsLink}" target="_blank" rel="noopener">Abrir en Google Maps</a>
          </div>
          <p class="map-note">Al cargar el mapa, Google puede instalar cookies propias.</p>
        </div>
      </div>
    </div>
  </section>`
  ].join("\n");

  write("contacto.html", page(0, {
    title: "Contacto | Seriart — Taller de rotulación en Dénia, Alicante",
    description: "Contacta con Seriart: tienda en Ronda de les Muralles 20, Dénia (Alicante). WhatsApp, teléfono, email y horario.",
    canonical: "contacto.html", current: "contacto", ogImage: CONTENT.about.homeImg
  }, body));
})();

/* ===========================================================================
   /presupuesto.html (depth 0)
   =========================================================================== */
(function buildPresupuesto() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Presupuesto" }];
  const groups = Object.keys(CATEGORY_CONTENT).map(function (slug) {
    const c = CATEGORY_CONTENT[slug];
    const opts = ALL_SUBSERVICES.filter((s) => s.cat.slug === slug)
      .map((s) => `<option value="${esc(c.label)} — ${esc(s.label)}" data-slug="${s.slug}">${esc(s.label)}</option>`).join("");
    return `<optgroup label="${esc(c.label)}"><option value="${esc(c.label)} (varios)" data-slug="${slug}">${esc(c.label)}: varios trabajos</option>${opts}</optgroup>`;
  }).join("");

  const body = [
    pageHero(0, {
      crumbs, label: "Presupuesto", title: "Pide presupuesto *sin compromiso*",
      lead: "Cuéntanos qué necesitas. Cuantos más detalles nos des (medidas, cantidad, fecha), más ajustado será el presupuesto.",
      cta: false
    }),
    `  <section class="section section-flush">
    <div class="wrap quote-grid">
      <div class="form-panel reveal">
        <form class="form" data-form data-form-kind="presupuesto" data-thanks="gracias.html" action="https://api.web3forms.com/submit" method="POST" novalidate>
          ${formHidden("Nueva solicitud de presupuesto desde la web")}
          <fieldset>
            <legend>${roundel(1)} Tus datos</legend>
            <div class="form-row">
              <div class="field"><label for="p-nombre">Nombre</label><input id="p-nombre" name="Nombre" type="text" autocomplete="name" required></div>
              <div class="field"><label for="p-empresa">Empresa <span class="opt">(opcional)</span></label><input id="p-empresa" name="Empresa" type="text" autocomplete="organization"></div>
            </div>
            <div class="form-row">
              <div class="field"><label for="p-email">Email</label><input id="p-email" name="email" type="email" autocomplete="email" required></div>
              <div class="field"><label for="p-telefono">Teléfono</label><input id="p-telefono" name="Telefono" type="tel" autocomplete="tel" required></div>
            </div>
          </fieldset>
          <fieldset>
            <legend>${roundel(2)} Tu trabajo</legend>
            <div class="field">
              <label for="p-servicio">¿Qué necesitas?</label>
              <select id="p-servicio" name="Servicio" required data-service-select>
                <option value="">Elige un servicio</option>
                ${groups}
                <option value="No lo tengo claro" data-slug="otro">No lo tengo claro / varios servicios</option>
              </select>
            </div>
            <div class="field"><label for="p-descripcion">Descríbelo</label><textarea id="p-descripcion" name="Descripcion" rows="5" placeholder="Por ejemplo: rotular los laterales y la puerta trasera de una Renault Kangoo con nuestro logo y teléfono." required></textarea></div>
            <div class="form-row is-three">
              <div class="field"><label for="p-cantidad">Cantidad <span class="opt">(opcional)</span></label><input id="p-cantidad" name="Cantidad" type="text" placeholder="50 camisetas, 2 furgonetas…"></div>
              <div class="field"><label for="p-medidas">Medidas <span class="opt">(opcional)</span></label><input id="p-medidas" name="Medidas" type="text" placeholder="3 × 2 m…"></div>
              <div class="field"><label for="p-fecha">Lo necesito para <span class="opt">(opcional)</span></label><input id="p-fecha" name="Fecha" type="date"></div>
            </div>
            <div class="field">
              <span class="field-label">¿Cómo prefieres que te contestemos?</span>
              <div class="radio-row">
                <label class="radio"><input type="radio" name="Contactar por" value="Email" checked> Email</label>
                <label class="radio"><input type="radio" name="Contactar por" value="Teléfono"> Teléfono</label>
                <label class="radio"><input type="radio" name="Contactar por" value="WhatsApp"> WhatsApp</label>
              </div>
            </div>
          </fieldset>
          ${privacyCheck(0, "p-privacidad")}
          <button class="btn btn-block btn-lg" type="submit" data-submit>Enviar solicitud</button>
          ${formStatus()}
        </form>
      </div>
      <aside class="quote-aside">
        <div class="aside-block reveal">
          <h2 class="label">Qué pasa después</h2>
          <ol class="mini-steps">
            <li>${roundel(1)}<div><strong>Revisamos tu solicitud</strong><span>Si nos falta algún dato, te llamamos o escribimos.</span></div></li>
            <li>${roundel(2)}<div><strong>Te enviamos el presupuesto</strong><span>Claro y detallado, sin compromiso.</span></div></li>
            <li>${roundel(3)}<div><strong>Diseño y prueba</strong><span>Si sigues adelante, te enseñamos el diseño antes de producir.</span></div></li>
          </ol>
        </div>
        <div class="aside-block is-cyan reveal">
          <h2 class="label">¿Tienes logo o fotos?</h2>
          <p>El formulario no admite archivos: mándanoslos por WhatsApp o email después de enviarlo (PDF, AI, SVG o una foto nos sirve para empezar).</p>
          <a class="btn btn-block" href="${waHref("Hola, os envío el logo y las fotos para el presupuesto.")}" target="_blank" rel="noopener">${WHATSAPP_SVG} Enviar por WhatsApp</a>
        </div>
      </aside>
    </div>
  </section>`
  ].join("\n");

  write("presupuesto.html", page(0, {
    title: "Pedir presupuesto | Seriart — Rotulación, serigrafía y gran formato",
    description: "Solicita presupuesto sin compromiso a Seriart: rotulación de vehículos y negocios, vinilo, serigrafía o impresión de gran formato en Dénia, Alicante.",
    canonical: "presupuesto.html", current: "presupuesto", ogImage: CONTENT.about.homeImg
  }, body));
})();

/* ===========================================================================
   /gracias.html, 404, legal
   =========================================================================== */
(function buildGracias() {
  const body = `  <section class="status-page">
    ${livery("is-status")}
    <div class="wrap">
      <p class="label">Recibido</p>
      <h1 class="display" data-thanks-title>Mensaje <strong>enviado</strong></h1>
      <p data-thanks-text>Gracias por escribirnos. Te responderemos lo antes posible.</p>
      <div class="btn-row">
        <a class="btn" href="${rel(0, "trabajos.html")}">Ver trabajos</a>
        <a class="btn btn-line" href="${rel(0, "index.html")}">Volver al inicio</a>
      </div>
      <p class="status-note">¿Es urgente? Llámanos al <a href="tel:${BRAND.phoneHref}">${esc(BRAND.phoneDisplay)}</a> o escríbenos por <a href="${waHref()}" target="_blank" rel="noopener">WhatsApp</a>.</p>
    </div>
  </section>`;
  write("gracias.html", page(0, {
    title: "Mensaje enviado | Seriart", description: "Hemos recibido tu mensaje.",
    canonical: "gracias.html", noindex: true
  }, body));
})();

(function build404() {
  const body = `  <section class="status-page">
    ${livery("is-status")}
    <div class="wrap">
      <p class="label">Error 404</p>
      <h1 class="display">Esta página <strong>no existe</strong></h1>
      <p>Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <div class="btn-row">
        <a class="btn" href="${BRAND.siteUrl}/">Volver al inicio</a>
        <a class="btn btn-line" href="${BRAND.siteUrl}/trabajos.html">Ver trabajos</a>
      </div>
    </div>
  </section>`;
  /* 404 is served at any depth, so links in its body are absolute */
  write("404.html", page(0, {
    title: "Página no encontrada | Seriart", description: "La página que buscas no existe o se ha movido.",
    canonical: "404.html", noindex: true
  }, body).replace(/(href|src)="(?!https?:|mailto:|tel:|#|\/)([^"]+)"/g, (m, a, p) => `${a}="${BRAND.siteUrl}/${p}"`)
    .replace(/srcset="([^"]+)"/g, (m, set) => `srcset="${set.split(", ").map((s) => /^https?:/.test(s) ? s : BRAND.siteUrl + "/" + s).join(", ")}"`));
})();

(function buildLegal() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Legal" }];
  const body = [
    pageHero(0, { crumbs, label: "Legal", title: "Aviso legal, privacidad *y cookies*", lead: "Información sobre el uso de esta web y el tratamiento de tus datos.", cta: false }),
    `  <section class="section section-flush">
    <div class="wrap prose">
      <h2 id="aviso-legal">Aviso legal</h2>
      <p>Titular del sitio web: ${esc(BRAND.legalName || "Seriart")}${BRAND.taxId ? ", NIF/CIF " + esc(BRAND.taxId) : ""}. Domicilio: ${esc(BRAND.address)}. Email de contacto: ${esc(BRAND.email)}. Teléfono: ${esc(BRAND.phoneDisplay)}.</p>
      <p>Este sitio web tiene carácter informativo y comercial. El acceso y uso del mismo atribuye la condición de usuario e implica la aceptación de las condiciones aquí recogidas.</p>
      <p>Las fotografías de trabajos son de Seriart. Las marcas y logotipos que aparecen en ellas pertenecen a sus respectivos titulares y se muestran únicamente como parte del trabajo realizado.</p>

      <h2 id="privacidad">Política de privacidad</h2>
      <p><strong>Responsable:</strong> Seriart, ${esc(BRAND.address)}, ${esc(BRAND.email)}.</p>
      <p><strong>Finalidad:</strong> responder a tus consultas y solicitudes de presupuesto enviadas desde los formularios, y gestionar la relación comercial que pueda derivarse.</p>
      <p><strong>Legitimación:</strong> tu consentimiento al enviar el formulario y, en su caso, la aplicación de medidas precontractuales.</p>
      <p><strong>Destinatarios:</strong> los formularios se envían a través de Web3Forms, un servicio que transmite el mensaje a nuestro correo electrónico. No cedemos tus datos a terceros salvo obligación legal.</p>
      <p><strong>Conservación:</strong> mientras dure la relación comercial y durante los plazos legalmente exigidos.</p>
      <p><strong>Derechos:</strong> puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${esc(BRAND.email)}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>

      <h2 id="cookies">Política de cookies</h2>
      <p>Esta web no utiliza cookies propias de análisis ni de publicidad, por eso no te mostramos ningún aviso de cookies al entrar. Las tipografías se sirven desde la propia web.</p>
      <ul>
        <li><strong>Mapa de Google:</strong> en la página de contacto el mapa solo se carga si pulsas «Ver mapa aquí». En ese momento Google puede instalar sus propias cookies, sujetas a su política de privacidad.</li>
        <li><strong>WhatsApp, Instagram y enlaces externos:</strong> al abrirlos se aplican las políticas de esos servicios.</li>
      </ul>
      <p class="prose-note">Tipografías Archivo (Omnibus-Type) e IBM Plex Mono (IBM), bajo licencia SIL Open Font License.</p>
    </div>
  </section>`
  ].join("\n");
  write("legal.html", page(0, {
    title: "Aviso legal, privacidad y cookies | Seriart", description: "Aviso legal, política de privacidad y política de cookies de Seriart.",
    canonical: "legal.html"
  }, body));
})();

/* ===========================================================================
   sitemap.xml + robots.txt + runtime config
   =========================================================================== */
(function buildSeoFiles() {
  const pages = ["", "servicios.html", "trabajos.html", "nosotros.html", "contacto.html", "presupuesto.html", "legal.html"];
  Object.keys(CATEGORY_CONTENT).forEach((slug) => pages.push("servicios/" + slug + ".html"));
  ALL_SUBSERVICES.forEach((s) => pages.push(subHref(s)));
  const urlset = pages.map((p) => `  <url><loc>${BRAND.siteUrl}/${p}</loc><changefreq>monthly</changefreq></url>`).join("\n");
  write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`);
  write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${BRAND.siteUrl}/sitemap.xml\n`);
  G.writeRuntimeConfig();
})();

/* ===========================================================================
   Static files → _site/
   =========================================================================== */
(function copyStatic() {
  const copy = (from, to) => {
    const src = path.join(ROOT, from);
    if (!fs.existsSync(src)) return;
    fs.cpSync(src, path.join(OUT, to || from), { recursive: true });
  };
  ["styles.css", "main.js", ".htaccess", "CNAME", "assets/video",
    "assets/fonts/archivo-var.woff2", "assets/fonts/archivo-italic-var.woff2", "assets/fonts/plexmono-400.woff2",
    "assets/img/favicon.svg", "assets/img/logo-trim.png", "assets/img/logo-white.png"].forEach((f) => copy(f));
  /* Optimised WebP versions of every photo that still exists */
  Object.keys(G.IMG_MANIFEST).forEach((src) => {
    const m = G.IMG_MANIFEST[src];
    if (!fs.existsSync(path.join(ROOT, src))) return;
    m.widths.forEach((w) => copy(path.join(".cache", "img", m.base + "-" + w + ".webp"), "assets/opt/" + m.base + "-" + w + ".webp"));
  });
  /* Originals only when a page links to them directly (no optimised version yet) */
  G.usedOriginals.forEach((f) => copy(f));
})();

console.log("Done: " + (ALL_SUBSERVICES.length + Object.keys(CATEGORY_CONTENT).length + 9) + " páginas en _site/");
if (CONTENT.warnings.length) {
  console.log("\nAvisos del contenido (la web se ha generado igualmente):");
  CONTENT.warnings.forEach((w) => console.log("  - " + w));
}
