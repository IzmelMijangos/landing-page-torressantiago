/**
 * Industry Solutions Data
 * Centralized data for industry-specific landing pages
 */

export interface FAQItem {
  question: string
  answer: string
}

export interface IndustrySolution {
  slug: string
  name: string
  hero: {
    title: string
    description: string
    image: string
  }
  serviceIds: string[] // Slugs of relevant services
  caseStudyId?: string // Slug of related case study
  benefits: {
    icon: string
    title: string
    description: string
  }[]
  challenges: {
    title: string
    description: string
  }[]
  solutions: {
    title: string
    description: string
  }[]
  faq: FAQItem[]
  keywords: string[]
  stats?: {
    label: string
    value: string
  }[]
}

export const industrySolutions: IndustrySolution[] = [
  {
    slug: "retail",
    name: "Retail y Comercio",
    hero: {
      title: "Soluciones Tecnológicas para Retail",
      description:
        "Aumenta tus ventas, optimiza inventario y mejora la experiencia del cliente con tecnología personalizada para tiendas y comercios.",
      image: "/images/industries/retail.jpg",
    },
    serviceIds: [
      "desarrollo-web-profesional",
      "chatbots-ia",
      "apps-moviles",
      "tratamiento-datos",
    ],
    caseStudyId: "meditium",
    benefits: [
      {
        icon: "ShoppingCart",
        title: "Ventas 24/7",
        description:
          "E-commerce que funciona mientras duermes. Catálogo digital, carrito de compras, pagos seguros integrados.",
      },
      {
        icon: "MessageSquare",
        title: "Atención automatizada",
        description:
          "Chatbot en WhatsApp responde consultas de productos, disponibilidad y precios instantáneamente.",
      },
      {
        icon: "BarChart3",
        title: "Control de inventario inteligente",
        description:
          "Sistema que predice demanda, alerta cuando hay bajo stock y optimiza reorden automáticamente.",
      },
      {
        icon: "Users",
        title: "Programa de lealtad digital",
        description:
          "App móvil con puntos, promociones exclusivas y notificaciones push para clientes frecuentes.",
      },
    ],
    challenges: [
      {
        title: "Pérdida de ventas fuera de horario",
        description:
          "Tu competencia vende 24/7 online mientras tu tienda física cierra a las 8pm.",
      },
      {
        title: "Consultas repetitivas abruman al personal",
        description:
          "Empleados pasan 60% del tiempo respondiendo '¿Tienen talla X?' '¿Cuánto cuesta?' '¿Dónde están ubicados?'",
      },
      {
        title: "Inventario descontrolado",
        description:
          "Quiebres de stock del 15% (ventas perdidas) y sobreinventario del 25% (capital inmovilizado).",
      },
      {
        title: "Clientes no regresan",
        description:
          "Sin seguimiento post-venta ni incentivos para segunda compra. Tasa de retención menor al 20%.",
      },
    ],
    solutions: [
      {
        title: "E-commerce a tu medida",
        description:
          "Tienda online integrada con tu inventario físico. Compras online, retiro en tienda. Pagos con MercadoPago, Stripe, transferencia. Dashboard con métricas de ventas en tiempo real.",
      },
      {
        title: "Chatbot inteligente para WhatsApp",
        description:
          "Automatiza 80% de consultas: disponibilidad, precios, ubicación, horarios. Toma pedidos directamente. Transfiere a humano solo casos complejos. Disponible 24/7.",
      },
      {
        title: "Sistema de gestión de inventario",
        description:
          "Alertas de bajo stock. Predicción de demanda con IA. Sugerencias de reorden. Sincronización entre tienda física y online. Reportes de productos más/menos vendidos.",
      },
      {
        title: "App de lealtad personalizada",
        description:
          "Programa de puntos por compra. Promociones exclusivas geofence (cuando cliente está cerca). Push notifications de ofertas. Historial de compras y wishlist.",
      },
    ],
    faq: [
      {
        question: "¿Cuánto tiempo toma implementar un e-commerce?",
        answer:
          "Un e-commerce básico (50-100 productos) toma 4-6 semanas. Incluye diseño, desarrollo, integración de pagos, capacitación y lanzamiento. E-commerce más complejos (500+ productos, múltiples variantes) toman 8-12 semanas.",
      },
      {
        question: "¿El chatbot puede procesar pagos directamente?",
        answer:
          "Sí. Integramos links de pago de MercadoPago, Stripe o el procesador que uses. El cliente ordena vía WhatsApp, recibe link de pago, paga, y el sistema confirma automáticamente.",
      },
      {
        question: "¿Qué pasa con mi inventario actual en Excel/libreta?",
        answer:
          "Migramos tus datos existentes al nuevo sistema. Si usas software de punto de venta (Bind, AdminPaq, etc.), integramos vía API. Si es Excel, importamos con mapeo de columnas.",
      },
      {
        question: "¿Necesito contratar más personal para atender el e-commerce?",
        answer:
          "No. El sistema automatiza: confirmación de pedidos, facturación, notificaciones al cliente. Solo necesitas personal para empacar y enviar. Muchos clientes manejan el e-commerce con el mismo equipo.",
      },
      {
        question: "¿Funciona para tiendas pequeñas o solo para grandes retailers?",
        answer:
          "Diseñamos soluciones escalables. Desde una boutique con 30 productos hasta cadenas con 5,000+ SKUs. La inversión se ajusta al tamaño y complejidad de tu negocio.",
      },
    ],
    keywords: [
      "e-commerce México",
      "tienda online",
      "chatbot retail",
      "sistema de inventario",
      "app de lealtad",
      "retail tecnología",
    ],
    stats: [
      {
        label: "Incremento promedio en ventas con e-commerce",
        value: "+45%",
      },
      {
        label: "Reducción en consultas repetitivas",
        value: "80%",
      },
      {
        label: "Mejora en control de inventario",
        value: "65%",
      },
    ],
  },
  {
    slug: "salud",
    name: "Salud y Bienestar",
    hero: {
      title: "Tecnología para el Sector Salud",
      description:
        "Optimiza agendamiento, mejora atención al paciente y cumple con normativas de protección de datos con soluciones especializadas para clínicas, consultorios y centros de bienestar.",
      image: "/images/industries/salud.jpg",
    },
    serviceIds: [
      "desarrollo-web-profesional",
      "chatbots-ia",
      "apps-moviles",
      "tratamiento-datos",
    ],
    caseStudyId: "meditium",
    benefits: [
      {
        icon: "Calendar",
        title: "Agendamiento automatizado",
        description:
          "Pacientes reservan citas 24/7 vía WhatsApp o web. Confirmaciones y recordatorios automáticos reducen ausencias 70%.",
      },
      {
        icon: "Shield",
        title: "Cumplimiento LFPDPPP",
        description:
          "Expedientes digitales cifrados, consentimientos firmados electrónicamente, trazabilidad completa de accesos.",
      },
      {
        icon: "FileText",
        title: "Expediente clínico electrónico",
        description:
          "Conforme a NOM-024. Historia clínica digital, recetas, resultados de laboratorio, evoluciones médicas.",
      },
      {
        icon: "Bell",
        title: "Seguimiento post-consulta",
        description:
          "Recordatorios de medicamentos, citas de seguimiento, encuestas de satisfacción. Mejora adherencia al tratamiento.",
      },
    ],
    challenges: [
      {
        title: "40% de citas perdidas por olvido",
        description:
          "Pacientes no llegan a citas y no avisan. Pérdida de $180,000 MXN mensuales en consultas no realizadas.",
      },
      {
        title: "Recepción saturada con llamadas",
        description:
          "80% de llamadas son para agendar, preguntar precios o confirmar horarios. Personal no puede atender pacientes presentes.",
      },
      {
        title: "Expedientes en papel desorganizados",
        description:
          "Búsqueda de expediente toma 5-10 minutos. Pérdida de documentos. No cumple NOM-024. Riesgo de multas COFEPRIS.",
      },
      {
        title: "Falta de seguimiento post-consulta",
        description:
          "Pacientes no regresan a consultas de control. 35% de abandono de tratamiento por falta de recordatorios.",
      },
    ],
    solutions: [
      {
        title: "Sistema integral de gestión médica",
        description:
          "Agenda electrónica con vista por médico, consultorio y especialidad. Expediente clínico digital conforme a NOM-024. Facturación electrónica automática. Estadísticas de pacientes atendidos, ingresos, especialidades más solicitadas.",
      },
      {
        title: "WhatsApp para agendamiento automático",
        description:
          "Pacientes agendan vía chatbot: eligen especialidad, médico, fecha/hora disponible. Sistema verifica disponibilidad en tiempo real. Confirmación instantánea. Recordatorio 24 horas antes vía WhatsApp. Opción de reagendar o cancelar sin llamar.",
      },
      {
        title: "Portal del paciente",
        description:
          "Acceso web/app para pacientes. Historial de consultas. Descarga de recetas y resultados de laboratorio. Pago en línea de consultas. Telemedicina básica (videoconsulta).",
      },
      {
        title: "Cumplimiento normativo garantizado",
        description:
          "Aviso de privacidad integral conforme LFPDPPP. Consentimiento informado firmado electrónicamente. Cifrado de datos sensibles de salud. Logs de acceso a expedientes. Backup automático diario. Exportación para auditorías COFEPRIS.",
      },
    ],
    faq: [
      {
        question: "¿El sistema cumple con la NOM-024-SSA3-2012?",
        answer:
          "Sí. Nuestro expediente clínico electrónico incluye todos los campos obligatorios: datos del paciente, historia clínica, notas de evolución, recetas, estudios de laboratorio, firma electrónica del médico. Genera reportes para auditorías COFEPRIS.",
      },
      {
        question: "¿Cómo protegen los datos sensibles de salud?",
        answer:
          "Implementamos cifrado AES-256 para datos en reposo y TLS 1.3 para datos en tránsito. Acceso solo con autenticación de dos factores. Logs de auditoría de todos los accesos. Servidores en México con certificación ISO 27001. Cumplimiento LFPDPPP garantizado.",
      },
      {
        question: "¿Puedo migrar expedientes en papel al sistema digital?",
        answer:
          "Sí. Ofrecemos servicio de digitalización de expedientes existentes. Escaneamos, aplicamos OCR (reconocimiento de texto), clasificamos y cargamos al sistema. También podemos importar datos de otros sistemas médicos vía CSV o API.",
      },
      {
        question: "¿Funciona para consultorios individuales o solo clínicas grandes?",
        answer:
          "Diseñamos soluciones escalables. Desde médico individual con consultorio hasta clínicas con 20+ médicos de múltiples especialidades. La inversión y funcionalidades se ajustan a tu tamaño.",
      },
      {
        question: "¿Qué pasa si el sistema falla durante una consulta?",
        answer:
          "El sistema tiene 99.9% uptime. En el caso remoto de falla, todos los datos están respaldados en tiempo real. Puedes acceder vía app móvil (funciona offline). Soporte técnico disponible en horario de consultas para resolver cualquier problema en menos de 15 minutos.",
      },
    ],
    keywords: [
      "sistema médico México",
      "expediente clínico electrónico",
      "NOM-024",
      "agendamiento médico",
      "software clínica",
      "LFPDPPP salud",
    ],
    stats: [
      {
        label: "Reducción en ausencias a citas",
        value: "70%",
      },
      {
        label: "Tiempo ahorrado en búsqueda de expedientes",
        value: "85%",
      },
      {
        label: "Incremento en consultas de seguimiento",
        value: "+48%",
      },
    ],
  },
  {
    slug: "restaurantes",
    name: "Restaurantes y Hospitalidad",
    hero: {
      title: "Soluciones Digitales para Restaurantes",
      description:
        "Optimiza reservaciones, agiliza pedidos y fideliza clientes con tecnología diseñada para restaurantes, cafeterías y negocios de alimentos.",
      image: "/images/industries/restaurantes.jpg",
    },
    serviceIds: [
      "desarrollo-web-profesional",
      "chatbots-ia",
      "apps-moviles",
    ],
    benefits: [
      {
        icon: "UtensilsCrossed",
        title: "Pedidos online sin comisiones",
        description:
          "Tu propio sistema de pedidos a domicilio. Sin pagar 30% de comisión a apps externas. Menú digital actualizable en minutos.",
      },
      {
        icon: "CalendarCheck",
        title: "Reservaciones automáticas",
        description:
          "Chatbot gestiona reservas 24/7. Verifica disponibilidad de mesas en tiempo real. Confirmaciones y recordatorios automáticos.",
      },
      {
        icon: "Smartphone",
        title: "App de lealtad y promociones",
        description:
          "Programa de puntos por consumo. Cupones digitales. Promociones geofence. Push notifications de ofertas especiales.",
      },
      {
        icon: "TrendingUp",
        title: "Análisis de preferencias",
        description:
          "Dashboard de platillos más vendidos, horarios pico, ticket promedio. Optimiza menú y staffing basado en datos reales.",
      },
    ],
    challenges: [
      {
        title: "Dependencia de apps de delivery (30% comisión)",
        description:
          "Uber Eats, Rappi y DiDi Food se quedan con 28-32% de cada pedido. En ventas de $80,000 mensuales, pierdes $24,000 en comisiones.",
      },
      {
        title: "Reservaciones caóticas",
        description:
          "Llamadas constantes para reservar. Doble reservación de mesas. No-shows del 25%. Imposible gestionar con libreta.",
      },
      {
        title: "Falta de fidelización",
        description:
          "Clientes van una vez y no regresan. No hay incentivo para segunda visita. Sin base de datos de clientes. Competencia los captura.",
      },
      {
        title: "Decisiones sin datos",
        description:
          "No sabes qué platillos son más rentables. Qué días/horarios son más fuertes. Perfil de cliente promedio. Inventario basado en intuición.",
      },
    ],
    solutions: [
      {
        title: "Sistema de pedidos propio",
        description:
          "Web/app con tu menú completo. Fotos profesionales de platillos. Modificadores (sin cebolla, extra queso). Pedidos para recoger o delivery. Pago online (tarjeta, transferencia). Integración con tu sistema de punto de venta. Gestión de repartidores propios.",
      },
      {
        title: "Chatbot para WhatsApp",
        description:
          "Clientes consultan menú, hacen pedidos, reservan mesa vía WhatsApp. Bot procesa pedidos automáticamente. Envía a cocina. Calcula tiempo de entrega. Notifica cuando pedido está listo. Solicita feedback post-consumo.",
      },
      {
        title: "App de lealtad gamificada",
        description:
          "Puntos por cada consumo (1 punto = $1 MXN). Niveles: Bronce, Plata, Oro (beneficios crecientes). Cupones de cumpleaños. Promoción 'trae un amigo'. Push notifications: 'Hace 2 semanas que no vienes, 20% descuento hoy'. Integración con redes sociales.",
      },
      {
        title: "Dashboard de inteligencia de negocio",
        description:
          "Platillos por rentabilidad (precio vs costo vs cantidad vendida). Horarios con mayor tráfico. Ticket promedio por tipo de cliente. Efectividad de promociones. Predicción de demanda para optimizar inventario y reducir merma.",
      },
    ],
    faq: [
      {
        question: "¿Cuánto tiempo recupero la inversión vs. seguir pagando comisiones?",
        answer:
          "Si pagas $24,000 mensuales en comisiones a apps (30% de $80K ventas), un sistema propio se paga en 4-6 meses. Después, ahorras $288,000 anuales. Plus: conservas datos de clientes para marketing directo.",
      },
      {
        question: "¿El sistema de pedidos incluye repartidores?",
        answer:
          "El software sí incluye módulo para gestionar repartidores propios (asignación de pedidos, rastreo GPS, liquidación diaria). Los repartidores son contratación tuya. Alternativa: integramos con servicios de mensajería bajo demanda a menor comisión que apps grandes.",
      },
      {
        question: "¿Se integra con mi punto de venta actual?",
        answer:
          "Sí. Integramos con mayoría de sistemas POS: Liven, Poster, Aloha, Square, Toast, etc. Pedidos online se sincronizan automáticamente a tu POS. Inventario se descuenta en tiempo real.",
      },
      {
        question: "¿Qué pasa si un cliente tiene problema con su pedido?",
        answer:
          "El sistema incluye módulo de soporte. Cliente puede reportar problema vía app/web. Tú recibes alerta inmediata. Puedes ofrecer reembolso/cupón con un clic. Historial completo de pedidos para resolver disputas.",
      },
      {
        question: "¿Funciona para food trucks o solo restaurantes establecidos?",
        answer:
          "Funciona para cualquier negocio de alimentos. Food trucks, cafeterías, restaurantes, catering. Incluso negocios desde casa. El sistema se adapta a tu modelo de operación.",
      },
    ],
    keywords: [
      "sistema restaurante",
      "pedidos online restaurante",
      "app delivery propia",
      "reservaciones restaurante",
      "WhatsApp restaurante",
    ],
    stats: [
      {
        label: "Ahorro vs. apps de delivery",
        value: "$288K/año",
      },
      {
        label: "Incremento en pedidos directos",
        value: "+65%",
      },
      {
        label: "Reducción de no-shows en reservas",
        value: "75%",
      },
    ],
  },
  {
    slug: "educacion",
    name: "Educación y Capacitación",
    hero: {
      title: "Plataformas de Aprendizaje Digital",
      description:
        "Transforma tu institución educativa con plataformas LMS, gestión de alumnos y herramientas de enseñanza online para escuelas, academias y centros de capacitación.",
      image: "/images/industries/educacion.jpg",
    },
    serviceIds: [
      "desarrollo-web-profesional",
      "chatbots-ia",
      "apps-moviles",
    ],
    benefits: [
      {
        icon: "GraduationCap",
        title: "Plataforma LMS completa",
        description:
          "Cursos online, videos, evaluaciones, certificados. Progreso del alumno en tiempo real. Gamificación para mayor engagement.",
      },
      {
        icon: "Users",
        title: "Gestión integral de alumnos",
        description:
          "Inscripciones online, control de pagos, asistencias, calificaciones. Portal para padres de familia. Comunicación automatizada.",
      },
      {
        icon: "Video",
        title: "Clases en vivo integradas",
        description:
          "Videoconferencia integrada en plataforma. Grabación automática de sesiones. Pizarra digital colaborativa. Chat y Q&A en tiempo real.",
      },
      {
        icon: "Award",
        title: "Certificación digital",
        description:
          "Generación automática de diplomas y certificados. Firma electrónica. Verificación QR. Cumple con validez oficial SEP.",
      },
    ],
    challenges: [
      {
        title: "Inscripciones y cobros manuales",
        description:
          "Proceso de inscripción toma 45 minutos por alumno. Pagos en efectivo dificultan control. Quejas de padres por falta de comprobantes digitales.",
      },
      {
        title: "Comunicación fragmentada",
        description:
          "WhatsApp, email, llamadas, grupos de Facebook. Información se pierde. Padres no ven tareas. Anuncios importantes no llegan a todos.",
      },
      {
        title: "Dependencia de plataformas externas",
        description:
          "Google Classroom + Zoom + WhatsApp + Kahoot. Estudiantes confundidos. Datos dispersos. Costo creciente de licencias. No hay control ni personalización.",
      },
      {
        title: "Deserción por falta de engagement",
        description:
          "35% de deserción en cursos online. Estudiantes se aburren. No hay seguimiento personalizado. Sin métricas para detectar en riesgo.",
      },
    ],
    solutions: [
      {
        title: "Plataforma educativa todo-en-uno",
        description:
          "LMS con cursos estructurados por módulos. Videos, PDFs, presentaciones, audios. Evaluaciones (opción múltiple, verdadero/falso, ensayo). Calificación automática. Foros de discusión. Mensajería interna estudiante-profesor. Progress tracking detallado. Certificados al completar.",
      },
      {
        title: "Sistema de gestión administrativa",
        description:
          "Inscripciones online con pago digital (tarjeta, OXXO, transferencia). Control de colegiaturas con recordatorios automáticos. Asistencias digitales (QR code). Calificaciones en línea para padres. Generación de boletas. Estadísticas de rendimiento académico.",
      },
      {
        title: "App móvil para estudiantes y padres",
        description:
          "Acceso a cursos desde smartphone. Notificaciones push de tareas, calificaciones, avisos. Chat con profesores. Calendario de exámenes. Pagos desde app. Portal separado para padres (seguimiento sin molestar al estudiante).",
      },
      {
        title: "Gamificación y engagement",
        description:
          "Sistema de puntos y badges por completar lecciones. Leaderboards por curso. Desafíos semanales. Avatares personalizables. Streaks (días consecutivos estudiando). Alertas tempranas de alumnos en riesgo (baja participación, entregas tardías).",
      },
    ],
    faq: [
      {
        question: "¿La plataforma tiene validez oficial SEP?",
        answer:
          "La plataforma en sí es una herramienta tecnológica. La validez oficial depende de tu institución. Si tienes RVOE, la plataforma genera certificados con tu logotipo y datos de RVOE. Los certificados incluyen código QR para verificación.",
      },
      {
        question: "¿Puedo migrar cursos de Google Classroom o Moodle?",
        answer:
          "Sí. Importamos contenido existente de Google Classroom, Moodle, Canvas, Blackboard. Estructura de cursos, materiales, calificaciones. También podemos integrar vía API para sincronización bidireccional si prefieres mantener ambas plataformas temporalmente.",
      },
      {
        question: "¿Cuántos estudiantes soporta la plataforma?",
        answer:
          "Diseñamos arquitectura escalable. Desde escuelas con 50 alumnos hasta universidades con 10,000+. Carga de videos y streaming optimizado. Servidores en México para baja latencia. Infraestructura crece conforme crece tu matrícula.",
      },
      {
        question: "¿Incluye herramientas antiplagio para trabajos?",
        answer:
          "Sí. Integramos detección de similitud de texto (compara con internet y trabajos previos). Alertas a profesores de posible plagio. También incluimos proctoring básico para exámenes online (detección de múltiples rostros, cambio de pestaña).",
      },
      {
        question: "¿Los profesores necesitan capacitación técnica?",
        answer:
          "La interfaz es intuitiva (similar a YouTube + Facebook). Incluimos capacitación de 4 horas para profesores: cómo subir materiales, crear evaluaciones, calificar, comunicarse con alumnos. Manuales en video y soporte técnico permanente.",
      },
    ],
    keywords: [
      "plataforma educativa México",
      "LMS personalizado",
      "sistema escolar",
      "clases online",
      "gestión alumnos",
    ],
    stats: [
      {
        label: "Reducción en deserción con gamificación",
        value: "45%",
      },
      {
        label: "Tiempo ahorrado en administración",
        value: "12h/sem",
      },
      {
        label: "Incremento en satisfacción de padres",
        value: "+82%",
      },
    ],
  },
]

export function getIndustrySolutionBySlug(slug: string): IndustrySolution | null {
  return industrySolutions.find((industry) => industry.slug === slug) || null
}

export function getAllIndustrySlugs(): string[] {
  return industrySolutions.map((industry) => industry.slug)
}
