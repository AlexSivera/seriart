# Dirección artística — «La librea de Seriart»

## Concepto

Seriart pasa el día poniendo **liberas**: franjas, logos y dorsales sobre la carrocería de una furgoneta, un coche de rally o un escaparate. La web se trata igual: una superficie limpia (papel, carrocería blanca) a la que el taller le aplica **su propia librea**, con su tipografía, sus colores y su manera de hacer.

No es un disfraz temático: la librea se reduce a tres recursos que salen de evidencias reales (el logo, el rótulo de la tienda, las franjas de la Caddy de Sellagas y el dorsal del SEAT 124) y el resto del espacio es para las fotos de trabajos.

**En una frase:** un taller de Dénia que rotula de verdad, enseñado con sus propias fotos y con la gráfica de una librea bien aplicada.

## Público y emoción

Autónomos con furgoneta, comercios, peñas y aficionados al motor de la Marina Alta. Tiene que transmitir **oficio, cercanía y orgullo por el trabajo bien hecho**; ni agencia de lujo ni ferretería. Un cliente debe pensar «estos saben lo que hacen y están aquí al lado».

## Paleta

| Token | Valor | Origen y uso |
| --- | --- | --- |
| `--paper` | `#F2F0EB` | Papel soporte del vinilo. Fondo general. |
| `--paper-2` | `#E7E4DC` | Bandas alternas, fondos de foto. |
| `--ink` | `#121314` | Texto, botones principales, franja negra de la librea. |
| `--ink-2` | `#4A4D51` | Texto secundario (contraste 8:1 sobre papel). |
| `--cyan` | `#1F8ECD` | Cian exacto del logo. Franja principal y plancha de contacto. Solo superficies y texto grande. |
| `--cyan-ink` | `#0B679A` | Cian oscurecido para enlaces y texto pequeño (AA). |
| `--orange` | `#EE6A1A` | Naranja del rótulo «seriart tenda». Franja fina de la librea y detalles. Nunca texto pequeño. |

Sin degradados ni sombras decorativas. El color se aplica en planos, como el vinilo.

## Tipografía

- **Archivo** (variable, ejes peso 100–900 y anchura 62–125 %) para todo. Reproduce el contraste del logo: «seri» fino / «art» negro.
  - Titulares: anchura 125 % (expandida, como la rotulación de competición), peso 250 para la parte «seri» y 850 para la palabra clave «art». En el panel, la palabra clave se marca entre asteriscos: `Rotulación de *vehículos*`.
  - Texto: anchura 100 %, 400/500, 17–18 px, interlineado 1,55.
- **IBM Plex Mono** 400 para pies de foto técnicos, migas, etiquetas y datos (horario, dirección). Es la voz de la «hoja de trabajo».

## Recursos de marca

1. **Franja de librea**: tres bandas diagonales paralelas (cian ancha, negra y naranja finas) inclinadas como las de la Caddy de Sellagas. Se usa solo en la portada, en las cabeceras de servicios sin foto, en el bloque de contacto y en la 404. Entra con un barrido de izquierda a derecha, como la rasqueta que asienta el vinilo (una vez; estática con movimiento reducido).
2. **Dorsal**: el disco blanco con número de las puertas de los coches de rally. Numera trabajos y pasos del proceso. Nada más.
3. **Pie técnico**: etiqueta en monoespaciada sobre cada foto con vehículo · trabajo · año.
4. **Wordmark** «seri**art**» a ancho completo en el pie.

## Fotografía

Solo fotos reales del Instagram del taller (autorizado por el cliente), seleccionadas por nitidez y por contar algo: trabajo terminado, proceso (replanteo, impresión en la Mimaki, aplicación) y la tienda. Hechas con móvil, sin retoque de estudio: se presentan **como lo que son**, grandes, con encuadres que priorizan el trabajo (`object-position` por foto) y sin filtros. No se usan imágenes de bancos ni de otras empresas. Servicios sin foto propia (lonas, roll-ups, letras corpóreas…) se resuelven con tipografía y franja, no con stock.

## Composición y ritmo

Rejilla de 12 columnas, márgenes amplios, filetes de 1 px como estructura (Brooklyn, ACME). Alternancia de densidad: portada tipográfica con foto alta → índice de trabajos (lista + vista previa) → proceso en tira horizontal de fotos → hoja de servicios con filetes → plancha cian a sangre → la tienda → pie con wordmark. Ninguna sección repite la composición de la anterior.

## Arquitectura

Se conserva la estructura de URLs existente (buena para SEO y para el panel):

- `/` Inicio · `/trabajos.html` · `/servicios.html` · `/servicios/{rotulacion|serigrafia|gran-formato}.html` · 12 páginas de servicio · `/nosotros.html` (El taller) · `/contacto.html` · `/presupuesto.html` · `/legal.html` · `/gracias.html` · `/404.html`.
- Se elimina `/creditos.html`: ya no hay fotos de terceros.
- Menú: Trabajos · Servicios · El taller · Contacto + teléfono + botón «Presupuesto». Sin megamenú (el pie y la página de servicios enlazan todos los servicios).

## Navegación y componentes

- Cabecera fija clara con logo en color; en móvil, menú a pantalla completa con enlaces grandes y botones de llamar / WhatsApp.
- En móvil, barra inferior «WhatsApp · Llamar» que aparece tras la portada; el contenido reserva su espacio para no quedar tapado.
- Botones rectangulares (radio 2 px), negro sobre papel; en la plancha cian, negro sobre cian.
- Listas en vez de tarjetas. Iconos solo funcionales (teléfono, WhatsApp, flecha).

## Interacciones justificadas

- Barrido de la franja de librea (identidad, una sola vez).
- Vista previa de foto al pasar por cada trabajo del índice en escritorio (ayuda a recorrer el archivo); en móvil cada fila lleva su foto.
- Galerías con visor ampliable (ya existente).
- Vídeo timelapse que solo se reproduce en pantalla y con botón de pausa.
- Entradas suaves al hacer scroll (opacidad + 12 px), desactivadas con `prefers-reduced-motion`.

## Riesgos que se evitan

- Convertir la franja en papel pintado: máximo un uso por pantalla.
- Estética de «racing» agresiva (negro + rojo + cursivas por todas partes): el taller también rotula panaderías y escaparates.
- Tarjetas redondeadas, iconos genéricos, degradados, glassmorphism, cursores personalizados, vídeo de fondo con titular centrado.
- Prometer plazos, materiales o garantías que no constan.
- Presentar como propio cualquier trabajo que no lo sea.
