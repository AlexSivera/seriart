"use strict";
const G = require("./generate-site.js");
const { CATEGORY_CONTENT, ALL_SUBSERVICES, CATEGORY_BENEFITS } = require("./content-data.js");
const { esc, rel, write, page, pageHero, introBlock, typesGrid, featureGrid, galleryBlock,
  processBlock, faqBlock, ctaBand, breadcrumb, svgIcon, CATEGORIES, BRAND, V } = G;

console.log("Building Seriart static site...\n");

/* ===========================================================================
   Subservice pages  (depth 1)
   =========================================================================== */
ALL_SUBSERVICES.forEach(function (sub) {
  const cat = sub.cat;
  const crumbs = [
    { label: "Inicio", href: "index.html" },
    { label: "Servicios", href: "servicios.html" },
    { label: cat.label, href: "servicios/" + cat.slug + ".html" },
    { label: sub.label }
  ];
  const body = [
    pageHero(1, { kicker: sub.kicker, title: sub.title, lead: sub.lead, crumbs: crumbs, service: sub.slug }),
    introBlock(1, { heading: sub.title, paragraphs: sub.intro, image: sub.heroImg, imageAlt: sub.label, eyebrow: "En qué consiste" }),
    typesGrid(1, { heading: "Tipos de trabajo", items: sub.types }),
    featureGrid(1, { heading: "Por qué elegir Seriart", items: CATEGORY_BENEFITS[cat.slug] }),
    galleryBlock(1, { heading: sub.label, images: sub.gallery }),
    processBlock(1),
    faqBlock(1, sub.faqs),
    ctaBand(1, { title: "¿Empezamos con tu proyecto de " + sub.label.toLowerCase() + "?", text: "Cuéntanos qué necesitas y te enviamos un presupuesto sin compromiso.", service: sub.slug })
  ].join("\n");
  write(cat.slug + "/" + sub.slug + ".html", page(1, {
    title: sub.metaTitle, description: sub.metaDescription, canonical: cat.slug + "/" + sub.slug + ".html",
    ogImage: sub.heroImg, heroPreload: sub.heroImg
  }, body));
});

/* ===========================================================================
   Category overview pages  (depth 1) — servicios/serigrafia.html etc.
   =========================================================================== */
Object.keys(CATEGORY_CONTENT).forEach(function (slug) {
  const cat = CATEGORY_CONTENT[slug];
  const subs = ALL_SUBSERVICES.filter(function (s) { return s.cat.slug === slug; });
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Servicios", href: "servicios.html" }, { label: cat.label }];

  const cards = subs.map(function (s) {
    return `<div class="service-card reveal" data-tilt>
      <div class="service-card-media"><img src="${rel(1, "assets/img/" + s.heroImg)}" alt="${esc(s.label)}" loading="lazy" decoding="async"></div>
      <div class="service-card-body">
        <h3>${esc(s.label)}</h3>
        <p>${esc(s.lead)}</p>
        <a class="btn-ghost" href="${rel(1, cat.slug + "/" + s.slug + ".html")}">Ver servicio</a>
      </div>
    </div>`;
  }).join("");

  const body = [
    pageHero(1, { kicker: cat.kicker, title: cat.title, lead: cat.lead, crumbs: crumbs }),
    `  <section class="section">
    <div class="container">
      <div class="section-head"><p class="eyebrow">Servicios</p><h2>Elige el tipo de ${esc(cat.label.toLowerCase())} que necesitas</h2></div>
      <div class="services-grid">${cards}</div>
    </div>
  </section>`,
    introBlock(1, { heading: "Un taller, todo el proceso", paragraphs: cat.intro, image: cat.heroImg, imageAlt: cat.label, eyebrow: "Cómo trabajamos" }),
    featureGrid(1, { heading: "Por qué elegir Seriart", items: CATEGORY_BENEFITS[slug] }),
    galleryBlock(1, { heading: cat.label, images: cat.gallery }),
    processBlock(1),
    ctaBand(1, { title: "Hablemos de tu proyecto de " + cat.label.toLowerCase(), text: "Escríbenos con los detalles y te respondemos con un presupuesto claro.", service: cat.slug })
  ].join("\n");

  write("servicios/" + slug + ".html", page(1, {
    title: cat.metaTitle, description: cat.metaDescription, canonical: "servicios/" + slug + ".html",
    ogImage: cat.heroImg, heroPreload: cat.heroImg
  }, body));
});

/* ===========================================================================
   /servicios.html — overview of all 3 categories (depth 0)
   =========================================================================== */
