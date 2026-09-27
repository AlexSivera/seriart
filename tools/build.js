"use strict";
/* Builds the whole static site. Run with: node tools/build.js
   (run tools/optimize-images.js first whenever images change). */
const G = require("./generate-site.js");
const { CATEGORY_CONTENT, ALL_SUBSERVICES, CATEGORY_BENEFITS } = require("./content-data.js");
const { esc, rel, write, waHref, pic, imgLargest, svgIcon, WHATSAPP_SVG, page, pageHero, sectionHead, arrowLink,
  introBlock, benefitsRow, galleryBlock, processBlock, faqBlock, relatedBlock, contactCta, BRAND, CATEGORIES } = G;

console.log("Building Seriart static site...\n");

const subHref = (s) => s.cat.slug + "/" + s.slug + ".html";

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
  const siblings = ALL_SUBSERVICES.filter((s) => s.cat.slug === cat.slug && s.slug !== sub.slug)
    .map((s) => ({ label: s.label, href: subHref(s), img: s.heroImg }));
  const body = [
    pageHero(1, {
      crumbs, kicker: cat.label, title: esc(sub.title), lead: sub.lead, image: sub.heroImg, imageAlt: sub.label,
      cta: { href: rel(1, "presupuesto.html") + "?servicio=" + sub.slug, label: "Pedir presupuesto" },
      secondary: { href: rel(1, "trabajos.html"), label: "Ver trabajos" }
    }),
    introBlock(1, { heading: "Cómo lo hacemos", paragraphs: sub.intro, types: sub.types, listTitle: "Tipos de trabajo" }),
    benefitsRow(1, CATEGORY_BENEFITS[cat.slug]),
    galleryBlock(1, { heading: "Trabajos de " + sub.label.toLowerCase(), images: sub.gallery, group: sub.slug }),
    faqBlock(1, sub.faqs),
    relatedBlock(1, "Otros servicios de " + cat.label.toLowerCase(), siblings),
    contactCta(1, { title: "¿Hablamos de tu proyecto de " + sub.label.toLowerCase() + "?", service: sub.slug })
  ].join("\n");
  write(subHref(sub), page(1, {
    title: sub.metaTitle, description: sub.metaDescription, canonical: subHref(sub), current: "servicios",
    ogImage: sub.heroImg, preload: sub.heroImg, preloadSizes: "(min-width: 960px) 46vw, 100vw"
  }, body));
});

/* ===========================================================================
   Category overview pages (depth 1) — servicios/rotulacion.html etc.
   =========================================================================== */
Object.keys(CATEGORY_CONTENT).forEach(function (slug) {
  const cat = CATEGORY_CONTENT[slug];
  const subs = ALL_SUBSERVICES.filter((s) => s.cat.slug === slug);
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Servicios", href: "servicios.html" }, { label: cat.label }];
  const cards = subs.map((s) => `<a class="svc-card reveal" href="${rel(1, subHref(s))}">
        <span class="svc-card-media">${pic(1, s.heroImg, "", { sizes: "(min-width: 960px) 30vw, (min-width: 640px) 45vw, 100vw" })}</span>
        <span class="svc-card-body">
          <h3>${esc(s.label)}</h3>
          <span>${esc(s.lead)}</span>
          <span class="link-arrow">Ver servicio ${svgIcon("arrow", 18)}</span>
        </span>
      </a>`).join("");

  const body = [
    pageHero(1, {
      crumbs, kicker: "Servicios", title: esc(cat.title), lead: cat.lead, image: cat.heroImg, imageAlt: cat.label,
      cta: { href: rel(1, "presupuesto.html") + "?servicio=" + slug, label: "Pedir presupuesto" }
    }),
    `  <section class="section">
    <div class="container">
      ${sectionHead({ kicker: cat.label, title: "Elige lo que necesitas" })}
      <div class="svc-grid">${cards}</div>
    </div>
  </section>`,
    introBlock(1, { heading: "Un taller, todo el proceso", paragraphs: cat.intro, types: cat.types, kicker: "Cómo trabajamos", listTitle: "Lo que hacemos" }),
    benefitsRow(1, CATEGORY_BENEFITS[slug]),
    galleryBlock(1, { heading: "Algunos trabajos", images: cat.gallery, group: slug }),
    processBlock(1, { alt: true }),
    contactCta(1, { title: "Hablemos de tu proyecto de " + cat.label.toLowerCase(), service: slug })
  ].join("\n");

  write("servicios/" + slug + ".html", page(1, {
    title: cat.metaTitle, description: cat.metaDescription, canonical: "servicios/" + slug + ".html", current: "servicios",
    ogImage: cat.heroImg, preload: cat.heroImg, preloadSizes: "(min-width: 960px) 46vw, 100vw"
  }, body));
});

/* ===========================================================================
   /servicios.html (depth 0)
   =========================================================================== */
