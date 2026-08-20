"use strict";
/* Editorial content for every service page. Kept separate from the renderer
   so copy can be edited without touching template logic. */

const SERIGRAFIA = {
  slug: "serigrafia", label: "Serigrafía", icon: "shirt",
  heroImg: "screen-printing-process.jpg",
  metaTitle: "Serigrafía en Denia | Textil, ropa laboral y merchandising — Seriart",
  metaDescription: "Serigrafía textil, ropa laboral personalizada y merchandising publicitario en Denia, Alicante. Más de 20 años imprimiendo para empresas de toda España.",
  kicker: "Serigrafía",
  title: "Serigrafía textil y merchandising con acabado de taller",
  lead: "Impresión serigráfica sobre prendas y objetos promocionales, pensada para que la imagen de tu marca aguante lavados, uso diario y jornadas de trabajo.",
  intro: [
    "La serigrafía es nuestro oficio desde 2002. Trabajamos con tintas de calidad textil e industrial que resisten el lavado y el roce, y con procesos que se adaptan tanto a una tirada de diez camisetas como a un pedido de varios cientos de prendas.",
    "Cada encargo pasa por el mismo taller de Denia donde preparamos las pantallas, ajustamos los colores y revisamos la calidad prenda a prenda antes de entregarlo. Trabajamos con comercios, empresas, asociaciones, clubes y particulares de toda España."
  ],
  types: [
    { title: "Camisetas y polos", desc: "Serigrafía a una o varias tintas sobre algodón, técnico o mezcla." },
    { title: "Sudaderas y chaquetas", desc: "Logotipos grandes, espalda completa o detalles en manga y pecho." },
    { title: "Ropa laboral", desc: "Uniformes con logo permanente para equipos de trabajo." },
    { title: "Delantales y textil de hostelería", desc: "Impresión resistente a lavados frecuentes." },
    { title: "Bolsas de tela", desc: "Totebags serigrafiadas para eventos, tiendas y regalo corporativo." },
    { title: "Textil deportivo", desc: "Equipaciones de clubes y grupos con numeración." }
  ],
  gallery: [
    { src: "tshirt-stack.jpg", alt: "Camisetas serigrafiadas apiladas" },
    { src: "screen-printing-process.jpg", alt: "Detalle de estampación textil" },
    { src: "workshop-machine.jpg", alt: "Taller de serigrafía de Seriart" }
  ]
};