(function buildServiciosOverview() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Servicios" }];
  const cats = Object.keys(CATEGORY_CONTENT).map(function (slug) { return CATEGORY_CONTENT[slug]; });
  const cards = cats.map(function (cat) {
    const subs = ALL_SUBSERVICES.filter(function (s) { return s.cat.slug === cat.slug; });
    const list = subs.map(function (s) { return `<li><a href="${rel(0, cat.slug + "/" + s.slug + ".html")}">${esc(s.label)}</a></li>`; }).join("");
    return `<div class="service-card reveal" data-tilt>
      <div class="service-card-media"><img src="${rel(0, "assets/img/" + cat.heroImg)}" alt="${esc(cat.label)}" loading="lazy" decoding="async"></div>
      <div class="service-card-body">
        <h3>${esc(cat.label)}</h3>
        <p>${esc(cat.lead)}</p>
        <ul class="service-card-list">${list}</ul>
        <a class="btn-ghost" href="${rel(0, "servicios/" + cat.slug + ".html")}">Ver ${esc(cat.label.toLowerCase())}</a>
      </div>
    </div>`;
  }).join("");

  const body = [
    pageHero(0, {
      kicker: "Servicios", title: "Serigrafía, rotulación e impresión de gran formato",
      lead: "Tres talleres en uno: personalización textil, rotulación de vehículos y espacios, e impresión de gran formato. Todo diseñado, fabricado e instalado desde Denia.",
      crumbs: crumbs
    }),
    `  <section class="section">
    <div class="container">
      <div class="services-grid">${cards}</div>
    </div>
  </section>`,
    processBlock(0),
    ctaBand(0, { title: "¿No sabes qué servicio necesitas exactamente?", text: "Cuéntanos tu proyecto tal cual lo tienes en la cabeza y te orientamos nosotros." })
  ].join("\n");

  write("servicios.html", page(0, {
    title: "Servicios | Serigrafía, rotulación y gran formato — Seriart Denia",
    description: "Serigrafía textil, rotulación de vehículos y negocios, e impresión de gran formato en Denia, Alicante. Un solo taller para todo tu proyecto gráfico.",
    canonical: "servicios.html", ogImage: "hero-vehicle-wrap.jpg"
  }, body));
})();

/* ===========================================================================
   Home  (depth 0)
   =========================================================================== */