(function buildServicios() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Servicios" }];
  const rows = CATEGORIES.map(function (nav, i) {
    const cat = CATEGORY_CONTENT[nav.slug];
    const links = nav.items.map((it) => `<li><a href="${rel(0, it.href)}">${esc(it.label)} ${svgIcon("arrow", 16)}</a></li>`).join("");
    return `<article class="cat-row${i % 2 ? " is-flipped" : ""}">
        <a class="cat-row-media reveal-wipe" href="${rel(0, nav.overview)}" tabindex="-1" aria-hidden="true">${pic(0, cat.heroImg, "", { sizes: "(min-width: 960px) 50vw, 100vw" })}</a>
        <div class="cat-row-body reveal">
          <p class="kicker">0${i + 1}</p>
          <h2><a href="${rel(0, nav.overview)}">${esc(nav.label)}</a></h2>
          <p>${esc(cat.lead)}</p>
          <ul class="cat-links">${links}</ul>
          ${arrowLink(rel(0, nav.overview), "Ver " + nav.label.toLowerCase())}
        </div>
      </article>`;
  }).join("");

  const body = [
    pageHero(0, {
      crumbs, kicker: "Servicios", title: "Rotulación, vinilo, serigrafía y gran formato",
      lead: "Todo lo que tu marca necesita para verse, diseñado, fabricado e instalado desde nuestro taller de Dénia."
    }),
    `  <section class="section">
    <div class="container cat-rows">${rows}</div>
  </section>`,
    processBlock(0, { alt: true }),
    contactCta(0, { title: "¿No sabes exactamente qué necesitas?", text: "Cuéntanos la idea tal cual la tienes en la cabeza y te orientamos sobre materiales, tamaños y presupuesto." })
  ].join("\n");

  write("servicios.html", page(0, {
    title: "Servicios | Rotulación, vinilo, serigrafía y gran formato en Dénia — Seriart",
    description: "Rotulación de vehículos y negocios, vinilo, serigrafía textil, ropa laboral e impresión de gran formato en Dénia, Alicante. Un solo taller para todo tu proyecto.",
    canonical: "servicios.html", current: "servicios", ogImage: "hero-vehicle-wrap.jpg"
  }, body));
})();

/* ===========================================================================
   Home (depth 0)
   =========================================================================== */