const SUB_SERIGRAFIA = [
  {
    slug: "textil", cat: SERIGRAFIA, label: "Serigrafía textil",
    metaTitle: "Serigrafía textil en Denia | Camisetas y ropa personalizada — Seriart",
    metaDescription: "Estampación serigráfica sobre camisetas, sudaderas y textil para empresas, comercios y eventos en Denia, Alicante. Tiradas cortas y grandes.",
    kicker: "Serigrafía · Textil", title: "Serigrafía textil",
    lead: "Estampamos camisetas, sudaderas, polos y textil promocional con tintas de calidad que aguantan el lavado y el uso diario.",
    heroImg: "screen-printing-process.jpg",
    intro: [
      "La serigrafía textil sigue siendo, después de más de veinte años, la técnica que mejor resultado da en prendas de uso continuo: el color queda integrado en la fibra y aguanta muchos más lavados que un vinilo o una impresión digital directa.",
      "Preparamos cada pedido a medida: elegimos el tipo de tinta según el tejido, hacemos una prueba de color si el pedido lo requiere y ajustamos el número de pantallas al diseño, desde un logotipo a una tinta hasta ilustraciones más complejas."
    ],
    types: [
      { title: "Camisetas de algodón y técnicas", desc: "Para eventos, comercios, asociaciones y regalo de empresa." },
      { title: "Sudaderas y chaquetas", desc: "Estampado grande en espalda o detalle en pecho y manga." },
      { title: "Polos", desc: "Logotipo discreto en pecho, ideal para imagen de empresa." },
      { title: "Textil deportivo", desc: "Equipaciones con nombres y dorsales numerados." },
      { title: "Bolsas y totebags", desc: "Para tiendas, ferias y campañas de comunicación." }
    ],
    gallery: [
      { src: "tshirt-stack.jpg", alt: "Camisetas estampadas en serigrafía" },
      { src: "screen-printing-process.jpg", alt: "Diseño serigrafiado sobre textil" },
      { src: "workshop-machine.jpg", alt: "Preparación de pantallas de serigrafía" }
    ],
    faqs: [
      { q: "¿Cuál es la cantidad mínima para un pedido?", a: "Trabajamos tanto tiradas cortas como pedidos grandes. Cuéntanos la cantidad que necesitas y te decimos la técnica y el precio que mejor se ajustan." },
      { q: "¿Puedo llevar mis propias prendas?", a: "Sí, puedes traer tus propias camisetas o sudaderas para que las estampemos, o pedirnos que te las suministremos nosotros." },
      { q: "¿Cuánto tarda un pedido de serigrafía textil?", a: "Depende del volumen y del número de colores del diseño. Te damos un plazo concreto al confirmar el presupuesto." },
      { q: "¿Aguanta la impresión muchos lavados?", a: "Sí, es una de las ventajas principales de la serigrafía frente a otras técnicas de impresión textil." }
    ]
  },
  {
    slug: "ropa-laboral", cat: SERIGRAFIA, label: "Ropa laboral personalizada",
    metaTitle: "Ropa laboral personalizada en Denia | Uniformes con logo — Seriart",
    metaDescription: "Personalizamos ropa laboral y uniformes de empresa con serigrafía o bordado en Denia. Imagen homogénea para tu equipo, en toda España.",
    kicker: "Serigrafía · Ropa laboral", title: "Ropa laboral personalizada",
    lead: "Uniformes y prendas de trabajo con el logotipo de tu empresa, pensados para durar tantas jornadas como haga falta.",
    heroImg: "workwear.jpeg",
    intro: [
      "Una plantilla con la imagen de empresa bien puesta transmite algo que ningún cartel consigue: profesionalidad de un vistazo. Personalizamos polos, camisas, chaquetas, chalecos y ropa técnica con tu logotipo, en la posición y el tamaño que mejor encaje con cada prenda.",
      "Trabajamos tanto con prendas que nos facilita el cliente como con proveedores de ropa laboral, para que un mismo pedido incluya la prenda y la personalización sin que tengas que gestionar dos proveedores distintos."
    ],
    types: [
      { title: "Polos y camisas de empresa", desc: "Logotipo en pecho, con acabado discreto y resistente." },
      { title: "Chalecos y chaquetas técnicas", desc: "Para trabajo en exterior, almacén o reparto." },
      { title: "Ropa de hostelería", desc: "Delantales, gorros y camisas para cocina y sala." },
      { title: "Equipos de mantenimiento y obra", desc: "Prendas resistentes con logotipo de alta durabilidad." }
    ],
    gallery: [
      { src: "workwear.jpeg", alt: "Trabajadores con ropa laboral personalizada" },
      { src: "about-team.jpg", alt: "Equipo con uniforme de empresa" },
      { src: "workshop-machine.jpg", alt: "Taller de personalización textil" }
    ],
    faqs: [
      { q: "¿Podéis personalizar la ropa que ya usa mi equipo?", a: "Sí, si nos traes las prendas nosotros nos encargamos de la personalización." },
      { q: "¿Podéis suministrar también las prendas?", a: "Sí, trabajamos con proveedores de ropa laboral y te asesoramos sobre el tejido más adecuado según el uso." },
      { q: "¿Qué técnica usáis, serigrafía o bordado?", a: "Depende de la prenda y del acabado que busques. Te recomendamos la técnica más adecuada al pedirnos presupuesto." },
      { q: "¿Puedo pedir tallas distintas dentro del mismo pedido?", a: "Sí, es habitual en pedidos de uniformidad. Indícanoslo en el formulario de presupuesto." }
    ]
  },
  {
    slug: "merchandising", cat: SERIGRAFIA, label: "Merchandising",
    metaTitle: "Merchandising publicitario en Denia | Regalos de empresa — Seriart",
    metaDescription: "Merchandising y regalos publicitarios personalizados en Denia, Alicante: bolsas, textil, tazas y objetos de empresa para eventos y campañas.",
    kicker: "Serigrafía · Merchandising", title: "Merchandising publicitario",
    lead: "Objetos y textil personalizados para ferias, eventos, campañas de comunicación y regalo de empresa.",
    heroImg: "merch-items.jpg",
    intro: [
      "El merchandising bien hecho es publicidad que la gente se queda con gusto. Personalizamos bolsas de tela, textil, y otros soportes con tu marca para que sean algo más que un objeto de usar y tirar.",
      "Te ayudamos a elegir soportes que encajen con el presupuesto y el objetivo del proyecto, ya sea una feria puntual, el regalo de fin de año o una campaña de comunicación más amplia."
    ],
    types: [
      { title: "Bolsas de tela", desc: "Totebags serigrafiadas para tiendas, ferias y eventos." },
      { title: "Textil promocional", desc: "Camisetas y gorras con el logotipo de campaña." },
      { title: "Regalo de empresa", desc: "Selección de objetos personalizados para clientes y equipo." },
      { title: "Material para ferias", desc: "Merchandising a juego con la imagen del stand." }
    ],
    gallery: [
      { src: "merch-items.jpg", alt: "Objetos de merchandising personalizados" },
      { src: "screen-printing-process.jpg", alt: "Textil promocional serigrafiado" },
      { src: "tshirt-stack.jpg", alt: "Camisetas de campaña" }
    ],
    faqs: [
      { q: "¿Tenéis catálogo de objetos personalizables?", a: "Trabajamos con varios proveedores de artículos promocionales; cuéntanos el objetivo del proyecto y te proponemos opciones." },
      { q: "¿Puedo pedir una muestra antes de la tirada completa?", a: "Sí, para pedidos grandes es habitual preparar una muestra o prueba de color antes de producir el resto." },
      { q: "¿Hacéis envíos a toda España?", a: "Sí, preparamos y enviamos pedidos de merchandising a cualquier punto de España." },
      { q: "¿Cuánto tiempo antes debo pedirlo si es para un evento?", a: "Cuanto antes mejor, sobre todo si el pedido es grande. Indícanos la fecha del evento en el formulario de presupuesto y ajustamos plazos." }
    ]
  }
];