(function buildHome() {
  const serviceBlocks = [
    { cat: CATEGORY_CONTENT.serigrafia, img: "screen-printing-process.jpg" },
    { cat: CATEGORY_CONTENT.rotulacion, img: "hero-vehicle-wrap.jpg" },
    { cat: CATEGORY_CONTENT["gran-formato"], img: "large-format-banner.jpg" }
  ].map(function (b) {
    return `<div class="service-card reveal" data-tilt>
      <div class="service-card-media"><img src="${rel(0, "assets/img/" + b.img)}" alt="${esc(b.cat.label)}" loading="lazy" decoding="async"></div>
      <div class="service-card-body">
        <h3>${esc(b.cat.label)}</h3>
        <p>${esc(b.cat.lead)}</p>
        <a class="btn-ghost" href="${rel(0, "servicios/" + b.cat.slug + ".html")}">Ver ${esc(b.cat.label.toLowerCase())}</a>
      </div>
    </div>`;
  }).join("");

  const workItems = [
    { src: "car-wrap-detail.jpg", alt: "Vehículo con acabado personalizado", cat: "Rotulación" },
    { src: "screen-printing-process.jpg", alt: "Estampación serigráfica textil", cat: "Serigrafía" },
    { src: "shop-storefront.jpg", alt: "Rótulo de fachada instalado", cat: "Rotulación" },
    { src: "channel-letters.jpg", alt: "Letras corpóreas iluminadas", cat: "Rotulación" },
    { src: "merch-items.jpg", alt: "Merchandising personalizado", cat: "Serigrafía" },
    { src: "poster-display.jpg", alt: "Cartelería de gran formato", cat: "Gran formato" }
  ];
  const workGrid = workItems.map(function (it) {
    return `<a class="gallery-item reveal" href="${rel(0, "trabajos.html")}" data-lightbox-src="${rel(0, "assets/img/" + it.src)}" data-lightbox-alt="${esc(it.alt)}">
      <img src="${rel(0, "assets/img/" + it.src)}" alt="${esc(it.alt)}" loading="lazy" decoding="async">
      <div class="gallery-item-overlay"><span>${esc(it.cat)}</span></div>
    </a>`;
  }).join("");

  const sectors = ["Hostelería", "Retail y comercio", "Construcción", "Eventos", "Automoción", "Administración", "Educación", "Asociaciones"];
  const marquee = sectors.concat(sectors).map(function (s) { return `<span>${esc(s)}</span>`; }).join("");

  const body = [
`  <section class="hero">
    <div class="hero-mesh" aria-hidden="true"></div>
    <div class="container hero-grid">
      <div>
        <p class="eyebrow">Denia · Alicante · desde 2002</p>
        <h1 class="hero-title reveal">Rotulación, serigrafía e impresión <em>profesional</em> en Denia</h1>
        <p class="hero-lead reveal">Rótulos, vinilos, camisetas personalizadas y gran formato para empresas, comercios y eventos. Un taller físico, un mismo equipo, de principio a fin.</p>
        <div class="hero-actions reveal">
          <a class="btn btn-primary" data-magnetic href="${rel(0, "servicios.html")}">Ver servicios</a>
          <a class="btn btn-secondary" href="${rel(0, "trabajos.html")}">Nuestros trabajos</a>
        </div>
        <div class="hero-meta reveal">
          <div class="hero-meta-item"><span class="hero-meta-num" data-count-to="23" data-count-suffix="+">0</span><span class="hero-meta-label">años de oficio</span></div>
          <div class="hero-meta-item"><span class="hero-meta-num">Propio</span><span class="hero-meta-label">taller físico en Denia</span></div>
          <div class="hero-meta-item"><span class="hero-meta-num">España</span><span class="hero-meta-label">clientes en toda</span></div>
        </div>
      </div>
      <div class="hero-video-card reveal">
        <img src="${rel(0, "assets/img/hero-vehicle-wrap.jpg")}" alt="Rotulación de un vehículo en proceso" loading="eager" fetchpriority="high">
        <div class="play-btn" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7-11-7Z"/></svg>
        </div>
        <div class="hero-video-caption"><span class="dot" aria-hidden="true"></span>Rotulación de vehículo, en directo desde el taller</div>
      </div>
    </div>
  </section>`,
`  <section class="section-tight">
    <div class="container">
      <div class="stats-strip">
        <div class="stat-item reveal"><div class="stat-num"><span data-count-to="23" data-count-suffix="+">0</span></div><div class="stat-label">años de experiencia</div></div>
        <div class="stat-item reveal"><div class="stat-num">100%</div><div class="stat-label">producción en taller propio</div></div>
        <div class="stat-item reveal"><div class="stat-num"><span data-count-to="12">0</span></div><div class="stat-label">especialidades de taller</div></div>
        <div class="stat-item reveal"><div class="stat-num unit">ES</div><div class="stat-label">clientes en toda España</div></div>
      </div>
    </div>
  </section>`,
`  <section class="section section-tint">
    <div class="container">
      <div class="section-head centered"><p class="eyebrow">Qué hacemos</p><h2>Tres talleres en uno</h2><p>Serigrafía textil, rotulación de vehículos y espacios, e impresión de gran formato — todo bajo un mismo techo en Denia.</p></div>
      <div class="services-grid">${serviceBlocks}</div>
    </div>
  </section>`,
`  <section class="section">
    <div class="container">
      <div class="section-head"><p class="eyebrow">Últimos trabajos</p><h2>Lo último que ha salido del taller</h2></div>
      <div class="gallery-grid">${workGrid}</div>
      <div style="margin-top:2rem;"><a class="btn-ghost" href="${rel(0, "trabajos.html")}">Ver todos los trabajos</a></div>
    </div>
  </section>`,
`  <section class="section section-tint">
    <div class="container">
      <div class="section-head centered"><p class="eyebrow">Confían en nosotros</p><h2>Sectores con los que trabajamos habitualmente</h2></div>
      <div class="marquee-wrap"><div class="marquee-track">${marquee}</div></div>
    </div>
  </section>`,
`  <section class="section">
    <div class="container intro-grid">
      <div class="intro-text reveal">
        <p class="eyebrow">Sobre el taller</p>
        <h2 style="font-size:1.7rem;margin-bottom:1rem;">Desde 2002, en el mismo taller de Denia</h2>
        <p>Desde 2002 ayudamos a empresas, comercios y particulares a mejorar su imagen mediante soluciones personalizadas de rotulación, serigrafía e impresión. Somos un equipo especializado, con colaboradores externos según las necesidades de cada proyecto, que controla cada encargo de principio a fin: del diseño a la instalación.</p>
        <a class="btn btn-secondary" href="${rel(0, "nosotros.html")}" style="margin-top:.5rem;">Conocer el equipo</a>
      </div>
      <img class="reveal" src="${rel(0, "assets/img/about-team.jpg")}" alt="Equipo de Seriart trabajando en el taller" loading="lazy" decoding="async">
    </div>
  </section>`,
    ctaBand(0, { title: "¿Tienes un proyecto en mente?", text: "Cuéntanos qué necesitas — rótulo, vehículo, textil o gran formato — y te respondemos con un presupuesto claro." })
  ].join("\n");

  write("index.html", page(0, {
    title: "Seriart | Rotulación, serigrafía e impresión en Denia, Alicante",
    description: "Taller de serigrafía, rotulación de vehículos y negocios, y gran formato en Denia, Alicante. Más de 20 años de experiencia, clientes en toda España.",
    canonical: "", ogImage: "hero-vehicle-wrap.jpg", heroPreload: "hero-vehicle-wrap.jpg"
  }, body));
})();

/* ===========================================================================
   /trabajos.html — portfolio (depth 0)
   =========================================================================== */
