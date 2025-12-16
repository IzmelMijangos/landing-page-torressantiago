/**
 * FAQ Data
 * Centralized FAQ data for homepage and other pages
 */

export interface FAQ {
  question: string
  answer: string
}

export const homepageFAQs: FAQ[] = [
  {
    question: "¿Cuánto tiempo toma desarrollar una página web?",
    answer:
      "Una página web básica (5-7 páginas) toma entre 5-7 días hábiles. Proyectos más complejos como e-commerce o sistemas personalizados toman de 10 a 20 días. Te mostramos avances cada 2-3 días durante el desarrollo.",
  },
  {
    question: "¿Qué pasa si necesito cambios después de la entrega?",
    answer:
      "Todos nuestros proyectos incluyen 30 días de soporte post-entrega sin costo adicional. Cambios menores y ajustes están incluidos. Para cambios mayores o nuevas funcionalidades, preparamos una cotización específica.",
  },
  {
    question: "¿Trabajan solo con empresas de Oaxaca?",
    answer:
      "Aunque estamos ubicados en Oaxaca, trabajamos con clientes de todo México e internacional. La mayoría de nuestros proyectos se manejan completamente por videollamada, email y WhatsApp. Nos adaptamos a tu zona horaria.",
  },
  {
    question: "¿Cuánto cuesta desarrollar un sitio web profesional?",
    answer:
      "Los precios varían según complejidad: Páginas web institucionales desde $7,999 MXN, E-commerce desde $19,999 MXN, Apps móviles desde $24,999 MXN. Agenda una consultoría gratuita para recibir una cotización exacta basada en tus necesidades específicas.",
  },
  {
    question: "¿Qué tecnologías usan para el desarrollo?",
    answer:
      "Utilizamos tecnologías modernas y probadas: Next.js y React para frontend, Node.js y Laravel para backend, PostgreSQL y MongoDB para bases de datos. Todas son tecnologías de nivel empresarial con amplio soporte y actualizaciones constantes.",
  },
  {
    question: "¿Incluyen hosting y dominio?",
    answer:
      "El proyecto de desarrollo no incluye hosting ni dominio, pero te asesoramos en la selección del servicio más adecuado para tu proyecto. Podemos configurar todo en tu cuenta o, si prefieres, nosotros gestionamos el hosting por ti con un cargo mensual adicional desde $500 MXN.",
  },
  {
    question: "¿Cómo garantizan la seguridad de mi sitio web?",
    answer:
      "Implementamos medidas de seguridad de nivel empresarial: certificados SSL, cifrado de datos sensibles, protección contra inyecciones SQL y XSS, autenticación de dos factores cuando aplica, respaldos automáticos diarios, y cumplimiento con LFPDPPP (Ley de Protección de Datos Personales).",
  },
  {
    question: "¿Puedo actualizar el contenido yo mismo después?",
    answer:
      "Sí. Desarrollamos sistemas con paneles de administración intuitivos donde puedes actualizar textos, imágenes, productos, blog posts, etc. sin conocimientos técnicos. Incluimos capacitación de 2 horas para que tu equipo quede autónomo. También ofrecemos servicio de mantenimiento mensual si prefieres que nosotros lo hagamos.",
  },
]
