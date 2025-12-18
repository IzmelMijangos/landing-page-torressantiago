# Lead Magnets - Recursos Descargables

Este directorio contiene los PDFs y otros recursos descargables que se ofrecen a cambio de email.

## Estructura

Cada lead magnet debe estar definido en:
- **Metadata**: `src/app/lib/data/leadMagnets.ts`
- **Archivo PDF**: `public/lead-magnets/[filename].pdf`

## Lead Magnets Configurados

Los siguientes lead magnets están configurados y listos para usar:

1. **checklist-desarrollo-web.pdf** - Checklist: 10 Puntos para Evaluar Proveedores de Desarrollo Web
2. **guia-roi-chatbots.pdf** - Guía: ROI de Chatbots + Calculadora Excel
3. **plan-ciberseguridad-pymes.pdf** - Template: Plan de Ciberseguridad para PyMEs
4. **guia-automatizacion-ia.pdf** - Guía: Automatización con IA para Negocios
5. **ebook-transformacion-digital.pdf** - eBook: Transformación Digital para PyMEs
6. **checklist-gdpr-cumplimiento.pdf** - Checklist: Cumplimiento GDPR y Protección de Datos

## Cómo Agregar un Nuevo Lead Magnet

### 1. Crear el PDF
Diseña y exporta tu recurso en formato PDF. Recomendaciones:
- Diseño profesional y branded
- Contenido de alto valor
- Tamaño recomendado: 1-5 MB
- Incluir branding de Torres Santiago
- Agregar CTA al final para agendar consultoría

### 2. Agregar a este directorio
Coloca el archivo PDF en `public/lead-magnets/`

### 3. Configurar metadata
Edita `src/app/lib/data/leadMagnets.ts` y agrega la configuración:

```typescript
'tu-lead-magnet-id': {
  id: 'tu-lead-magnet-id',
  title: 'Título Completo del Recurso',
  description: 'Descripción detallada de lo que incluye',
  filename: 'nombre-archivo.pdf',
  fileSize: '2.5 MB',
  category: 'desarrollo-web', // o chatbots, ciberseguridad, datos, ia, general
  relatedBlogPosts: ['slug-post-1', 'slug-post-2'],
  emailSubject: 'Asunto del Email de Entrega',
  emailPreview: 'Preview text del email',
  icon: '📥' // Emoji representativo
}
```

### 4. Usar en el sitio

**En un artículo de blog:**
```tsx
import LeadMagnetBanner from '@/app/components/lead-capture/LeadMagnetBanner'

<LeadMagnetBanner
  resourceId="tu-lead-magnet-id"
  title="Título del Recurso"
  description="Descripción breve"
/>
```

**Como content upgrade:**
```tsx
import ContentUpgradeCard from '@/app/components/lead-capture/ContentUpgradeCard'

<ContentUpgradeCard
  upgradeType="pdf"
  title="Versión PDF de este artículo"
  description="Descarga este artículo en PDF para leerlo offline"
  resourceId="tu-lead-magnet-id"
/>
```

## Mejores Prácticas

### Diseño del PDF
- Primera página impactante con título y branding
- Tabla de contenidos (para ebooks largos)
- Diseño limpio y profesional
- Imágenes y gráficos de alta calidad
- Footer con logo y contacto en cada página

### Contenido
- Valor inmediato y accionable
- No solo teoría, incluir pasos prácticos
- Ejemplos reales cuando sea posible
- Checklists, plantillas o calculadoras cuando aplique
- CTA claro al final para siguiente paso

### Email de entrega
- Asunto claro y directo
- Email HTML responsive (ya configurado en el endpoint)
- Link de descarga prominente
- Mensaje de bienvenida
- CTA secundario (agendar consultoría, seguir en redes, etc.)

## Métricas a Trackear

Las descargas se registran automáticamente en:
- `data/lead-magnet-downloads.json`

Métricas importantes:
- Total de descargas por recurso
- Tasa de conversión por ubicación (blog post)
- Leads generados → Consultas solicitadas
- Consultas → Proyectos cerrados

## URLs de los recursos

Los PDFs están disponibles en:
`https://www.torressantiago.com/lead-magnets/[filename].pdf`

## Seguridad

- Los PDFs son públicos una vez subidos
- No incluir información confidencial o código sensible
- Watermark opcional con branding (recomendado)
- Los emails se envían vía Brevo (requiere BREVO_API_KEY)

## Troubleshooting

**Error: "Recurso no encontrado"**
- Verifica que el ID en leadMagnets.ts coincida con el resourceId usado
- Verifica que el archivo PDF exista en public/lead-magnets/

**Error: "No se pudo enviar el email"**
- Verifica que BREVO_API_KEY esté configurada
- Revisa los logs del endpoint /api/leads/download

**PDF no descarga**
- Verifica que el filename en metadata coincida con el nombre real del archivo
- Verifica permisos de lectura del archivo
