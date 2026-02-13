# 🔧 Cómo Actualizar n8n para el Chatbot - Guía Paso a Paso

## Opción 1: Importar Workflow Nuevo (RECOMENDADO - 2 minutos)

### Paso 1: Abrir n8n
1. Ve a: http://35.226.54.93:5678
2. Inicia sesión con tus credenciales

### Paso 2: Importar el Workflow
1. Click en el menú superior derecho (3 líneas)
2. Click en **"Import from File"**
3. Selecciona el archivo: `n8n-chatbot-workflow.json`
4. Click **"Import"**

### Paso 3: Configurar Twilio Webhook
1. En el workflow importado, click en el nodo **"Webhook Twilio"**
2. Copia la URL del webhook que aparece (algo como: `http://35.226.54.93:5678/webhook/twilio-webhook`)
3. Ve a tu cuenta de Twilio
4. Ve a: **Messaging > Settings > WhatsApp sandbox settings**
5. Pega la URL en **"When a message comes in"**
6. Guarda

### Paso 4: Activar el Workflow
1. En n8n, click en el switch **"Active"** (esquina superior derecha)
2. El workflow ahora está en verde ✅

### Paso 5: Probar
Envía un mensaje de WhatsApp al número de Twilio y verifica que:
- ✅ Aparece en **Executions** en n8n
- ✅ Se crea la conversación en `/dashboard/conversaciones`
- ✅ El bot responde automáticamente

---

## Opción 2: Actualizar Workflow Existente (5 minutos)

Si ya tienes un workflow de WhatsApp y quieres actualizarlo:

### Paso 1: Encontrar tu Workflow Actual
1. En n8n, busca el workflow que recibe mensajes de Twilio
2. Probablemente se llama algo como "WhatsApp Lead Capture" o similar

### Paso 2: Modificar el Nodo HTTP Request
1. Busca el nodo que hace el HTTP Request (donde se envían los datos)
2. Click en ese nodo para editarlo
3. Cambia estos valores:

**URL**: Cambia de:
```
❌ URL antigua (lo que sea que tengas)
```
A:
```
✅ https://leads.torressantiago.com/api/chatbot/webhook
```

**Method**: `POST`

**Body**: Cambia a JSON Parameters y usa este código:
```json
{
  "From": "{{ $json.From }}",
  "To": "{{ $json.To }}",
  "Body": "{{ $json.Body }}",
  "MessageSid": "{{ $json.MessageSid }}",
  "MediaUrl": "{{ $json.MediaUrl0 }}",
  "MediaContentType": "{{ $json.MediaContentType0 }}"
}
```

**Timeout**: 30000 (30 segundos)

### Paso 3: Guardar y Activar
1. Click **"Save"**
2. Asegúrate de que el workflow esté **Active**

---

## 🧪 Cómo Probar que Funciona

### Test Manual en n8n:
1. En el workflow, click en el nodo "Webhook Twilio"
2. Click en **"Listen for Test Event"**
3. Envía un mensaje de WhatsApp al número de Twilio
4. Deberías ver los datos aparecer en n8n
5. Click **"Execute Workflow"**
6. Verifica que todos los nodos se ejecuten en verde ✅

### Test desde WhatsApp:
1. Envía un mensaje al número de Twilio: **"Hola"**
2. Deberías recibir respuesta automática del bot
3. Ve a `/dashboard/conversaciones`
4. Deberías ver la conversación aparecer

---

## 📊 Diagrama del Flujo Nuevo

```
WhatsApp Cliente
      ↓
Twilio recibe mensaje
      ↓
n8n Webhook recibe
      ↓
HTTP Request → /api/chatbot/webhook
      ↓
Chatbot procesa con IA
      ↓
Responde automáticamente
      ↓
Guarda en BD
      ↓
Aparece en Dashboard
```

---

## 🔍 Troubleshooting

### Error: "Webhook not found"
- **Causa**: El webhook de Twilio no está configurado correctamente
- **Solución**: Verifica que la URL en Twilio coincida exactamente con la URL del webhook de n8n

### Error: "Connection timeout"
- **Causa**: El servidor de Next.js está caído o muy lento
- **Solución**:
  1. Verifica que `npm run dev` esté corriendo
  2. Aumenta el timeout en n8n a 30000ms

### El bot no responde
- **Causa 1**: Chatbot no está activado
- **Solución**: Ve a `/dashboard/chatbot-config` y activa el bot

- **Causa 2**: Está en modo pasivo
- **Solución**: Cambia a modo activo en la configuración

### No aparece en el dashboard
- **Causa**: El palenque_id no se está identificando
- **Solución**: Verifica que el número de WhatsApp esté asociado a un palenque o agrega `palenque_id` al payload

---

## 🎯 Checklist Final

Antes de considerarlo completo, verifica:

- [ ] ✅ Workflow importado o actualizado
- [ ] ✅ Webhook URL configurado en Twilio
- [ ] ✅ Workflow activo (switch verde)
- [ ] ✅ Test manual funciona (mensaje de prueba)
- [ ] ✅ Bot responde automáticamente
- [ ] ✅ Conversación aparece en dashboard
- [ ] ✅ Mensajes se guardan en BD

---

## 📝 Notas Importantes

1. **Webhook URL**: La URL del webhook debe ser **HTTP**, no HTTPS (a menos que tengas SSL en n8n)

2. **Formato del Número**: Twilio envía números en formato `whatsapp:+5219511234567`

3. **Identificación de Palenque**: El sistema identifica automáticamente el palenque por:
   - Conversaciones anteriores del número
   - Leads existentes con ese número
   - Si no puede identificar, devuelve error (puedes agregar lógica para asignar palenque por defecto)

4. **Modo Pasivo vs Activo**:
   - **Pasivo**: Solo saluda y notifica al dueño
   - **Activo**: Maneja la venta completa automáticamente

---

## 🆘 Si Nada Funciona

Si después de seguir estos pasos aún no funciona:

1. **Revisa los logs de n8n**:
   - Ve a "Executions" en n8n
   - Busca errores en rojo
   - Copia el mensaje de error

2. **Revisa los logs del servidor**:
   ```bash
   # En la terminal donde corre npm run dev
   # Busca errores en rojo
   ```

3. **Prueba el webhook directamente**:
   ```bash
   curl -X POST https://leads.torressantiago.com/api/chatbot/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "From": "whatsapp:+5219511234567",
       "Body": "Hola",
       "MessageSid": "test123",
       "palenque_id": 1
     }'
   ```

   Si esto funciona, el problema está en n8n o Twilio, no en el chatbot.

---

*Última actualización: 2026-02-13*