(function buildTrabajos() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Trabajos" }];
  const items = [
    { src: "car-wrap-detail.jpg", alt: "Vehículo con acabado personalizado", cats: ["rotulacion", "vehiculos"], compareBefore: "van-signage.jpg", compareBeforeAlt: "Ejemplo de vehículo sin rotular" },
    { src: "hero-vehicle-wrap.jpg", alt: "Ejemplo de rotulación integral", cats: ["rotulacion", "vehiculos"], compareBefore: "van-signage.jpg", compareBeforeAlt: "Ejemplo de aplicación parcial de vinilo" },
    { src: "screen-printing-process.jpg", alt: "Estampación serigráfica textil", cats: ["serigrafia"], compareBefore: "blank-tshirt.jpg", compareBeforeAlt: "Prenda en blanco, sin estampar" },
    { src: "workwear.jpeg", alt: "Ropa laboral personalizada", cats: ["serigrafia"], compareBefore: "blank-tshirt.jpg", compareBeforeAlt: "Prenda en blanco, sin personalizar" },
    { src: "merch-items.jpg", alt: "Merchandising personalizado", cats: ["serigrafia"], compareBefore: "blank-tshirt.jpg", compareBeforeAlt: "Producto en blanco, sin personalizar" },
    { src: "channel-letters.jpg", alt: "Letras corpóreas iluminadas", cats: ["rotulacion"], compareBefore: "blank-shopfront.jpg", compareBeforeAlt: "Fachada antes de instalar el rótulo" },
    { src: "shop-storefront.jpg", alt: "Rótulo de fachada instalado", cats: ["rotulacion"], compareBefore: "blank-shopfront.jpg", compareBeforeAlt: "Fachada sin rotular" },
    { src: "shop-window-vinyl.jpg", alt: "Escaparate con vinilo", cats: ["rotulacion"], compareBefore: "blank-shopfront.jpg", compareBeforeAlt: "Escaparate sin vinilo" },
    { src: "van-signage.jpg", alt: "Detalle de vinilo aplicado sobre carrocería", cats: ["rotulacion"], compareBefore: "blank-shopfront.jpg", compareBeforeAlt: "Antes de la intervención" },
    { src: "large-format-banner.jpg", alt: "Producción de impresión de gran formato", cats: ["gran-formato"], compareBefore: "blank-shopfront.jpg", compareBeforeAlt: "Soporte en blanco, antes de imprimir" },
    { src: "outdoor-banner.jpg", alt: "Publicidad impresa en escaparate", cats: ["gran-formato"], compareBefore: "blank-tshirt.jpg", compareBeforeAlt: "Soporte en blanco, antes de imprimir" },
    { src: "poster-display.jpg", alt: "Diseño de cartelería", cats: ["gran-formato"], compareBefore: "blank-shopfront.jpg", compareBeforeAlt: "Diseño en blanco, antes de imprimir" }
  ];
  const grid = items.map(function (it) {
    if (it.compareBefore) {
      return `<a class="portfolio-item gallery-item reveal" data-filter-item="${it.cats.join(" ")}" href="${rel(0, "assets/img/" + it.src)}"
        data-compare-before="${rel(0, "assets/img/" + it.compareBefore)}" data-compare-before-alt="${esc(it.compareBeforeAlt)}"
        data-compare-after="${rel(0, "assets/img/" + it.src)}" data-compare-after-alt="${esc(it.alt)}">
        <img src="${rel(0, "assets/img/" + it.src)}" alt="${esc(it.alt)}" loading="lazy" decoding="async">
        <span class="compare-chip"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 7 4 12l4 5M16 7l4 5-4 5" stroke-linecap="round" stroke-linejoin="round"/></svg>Antes / después</span>
        <div class="gallery-item-overlay"><span>${esc(it.alt)}</span></div>
      </a>`;
    }
    return `<a class="portfolio-item gallery-item reveal" data-filter-item="${it.cats.join(" ")}" href="${rel(0, "assets/img/" + it.src)}" data-lightbox-src="${rel(0, "assets/img/" + it.src)}" data-lightbox-alt="${esc(it.alt)}">
      <img src="${rel(0, "assets/img/" + it.src)}" alt="${esc(it.alt)}" loading="lazy" decoding="async">
      <div class="gallery-item-overlay"><span>${esc(it.alt)}</span></div>
    </a>`;
  }).join("");

  const filters = [
    { key: "all", label: "Todos" },
    { key: "serigrafia", label: "Serigrafía" },
    { key: "rotulacion", label: "Rotulación" },
    { key: "vehiculos", label: "Vehículos" },
    { key: "gran-formato", label: "Gran formato" }
  ].map(function (f, i) { return `<button class="filter-btn${i === 0 ? " is-active" : ""}" data-filter="${f.key}" aria-pressed="${i === 0}">${f.label}</button>`; }).join("");

  const body = [
    pageHero(0, { kicker: "Trabajos", title: "Proyectos realizados en el taller", lead: "Una muestra de lo que hacemos día a día: vehículos, fachadas, textil y piezas de gran formato para clientes de toda España.", crumbs: crumbs }),
    `  <section class="section">
    <div class="container">
      <div class="filter-bar" data-filter-bar role="group" aria-label="Filtrar trabajos por categoría">${filters}</div>
      <p class="field-hint" style="margin-bottom:1.4rem;">Haz clic en una imagen para verla en grande. Las marcadas con <strong>Antes / después</strong> muestran una comparativa — de momento con fotos de archivo ilustrativas, pendientes de sustituir por proyectos reales del taller.</p>
      <div class="portfolio-grid">${grid}</div>
    </div>
  </section>`,
    ctaBand(0, { title: "¿Quieres un resultado parecido?", text: "Cuéntanos tu proyecto y te decimos cómo lo enfocaríamos." })
  ].join("\n");

  write("trabajos.html", page(0, {
    title: "Trabajos realizados | Seriart Denia",
    description: "Proyectos de rotulación de vehículos, serigrafía textil y gran formato realizados por Seriart en Denia, Alicante, para clientes de toda España.",
    canonical: "trabajos.html", ogImage: "car-wrap-detail.jpg"
  }, body));
})();

