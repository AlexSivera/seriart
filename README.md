# Seriart — web

Web estática de Seriart (rotulación, vinilo, serigrafía y gran formato, Dénia).
El contenido se edita desde **Pages CMS** y GitHub publica la web sola en cada cambio.

```
content/            ← textos y datos editables (JSON), los edita Pages CMS
assets/uploads/     ← fotos (las sube Pages CMS)
assets/video/       ← vídeo de portada (lo sube Pages CMS)
assets/img/         ← logo y favicon
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

- **Web3Forms**: crea la clave en <https://web3forms.com> con el email que recibirá
  las solicitudes y ponla en `web3formsKey` de `content/sitio.json` (está oculta en el
  panel a propósito). Sin clave, los formularios abren el correo del visitante.
- **Dominio**: cuando tengáis `seriart.es`, crea un archivo `CNAME` en la raíz con
  `www.seriart.es` y configura el dominio en *Settings → Pages*. Las URLs canónicas y
  el sitemap ya apuntan a `https://www.seriart.es`.
- Si algún día se aloja en otro sitio (p. ej. Hostinger), basta con subir el
  contenido de `_site/`.