(function buildHome() {
  const video = BRAND.heroVideo;
  const hasVideo = Boolean(video.src);

  const hero = `  <section class="hero${hasVideo ? " has-video" : ""}">
    <div class="hero-media">
      ${pic(0, video.poster, "Rotulación de un vehículo comercial", { eager: true, sizes: "100vw", cls: "hero-poster" })}
      ${hasVideo ? `<video class="hero-video" data-hero-video muted loop playsinline preload="none" aria-hidden="true">
        <source src="${rel(0, video.src)}" type="${/\.webm$/i.test(video.src) ? "video/webm" : "video/mp4"}">
      </video>` : ""}
      <div class="hero-shade" aria-hidden="true"></div>
    </div>
    <div class="container hero-inner">
      <div class="hero-copy">
        <p class="hero-kicker">Dénia · Alicante — desde ${BRAND.founded}</p>
        <h1 class="hero-title"><span class="hero-line">Rotulación y vinilo</span> <span class="hero-line">profesional <span class="hero-mark">en Dénia</span></span></h1>
        <p class="hero-lead">Vehículos, fachadas, escaparates, ropa laboral y gran formato. Diseñamos, fabricamos e instalamos desde nuestro propio taller.</p>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="${rel(0, "presupuesto.html")}">Pedir presupuesto</a>
          <a class="btn btn-light btn-lg" href="${rel(0, "trabajos.html")}">Ver trabajos</a>
        </div>
      </div>
      ${hasVideo ? `<div class="hero-video-ui">
        <button class="hero-video-toggle" type="button" data-hero-video-toggle aria-label="Pausar vídeo">
          <span class="i-pause">${svgIcon("pause", 18)}</span><span class="i-play">${svgIcon("play", 18)}</span>
        </button>
        <span>${esc(video.caption)}</span>
      </div>` : ""}
    </div>
    <div class="hero-facts">
      <ul class="container">
        <li><strong>Desde ${BRAND.founded}</strong><span>más de 20 años en Dénia</span></li>
        <li><strong>Taller propio</strong><span>sin intermediarios</span></li>
        <li><strong>Instalación incluida</strong><span>vehículo, fachada o local</span></li>
        <li><strong>Toda España</strong><span>envíos e instalaciones</span></li>
      </ul>
    </div>
  </section>`;

  const tiles = [
    { label: "Rotulación de vehículos", desc: "Furgonetas, coches y flotas. Integral o parcial, con vinilo de calidad profesional.", href: "rotulacion/vehiculos.html", img: "hero-vehicle-wrap.jpg", size: "xl" },
    { label: "Rótulos y fachadas", desc: "Rótulos, banderolas y cajones luminosos.", href: "rotulacion/rotulos-negocios.html", img: "shop-storefront.jpg", size: "wide" },
    { label: "Escaparates y vinilo", href: "rotulacion/escaparates.html", img: "shop-window-vinyl.jpg", size: "sm" },
    { label: "Letras corpóreas", href: "rotulacion/letras-corporeas.html", img: "channel-letters.jpg", size: "sm" },
    { label: "Serigrafía y ropa laboral", desc: "Camisetas, uniformes y merchandising.", href: "servicios/serigrafia.html", img: "workwear.jpeg", size: "wide" },
    { label: "Gran formato", desc: "Lonas, banners, roll-ups y cartelería.", href: "servicios/gran-formato.html", img: "large-format-banner.jpg", size: "wide" }
  ].map((t) => `<a class="tile tile-${t.size} reveal-wipe" href="${rel(0, t.href)}">
        ${pic(0, t.img, "", { sizes: t.size === "xl" ? "(min-width: 960px) 50vw, 100vw" : t.size === "wide" ? "(min-width: 960px) 50vw, 100vw" : "(min-width: 960px) 25vw, 50vw" })}
        <span class="tile-body">
          <strong>${esc(t.label)}</strong>
          ${t.desc ? `<span>${esc(t.desc)}</span>` : ""}
        </span>
        <span class="tile-arrow">${svgIcon("arrow", 20)}</span>
      </a>`).join("");

  const works = [
    { src: "hero-vehicle-wrap.jpg", title: "Rotulación integral de camión de reparto", tag: "Vehículos" },
    { src: "shop-storefront.jpg", title: "Rótulo de fachada para comercio", tag: "Fachadas" },
    { src: "workwear.jpeg", title: "Ropa laboral con logotipo", tag: "Serigrafía" },
    { src: "channel-letters.jpg", title: "Letras corpóreas iluminadas", tag: "Letras corpóreas" },
    { src: "outdoor-banner.jpg", title: "Pancarta para exterior", tag: "Gran formato" }
  ].map((w, i) => `<a class="work${i === 0 ? " work-lead" : ""} reveal" href="${imgLargest(0, w.src)}" data-lightbox-item="home" data-caption="${esc(w.title)}">
        <span class="work-media">${pic(0, w.src, w.title, { sizes: i === 0 ? "(min-width: 960px) 58vw, 100vw" : "(min-width: 960px) 20vw, 50vw" })}</span>
        <span class="work-meta"><span class="tag">${esc(w.tag)}</span><strong>${esc(w.title)}</strong></span>
      </a>`).join("");

  const sectors = ["Hostelería", "Comercio", "Construcción", "Transporte y reparto", "Eventos", "Clubes y asociaciones", "Administración"];

  const body = [
    hero,
    `  <section class="section">
    <div class="container">
      ${sectionHead({ kicker: "Qué hacemos", title: "Todo lo que tu marca necesita para verse", text: "Del vinilo de una furgoneta a la lona de una fachada: lo diseñamos, lo fabricamos y lo instalamos nosotros.", split: true })}
      <div class="bento">${tiles}</div>
      <div class="section-foot">${arrowLink(rel(0, "servicios.html"), "Ver todos los servicios")}</div>
    </div>
  </section>`,
    processBlock(0, { alt: true }),
    `  <section class="section">
    <div class="container">
      ${sectionHead({ kicker: "Trabajos", title: "Recién salido del taller", link: arrowLink(rel(0, "trabajos.html"), "Ver todos los trabajos", "section-head-link") })}
      <div class="works">${works}</div>
    </div>
  </section>`,
    `  <section class="section section-alt">
    <div class="container about-split">
      <div class="about-media reveal-wipe">${pic(0, "workshop-machine.jpg", "Taller de Seriart en Dénia", { sizes: "(min-width: 960px) 50vw, 100vw" })}</div>
      <div class="about-copy reveal">
        <p class="kicker">El taller</p>
        <h2>Un taller de Dénia con más de 20 años de oficio</h2>
        <p>Desde ${BRAND.founded} ayudamos a empresas, comercios y particulares a mejorar su imagen. Un mismo equipo controla cada encargo, del diseño a la instalación, así que siempre sabes con quién hablar.</p>
        <ul class="checklist is-compact">
          <li>${svgIcon("check", 20)}<div><strong>Diseño, fabricación e instalación</strong></div></li>
          <li>${svgIcon("check", 20)}<div><strong>Materiales profesionales para exterior</strong></div></li>
          <li>${svgIcon("check", 20)}<div><strong>Tiradas cortas y pedidos grandes</strong></div></li>
        </ul>
        <p class="sectors"><span>Trabajamos para</span> ${sectors.map(esc).join(" · ")}</p>
        ${arrowLink(rel(0, "nosotros.html"), "Conocer el taller")}
      </div>
    </div>
  </section>`,
    contactCta(0)
  ].join("\n");

  write("index.html", page(0, {
    title: "Seriart | Rotulación, vinilo y serigrafía en Dénia, Alicante",
    description: "Rotulación de vehículos y negocios, vinilo, serigrafía textil y gran formato en Dénia, Alicante. Diseño, fabricación e instalación desde 2002.",
    canonical: "", current: "inicio", overHero: true, bodyClass: "is-home",
    ogImage: "hero-vehicle-wrap.jpg", preload: video.poster, preloadSizes: "100vw"
  }, body));
})();

