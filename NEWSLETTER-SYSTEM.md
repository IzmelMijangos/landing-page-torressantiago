# 📧 SISTEMA DE ENVÍO DE NEWSLETTERS

**Fecha de implementación:** 2025-12-18
**Estado:** ✅ COMPLETADO
**Tipo:** Manual (con opción de test)

---

## 🎯 RESUMEN

Sistema completo para enviar newsletters a suscriptores cuando publiques nuevos posts del blog.

### ✅ Lo que ya funciona:

1. ✅ **Captura de suscriptores** (newsletter forms en sidebar, footer, popups)
2. ✅ **Email de bienvenida automático** al suscribirse
3. ✅ **Dashboard admin** para enviar newsletters
4. ✅ **Preview del email** antes de enviar
5. ✅ **Modo test** (envía solo a 3 personas)
6. ✅ **Envío masivo** con Brevo
7. ✅ **Historial de newsletters enviados**
8. ✅ **Tracking de éxito/fallos**

---

## 🚀 CÓMO USAR EL SISTEMA

### Paso 1: Acceder al Dashboard

Navega a: **http://localhost:3000/admin/newsletter**

O en producción: **https://www.torressantiago.com/admin/newsletter**

### Paso 2: Configurar el Newsletter

1. **Escribe el asunto** del email (opcional, usa default si dejas vacío)
2. **Agrega mensaje personalizado** (opcional)
3. **Selecciona posts** del blog que quieres incluir (puedes seleccionar múltiples)

### Paso 3: Preview del Email

Click en **"👁️ Preview del Email"** para ver exactamente cómo se verá el email.

### Paso 4: Enviar

Tienes 2 opciones:

#### Opción A: Modo Test (Recomendado primero)
- Click en **"🧪 Enviar Test (3 personas)"**
- Envía solo a los primeros 3 suscriptores
- Perfecto para verificar que todo funcione

#### Opción B: Enviar a Todos
- Click en **"📧 Enviar a Todos (N)"**
- Envía a TODOS los suscriptores activos
- Te pedirá confirmación antes de enviar

---

## 📁 ARCHIVOS CREADOS

### API Endpoints

**1. `/api/newsletter/send` - Envío de newsletters**
- `POST`: Envía newsletter a suscriptores
- `GET`: Obtiene historial de newsletters enviados

**2. `/api/newsletter/preview` - Preview del email**
- `POST`: Genera preview HTML del newsletter

### Dashboard Admin

**`/admin/newsletter`** - Dashboard principal
- Selección de posts
- Configuración de subject y mensaje
- Preview del email
- Envío con modo test

### Archivos de Datos

Los datos se guardan en:
```
data/
├── newsletter-subscribers.json    (suscriptores)
├── sent-newsletters.json          (newsletters enviados)
└── leads.json                     (leads del chatbot)
```

---

## 📊 ESTRUCTURA DEL EMAIL

El template incluye:

### Header
- Logo y branding de Torres Santiago
- Gradiente naranja

### Contenido
- Saludo personalizado con nombre (si está disponible)
- Mensaje personalizado (si lo agregaste)
- Lista de posts seleccionados con:
  - Título (linked)
  - Descripción
  - Link "Leer artículo →"

### Call-to-Action
- Botón "Ver todos los artículos"

### Footer
- Información de contacto
- Link a WhatsApp
- Link para cancelar suscripción

---

## 🎨 PERSONALIZACIÓN

### Cambiar Asunto Default

Edita en `/api/newsletter/send/route.ts` línea 93:
```typescript
subject: subject || 'Nuevos artículos de Torres Santiago',
```

### Cambiar Email Sender

Edita en `/api/newsletter/send/route.ts` líneas 254-257:
```typescript
sender: {
  name: 'Torres Santiago',
  email: 'noreply@torressantiago.com'
}
```

### Modificar Template

Edita el HTML en `/api/newsletter/send/route.ts` líneas 267-372

---

## 📈 TRACKING Y MÉTRICAS

### Ver Estadísticas

En el dashboard verás:
- **Suscriptores activos**: Total de personas que recibirán el email
- **Posts seleccionados**: Cuántos posts incluiste
- **Newsletters enviados**: Historial total

### Historial de Envíos

En la sección "Últimos Envíos" verás:
- Asunto del newsletter
- Fecha de envío
- Éxito/Total (ej: 145/150 = 145 exitosos de 150 enviados)
- Estado: completed, sending, o failed

### Datos Almacenados

Cada newsletter enviado guarda:
```json
{
  "id": "newsletter_1703012345678",
  "timestamp": "2025-12-18T10:30:00.000Z",
  "subject": "Nuevos artículos sobre IA y Desarrollo",
  "postSlugs": ["automatizacion-ia", "desarrollo-web-2025"],
  "recipientCount": 150,
  "successCount": 145,
  "failCount": 5,
  "status": "completed"
}
```

---

## ⚙️ CONFIGURACIÓN TÉCNICA

### Variables de Entorno Requeridas

