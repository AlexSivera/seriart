"use strict";
/* Loads the editable content (content/*.json, edited from Pages CMS) and
   normalises it for the templates. The site structure — which services exist
   and their URLs — lives here in code; everything else comes from the JSON.

   Editors are not developers, so this loader never throws on bad content:
   missing images or empty fields are skipped with a warning and the build
   carries on. */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const warnings = [];
function warn(msg) { warnings.push(msg); }

/* Fixed structure: category → services (order = order on the site) */
const STRUCTURE = [
  { slug: "rotulacion", subs: ["vehiculos", "rotulos-negocios", "letras-corporeas", "escaparates", "vinilos"] },
  { slug: "serigrafia", subs: ["textil", "ropa-laboral", "merchandising"] },
  { slug: "gran-formato", subs: ["lonas", "banners", "roll-ups", "carteleria"] }
];

/* Portfolio categories (keys must match the select in .pages.yml) */
const WORK_CATEGORIES = [
  { key: "vehiculos", label: "Vehículos", filter: "Vehículos" },
  { key: "fachadas", label: "Fachadas y letras", filter: "Fachadas y letras" },
  { key: "escaparates", label: "Escaparates y vinilo", filter: "Escaparates y vinilo" },
  { key: "serigrafia", label: "Serigrafía y textil", filter: "Serigrafía" },
  { key: "gran-formato", label: "Gran formato", filter: "Gran formato" }
];

function readJson(rel, fallback) {
  const file = path.join(ROOT, rel);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    warn(rel + ": no se pudo leer (" + e.message.split("\n")[0] + ")");
    return fallback;
  }
}
const str = (v) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());
const arr = (v) => (Array.isArray(v) ? v : []);
const paragraphs = (v) => str(v).split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);

/* "/assets/uploads/foto.jpg" (as written by Pages CMS) → "assets/uploads/foto.jpg",
   or null (with a warning) when empty or the file doesn't exist. */
function media(value, where) {
  let p = str(value);
  if (!p) return null;
  try { p = decodeURI(p); } catch (e) { /* keep as written */ }
  p = p.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!fs.existsSync(path.join(ROOT, p))) { warn(where + ": no existe el archivo " + p); return null; }
  return p;
}

function textItems(list, a, b) {
  return arr(list).map((it) => ({ title: str(it && it[a]), desc: str(it && it[b]) })).filter((it) => it.title);
}
function gallery(list, where) {
  return arr(list).map((it, i) => {
    const src = media(it && it.imagen, where + " (galería, foto " + (i + 1) + ")");
    return src ? { src, alt: str(it.pie) || "Trabajo de Seriart" } : null;
  }).filter(Boolean);
}

function loadPage(rel, slug, fallbackName) {
  const d = readJson(rel, {});
  const nombre = str(d.nombre) || fallbackName;
  const seo = d.seo || {};
  return {
    slug,
    label: nombre,
    title: str(d.titulo) || nombre,
    lead: str(d.entradilla),
    heroImg: media(d.foto, rel + " (foto principal)"),
    intro: paragraphs(d.texto),
    types: textItems(d.tipos, "titulo", "texto"),
    gallery: gallery(d.galeria, rel),
    faqs: arr(d.preguntas).map((q) => ({ q: str(q && q.pregunta), a: str(q && q.respuesta) })).filter((q) => q.q && q.a),
    benefits: arr(d.ventajas).map((v) => ({ icon: str(v && v.icono) || "check", title: str(v && v.titulo), desc: str(v && v.texto) })).filter((v) => v.title),
    metaTitle: str(seo.titulo) || nombre + " en Dénia — Seriart",
    metaDescription: str(seo.descripcion) || str(d.entradilla)
  };
}

function load() {
  /* Site-wide data */
  const s = readJson("content/sitio.json", {});
  const dir = s.direccion || {};
  const digits = (v) => str(v).replace(/\D/g, "");
  const phone = digits(s.telefono);
  const wa = digits(s.whatsapp);
  const portada = s.portada || {};
  const empresa = s.empresa || {};
  const site = {
    email: str(s.email),
    phoneDisplay: str(s.telefono),
    phoneHref: phone ? (str(s.telefono).startsWith("+") ? "+" + phone : "+34" + phone) : "",
    whatsappDisplay: str(s.whatsapp),
    whatsappNumber: wa ? (wa.length === 9 ? "34" + wa : wa) : "",
    street: str(dir.calle),
    postalCode: str(dir.codigoPostal),
    city: str(dir.ciudad) || "Dénia",
    province: str(dir.provincia) || "Alicante",
    hours: str(s.horario),
    hoursNote: str(s.horarioNota),
    legalName: str(empresa.nombreFiscal),
    taxId: str(empresa.nif),
    web3formsKey: str(s.web3formsKey),
    heroVideo: {
      src: media(portada.video, "Datos generales (vídeo de portada)") || "",
      poster: media(portada.imagen, "Datos generales (imagen de portada)") || "assets/uploads/hero-vehicle-wrap.jpg",
      caption: str(portada.textoVideo)
    }
  };
  site.address = [site.street, [site.postalCode, site.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") + " (" + site.province + ")";

  /* Services */
  const categories = STRUCTURE.map((c) => {
    const cat = loadPage("content/categorias/" + c.slug + ".json", c.slug, c.slug);
    cat.subs = c.subs.map((slug) => {
      const sub = loadPage("content/servicios/" + slug + ".json", slug, slug);
      sub.cat = cat;
      return sub;
    });
    return cat;
  });
  const services = categories.reduce((all, c) => all.concat(c.subs), []);

  /* Portfolio */
  const catKeys = WORK_CATEGORIES.map((c) => c.key);
  const works = arr(readJson("content/trabajos.json", [])).map((w, i) => {
    const src = media(w && w.imagen, "Trabajos (nº " + (i + 1) + ")");
    if (!src) {
      if (!str(w && w.imagen)) warn("Trabajos (nº " + (i + 1) + "): no tiene foto y no se muestra");
      return null;
    }
    const key = catKeys.indexOf(str(w.categoria)) !== -1 ? str(w.categoria) : "vehiculos";
    const cat = WORK_CATEGORIES.find((c) => c.key === key);
    return { src, title: str(w.titulo) || cat.label, cat: key, tag: cat.label, home: Boolean(w.inicio) };
  }).filter(Boolean);

  /* About page */
  const n = readJson("content/nosotros.json", {});
  const about = {
    heroImg: media(n.fotoCabecera, "Nosotros (foto de cabecera)"),
    homeImg: media(n.fotoInicio, "Nosotros (foto de la página de inicio)"),
    storyTitle: str(n.historiaTitulo) || "Nuestra historia",
    story: paragraphs(n.historia),
    areas: arr(n.areas).map((a, i) => ({
      title: str(a && a.titulo), desc: str(a && a.texto), img: media(a && a.imagen, "Nosotros (área " + (i + 1) + ")")
    })).filter((a) => a.title),
    workshop: arr(n.fotosTaller).map((f, i) => media(f, "Nosotros (foto del taller " + (i + 1) + ")")).filter(Boolean)
  };

  return { site, categories, services, works, about, WORK_CATEGORIES, warnings };
}

module.exports = { load, STRUCTURE, WORK_CATEGORIES, warnings };