/* ===========================================================================
   /trabajos.html (depth 0)
   =========================================================================== */
(function buildTrabajos() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Trabajos" }];
  /* Replace with real projects: title, tag (visible label) and filter keys. */
  const items = [
    { src: "hero-vehicle-wrap.jpg", title: "Rotulación integral de camión de reparto", tag: "Vehículos", cats: ["vehiculos"] },
    { src: "car-wrap-detail.jpg", title: "Vinilo de color en turismo", tag: "Vehículos", cats: ["vehiculos"] },
    { src: "van-signage.jpg", title: "Rotulación parcial con logotipo", tag: "Vehículos", cats: ["vehiculos"] },
    { src: "shop-storefront.jpg", title: "Rótulo de fachada para comercio", tag: "Fachadas", cats: ["fachadas"] },
    { src: "channel-letters.jpg", title: "Letras corpóreas iluminadas", tag: "Letras corpóreas", cats: ["fachadas"] },
    { src: "shop-window-vinyl.jpg", title: "Vinilo decorativo en escaparate", tag: "Escaparates", cats: ["escaparates"] },
    { src: "tshirt-stack.jpg", title: "Camisetas serigrafiadas para evento", tag: "Serigrafía", cats: ["serigrafia"] },
    { src: "workwear.jpeg", title: "Ropa laboral con logotipo", tag: "Ropa laboral", cats: ["serigrafia"] },
    { src: "screen-printing-process.jpg", title: "Estampación textil a una tinta", tag: "Serigrafía", cats: ["serigrafia"] },
    { src: "merch-items.jpg", title: "Merchandising personalizado", tag: "Merchandising", cats: ["serigrafia"] },
    { src: "large-format-banner.jpg", title: "Lona publicitaria de gran formato", tag: "Gran formato", cats: ["gran-formato"] },
    { src: "outdoor-banner.jpg", title: "Pancarta para exterior", tag: "Gran formato", cats: ["gran-formato"] }
  ];
  const grid = items.map((it) => `<a class="work reveal" href="${imgLargest(0, it.src)}" data-lightbox-item="trabajos" data-caption="${esc(it.title)}" data-filter-item="${it.cats.join(" ")}">
        <span class="work-media">${pic(0, it.src, it.title, { sizes: "(min-width: 960px) 30vw, (min-width: 640px) 45vw, 100vw" })}</span>
        <span class="work-meta"><span class="tag">${esc(it.tag)}</span><strong>${esc(it.title)}</strong></span>
      </a>`).join("");

  const filters = [
    { key: "all", label: "Todos" },
    { key: "vehiculos", label: "Vehículos" },
    { key: "fachadas", label: "Fachadas y letras" },
    { key: "escaparates", label: "Escaparates y vinilo" },
    { key: "serigrafia", label: "Serigrafía" },
    { key: "gran-formato", label: "Gran formato" }
  ].map((f, i) => `<button class="chip${i === 0 ? " is-active" : ""}" type="button" data-filter="${f.key}" aria-pressed="${i === 0}">${esc(f.label)}</button>`).join("");

  const body = [
    pageHero(0, {
      crumbs, kicker: "Trabajos", title: "Trabajos realizados",
      lead: "Una muestra de lo que sale de nuestro taller: vehículos, fachadas, escaparates, textil y gran formato para clientes de Dénia y de toda España."
    }),
    `  <section class="section">
    <div class="container">
      <div class="filter-bar" data-filter-bar role="group" aria-label="Filtrar trabajos por tipo">${filters}</div>
      <div class="works-grid" data-filter-grid>${grid}</div>
      <p class="filter-empty" data-filter-empty hidden>Todavía no hay trabajos publicados en esta categoría.</p>
    </div>
  </section>`,
    contactCta(0, { title: "¿Quieres un resultado así?", text: "Cuéntanos tu proyecto y te decimos cómo lo haríamos y cuánto costaría." })
  ].join("\n");

  write("trabajos.html", page(0, {
    title: "Trabajos realizados | Rotulación y serigrafía — Seriart Dénia",
    description: "Trabajos de rotulación de vehículos, fachadas, escaparates, serigrafía textil y gran formato realizados por Seriart en Dénia, Alicante.",
    canonical: "trabajos.html", current: "trabajos", ogImage: "car-wrap-detail.jpg"
  }, body));
})();