/* ===========================================================================
   /nosotros.html  (depth 0)
   =========================================================================== */
(function buildNosotros() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Nosotros" }];
  const team = [
    { role: "Diseño y preimpresión", desc: "Preparamos artes finales, pantallas y plotters para cada pedido.", img: "screen-printing-process.jpg" },
    { role: "Producción y serigrafía", desc: "Estampación textil y control de calidad prenda a prenda.", img: "workshop-machine.jpg" },
    { role: "Rotulación e instalación", desc: "Fabricación, montaje e instalación en vehículos y fachadas.", img: "car-wrap-detail.jpg" }
  ];
  const teamGrid = team.map(function (t) {
    return `<div class="team-card reveal">
      <div class="team-photo"><img src="${rel(0, "assets/img/" + t.img)}" alt="${esc(t.role)}" loading="lazy" decoding="async"></div>
      <h3>${esc(t.role)}</h3>
      <p class="role">Equipo Seriart</p>
      <p style="font-size:.88rem;color:var(--ink-soft);margin-top:.4rem;">${esc(t.desc)}</p>
    </div>`;
  }).join("");

  const workshopImgs = ["shop-storefront.jpg", "channel-letters.jpg", "about-team.jpg", "workshop-machine.jpg"]
    .map(function (im) { return `<img src="${rel(0, "assets/img/" + im)}" alt="Interior del taller Seriart" loading="lazy" decoding="async">`; }).join("");

  const body = [
    pageHero(0, { kicker: "Nosotros", title: "Un taller de Denia con más de 20 años de oficio", lead: "Desde 2002 ayudamos a empresas, comercios y particulares a mejorar su imagen mediante soluciones personalizadas de rotulación, serigrafía e impresión.", crumbs: crumbs }),
    `  <section class="section">
    <div class="container">
      <div class="section-head"><p class="eyebrow">Historia</p><h2>De 2002 hasta hoy</h2></div>
      <div class="timeline">
        <div class="timeline-item reveal"><div class="year">2002</div><p>Nace Seriart en Denia, como taller de serigrafía textil.</p></div>
        <div class="timeline-item reveal"><div class="year">Con los años</div><p>El taller amplía su actividad a la rotulación de vehículos y negocios, y a la impresión de gran formato, para ofrecer todo el proceso gráfico desde un mismo lugar.</p></div>
        <div class="timeline-item reveal"><div class="year">Hoy</div><p>Seguimos en Denia, con un equipo especializado y colaboradores externos según el proyecto, trabajando para clientes de toda España.</p></div>
      </div>
    </div>
  </section>`,
    `  <section class="section section-tint">
    <div class="container">
      <div class="section-head"><p class="eyebrow">Equipo</p><h2>Quién está detrás de cada encargo</h2></div>
      <div class="team-grid">${teamGrid}</div>
    </div>
  </section>`,
    `  <section class="section">
    <div class="container">
      <div class="section-head"><p class="eyebrow">El taller</p><h2>Nuestro espacio de trabajo en Denia</h2><p>Contamos con equipos de impresión textil, corte de vinilo e impresión de gran formato, todo bajo el mismo techo — lo que nos permite controlar cada fase del proceso sin depender de terceros.</p></div>
      <div class="workshop-grid">${workshopImgs}</div>
    </div>
  </section>`,
    ctaBand(0, { title: "¿Conoces ya lo que hacemos?", text: "Pásate por el taller de Calle Oeste, 13 en Denia, o escríbenos para hablar de tu proyecto." })
  ].join("\n");

  write("nosotros.html", page(0, {
    title: "Nosotros | Taller de serigrafía y rotulación en Denia — Seriart",
    description: "Conoce Seriart: taller de serigrafía, rotulación e impresión de gran formato en Denia, Alicante, con más de 20 años de experiencia.",
    canonical: "nosotros.html", ogImage: "about-team.jpg"
  }, body));
})();

