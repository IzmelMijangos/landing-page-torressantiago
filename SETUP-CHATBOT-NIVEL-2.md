# Setup Chatbot IA Nivel 2 - Torres Santiago

## Resumen de lo Implementado

✅ **Correcciones Urgentes Completadas:**
- Número de WhatsApp actualizado a: **+52 951 318 3885**
- Tiempo de consultoría cambiado a: **30 minutos**

✅ **Chatbot con IA Implementado:**
- Widget flotante con GPT-4
- Respuestas inteligentes 24/7
- Calificación automática de leads
- Sistema de tracking completo

✅ **Sistema de Notificaciones:**
- Email (Brevo)
- Telegram (opcional)
- WhatsApp (opcional con Twilio)

✅ **Dashboard de Analytics:**
- Vista de todos los leads
- Filtros por temperatura (caliente/tibio/frío)
- Estadísticas en tiempo real
- Distribución por fuente

---

## Configuración Paso a Paso

### 📌 Paso 1: Instalar Dependencias

```bash
npm install openai
# o si usas yarn:
yarn add openai
```

### 📌 Paso 2: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tus credenciales reales:

#### A. OpenAI API (OBLIGATORIO)

**Cómo obtener:**
1. Ve a https://platform.openai.com/api-keys
2. Inicia sesión o crea cuenta
3. Click en "Create new secret key"
4. Copia la key (empieza con `sk-`)

**Costo estimado:** $20-50 USD/mes según uso

```env
OPENAI_API_KEY=sk-tu-key-real-aqui
```

#### B. Brevo API (YA LO TIENES)

Ya tienes esto configurado de tu formulario actual.

```env
BREVO_API_KEY=tu-key-actual-de-brevo
```

#### C. Telegram Bot (OPCIONAL - GRATIS - RECOMENDADO)

**Cómo configurar:**

1. **Crear el bot:**
   - Abre Telegram
   - Busca @BotFather
   - Envía `/newbot`
   - Nombra tu bot (ej: "Torres Santiago Leads Bot")
   - Obtienes el TOKEN

2. **Obtener Chat ID:**
   - Inicia conversación con tu nuevo bot
   - Envía cualquier mensaje
   - Visita en navegador:
     ```
     https://api.telegram.org/bot<TU_TOKEN>/getUpdates
     ```
   - Busca `"chat":{"id":123456789}` → ese es tu CHAT_ID

3. **Agregar a .env.local:**
   ```env
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   TELEGRAM_CHAT_ID=123456789
   ```

**Resultado:** Recibirás notificaciones instantáneas en Telegram cuando llegue un lead caliente.

#### D. Twilio WhatsApp (OPCIONAL - $20 USD/mes)

Solo si quieres recibir notificaciones por WhatsApp (además del chatbot).

**Configuración:**
1. https://console.twilio.com/
2. Crear cuenta (incluye $15 USD gratis)
3. Activar WhatsApp Sandbox
4. Obtener credenciales