/* ===========================================================================
   /nosotros.html (depth 0)
   =========================================================================== */
(function buildNosotros() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Nosotros" }];
  const areas = [
    { title: "Diseño y preparación", desc: "Adaptamos tu logotipo o diseñamos desde cero, medimos el soporte y preparamos los archivos para producción.", img: "screen-printing-process.jpg" },
    { title: "Producción en taller", desc: "Impresión, corte de vinilo, serigrafía y montaje, con control de calidad antes de que nada salga por la puerta.", img: "workshop-machine.jpg" },
    { title: "Instalación", desc: "Aplicamos el vinilo en vehículos y cristales, y montamos rótulos y lonas en fachadas, en Dénia y alrededores.", img: "van-signage.jpg" }
  ].map((a) => `<article class="area reveal">
        <div class="area-media">${pic(0, a.img, "", { sizes: "(min-width: 960px) 30vw, 100vw" })}</div>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.desc)}</p>
      </article>`).join("");

  const workshop = ["workshop-machine.jpg", "shop-storefront.jpg", "about-team.jpg", "channel-letters.jpg"].map((im) =>
    `<a class="gallery-item reveal-wipe" href="${imgLargest(0, im)}" data-lightbox-item="taller" data-caption="El taller de Seriart en Dénia">${pic(0, im, "El taller de Seriart en Dénia", { sizes: "(min-width: 960px) 25vw, 50vw" })}</a>`).join("");

  const body = [
    pageHero(0, {
      crumbs, kicker: "Nosotros", title: "Un taller de Dénia con más de 20 años de oficio",
      lead: "Desde 2002 ayudamos a empresas, comercios y particulares a mejorar su imagen con rotulación, vinilo, serigrafía e impresión de gran formato.",
      image: "about-team.jpg", imageAlt: "Equipo de Seriart preparando un proyecto"
    }),
    `  <section class="section">
    <div class="container story">
      <div class="story-copy reveal">
        <p class="kicker">Nuestra historia</p>
        <h2>Empezamos con la serigrafía. Hoy rotulamos de todo.</h2>
        <p>Seriart nació en Dénia en ${BRAND.founded} como taller de serigrafía textil. Con los años, los mismos clientes que nos pedían camisetas empezaron a pedirnos el rótulo de la tienda, el vinilo de la furgoneta o la lona para el próximo evento, y el taller creció para darles respuesta.</p>
        <p>Hoy seguimos en Dénia, con un equipo especializado y colaboradores externos cuando el proyecto lo pide, trabajando para clientes de toda España. Lo que no ha cambiado es la forma de trabajar: un mismo taller que se encarga de todo, de principio a fin.</p>
      </div>
      <dl class="story-facts reveal">
        <div><dt>${BRAND.founded}</dt><dd>Año en que abrimos el taller en Dénia</dd></div>
        <div><dt>12</dt><dd>Servicios de rotulación, serigrafía y gran formato</dd></div>
        <div><dt>1</dt><dd>Único interlocutor para todo tu proyecto</dd></div>
      </dl>
    </div>
  </section>`,
    `  <section class="section section-alt">
    <div class="container">
      ${sectionHead({ kicker: "Cómo nos organizamos", title: "Tres áreas, un mismo equipo" })}
      <div class="areas">${areas}</div>
    </div>
  </section>`,
    `  <section class="section">
    <div class="container">
      ${sectionHead({ kicker: "El taller", title: "Nuestro espacio de trabajo", text: "Impresión textil, corte de vinilo e impresión de gran formato bajo el mismo techo: así controlamos cada fase sin depender de terceros." })}
      <div class="gallery-grid is-four">${workshop}</div>
    </div>
  </section>`,
    contactCta(0, { title: "Pásate por el taller", text: "Estamos en " + BRAND.street + ", " + BRAND.city + ". " + BRAND.hours + " (" + BRAND.hoursNote.toLowerCase() + "). O escríbenos y hablamos de tu proyecto." })
  ].join("\n");

  write("nosotros.html", page(0, {
    title: "Nosotros | Taller de rotulación y serigrafía en Dénia — Seriart",
    description: "Seriart es un taller de rotulación, vinilo, serigrafía e impresión de gran formato en Dénia, Alicante, con más de 20 años de experiencia.",
    canonical: "nosotros.html", current: "nosotros", ogImage: "about-team.jpg",
    preload: "about-team.jpg", preloadSizes: "(min-width: 960px) 46vw, 100vw"
  }, body));
})();

/* ===========================================================================
   /contacto.html (depth 0)
   =========================================================================== */