const ROTULACION = {
  slug: "rotulacion", label: "Rotulación", icon: "signage",
  heroImg: "hero-vehicle-wrap.jpg",
  metaTitle: "Rotulación en Denia | Vehículos, negocios y escaparates — Seriart",
  metaDescription: "Rotulación de vehículos, rótulos para negocios, letras corpóreas, escaparates y vinilos en Denia, Alicante. Diseño, fabricación e instalación.",
  kicker: "Rotulación",
  title: "Rotulación para vehículos, negocios y espacios",
  lead: "Diseñamos, fabricamos e instalamos la rotulación de tu vehículo, tu fachada o tu escaparate, con materiales pensados para durar a la intemperie.",
  intro: [
    "La rotulación es la parte más visible de una imagen de marca: un vehículo, una fachada o un escaparate bien rotulado comunica antes de que nadie lea una sola palabra. Nos encargamos de todo el proceso, desde el diseño hasta la instalación final.",
    "Trabajamos con vinilos, PVC, metacrilato y otros materiales resistentes a la intemperie, y nos desplazamos para instalar en Denia y alrededores, además de coordinar envíos e instalaciones en otros puntos de España."
  ],
  types: [
    { title: "Rotulación de vehículos", desc: "Vinilo integral o parcial para flotas y vehículos individuales." },
    { title: "Rótulos para negocios", desc: "Fachadas, banderolas y señalética exterior." },
    { title: "Letras corpóreas", desc: "Letras 3D con y sin iluminación para fachadas." },
    { title: "Escaparates", desc: "Vinilos para cristal, horarios y comunicación de temporada." },
    { title: "Vinilos decorativos", desc: "Interiores de oficina, comercio y espacios de trabajo." }
  ],
  gallery: [
    { src: "hero-vehicle-wrap.jpg", alt: "Rotulación de vehículo comercial" },
    { src: "channel-letters.jpg", alt: "Letras corpóreas iluminadas" },
    { src: "shop-storefront.jpg", alt: "Rótulo de negocio" }
  ]
};