/* ===========================================================================
   /contacto.html  (depth 0)
   =========================================================================== */
(function buildContacto() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Contacto" }];
  const mapSrc = "https://www.google.com/maps?q=" + encodeURIComponent(BRAND.address) + "&output=embed";
  const body = [
    pageHero(0, { kicker: "Contacto", title: "Hablemos de tu proyecto", lead: "Escríbenos, llámanos o pásate por el taller. Si ya tienes claro lo que necesitas, mejor pide presupuesto directamente.", crumbs: crumbs }),
    `  <section class="section">
    <div class="container contact-page-grid">
      <div class="contact-page-side">
        <div class="contact-info-grid">
          <div class="card contact-info-card reveal"><div class="contact-info-icon" aria-hidden="true">${svgIcon("pin")}</div><div><h3>Taller</h3><p>${esc(BRAND.address)}</p></div></div>
          <div class="card contact-info-card reveal"><div class="contact-info-icon" aria-hidden="true">${svgIcon("mail")}</div><div><h3>Email</h3><a href="mailto:${BRAND.email}">${BRAND.email}</a></div></div>
          <div class="card contact-info-card reveal"><div class="contact-info-icon" aria-hidden="true">${svgIcon("phone")}</div><div><h3>Teléfono</h3><a href="tel:${BRAND.phoneHref}">${esc(BRAND.phoneDisplay)}</a></div></div>
          <div class="card contact-info-card reveal"><div class="contact-info-icon" aria-hidden="true">${svgIcon("whatsapp")}</div><div><h3>WhatsApp</h3><a href="https://wa.me/${BRAND.whatsappNumber}" target="_blank" rel="noopener">${esc(BRAND.whatsappDisplay)}</a></div></div>
          <div class="card contact-info-card reveal"><div class="contact-info-icon" aria-hidden="true">${svgIcon("clock")}</div><div><h3>Horario</h3><p>${esc(BRAND.hours)}</p></div></div>
        </div>
        <div class="map-embed reveal"><iframe src="${mapSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Ubicación de Seriart en Denia"></iframe></div>
      </div>
      <div class="form-card reveal">
        <h2 style="font-size:1.4rem;margin-bottom:.4rem;">Escríbenos</h2>
        <p style="color:var(--ink-soft);font-size:.92rem;margin-bottom:1.4rem;">Para presupuestos detallados con archivo adjunto, mejor usa el <a href="${rel(0, "presupuesto.html")}" style="color:var(--accent-dark);font-weight:600;">formulario de presupuesto</a>.</p>
        <form data-mailto-form action="mailto:${BRAND.email}" method="get" enctype="text/plain" novalidate>
          <div class="form-grid cols-2">
            <div class="field"><label for="c-nombre">Nombre</label><input id="c-nombre" name="Nombre" type="text" required></div>
            <div class="field"><label for="c-email">Email</label><input id="c-email" name="Email" type="email" required></div>
          </div>
          <div class="form-grid" style="margin-top:1.1rem;">
            <div class="field"><label for="c-telefono">Teléfono <span class="optional">(opcional)</span></label><input id="c-telefono" name="Telefono" type="tel"></div>
            <div class="field"><label for="c-mensaje">Mensaje</label><textarea id="c-mensaje" name="Mensaje" required></textarea></div>
          </div>
          <button class="btn btn-primary btn-block" type="submit" style="margin-top:1.3rem;">Enviar mensaje</button>
          <p class="form-note">Al enviar se abrirá tu programa de correo con el mensaje ya redactado, listo para confirmar el envío.</p>
          <div class="form-success" data-form-success>${svgIcon("check")} <span>Se ha abierto tu correo — confirma el envío desde ahí.</span></div>
        </form>
      </div>
    </div>
  </section>`
  ].join("\n");

  write("contacto.html", page(0, {
    title: "Contacto | Seriart — Taller en Denia, Alicante",
    description: "Contacta con Seriart: taller en Calle Oeste 13, Denia (Alicante). Escríbenos por email, WhatsApp o pásate por el taller.",
    canonical: "contacto.html", ogImage: "workshop-machine.jpg"
  }, body));
})();

/* ===========================================================================
   /presupuesto.html  (depth 0)
   =========================================================================== */