(function buildContacto() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Contacto" }];
  const mapsLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(BRAND.address);
  const mapEmbed = "https://www.google.com/maps?q=" + encodeURIComponent(BRAND.address) + "&output=embed";
  const body = [
    pageHero(0, {
      crumbs, kicker: "Contacto", title: "Hablemos de tu proyecto",
      lead: "Llámanos, escríbenos por WhatsApp o pásate por el taller. Si ya sabes lo que necesitas, pide presupuesto directamente.",
      cta: { href: rel(0, "presupuesto.html"), label: "Pedir presupuesto" }
    }),
    `  <section class="section">
    <div class="container contact-grid">
      <div class="contact-methods">
        <a class="method reveal" href="${waHref()}" target="_blank" rel="noopener">
          <span class="method-icon is-wa">${WHATSAPP_SVG}</span>
          <span><strong>WhatsApp</strong><span>${esc(BRAND.whatsappDisplay)} · la forma más rápida</span></span>${svgIcon("arrow", 18)}
        </a>
        <a class="method reveal" href="tel:${BRAND.phoneHref}">
          <span class="method-icon">${svgIcon("phone", 22)}</span>
          <span><strong>Teléfono</strong><span>${esc(BRAND.phoneDisplay)}</span></span>${svgIcon("arrow", 18)}
        </a>
        <a class="method reveal" href="mailto:${BRAND.email}">
          <span class="method-icon">${svgIcon("mail", 22)}</span>
          <span><strong>Email</strong><span>${esc(BRAND.email)}</span></span>${svgIcon("arrow", 18)}
        </a>
        <div class="method is-static reveal">
          <span class="method-icon">${svgIcon("pin", 22)}</span>
          <span><strong>Taller</strong><span>${esc(BRAND.address)}</span></span>
        </div>
        <div class="method is-static reveal">
          <span class="method-icon">${svgIcon("clock", 22)}</span>
          <span><strong>Horario</strong><span>${esc(BRAND.hours)}. ${esc(BRAND.hoursNote)}.</span></span>
        </div>
      </div>
      <div class="form-card reveal">
        <h2>Escríbenos</h2>
        <p class="form-intro">Para un presupuesto detallado, mejor usa el <a href="${rel(0, "presupuesto.html")}">formulario de presupuesto</a>.</p>
        <form class="form" data-form data-form-kind="contacto" data-thanks="gracias.html" action="https://api.web3forms.com/submit" method="POST" novalidate>
          ${formHidden("Nuevo mensaje desde la web (contacto)")}
          <div class="form-row">
            <div class="field"><label for="c-nombre">Nombre</label><input id="c-nombre" name="Nombre" type="text" autocomplete="name" required></div>
            <div class="field"><label for="c-telefono">Teléfono <span class="opt">(opcional)</span></label><input id="c-telefono" name="Teléfono" type="tel" autocomplete="tel"></div>
          </div>
          <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="c-mensaje">Mensaje</label><textarea id="c-mensaje" name="Mensaje" rows="5" required></textarea></div>
          ${privacyCheck(0, "c-privacidad")}
          <button class="btn btn-primary btn-block btn-lg" type="submit" data-submit>Enviar mensaje</button>
          ${formStatus()}
        </form>
      </div>
    </div>
  </section>`,
    `  <section class="section section-alt">
    <div class="container">
      ${sectionHead({ kicker: "Cómo llegar", title: "El taller, en el centro de Dénia", text: BRAND.address })}
      <div class="map-facade reveal" data-map data-map-src="${esc(mapEmbed)}">
        <div class="map-facade-inner">
          <span class="map-pin">${svgIcon("pin", 28)}</span>
          <p><strong>${esc(BRAND.street)}</strong><br>${esc(BRAND.postalCode)} ${esc(BRAND.city)} (${esc(BRAND.province)})</p>
          <div class="map-actions">
            <button class="btn btn-primary" type="button" data-map-load>Ver mapa aquí</button>
            <a class="btn btn-outline" href="${mapsLink}" target="_blank" rel="noopener">Abrir en Google Maps</a>
          </div>
          <p class="map-note">Al cargar el mapa, Google puede instalar cookies propias.</p>
        </div>
      </div>
    </div>
  </section>`
  ].join("\n");

  write("contacto.html", page(0, {
    title: "Contacto | Seriart — Taller de rotulación en Dénia, Alicante",
    description: "Contacta con Seriart: taller en Ronda de les Muralles 20, Dénia (Alicante). Teléfono, WhatsApp, email y horario.",
    canonical: "contacto.html", current: "contacto", ogImage: "workshop-machine.jpg"
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
      crumbs, kicker: "Presupuesto", title: "Pide presupuesto sin compromiso",
      lead: "Cuéntanos qué necesitas. Cuantos más detalles nos des (medidas, cantidad, fecha), más ajustado será el presupuesto.",
      cta: false
    }),
    `  <section class="section">
    <div class="container quote-grid">
      <div class="form-card reveal">
        <form class="form" data-form data-form-kind="presupuesto" data-thanks="gracias.html" action="https://api.web3forms.com/submit" method="POST" novalidate>
          ${formHidden("Nueva solicitud de presupuesto desde la web")}
          <fieldset>
            <legend><span>1</span> Tus datos</legend>
            <div class="form-row">
              <div class="field"><label for="p-nombre">Nombre</label><input id="p-nombre" name="Nombre" type="text" autocomplete="name" required></div>
              <div class="field"><label for="p-empresa">Empresa <span class="opt">(opcional)</span></label><input id="p-empresa" name="Empresa" type="text" autocomplete="organization"></div>
            </div>
            <div class="form-row">
              <div class="field"><label for="p-email">Email</label><input id="p-email" name="email" type="email" autocomplete="email" required></div>
              <div class="field"><label for="p-telefono">Teléfono</label><input id="p-telefono" name="Teléfono" type="tel" autocomplete="tel" required></div>
            </div>
          </fieldset>
          <fieldset>
            <legend><span>2</span> Tu proyecto</legend>
            <div class="field">
              <label for="p-servicio">¿Qué necesitas?</label>
              <select id="p-servicio" name="Servicio" required data-service-select>
                <option value="">Elige un servicio</option>
                ${groups}
                <option value="No lo tengo claro" data-slug="otro">No lo tengo claro / varios servicios</option>
              </select>
            </div>
            <div class="field"><label for="p-descripcion">Descríbelo</label><textarea id="p-descripcion" name="Descripción" rows="5" placeholder="Por ejemplo: rotular los laterales y la puerta trasera de una Renault Kangoo con nuestro logo y teléfono." required></textarea></div>
            <div class="form-row is-three">
              <div class="field"><label for="p-cantidad">Cantidad <span class="opt">(opcional)</span></label><input id="p-cantidad" name="Cantidad" type="text" placeholder="50 camisetas, 2 furgonetas…"></div>
              <div class="field"><label for="p-medidas">Medidas <span class="opt">(opcional)</span></label><input id="p-medidas" name="Medidas" type="text" placeholder="3 × 2 m…"></div>
              <div class="field"><label for="p-fecha">Lo necesito para <span class="opt">(opcional)</span></label><input id="p-fecha" name="Fecha" type="date"></div>
            </div>
            <div class="field">
              <span class="label">¿Cómo prefieres que te contestemos?</span>
              <div class="radio-row">
                <label class="radio"><input type="radio" name="Contactar por" value="Email" checked> Email</label>
                <label class="radio"><input type="radio" name="Contactar por" value="Teléfono"> Teléfono</label>
                <label class="radio"><input type="radio" name="Contactar por" value="WhatsApp"> WhatsApp</label>
              </div>
            </div>
          </fieldset>
          ${privacyCheck(0, "p-privacidad")}
          <button class="btn btn-primary btn-block btn-lg" type="submit" data-submit>Enviar solicitud</button>
          ${formStatus()}
        </form>
      </div>
      <aside class="quote-aside">
        <div class="aside-card reveal">
          <h2>Qué pasa después</h2>
          <ol class="mini-steps">
            <li><strong>Revisamos tu solicitud</strong><span>Si nos falta algún dato, te llamamos o escribimos.</span></li>
            <li><strong>Te enviamos el presupuesto</strong><span>Claro y detallado, sin compromiso.</span></li>
            <li><strong>Diseño y prueba</strong><span>Si sigues adelante, preparamos una prueba antes de producir.</span></li>
          </ol>
        </div>
        <div class="aside-card reveal">
          <h2>¿Tienes logo o diseño?</h2>
          <p>Envíanoslo por WhatsApp o email después de mandar el formulario (PDF, AI, SVG o una foto nos sirve para empezar).</p>
          <a class="btn btn-outline btn-block" href="${waHref("Hola, os envío el logo/diseño para el presupuesto.")}" target="_blank" rel="noopener">${WHATSAPP_SVG} Enviar por WhatsApp</a>
        </div>
      </aside>
    </div>
  </section>`
  ].join("\n");

  write("presupuesto.html", page(0, {
    title: "Pedir presupuesto | Seriart — Rotulación, serigrafía y gran formato",
    description: "Solicita presupuesto sin compromiso a Seriart: rotulación de vehículos y negocios, vinilo, serigrafía o impresión de gran formato en Dénia, Alicante.",
    canonical: "presupuesto.html", current: "presupuesto", ogImage: "workshop-machine.jpg"
  }, body));
})();