const SUB_ROTULACION = [
  {
    slug: "vehiculos", cat: ROTULACION, label: "Vehículos",
    metaTitle: "Rotulación de vehículos en Denia | Vinilo para furgonetas y coches — Seriart",
    metaDescription: "Rotulación de vehículos comerciales y particulares en Denia, Alicante. Vinilo integral o parcial, diseño incluido. Trabajamos con flotas de toda España.",
    kicker: "Rotulación · Vehículos", title: "Rotulación de vehículos",
    lead: "Convierte tu furgoneta, coche o flota en un anuncio que se mueve por toda la ciudad, con vinilo resistente y una instalación cuidada.",
    heroImg: "hero-vehicle-wrap.jpg",
    intro: [
      "Un vehículo rotulado trabaja para tu marca cada vez que sale a la calle. Diseñamos la composición gráfica adaptada a la carrocería de cada vehículo y usamos vinilo de calidad profesional, resistente al sol, la lluvia y el lavado habitual.",
      "Podemos rotular un vehículo puntual o coordinar la imagen de una flota completa, manteniendo el mismo diseño y los mismos materiales en todas las unidades para que la imagen de empresa sea homogénea."
    ],
    types: [
      { title: "Rotulación integral", desc: "Cobertura completa de la carrocería con diseño a medida." },
      { title: "Rotulación parcial", desc: "Logotipo, datos de contacto y elementos gráficos puntuales." },
      { title: "Flotas de vehículos", desc: "Mismo diseño replicado en varias unidades." },
      { title: "Lunas y cristales", desc: "Vinilo microperforado que no impide la visibilidad desde dentro." }
    ],
    gallery: [
      { src: "car-wrap-detail.jpg", alt: "Vehículo con acabado personalizado" },
      { src: "van-signage.jpg", alt: "Detalle de vinilo aplicado sobre carrocería" },
      { src: "hero-vehicle-wrap.jpg", alt: "Ejemplo de rotulación integral de vehículo" }
    ],
    faqs: [
      { q: "¿Tengo que dejar el vehículo en el taller?", a: "Sí, la instalación requiere que el vehículo esté con nosotros durante el tiempo de aplicación, que depende del tamaño del proyecto." },
      { q: "¿El vinilo daña la pintura?", a: "No, es un material pensado para aplicarse y retirarse sin dañar la pintura original si se instala y se retira correctamente." },
      { q: "¿Puedo rotular solo una parte del vehículo?", a: "Sí, hacemos tanto rotulación integral como parcial, según el presupuesto y el efecto que busques." },
      { q: "¿Cuánto dura el vinilo instalado?", a: "Con un uso normal, varios años. Te informamos de la durabilidad del material concreto al hacer el presupuesto." }
    ]
  },
  {
    slug: "rotulos-negocios", cat: ROTULACION, label: "Rótulos para negocios",
    metaTitle: "Rótulos para negocios en Denia | Fachadas y señalética — Seriart",
    metaDescription: "Diseño, fabricación e instalación de rótulos para negocios en Denia, Alicante: fachadas, banderolas y señalética exterior.",
    kicker: "Rotulación · Negocios", title: "Rótulos para negocios",
    lead: "El rótulo de fachada es la primera impresión de tu negocio. Lo diseñamos, fabricamos e instalamos para que se vea bien de día y de noche.",
    heroImg: "shop-storefront.jpg",
    intro: [
      "Un rótulo mal resuelto pasa desapercibido; uno bien pensado hace que un negocio se identifique desde lejos. Trabajamos la fachada como un conjunto: rótulo principal, banderola lateral y señalética complementaria, con materiales adaptados a la exposición al sol y la lluvia.",
      "Nos encargamos de la fabricación en taller y de la instalación en el propio local, coordinando horarios para no interferir con la actividad del negocio."
    ],
    types: [
      { title: "Rótulos de fachada", desc: "Placas, cajones luminosos y paneles con el nombre del negocio." },
      { title: "Banderolas", desc: "Rótulos perpendiculares a fachada, visibles desde ambos lados de la calle." },
      { title: "Señalética exterior", desc: "Indicadores de horario, entrada y otra información práctica." },
      { title: "Rótulos luminosos", desc: "Cajones y letreros con iluminación LED para visibilidad nocturna." }
    ],
    gallery: [
      { src: "shop-storefront.jpg", alt: "Fachada de negocio con rótulo" },
      { src: "channel-letters.jpg", alt: "Rótulo luminoso de negocio" },
      { src: "van-signage.jpg", alt: "Detalle de acabado de vinilo" }
    ],
    faqs: [
      { q: "¿Necesito permiso del ayuntamiento para instalar un rótulo?", a: "Depende del municipio y del tipo de rótulo. Te orientamos sobre qué suele requerir permiso, aunque la gestión municipal corresponde al titular del negocio." },
      { q: "¿Podéis hacer rótulos con iluminación?", a: "Sí, fabricamos cajones y letras con iluminación LED cuando el proyecto lo requiere." },
      { q: "¿Cuánto tarda la fabricación e instalación de un rótulo?", a: "Depende del tamaño y la complejidad. Te damos un plazo concreto al valorar el proyecto." },
      { q: "¿Hacéis el mantenimiento del rótulo con el tiempo?", a: "Sí, podemos revisar o reparar rótulos que hayamos instalado nosotros." }
    ]
  },
  {
    slug: "letras-corporeas", cat: ROTULACION, label: "Letras corpóreas",
    metaTitle: "Letras corpóreas en Denia | Rótulos 3D para fachadas — Seriart",
    metaDescription: "Fabricación e instalación de letras corpóreas para fachadas de negocios en Denia, Alicante. Con y sin iluminación, a medida.",
    kicker: "Rotulación · Letras corpóreas", title: "Letras corpóreas",
    lead: "Letras en volumen que dan a tu fachada un acabado más sólido y profesional que un simple vinilo impreso.",
    heroImg: "channel-letters.jpg",
    intro: [
      "Las letras corpóreas aportan profundidad y presencia a una fachada. Las fabricamos a medida en PVC, metacrilato u otros materiales, con o sin iluminación interior, ajustando tamaño y tipografía al espacio disponible.",
      "Es una solución habitual para negocios que quieren un acabado más duradero y de mayor calidad percibida que la rotulación plana, especialmente en fachadas con buena visibilidad."
    ],
    types: [
      { title: "Letras sin iluminar", desc: "PVC o metacrilato con acabado en color corporativo." },
      { title: "Letras retroiluminadas", desc: "Efecto halo de luz alrededor de cada letra." },
      { title: "Letras luminosas frontales", desc: "Iluminación LED integrada visible de frente." },
      { title: "Logotipos en volumen", desc: "Símbolos e iconos corporativos en 3D, a juego con las letras." }
    ],
    gallery: [
      { src: "channel-letters.jpg", alt: "Letras corpóreas iluminadas en fachada" },
      { src: "shop-storefront.jpg", alt: "Fachada con letras corpóreas" },
      { src: "workshop-machine.jpg", alt: "Fabricación de letras en taller" }
    ],
    faqs: [
      { q: "¿Qué materiales usáis para las letras corpóreas?", a: "Principalmente PVC y metacrilato, según el acabado y el presupuesto del proyecto." },
      { q: "¿Se pueden iluminar todas las letras?", a: "Sí, podemos incorporar iluminación LED frontal o retroiluminada según el efecto que busques." },
      { q: "¿Sirven para interior además de fachada?", a: "Sí, también se usan en recepciones y espacios interiores como elemento de imagen corporativa." },
      { q: "¿Cómo se instalan en la fachada?", a: "Con anclajes ocultos pensados para cada tipo de superficie, revisando la fachada antes de fabricar para asegurar un buen anclaje." }
    ]
  },
  {
    slug: "escaparates", cat: ROTULACION, label: "Escaparates",
    metaTitle: "Rotulación de escaparates en Denia | Vinilos para comercios — Seriart",
    metaDescription: "Rotulación de escaparates y vinilos para comercios en Denia, Alicante: horarios, ofertas, temporada y comunicación de tienda.",
    kicker: "Rotulación · Escaparates", title: "Rotulación de escaparates",
    lead: "Comunicación directa sobre el cristal de tu comercio: horarios, campañas de temporada, ofertas o simplemente tu imagen de marca.",
    heroImg: "shop-window-vinyl.jpg",
    intro: [
      "El escaparate es el espacio publicitario más visitado de cualquier comercio: lo ve todo el que pasa por la calle. Con vinilo de corte o impreso, comunicamos lo que necesites sin tapar el interior de la tienda más de lo necesario.",
      "Preparamos tanto piezas permanentes, como el nombre del comercio o el horario, como campañas puntuales de temporada o rebajas que se pueden retirar sin dejar marca en el cristal."
    ],
    types: [
      { title: "Vinilo de corte", desc: "Textos y logotipos recortados en color liso, sin fondo." },
      { title: "Vinilo impreso", desc: "Composiciones a todo color para campañas de temporada." },
      { title: "Horarios y datos de contacto", desc: "Información práctica siempre visible desde la calle." },
      { title: "Vinilo microperforado", desc: "Grandes superficies de cristal sin perder visibilidad interior." }
    ],
    gallery: [
      { src: "shop-window-vinyl.jpg", alt: "Escaparate con vinilo rotulado" },
      { src: "shop-storefront.jpg", alt: "Comercio con escaparate personalizado" },
      { src: "blank-shopfront.jpg", alt: "Escaparate antes de aplicar el vinilo" }
    ],
    faqs: [
      { q: "¿El vinilo se puede quitar sin dañar el cristal?", a: "Sí, está pensado para retirarse sin dejar residuos si se aplica correctamente." },
      { q: "¿Puedo cambiar el vinilo del escaparate en cada temporada?", a: "Sí, es habitual renovar campañas de temporada o rebajas varias veces al año." },
      { q: "¿El vinilo impide ver el interior de la tienda?", a: "Depende del tipo. El vinilo microperforado permite ver desde dentro casi con normalidad." },
      { q: "¿Diseñáis vosotros la composición del escaparate?", a: "Sí, te proponemos una composición o adaptamos tu diseño al tamaño real del cristal." }
    ]
  },
  {
    slug: "vinilos", cat: ROTULACION, label: "Vinilos decorativos",
    metaTitle: "Vinilos decorativos en Denia | Interiores de oficina y comercio — Seriart",
    metaDescription: "Vinilos decorativos para interiores de oficinas, comercios y espacios de trabajo en Denia, Alicante. Diseño a medida.",
    kicker: "Rotulación · Vinilos", title: "Vinilos decorativos",
    lead: "Vinilo para paredes y superficies interiores: logotipos de recepción, frases corporativas o elementos decorativos a medida.",
    heroImg: "shop-window-vinyl.jpg",
    intro: [
      "Un vinilo bien colocado en una pared puede sustituir a un cuadro, un mural o un rótulo de recepción, con un coste y un tiempo de instalación mucho menores. Lo usamos tanto en oficinas como en comercios y espacios de trabajo.",
      "Trabajamos a partir de tu logotipo o de un diseño que preparamos a medida, adaptado al tamaño y al color de la pared o superficie donde se va a instalar."
    ],
    types: [
      { title: "Logotipo de recepción", desc: "Presencia de marca en la entrada de oficinas y locales." },
      { title: "Frases y mensajes corporativos", desc: "Espacios de trabajo, salas de reuniones y zonas comunes." },
      { title: "Vinilos decorativos", desc: "Motivos gráficos para dar personalidad a un espacio." },
      { title: "Señalética interior", desc: "Identificación de salas y zonas dentro de un edificio." }
    ],
    gallery: [
      { src: "shop-window-vinyl.jpg", alt: "Vinilo decorativo en pared de oficina" },
      { src: "shop-window-vinyl.jpg", alt: "Vinilo aplicado en interior" },
      { src: "channel-letters.jpg", alt: "Logotipo en vinilo para recepción" }
    ],
    faqs: [
      { q: "¿Puedo pedir un vinilo con mi propio diseño?", a: "Sí, podemos trabajar sobre un diseño que ya tengas o preparar uno nuevo." },
      { q: "¿En qué superficies se puede instalar?", a: "En paredes lisas, cristal y otras superficies interiores. Si tienes dudas sobre la superficie, consúltanos antes de pedir presupuesto." },
      { q: "¿Se puede retirar sin dañar la pared?", a: "En superficies pintadas en buen estado, sí, aunque depende del tiempo que lleve instalado." },
      { q: "¿Instaláis vosotros el vinilo?", a: "Sí, nos desplazamos para instalar en Denia y alrededores, y coordinamos instalaciones en otras zonas cuando el proyecto lo requiere." }
    ]
  }
];