En tu `.env.local`:
```env
BREVO_API_KEY=xkeysib-tu-api-key-real-aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**✅ Ya configurado!** Tu API key ya está en `.env.local`

### Límites de Brevo

Plan Gratuito:
- ✅ 300 emails por día
- ✅ Unlimited contacts
- ✅ Email templates
- ✅ SMTP relay

Si superas 300 emails/día, considera upgrade a plan pagado.

### Envío en Lotes

El sistema envía en lotes de 10 emails con pausa de 1 segundo entre lotes para evitar sobrecargar el servidor.

Puedes ajustar esto en `/api/newsletter/send/route.ts` línea 110:
```typescript
const BATCH_SIZE = 10  // Cambia este número
```

---

## 🔧 TROUBLESHOOTING

### Error: "BREVO_API_KEY no configurada"

**Solución:** Verifica que tu `.env.local` tenga la API key correcta:
```env
BREVO_API_KEY=xkeysib-tu-key-real-aqui
```

Y **reinicia el servidor**:
```bash
# Ctrl+C para detener
npm run dev
```

### Error: "No hay suscriptores activos"

**Solución:**
1. Ve a `http://localhost:3000`
2. Suscríbete al newsletter desde el footer o sidebar del blog
3. Verifica en `/admin/leads-dashboard` que aparezca el suscriptor

### Email no llega

**Checklist:**
1. ✅ ¿BREVO_API_KEY configurada?
2. ✅ ¿Email del remitente verificado en Brevo?
3. ✅ ¿Revisa carpeta de spam?
4. ✅ ¿Revisa logs del servidor para errores?

### Preview no se muestra

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores
3. Verifica que hayas seleccionado al menos 1 post

---

## 🎯 WORKFLOW RECOMENDADO

### Cuando publiques un nuevo post:

#### Opción 1: Newsletter Individual (Inmediato)
1. Publicar post en el blog
2. Ir a `/admin/newsletter`
3. Seleccionar solo el nuevo post
4. Asunto: "Nuevo: [Título del Post]"
5. Enviar test primero
6. Si todo bien, enviar a todos

#### Opción 2: Newsletter Semanal (Digest)
1. Publicar posts durante la semana
2. Cada viernes, ir a `/admin/newsletter`
3. Seleccionar todos los posts de la semana
4. Asunto: "Newsletter Semanal: Lo nuevo de Torres Santiago"
5. Mensaje personalizado resumiendo la semana
6. Enviar

**💡 Recomendación:** Newsletter semanal tiene **mayor engagement** que individual.

---

## 📧 MEJORES PRÁCTICAS

### Frecuencia

✅ **Recomendado:**
- 1 email por semana (viernes)
- Máximo 2 emails por semana

❌ **Evitar:**
- Emails diarios
- Más de 3 posts por email (sobrecarga)

### Asuntos Efectivos

✅ **Buenos ejemplos:**
- "3 Nuevos Artículos sobre IA que Debes Leer"
- "Guía Completa: Ciberseguridad para PyMEs"
- "Esta Semana en Tech: Automatización e IA"

❌ **Malos ejemplos:**
- "Newsletter #23"
- "Nuevos posts"
- "Hola"

### Mensajes Personalizados

Usa el campo "Mensaje Personalizado" para:
- Contexto de la semana
- Anuncios especiales
- Conectar los posts con un tema común
- Agregar CTA específico

**Ejemplo:**
```
Esta semana nos enfocamos en la automatización con IA.
Si estás buscando optimizar procesos en tu empresa,
estos artículos te van a ayudar mucho.

¿Tienes dudas? Responde este email y te ayudamos.
```

---

## 🔮 PRÓXIMAS MEJORAS (Futuro)

### Corto Plazo
- [ ] Agregar imágenes de posts en el email
- [ ] A/B testing de asuntos
- [ ] Segmentación por categoría de interés
- [ ] Estadísticas de apertura (Brevo webhooks)

### Mediano Plazo
- [ ] Newsletter automático semanal
- [ ] Editor visual de emails (drag & drop)
- [ ] Plantillas de email personalizables
- [ ] Scheduler (programar envío)

### Largo Plazo
- [ ] Integración con HubSpot/CRM
- [ ] Lead scoring automation
- [ ] Sequences automation (drip campaigns)
- [ ] Dynamic content basado en comportamiento

---

## 📞 RESUMEN RÁPIDO

### Para enviar newsletter:

1. **Ve a:** `/admin/newsletter`
2. **Selecciona posts** del blog
3. **Escribe asunto** (opcional)
4. **Click "Preview"** para ver el email
5. **Click "Enviar Test"** primero (3 personas)
6. **Si ok, click "Enviar a Todos"**

### Flujo Completo:

```
Usuario se suscribe en la web
         ↓
Recibe email de bienvenida automático ✅
         ↓
Tú publicas nuevos posts
         ↓
Vas a /admin/newsletter
         ↓
Seleccionas posts + configuras
         ↓
Preview del email
         ↓
Envías (test o todos)
         ↓
Suscriptores reciben newsletter 📧
         ↓
Clicks en artículos → Más tráfico al blog
         ↓
Más engagement → Más leads → Más ventas 🚀
```

---

## ✅ TODO COMPLETADO

✅ Sistema de captura de suscriptores
✅ Email de bienvenida automático
✅ Dashboard admin de newsletters
✅ API endpoints de envío
✅ Preview de email antes de enviar
✅ Modo test (3 personas)
✅ Envío masivo a todos
✅ Template profesional de email
✅ Tracking de envíos
✅ Historial de newsletters
✅ Integración con Brevo
✅ Documentación completa

🎉 **El sistema está listo para usar!**

---

## 🚀 EMPIEZA AHORA

1. Abre tu navegador
2. Ve a `http://localhost:3000/admin/newsletter`
3. Selecciona posts
4. ¡Envía tu primer newsletter!

**¿Preguntas?** Revisa este documento o los logs del servidor para debugging.