(function buildPresupuesto() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Presupuesto" }];
  const catOptions = Object.keys(CATEGORY_CONTENT).map(function (slug) {
    var c = CATEGORY_CONTENT[slug];
    return `<option value="${esc(c.label)}" data-slug="${slug}">${esc(c.label)} (varios trabajos)</option>`;
  }).join("");
  const serviceOptions = ALL_SUBSERVICES.map(function (s) {
    return `<option value="${esc(s.cat.label)} — ${esc(s.label)}" data-slug="${s.slug}">${esc(s.cat.label)} — ${esc(s.label)}</option>`;
  }).join("");

  const body = [
    pageHero(0, { kicker: "Presupuesto", title: "Pide presupuesto sin compromiso", lead: "Cuéntanos qué necesitas con el mayor detalle posible — cuanta más información nos des, más ajustado será el presupuesto.", crumbs: crumbs }),
    `  <section class="section">
    <div class="container" style="display:grid;gap:2.4rem;grid-template-columns:1fr;max-width:900px;margin-inline:auto;">
      <div class="form-card reveal">
        <form data-mailto-form action="mailto:${BRAND.email}" method="get" enctype="text/plain" novalidate>
          <div class="form-grid cols-2">
            <div class="field"><label for="p-nombre">Nombre</label><input id="p-nombre" name="Nombre" type="text" required></div>
            <div class="field"><label for="p-empresa">Empresa <span class="optional">(opcional)</span></label><input id="p-empresa" name="Empresa" type="text"></div>
            <div class="field"><label for="p-email">Email</label><input id="p-email" name="Email" type="email" required></div>
            <div class="field"><label for="p-telefono">Teléfono</label><input id="p-telefono" name="Telefono" type="tel" required></div>
          </div>
          <div class="form-grid" style="margin-top:1.1rem;">
            <div class="field">
              <label for="p-servicio">Servicio</label>
              <select id="p-servicio" name="Servicio" required data-service-select>
                <option value="">Selecciona un servicio</option>
                ${serviceOptions}
                ${catOptions}
                <option value="No lo tengo claro">No lo tengo claro / varios servicios</option>
              </select>
            </div>
          </div>
          <div class="form-grid" style="margin-top:1.1rem;">
            <div class="field"><label for="p-descripcion">Describe tu proyecto</label><textarea id="p-descripcion" name="Descripcion" placeholder="Qué necesitas, para qué y cualquier detalle relevante" required></textarea></div>
          </div>
          <div class="form-grid cols-2" style="margin-top:1.1rem;">
            <div class="field"><label for="p-cantidad">Cantidad aproximada <span class="optional">(opcional)</span></label><input id="p-cantidad" name="Cantidad" type="text" placeholder="Ej. 50 camisetas, 1 vehículo…"></div>
            <div class="field"><label for="p-medidas">Medidas <span class="optional">(opcional)</span></label><input id="p-medidas" name="Medidas" type="text" placeholder="Ej. 3 x 2 m, talla M…"></div>
          </div>
          <div class="form-grid cols-2" style="margin-top:1.1rem;">
            <div class="field"><label for="p-fecha">Fecha en la que lo necesitas <span class="optional">(opcional)</span></label><input id="p-fecha" name="Fecha_necesaria" type="date"></div>
            <div class="field">
              <label for="p-archivo">Archivo adjunto <span class="optional">(logo, diseño, foto…)</span></label>
              <div class="field-file"><input id="p-archivo" name="Archivo" type="file" accept="image/*,.pdf,.ai,.eps,.svg"></div>
            </div>
          </div>
          <p class="field-hint" style="margin-top:.6rem;">Al enviar el formulario se abrirá tu programa de correo con estos datos. Como el envío es por email, adjunta también el archivo manualmente en el mensaje antes de darle a enviar (o envíanoslo por WhatsApp).</p>
          <button class="btn btn-primary btn-block" type="submit" style="margin-top:1.3rem;">Enviar solicitud de presupuesto</button>
          <div class="form-success" data-form-success>${svgIcon("check")} <span>Se ha abierto tu correo — recuerda adjuntar el archivo antes de enviarlo.</span></div>
          <p class="form-note">También puedes escribirnos directamente a <a href="mailto:${BRAND.email}" style="color:var(--accent-dark);">${BRAND.email}</a> o por WhatsApp.</p>
        </form>
      </div>
    </div>
  </section>`
  ].join("\n");

  write("presupuesto.html", page(0, {
    title: "Pedir presupuesto | Seriart — Serigrafía, rotulación y gran formato",
    description: "Solicita presupuesto sin compromiso a Seriart: serigrafía, rotulación de vehículos y negocios, o impresión de gran formato en Denia, Alicante.",
    canonical: "presupuesto.html", ogImage: "workshop-machine.jpg"
  }, body));
})();

/* ===========================================================================
   404, legal, creditos
   =========================================================================== */