const GRAN_FORMATO = {
  slug: "gran-formato", label: "Gran formato", icon: "banner",
  heroImg: "large-format-banner.jpg",
  metaTitle: "Impresión de gran formato en Denia | Lonas, banners y roll-ups — Seriart",
  metaDescription: "Impresión de gran formato en Denia, Alicante: lonas publicitarias, banners, roll-ups y cartelería para eventos, comercios y empresas.",
  kicker: "Gran formato",
  title: "Impresión de gran formato para eventos y comercios",
  lead: "Lonas, banners, roll-ups y cartelería impresos a gran tamaño, listos para colgar en fachada, montar en un stand o instalar en la calle.",
  intro: [
    "La impresión de gran formato cubre todo lo que necesita verse de lejos: una lona en una fachada, un roll-up en una feria o un cartel en un escaparate. Imprimimos en nuestro propio taller y controlamos el acabado de principio a fin.",
    "Trabajamos tanto proyectos puntuales, como un evento o una feria, como pedidos recurrentes para comercios y empresas que necesitan renovar su cartelería varias veces al año."
  ],
  types: [
    { title: "Lonas publicitarias", desc: "Grandes formatos para fachadas, vallas y obras." },
    { title: "Banners y pancartas", desc: "Para eventos, exteriores y campañas puntuales." },
    { title: "Roll-ups", desc: "Expositores portátiles para ferias y puntos de venta." },
    { title: "Cartelería", desc: "Carteles y paneles para escaparates e interiores." }
  ],
  gallery: [
    { src: "large-format-banner.jpg", alt: "Impresión de lona de gran formato" },
    { src: "poster-display.jpg", alt: "Roll-up para feria o evento" },
    { src: "poster-display.jpg", alt: "Cartelería de gran formato" }
  ]
};