```env
TWILIO_ACCOUNT_SID=ACxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 📌 Paso 3: Probar el Chatbot

1. Inicia el servidor:
```bash
npm run dev
```

2. Abre http://localhost:3000

3. Verás el botón flotante naranja en esquina inferior derecha

4. Haz click y prueba mensajes como:
   - "¿Cuánto cuesta una app móvil?"
   - "Necesito un chatbot para mi negocio"
   - "Quiero cotizar un sitio web urgente"

### 📌 Paso 4: Verificar Notificaciones

1. Envía un mensaje al chatbot que incluya:
   - Presupuesto alto
   - Urgencia
   - Mención de "contratar" o "necesito"

2. Deberías recibir:
   - ✅ Email en contacto.torressantiago@gmail.com
   - ✅ Notificación en Telegram (si lo configuraste)

### 📌 Paso 5: Acceder al Dashboard

1. Ve a: http://localhost:3000/admin/leads

2. Verás:
   - Total de leads capturados
   - Leads calientes/tibios/fríos
   - Leads de hoy
   - Tabla con todos los leads
   - Botón directo a WhatsApp para cada lead

**Nota:** Este dashboard NO tiene autenticación. Para producción deberías agregar login.

---

## Uso Diario

### Cómo Usar el Sistema

1. **El chatbot trabaja 24/7**
   - Responde automáticamente
   - Califica cada conversación
   - Guarda información de contacto

2. **Cuando llega un lead caliente:**
   - Recibes notificación instantánea
   - Respondes por WhatsApp lo más pronto posible
   - El lead ya está pre-calificado

3. **Revisar dashboard:**
   - Cada mañana revisa http://localhost:3000/admin/leads
   - Filtra por "Calientes" primero
   - Contacta a todos los leads calientes del día

4. **Optimizar el chatbot:**
   - Lee las conversaciones
   - Identifica preguntas frecuentes no respondidas bien
   - Edita el `SYSTEM_PROMPT` en `/src/app/api/chat/route.ts`

---

## Costos Mensuales Estimados

### Configuración Mínima (Solo OpenAI)
```
OpenAI API:        $20-50 USD/mes
Brevo Email:       GRATIS (ya incluido)
Telegram:          GRATIS
TOTAL:             ~$20-50 USD/mes (~$400-900 MXN)
```

### Configuración Completa
```
OpenAI API:        $50 USD/mes
Brevo Email:       GRATIS
Telegram:          GRATIS
Twilio WhatsApp:   $20 USD/mes
TOTAL:             ~$70 USD/mes (~$1,260 MXN)
```

---

## Alternativa: Google Cloud en lugar de OpenAI

Si prefieres usar Google Cloud Vertex AI:

1. **Crear proyecto en Google Cloud:**
   - https://console.cloud.google.com/
   - Crear nuevo proyecto
   - Habilitar Vertex AI API

2. **Crear service account:**
   - IAM & Admin → Service Accounts
   - Create Service Account
   - Descargar JSON key

3. **Modificar código:**
   - Cambiar en `/src/app/api/chat/route.ts`
   - Reemplazar `openai` por `@google-cloud/aiplatform`

**Ventaja:** Precio similar o más barato
**Desventaja:** Configuración más compleja

---

## Métricas a Monitorear

### Diarias
- [ ] Leads nuevos hoy
- [ ] Leads calientes sin responder
- [ ] Conversiones (leads → clientes)

### Semanales
- [ ] Total de conversaciones del chatbot
- [ ] Tasa de respuesta del chatbot (% resuelto sin humano)
- [ ] Tiempo promedio de primera respuesta a leads calientes

### Mensuales
- [ ] ROI del chatbot (ventas generadas vs costo)
- [ ] Tasa de conversión por fuente (chatbot vs formulario)
- [ ] Preguntas más frecuentes

---

## Optimización Continua

### Mes 1: Setup y Aprendizaje
- Configura todo
- Monitorea conversaciones
- Identifica patrones

### Mes 2: Refinamiento
- Mejora respuestas del chatbot
- Ajusta lead scoring
- Optimiza tiempos de respuesta

### Mes 3: Automatización Avanzada
- Integra con CRM (HubSpot)
- Automatiza seguimiento
- A/B testing de mensajes

---

## Troubleshooting

### El chatbot no responde
1. Verifica que `OPENAI_API_KEY` esté en `.env.local`
2. Revisa la consola del navegador (F12)
3. Verifica créditos de OpenAI: https://platform.openai.com/usage

### No llegan notificaciones
1. Verifica que el lead tenga score >= 60
2. Revisa que `BREVO_API_KEY` esté correcto
3. Para Telegram, verifica TOKEN y CHAT_ID

### Dashboard no muestra leads
1. Verifica que existe el archivo `data/leads.json`
2. Si no existe, se creará automáticamente con el primer lead
3. Permisos: asegúrate que Next.js puede escribir en `/data`

### Error "Module not found: openai"
```bash
npm install openai
# Luego reinicia el servidor
```

---

## Próximos Pasos Recomendados

### Corto Plazo (1-2 semanas)
1. ✅ Configurar OpenAI API
2. ✅ Configurar Telegram para notificaciones
3. ✅ Probar chatbot con usuarios reales
4. ✅ Monitorear primeros leads

### Mediano Plazo (1 mes)
1. Agregar autenticación al dashboard `/admin/leads`
2. Integrar con HubSpot CRM
3. Crear reportes automáticos semanales
4. Implementar A/B testing de mensajes

### Largo Plazo (2-3 meses)
1. Fine-tuning del modelo con tus conversaciones
2. Chatbot multicanal (WhatsApp, Messenger, Instagram)
3. Automatización completa de seguimiento
4. Dashboard público para clientes

---

## Soporte y Ayuda

### Recursos
- Documentación OpenAI: https://platform.openai.com/docs
- Guía Telegram Bots: https://core.telegram.org/bots
- Brevo API Docs: https://developers.brevo.com/

### Contacto
Si necesitas ayuda con la configuración:
1. Revisa este documento completo
2. Verifica los logs en consola
3. Prueba cada componente por separado

---

## Checklist de Implementación

### Configuración Inicial
- [ ] Copiar `.env.example` a `.env.local`
- [ ] Obtener OpenAI API key
- [ ] Configurar Telegram bot (opcional)
- [ ] Instalar dependencias: `npm install openai`
- [ ] Iniciar servidor: `npm run dev`

### Verificación
- [ ] Chatbot aparece en pantalla
- [ ] Chatbot responde correctamente
- [ ] Lead se guarda en dashboard
- [ ] Notificación llega por email
- [ ] Notificación llega por Telegram (si configurado)

### Producción
- [ ] Cambiar `NEXT_PUBLIC_BASE_URL` a producción
- [ ] Agregar autenticación a `/admin/leads`
- [ ] Configurar backup de `data/leads.json`
- [ ] Monitorear créditos de OpenAI

---

## Changelog

### v1.0 (16 Dic 2024)
✅ Chatbot IA con GPT-4 implementado
✅ Sistema de leads con scoring
✅ Notificaciones multi-canal
✅ Dashboard de analytics
✅ Números de WhatsApp actualizados
✅ Tiempos de consultoría actualizados a 30 min

---

¡El sistema está listo para usar! 🚀

**Siguiente acción:** Configurar OpenAI API y Telegram para empezar a capturar leads.