(function build404() {
  const body = `  <section class="error-page">
    <div class="container">
      <div class="error-num reveal">404</div>
      <h1 class="reveal">Esta página no existe</h1>
      <p class="reveal">Puede que el enlace esté mal escrito o que la página se haya movido. Prueba a volver al inicio o a ver nuestros servicios.</p>
      <div class="error-actions reveal">
        <a class="btn btn-primary" href="${rel(0, "index.html")}">Volver al inicio</a>
        <a class="btn btn-secondary" href="${rel(0, "servicios.html")}">Ver servicios</a>
      </div>
    </div>
  </section>`;
  write("404.html", page(0, {
    title: "Página no encontrada | Seriart", description: "La página que buscas no existe o se ha movido.",
    canonical: "404.html", ogImage: "hero-vehicle-wrap.jpg"
  }, body));
})();

(function buildLegal() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Aviso legal y privacidad" }];
  const body = [
    pageHero(0, { kicker: "Legal", title: "Aviso legal, privacidad y cookies", lead: "Información legal sobre el uso de esta web y el tratamiento de tus datos.", crumbs: crumbs }),
    `  <section class="section">
    <div class="container prose">
      <h2 id="aviso-legal">Aviso legal</h2>
      <p>Titular del sitio web: Seriart — [Nombre fiscal y NIF/CIF pendientes de completar]. Domicilio: ${esc(BRAND.address)}. Email de contacto: ${BRAND.email}.</p>
      <p>Este sitio web tiene carácter informativo y comercial. El acceso y uso del mismo atribuye la condición de usuario e implica la aceptación de las condiciones aquí recogidas.</p>

      <h2 id="privacidad">Política de privacidad</h2>
      <p>Los datos personales facilitados a través de los formularios de esta web (contacto y presupuesto) se utilizan exclusivamente para responder a tu solicitud y gestionar la relación comercial derivada de ella. No se ceden a terceros salvo obligación legal.</p>
      <p>Puedes ejercer tus derechos de acceso, rectificación, supresión y oposición escribiendo a ${BRAND.email}.</p>
      <p>Los formularios de este sitio envían la información por correo electrónico a través de tu propio gestor de correo; Seriart no almacena los datos en una base de datos ni en un servidor propio.</p>

      <h2 id="cookies">Política de cookies</h2>
      <p>Esta web utiliza cookies técnicas necesarias para su funcionamiento y, si las aceptas, cookies de análisis para entender cómo se usa el sitio. Puedes aceptarlas o rechazarlas desde el aviso que aparece al entrar, o eliminarlas en cualquier momento desde la configuración de tu navegador.</p>
      <ul>
        <li><strong>Cookies técnicas:</strong> necesarias para la navegación y el funcionamiento básico del sitio.</li>
        <li><strong>Cookies de preferencia:</strong> recuerdan tu decisión sobre el aviso de cookies.</li>
      </ul>
    </div>
  </section>`
  ].join("\n");
  write("legal.html", page(0, {
    title: "Aviso legal, privacidad y cookies | Seriart", description: "Aviso legal, política de privacidad y política de cookies de Seriart.",
    canonical: "legal.html", ogImage: "workshop-machine.jpg"
  }, body));
})();

(function buildCreditos() {
  const crumbs = [{ label: "Inicio", href: "index.html" }, { label: "Créditos fotográficos" }];
  const body = [
    pageHero(0, { kicker: "Créditos", title: "Créditos fotográficos", lead: "Mientras incorporamos fotografía real del taller y los proyectos, esta web usa imágenes de archivo bajo licencia Creative Commons vía Openverse.", crumbs: crumbs }),
    `  <section class="section">
    <div class="container prose">
      <p>Imágenes bajo licencias Creative Commons vía <a href="https://openverse.org" target="_blank" rel="noopener">Openverse</a>.</p>
      <ul class="credits-list" data-credits data-credits-base="${rel(0, "assets/credits.json")}"><li>Cargando créditos…</li></ul>
    </div>
  </section>`
  ].join("\n");
  write("creditos.html", page(0, {
    title: "Créditos fotográficos | Seriart", description: "Créditos y licencias de las imágenes de archivo utilizadas en la web de Seriart.",
    canonical: "creditos.html", ogImage: "workshop-machine.jpg"
  }, body));
})();

/* ===========================================================================
   sitemap.xml + robots.txt
   =========================================================================== */
(function buildSeoFiles() {
  const pages = ["", "servicios.html", "trabajos.html", "nosotros.html", "contacto.html", "presupuesto.html", "legal.html"];
  Object.keys(CATEGORY_CONTENT).forEach(function (slug) { pages.push("servicios/" + slug + ".html"); });
  ALL_SUBSERVICES.forEach(function (s) { pages.push(s.cat.slug + "/" + s.slug + ".html"); });

  const urlset = pages.map(function (p) {
    return `  <url><loc>${BRAND.siteUrl}/${p}</loc><changefreq>monthly</changefreq></url>`;
  }).join("\n");
  write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`);

  write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${BRAND.siteUrl}/sitemap.xml\n`);
})();

console.log("\nDone: " + (ALL_SUBSERVICES.length + Object.keys(CATEGORY_CONTENT).length + 9) + " HTML pages + sitemap.xml + robots.txt");