const SUB_GRAN_FORMATO = [
  {
    slug: "lonas", cat: GRAN_FORMATO, label: "Lonas publicitarias",
    metaTitle: "Lonas publicitarias en Denia | Impresión de gran formato — Seriart",
    metaDescription: "Impresión y montaje de lonas publicitarias en Denia, Alicante: fachadas, vallas, andamios y obras. Materiales resistentes a la intemperie.",
    kicker: "Gran formato · Lonas", title: "Lonas publicitarias",
    lead: "Lonas de gran tamaño para fachadas, vallas y obras, impresas con materiales pensados para aguantar sol, lluvia y viento.",
    heroImg: "large-format-banner.jpg",
    intro: [
      "Una lona bien impresa cubre una fachada entera con la imagen de una campaña, una obra o un evento. Usamos lonas de PVC con ojales reforzados, preparadas para instalarse a la intemperie durante semanas o meses sin perder color.",
      "Nos encargamos del diseño, la impresión y, si el proyecto lo requiere, del montaje en altura con los medios adecuados."
    ],
    types: [
      { title: "Lonas de fachada", desc: "Grandes formatos para reformas, aperturas o campañas." },
      { title: "Lonas para andamios y obras", desc: "Cubren el andamiaje mientras dura la obra." },
      { title: "Lonas para eventos", desc: "Identidad visual de un evento en su acceso principal." },
      { title: "Vallas publicitarias", desc: "Formato horizontal para exterior y grandes superficies." }
    ],
    gallery: [
      { src: "large-format-banner.jpg", alt: "Lona publicitaria de gran formato" },
      { src: "outdoor-banner.jpg", alt: "Lona instalada en fachada" },
      { src: "workshop-machine.jpg", alt: "Impresión de gran formato en taller" }
    ],
    faqs: [
      { q: "¿Qué material lleva la lona?", a: "Trabajamos principalmente con PVC de gran formato con ojales reforzados, adecuado para instalación en exterior." },
      { q: "¿Aguanta la lluvia y el sol durante meses?", a: "Sí, es un material pensado para exterior, aunque la durabilidad exacta depende del tiempo de exposición y la orientación." },
      { q: "¿Podéis encargaros del montaje?", a: "Sí, coordinamos el montaje cuando el proyecto lo requiere, incluyendo instalaciones en altura." },
      { q: "¿Cuál es el tamaño máximo que podéis imprimir?", a: "Trabajamos con equipos de gran formato; cuéntanos las medidas exactas y te confirmamos la viabilidad." }
    ]
  },
  {
    slug: "banners", cat: GRAN_FORMATO, label: "Banners y pancartas",
    metaTitle: "Banners y pancartas en Denia | Impresión para eventos — Seriart",
    metaDescription: "Impresión de banners y pancartas en Denia, Alicante para eventos, exteriores y campañas publicitarias puntuales.",
    kicker: "Gran formato · Banners", title: "Banners y pancartas",
    lead: "Banners y pancartas para eventos, competiciones y campañas puntuales, listos para colgar o instalar el mismo día.",
    heroImg: "outdoor-banner.jpg",
    intro: [
      "Para un evento, una carrera popular o una campaña de pocos días, un banner o una pancarta resuelven la comunicación sin necesidad de una instalación permanente. Los preparamos con materiales ligeros, fáciles de transportar y de montar.",
      "Ajustamos el acabado (ojales, dobladillo, varilla) al tipo de instalación que vayas a hacer, para que el montaje sea sencillo el día del evento."
    ],
    types: [
      { title: "Banners para exterior", desc: "Con ojales para atar o colgar en vallas y estructuras." },
      { title: "Pancartas de gran tamaño", desc: "Para actos, competiciones deportivas y celebraciones." },
      { title: "Banners para interior", desc: "Ferias, salas de conferencias y puntos de venta." },
      { title: "Banderolas con varilla", desc: "Fácil montaje en soportes verticales." }
    ],
    gallery: [
      { src: "outdoor-banner.jpg", alt: "Pancarta de gran formato instalada" },
      { src: "large-format-banner.jpg", alt: "Impresión de banner en taller" },
      { src: "poster-display.jpg", alt: "Banner para evento" }
    ],
    faqs: [
      { q: "¿Puedo pedir un banner con urgencia para un evento próximo?", a: "Cuéntanos la fecha del evento al pedir presupuesto y te confirmamos si el plazo es viable." },
      { q: "¿Qué acabado lleva el banner, ojales o varilla?", a: "Depende de cómo lo vayas a instalar. Te lo preguntamos al preparar el presupuesto para ajustar el acabado." },
      { q: "¿Se pueden reutilizar en varios eventos?", a: "Sí, si el diseño no lleva fechas concretas, el banner se puede reutilizar mientras el material aguante." },
      { q: "¿Hacéis pancartas de gran longitud?", a: "Sí, trabajamos formatos grandes; indícanos las medidas exactas en el formulario de presupuesto." }
    ]
  },
  {
    slug: "roll-ups", cat: GRAN_FORMATO, label: "Roll-ups",
    metaTitle: "Roll-ups en Denia | Expositores para ferias y eventos — Seriart",
    metaDescription: "Impresión de roll-ups en Denia, Alicante. Expositores portátiles para ferias, puntos de venta y presentaciones, listos en su estuche.",
    kicker: "Gran formato · Roll-ups", title: "Roll-ups",
    lead: "Expositores enrollables, ligeros y fáciles de transportar, listos para montar en cualquier feria, tienda o presentación.",
    heroImg: "poster-display.jpg",
    intro: [
      "El roll-up es el soporte más práctico para quien necesita comunicar en distintos sitios: cabe en su propia bolsa de transporte, se monta en menos de un minuto y se puede reutilizar tantas veces como haga falta.",
      "Imprimimos la lona y montamos el mecanismo, listo para usar nada más recibirlo. También podemos preparar varias unidades con el mismo diseño para stands o puntos de venta múltiples."
    ],
    types: [
      { title: "Roll-up estándar", desc: "Tamaño habitual para ferias y presentaciones, con bolsa de transporte." },
      { title: "Roll-up de gran formato", desc: "Mayor anchura para presencia destacada en stands." },
      { title: "Roll-up de doble cara", desc: "Visible desde ambos lados en pasillos y zonas de paso." },
      { title: "Packs para varios puntos de venta", desc: "Mismo diseño replicado en varias unidades." }
    ],
    gallery: [
      { src: "poster-display.jpg", alt: "Roll-up montado en feria" },
      { src: "poster-display.jpg", alt: "Expositor de gran formato" },
      { src: "outdoor-banner.jpg", alt: "Soporte publicitario portátil" }
    ],
    faqs: [
      { q: "¿El roll-up incluye el mecanismo o solo la lona?", a: "Incluye el mecanismo completo, listo para montar y transportar en su bolsa." },
      { q: "¿Puedo cambiar solo la lona más adelante?", a: "Sí, si conservas el mecanismo podemos imprimir solo la lona de recambio." },
      { q: "¿Es fácil de montar sin ayuda?", a: "Sí, el mecanismo está pensado para montarse en menos de un minuto sin herramientas." },
      { q: "¿Cuánto tarda la fabricación de un roll-up?", a: "Suele ser uno de nuestros plazos más cortos dentro de gran formato; te lo confirmamos al presupuestar." }
    ]
  },
  {
    slug: "carteleria", cat: GRAN_FORMATO, label: "Cartelería",
    metaTitle: "Cartelería en Denia | Carteles y paneles de gran formato — Seriart",
    metaDescription: "Impresión de cartelería y paneles de gran formato en Denia, Alicante para escaparates, interiores y puntos de información.",
    kicker: "Gran formato · Cartelería", title: "Cartelería",
    lead: "Carteles y paneles impresos a gran tamaño para escaparates, interiores de tienda y puntos de información.",
    heroImg: "poster-display.jpg",
    intro: [
      "La cartelería resuelve la comunicación puntual: una oferta, una novedad, información de temporada. La imprimimos sobre distintos soportes (papel, cartón pluma, PVC) según dónde se vaya a colocar y cuánto tiempo tenga que aguantar.",
      "Es habitual combinarla con otras piezas de gran formato, como escaparates o roll-ups, para que toda la comunicación de una campaña mantenga la misma imagen."
    ],
    types: [
      { title: "Carteles para escaparate", desc: "Ofertas, novedades y comunicación de temporada." },
      { title: "Paneles rígidos", desc: "Sobre cartón pluma o PVC, para interior y exterior protegido." },
      { title: "Paneles informativos", desc: "Señalética y puntos de información en comercios y oficinas." },
      { title: "Displays de mostrador", desc: "Formato pequeño para punto de venta." }
    ],
    gallery: [
      { src: "poster-display.jpg", alt: "Cartelería impresa de gran formato" },
      { src: "poster-display.jpg", alt: "Panel informativo en evento" },
      { src: "large-format-banner.jpg", alt: "Impresión de cartel en taller" }
    ],
    faqs: [
      { q: "¿Sobre qué materiales imprimís la cartelería?", a: "Según el uso: papel para interior de corta duración, o cartón pluma y PVC para piezas más resistentes." },
      { q: "¿Puedo pedir varios tamaños del mismo cartel?", a: "Sí, es habitual combinar formatos distintos para escaparate, mostrador e interior en la misma campaña." },
      { q: "¿Hacéis cartelería para exterior?", a: "Sí, aunque para exterior prolongado solemos recomendar materiales más resistentes, como PVC o lona." },
      { q: "¿Puedo enviaros mi propio diseño ya maquetado?", a: "Sí, puedes adjuntarlo en el formulario de presupuesto o enviárnoslo por email." }
    ]
  }
];