/* ===========================================================================
   /gracias.html, 404, legal, créditos
   =========================================================================== */
(function buildGracias() {
  const body = `  <section class="status-page">
    <div class="container">
      <span class="status-icon">${svgIcon("check", 34)}</span>
      <h1 data-thanks-title>Mensaje enviado</h1>
      <p data-thanks-text>Gracias por escribirnos. Te responderemos lo antes posible.</p>
      <div class="status-actions">
        <a class="btn btn-primary" href="${rel(0, "trabajos.html")}">Ver trabajos</a>
        <a class="btn btn-outline" href="${rel(0, "index.html")}">Volver al inicio</a>
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
    <div class="container">
      <p class="status-code">404</p>
      <h1>Esta página no existe</h1>
      <p>Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <div class="status-actions">
        <a class="btn btn-primary" href="${rel(0, "index.html")}">Volver al inicio</a>
        <a class="btn btn-outline" href="${rel(0, "servicios.html")}">Ver servicios</a>
      </div>
    </div>
  </section>`;
  write("404.html", page(0, {
    title: "Página no encontrada | Seriart", description: "La página que buscas no existe o se ha movido.",
    canonical: "404.html", noindex: true
  }, body));
})();

(function buildLegal() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Legal" }];
  const body = [
    pageHero(0, { crumbs, kicker: "Legal", title: "Aviso legal, privacidad y cookies", lead: "Información sobre el uso de esta web y el tratamiento de tus datos.", cta: false }),
    `  <section class="section">
    <div class="container prose">
      <h2 id="aviso-legal">Aviso legal</h2>
      <p>Titular del sitio web: Seriart — [Nombre fiscal y NIF/CIF pendientes de completar]. Domicilio: ${esc(BRAND.address)}. Email de contacto: ${esc(BRAND.email)}. Teléfono: ${esc(BRAND.phoneDisplay)}.</p>
      <p>Este sitio web tiene carácter informativo y comercial. El acceso y uso del mismo atribuye la condición de usuario e implica la aceptación de las condiciones aquí recogidas.</p>

      <h2 id="privacidad">Política de privacidad</h2>
      <p><strong>Responsable:</strong> Seriart, ${esc(BRAND.address)}, ${esc(BRAND.email)}.</p>
      <p><strong>Finalidad:</strong> responder a tus consultas y solicitudes de presupuesto enviadas desde los formularios, y gestionar la relación comercial que pueda derivarse.</p>
      <p><strong>Legitimación:</strong> tu consentimiento al enviar el formulario y, en su caso, la aplicación de medidas precontractuales.</p>
      <p><strong>Destinatarios:</strong> los formularios se envían a través de Web3Forms, un servicio que transmite el mensaje a nuestro correo electrónico. No cedemos tus datos a terceros salvo obligación legal.</p>
      <p><strong>Conservación:</strong> mientras dure la relación comercial y durante los plazos legalmente exigidos.</p>
      <p><strong>Derechos:</strong> puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${esc(BRAND.email)}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>

      <h2 id="cookies">Política de cookies</h2>
      <p>Esta web no utiliza cookies propias de análisis ni de publicidad, por eso no te mostramos ningún aviso de cookies al entrar.</p>
      <ul>
        <li><strong>Mapa de Google:</strong> en la página de contacto el mapa solo se carga si pulsas «Ver mapa aquí». En ese momento Google puede instalar sus propias cookies, sujetas a su política de privacidad.</li>
        <li><strong>WhatsApp y enlaces externos:</strong> al abrir WhatsApp, Google Maps u otros sitios externos se aplican las políticas de esos servicios.</li>
      </ul>
    </div>
  </section>`
  ].join("\n");
  write("legal.html", page(0, {
    title: "Aviso legal, privacidad y cookies | Seriart", description: "Aviso legal, política de privacidad y política de cookies de Seriart.",
    canonical: "legal.html"
  }, body));
})();

(function buildCreditos() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Créditos" }];
  const body = [
    pageHero(0, { crumbs, kicker: "Créditos", title: "Créditos fotográficos", lead: "Mientras incorporamos fotografía real del taller y de nuestros proyectos, esta web usa imágenes de archivo bajo licencia Creative Commons.", cta: false }),
    `  <section class="section">
    <div class="container prose">
      <p>Imágenes bajo licencias Creative Commons vía <a href="https://openverse.org" target="_blank" rel="noopener">Openverse</a>. Tipografía Barlow, de Jeremy Tribby, bajo licencia SIL Open Font License.</p>
      <ul class="credits-list" data-credits data-credits-base="${rel(0, "assets/credits.json")}"><li>Cargando créditos…</li></ul>
    </div>
  </section>`
  ].join("\n");
  write("creditos.html", page(0, {
    title: "Créditos fotográficos | Seriart", description: "Créditos y licencias de las imágenes de archivo utilizadas en la web de Seriart.",
    canonical: "creditos.html", noindex: true
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

console.log("\nDone: " + (ALL_SUBSERVICES.length + Object.keys(CATEGORY_CONTENT).length + 10) + " HTML pages + sitemap.xml + robots.txt");
