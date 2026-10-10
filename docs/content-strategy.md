# Estrategia de contenido

## Mensaje principal

**Rotulación, vinilo y serigrafía en Dénia, hechos en un taller propio.** Diseñamos, imprimimos y aplicamos: furgonetas de empresa, escaparates, coches de rally y clásicos, ropa de trabajo y de fiesta.

## Orden de la portada (y por qué)

1. **Portada**: qué hacemos + dónde estamos + cómo contactar, en la primera pantalla. Foto real: la Caddy de Sellagas terminada frente a la tienda «seriart tenda» (trabajo + local en una sola imagen).
2. **Recién salido del taller**: índice de trabajos reales. Es lo que genera confianza antes de pedir precio.
3. **Del archivo a la carrocería**: el proceso con fotos propias y el timelapse. Responde «¿qué tengo que hacer yo?» y «¿lo hacéis vosotros?».
4. **Servicios**: hoja con los 12 servicios y las técnicas que figuran en Facebook (tampografía, transfer, vinilo termosoldable…). Para quien ya sabe lo que busca.
5. **Mándanos el logo**: llamada a la acción principal (WhatsApp), con formulario y teléfono como alternativas.
6. **La tienda**: dirección, horario, mapa.

## Reglas de redacción

- Frases cortas, de tú, con verbos de oficio. Nada de «calidad, innovación y excelencia».
- Solo datos confirmados (ver `business-brief.md`). Sin plazos, precios, marcas de material ni garantías.
- Los títulos marcan en `*asteriscos*` la palabra que va en negro (recurso del logo).
- Pies de foto descriptivos y técnicos: qué es, qué se hizo, año de publicación.
- Los nombres de clientes aparecen porque están rotulados en el propio trabajo y ya publicados por el taller en Instagram (Sellagas, Los Baños Sunshine, DENIKEY, IV Rally Clásico Territorio Borgia).

## Contenido editable desde el panel (Pages CMS)

| Archivo | Qué controla |
| --- | --- |
| `content/sitio.json` | Teléfono, WhatsApp, email, dirección, horario, foto de portada, vídeo y su texto |
| `content/trabajos.json` | Índice de trabajos: foto principal, fotos extra, título, descripción, categoría, año, si sale en inicio |
| `content/servicios/*.json` | Cada servicio: título, entradilla, texto, tipos, galería, preguntas, SEO |
| `content/categorias/*.json` | Rotulación / Serigrafía / Gran formato |
| `content/nosotros.json` | Página «El taller»: historia, áreas, fotos |

## Pendiente de contenido (para el cliente)

- Fotos propias de letras corpóreas, lonas, banners, roll-ups, cartelería, merchandising y escaparates: hoy esas páginas se muestran sin galería.
- Una foto del interior del taller con buena luz (la mejor disponible es la Mimaki).
- Unificar WhatsApp y email con los de Instagram/Facebook, o al revés.
- Datos fiscales para el aviso legal (nombre fiscal y NIF), en el panel.
