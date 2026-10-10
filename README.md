# Seriart — web

Web estática de Seriart (rotulación, vinilo, serigrafía y gran formato, Dénia).
El contenido se edita desde **Pages CMS** y GitHub publica la web sola en cada cambio.

```
content/            ← textos y datos editables (JSON), los edita Pages CMS
assets/uploads/     ← fotos (las sube Pages CMS)
assets/video/       ← vídeo de portada (lo sube Pages CMS)
assets/img/         ← logo y favicon
assets/fonts/       ← Archivo e IBM Plex Mono (alojadas aquí, sin Google Fonts)
docs/               ← brief del negocio, referencias, dirección artística y contenido
styles.css, main.js ← diseño y comportamiento
tools/              ← generador de la web
.pages.yml          ← qué se puede editar en el panel y cómo
.github/workflows/  ← publicación automática
_site/              ← web generada (no se sube a git)
```

## Cómo funciona

1. Alguien guarda un cambio en el panel → Pages CMS hace un commit en `main`.
2. El workflow `Publicar web` optimiza las fotos nuevas (WebP en 3 tamaños, con caché),
   genera las páginas en `_site/` y las publica en GitHub Pages. Tarda 1–2 minutos.

La **estructura** (qué servicios existen, sus URLs y el diseño) está en el código
(`tools/content.js`, `tools/generate-site.js`, `tools/build.js`). El panel solo
edita contenido, así que no se puede romper la maqueta desde ahí. Si falta una
foto o un campo, la web se genera igualmente y el aviso sale en el log del workflow.

## Diseño

La dirección artística («La librea de Seriart») está explicada en `docs/design-direction.md`.
En los títulos editables, la palabra entre asteriscos sale en negrita, como en el logo:
`Rotulación de *vehículos*`. Todas las fotos son trabajos reales del taller (Instagram
@seriart_denia); no se usan imágenes de bancos ni de otras empresas.

## Trabajar en local

```bash
node tools/optimize-images.js   # fotos → .cache/img (solo las nuevas o cambiadas)
node tools/build.js             # genera _site/
node tools/dev-server.js 8792   # http://localhost:8792
```

Necesita Node 22 y Chrome instalado (se usa en modo headless para convertir las fotos).

## Puesta en marcha del panel (una sola vez)

1. Entra en <https://app.pagescms.org> con tu cuenta de GitHub e instala la app de
   Pages CMS en el repositorio `AlexSivera/seriart`.
2. Abre el repositorio en el panel → **Settings → Collaborators** e invita a tu tío
   **por email**: no necesita cuenta de GitHub, entra con un enlace que le llega al correo.
3. En *Settings → Pages* del repositorio, la fuente debe ser **GitHub Actions**.

## Pendiente

- **Web3Forms**: la clave ya está en `web3formsKey` de `config.json` (fuera del panel a
  propósito, para que nadie la borre al guardar). Las solicitudes llegan al email con el que
  se creó la clave en <https://web3forms.com>: conviene enviar un formulario de prueba y
  comprobar que llega. Sin clave, los formularios abren el correo del visitante.
- **Dominio**: cuando tengáis dominio propio (p. ej. `seriart.es`), crea un archivo `CNAME`
  en la raíz con `www.seriart.es` y configúralo en *Settings → Pages*. Las URLs canónicas, el
  sitemap y los datos estructurados cambian solos al dominio del `CNAME`; mientras no exista,
  apuntan a `https://alexsivera.github.io/seriart`.
- **Contacto**: Instagram y Facebook publican otro WhatsApp (649 864 462) y otro email
  (javiseriart@gmail.com). Conviene unificarlos con los de la web (panel → Contacto y portada).
- **Fotos que faltan**: letras corpóreas, lonas, banners, roll-ups, cartelería, rótulos de
  fachada y merchandising no tienen fotos propias; esas páginas se muestran sin galería hasta
  que se suban desde el panel.
- Si algún día se aloja en otro sitio (p. ej. Hostinger), basta con subir el
  contenido de `_site/`.