const CATEGORY_CONTENT = { serigrafia: SERIGRAFIA, rotulacion: ROTULACION, "gran-formato": GRAN_FORMATO };
const ALL_SUBSERVICES = SUB_SERIGRAFIA.concat(SUB_ROTULACION, SUB_GRAN_FORMATO);

const CATEGORY_BENEFITS = {
  serigrafia: [
    { icon: "shield", title: "Tintas resistentes", desc: "Aguantan lavados y uso diario sin perder color." },
    { icon: "layers", title: "Tiradas cortas y largas", desc: "Nos adaptamos al volumen real de tu pedido." },
    { icon: "clock", title: "Plazos claros", desc: "Sabes desde el presupuesto cuándo estará listo." },
    { icon: "spark", title: "20+ años de oficio", desc: "Un taller físico que controla cada fase del proceso." }
  ],
  rotulacion: [
    { icon: "shield", title: "Materiales de exterior", desc: "Pensados para aguantar sol, lluvia y uso diario." },
    { icon: "ruler", title: "Diseño a medida", desc: "Adaptado a la fachada, el vehículo o el espacio real." },
    { icon: "truck", title: "Instalación incluida", desc: "Fabricamos e instalamos, no solo entregamos." },
    { icon: "spark", title: "20+ años de oficio", desc: "Experiencia en proyectos de todos los tamaños." }
  ],
  "gran-formato": [
    { icon: "layers", title: "Impresión propia", desc: "Producción en nuestro taller, sin intermediarios." },
    { icon: "clock", title: "Plazos ajustados", desc: "Útil para eventos y campañas con fecha fija." },
    { icon: "ruler", title: "Grandes formatos", desc: "Desde un roll-up hasta una lona de fachada." },
    { icon: "spark", title: "20+ años de oficio", desc: "Un único taller para todo el proyecto gráfico." }
  ]
};

module.exports = { CATEGORY_CONTENT, ALL_SUBSERVICES, CATEGORY_BENEFITS };
