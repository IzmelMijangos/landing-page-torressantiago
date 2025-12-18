# 🧪 Guía de Pruebas Rápidas - Chatbot Mejorado

**Tiempo total:** ~10 minutos
**Objetivo:** Validar que las 6 mejoras funcionan correctamente

---

## 🚀 Inicio Rápido

### 1. Arrancar el Servidor
```bash
npm run dev
```

Espera a que diga:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### 2. Abrir el Sitio
```
http://localhost:3000
```

---

## ✅ Test 1: FAQ Caché (2 minutos)

### Objetivo:
Verificar que respuestas comunes son INSTANTÁNEAS y NO gastan tokens.

### Pasos:

1. **Abre el chatbot** (botón flotante naranja)

2. **Abre la consola del navegador:**
   - Chrome/Edge: F12 o Ctrl+Shift+J
   - Firefox: F12 o Ctrl+Shift+K
   - Mac: Cmd+Option+J

3. **Prueba estas preguntas** (una por una):

   **Test 1.1: Precio de Web**
   ```
   Escribe: "¿Cuánto cuesta una web?"
   ```
   ✅ **Esperado:**
   - Respuesta INSTANTÁNEA (< 100ms)
   - En consola: `⚡ FAQ Cache Hit - 0 tokens used`
   - Aparecen Quick Replies: [Landing page simple] [E-commerce completo]

   **Test 1.2: WhatsApp**
   ```
   Escribe: "¿Cuál es su WhatsApp?"
   ```
   ✅ **Esperado:**
   - Respuesta instantánea
   - Aparece CTA: [💬 Abrir WhatsApp]
   - Click abre WhatsApp

   **Test 1.3: Servicios**
   ```
   Escribe: "¿Qué servicios ofrecen?"
   ```
   ✅ **Esperado:**
   - Respuesta instantánea
   - Quick Replies: [Web] [Apps] [Chatbots]

### ✅ Resultado:
- [ ] 3 respuestas fueron instantáneas
- [ ] Consola mostró "FAQ Cache Hit" 3 veces
- [ ] Quick Replies aparecieron
- [ ] CTA Button de WhatsApp funcionó

---

## ✅ Test 2: Streaming (2 minutos)

### Objetivo:
Verificar que respuestas aparecen palabra por palabra (como ChatGPT).

### Pasos:

1. **Pregunta algo que NO esté en FAQ:**
   ```
   Escribe: "Cuéntame sobre su experiencia en proyectos de automatización"
   ```

2. **Observa:**
   - ⏱️ Primero: "Alex está pensando..." (~500ms)
   - 📊 Luego: "Alex está escribiendo..." + barra de progreso
   - 🎨 Texto aparece **palabra por palabra**
   - 📈 Barra sube gradualmente: 30% → 50% → 80% → 100%

✅ **Esperado:**
- Ves el pensamiento inicial
- Ves el indicador de progreso
- Texto NO aparece todo de golpe
- Parece más "humano"

### ✅ Resultado:
- [ ] Viste "está pensando"
- [ ] Viste barra de progreso
- [ ] Texto apareció gradualmente
- [ ] Experiencia fluida

---

## ✅ Test 3: Persistencia (1 minuto)

### Objetivo:
Verificar que conversación se guarda al cerrar/recargar.

### Pasos:

1. **Ten una conversación corta** (2-3 mensajes)
   ```
   Tú: "Hola"
   Alex: [responde]
   Tú: "¿Cuánto cuesta una app?"
   Alex: [responde]
   ```

2. **Cierra el chatbot** (botón X)

3. **Recarga la página completa** (F5 o Ctrl+R)

4. **Abre el chatbot nuevamente**

✅ **Esperado:**
- Tu conversación anterior sigue ahí
- Todos los mensajes se restauraron
- Puedes continuar donde te quedaste

### ✅ Resultado:
- [ ] Conversación se guardó
- [ ] Se restauró al abrir
- [ ] Todos los mensajes están

---

## ✅ Test 4: Quick Replies (1 minuto)

### Objetivo:
Verificar que botones de respuesta rápida funcionan.

### Pasos:

1. **Nueva conversación** (botón ↻ Reiniciar)

2. **Pregunta sobre servicios:**
   ```
   Escribe: "¿Qué hacen?"
   ```

3. **Observa los botones** que aparecen abajo:
   - [Web] [Apps] [Chatbots]

4. **Click en "Apps"**

✅ **Esperado:**
- Botones aparecen con animación (escala 0 → 1)
- Click envía automáticamente "Apps"
- Alex responde sobre apps móviles
- Nuevos Quick Replies aparecen

### ✅ Resultado:
- [ ] Botones aparecieron
- [ ] Click auto-envió mensaje
- [ ] Respuesta fue relevante
- [ ] Animación fue suave

---

## ✅ Test 5: CTA Buttons (1 minuto)

### Objetivo:
Verificar que botones de acción directa funcionan.

### Pasos:

1. **Pregunta por contacto:**
   ```
   Escribe: "¿Cómo los contacto?"
   ```

2. **Busca el botón naranja:**
   - [💬 Abrir WhatsApp]

3. **Click en el botón**

✅ **Esperado:**
- Botón destaca (gradiente naranja)
- Click abre nueva pestaña
- Te lleva a WhatsApp Web
- Mensaje pre-llenado: "Hola, vengo del chatbot..."

### Prueba también:

**Email:**
```
Escribe: "¿Cuál es su email?"
```
- Debe aparecer: [📧 Enviar Email]
- Click abre cliente de email

### ✅ Resultado:
- [ ] CTA de WhatsApp funcionó
- [ ] CTA de Email funcionó
- [ ] Mensajes pre-llenados correctos

---

## ✅ Test 6: Analytics Dashboard (2 minutos)

### Objetivo:
Verificar que métricas se registran correctamente.

### Pasos:

1. **Después de las pruebas anteriores**, navega a:
   ```
   http://localhost:3000/admin/chatbot-analytics
   ```

2. **Verifica que aparezcan:**

   **KPIs:**
   - Total Conversaciones: > 0
   - Total Mensajes: > 0
   - Costo Total: > $0
   - Eficiencia Caché: > 0%

   **Gráficas:**
   - "Uso de Tokens por Día" tiene datos
   - "Top Preguntas Cacheadas" tiene datos

   **Resumen:**
   - Ahorro por Caché: > $0
   - Tokens Ahorrados: > 0

3. **Revisa consola del navegador:**
   - Busca: "📊 MÉTRICAS DE OPTIMIZACIÓN"
   - Verifica que hay registros de:
     - Cache hits
     - OpenAI calls
     - Tokens usados

### ✅ Resultado:
- [ ] Dashboard carga correctamente
- [ ] KPIs muestran datos reales
- [ ] Gráficas tienen información
- [ ] Consola muestra métricas

---

## ✅ Test 7: Typing Indicators (1 minuto)

### Objetivo:
Verificar animaciones de "pensando" y "escribiendo".

### Pasos:

1. **Pregunta algo nuevo:**
   ```
   Escribe: "¿Hacen sitios para restaurantes?"
   ```

2. **Observa cuidadosamente:**
   - Paso 1: "Alex está pensando..." (texto simple)
   - Paso 2: Cambia a "Alex está escribiendo..."
   - Paso 3: Barra de progreso aparece
   - Paso 4: Barra sube: ████░░░░ → ████████░ → ██████████

✅ **Esperado:**
- Transición suave entre estados
- Barra animada (no salta)
- Color gradiente naranja
- Timing natural (~2-3 seg total)

### ✅ Resultado:
- [ ] Viste "pensando"
- [ ] Viste "escribiendo"
- [ ] Barra progresó suavemente
- [ ] Timing fue natural

---

## 🎯 Checklist Final de Validación

### Funcionalidades Core:
- [ ] FAQ Caché funciona (respuestas instantáneas)
- [ ] Streaming funciona (palabra por palabra)
- [ ] Persistencia funciona (se guarda y restaura)
- [ ] Quick Replies funcionan (botones clicables)
- [ ] CTA Buttons funcionan (WhatsApp/Email)
- [ ] Typing Indicators funcionan (pensando → escribiendo)
- [ ] Analytics Dashboard funciona (muestra métricas)

### Métricas en Consola:
- [ ] Viste "⚡ FAQ Cache Hit - 0 tokens used"
- [ ] Viste "📊 MÉTRICAS DE OPTIMIZACIÓN"
- [ ] Viste "optimization: Chat Completions + Streaming"
- [ ] Viste tokens totales < 1,500 por conversación

### UX/UI:
- [ ] Animaciones son suaves
- [ ] Botones tienen hover effects
- [ ] Colores son consistentes (naranja/amarillo)
- [ ] Todo es responsive (prueba en mobile)

---

## 🐛 Problemas Comunes y Soluciones

### Problema 1: "FAQ Caché no funciona"
**Síntomas:** Todas las respuestas tardan 1-2 segundos

**Solución:**
1. Verifica que escribes EXACTAMENTE:
   - "¿Cuánto cuesta una web?" (con signos)
   - "cuanto cuesta web" (sin signos también funciona)
2. Revisa consola - debe decir "FAQ Cache Hit"
3. Si no funciona, verifica `src/app/lib/faq-cache.ts` existe

### Problema 2: "Streaming no se ve"
**Síntomas:** Texto aparece todo de golpe

**Solución:**
1. OpenAI puede estar respondiendo muy rápido
2. Prueba con pregunta más larga:
   ```
   "Explícame detalladamente cómo es su proceso de desarrollo de software desde la consulta inicial hasta la entrega final del proyecto"
   ```
3. Verifica que `stream: true` en `route.ts:81`

### Problema 3: "Persistencia no funciona"
**Síntomas:** Conversación se pierde al recargar

**Solución:**
1. Abre DevTools → Application → Local Storage
2. Busca key: `torressantiago_chat_history`
3. Si no existe, revisa que no estés en modo incógnito
4. Verifica que localStorage esté habilitado

### Problema 4: "Analytics Dashboard vacío"
**Síntomas:** Todo en 0, no hay datos

**Solución:**
1. Es normal si NO has tenido conversaciones
2. Ten al menos 5-10 mensajes de prueba
3. El dashboard usa datos simulados + localStorage
4. En producción conectarás una DB real

### Problema 5: "Quick Replies no aparecen"
**Síntomas:** No veo botones después de mensajes

**Solución:**
1. Solo aparecen en respuestas FAQ
2. Prueba: "¿Qué servicios ofrecen?"
3. Si no aparecen, revisa `faq-cache.ts` línea ~90
4. Verifica que `quickReplies` está definido en FAQ

---

## 📊 Métricas Esperadas (Después de Pruebas)

Después de completar todos los tests, deberías ver:

### En Consola:
```
📊 MÉTRICAS DE OPTIMIZACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total tokens: ~800-1,200
Prompt tokens: ~400-600
Completion tokens: ~200-400
Secciones inyectadas: ["Base only"] o ["Pricing", "Contact"]
Tokens del prompt dinámico: 400-800
Optimización: Chat Completions + Streaming + Dynamic Prompt
Source: cache o openai-stream
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### En Analytics Dashboard:
```
Conversaciones: 3-5
Mensajes: 15-25
Costo Total: $0.01-0.03
Eficiencia Caché: 40-60%
```

---

## ✅ Test de Integración Completo (Bonus)

Si quieres hacer UN test que valide TODO:

### Escenario: Usuario Interesado en App Móvil

```
[Abre chatbot]

Tú: "Hola"
Alex: [saludo + quick replies]

[Click en Quick Reply: "Cotizar proyecto"]
Alex: [pregunta sobre proyecto]

Tú: "Necesito una app móvil"
Alex: [responde + quick replies iOS/Android]

[Click: "App híbrida (ambas)"]
Alex: [explica híbrida + precios]

Tú: "¿Cuánto cuesta?"
[INSTANTÁNEO - FAQ Cache Hit]
Alex: [precios $50K-300K + quick replies]

Tú: "¿Cómo los contacto?"
Alex: [info contacto + CTA "💬 Abrir WhatsApp"]

[Click en CTA]
→ Abre WhatsApp ✅

[Cierra chatbot]
[Recarga página]
[Abre chatbot]
→ Conversación sigue ahí ✅

[Ve a /admin/chatbot-analytics]
→ Métricas registradas ✅
```

**Tiempo:** 3-4 minutos
**Valida:** TODAS las 6 mejoras

---

## 🎓 Comandos Útiles Durante Pruebas

### Ver localStorage en DevTools:
```javascript
// En consola del navegador:
console.log(localStorage.getItem('torressantiago_chat_history'))
```

### Ver stats de FAQ Cache:
```javascript
console.log(JSON.parse(localStorage.getItem('faq_cache_stats')))
```

### Limpiar localStorage (reset completo):
```javascript
localStorage.clear()
location.reload()
```

### Forzar recarga de Analytics:
```
http://localhost:3000/admin/chatbot-analytics
[Click en "Refrescar Datos"]
```

---

## 🎉 ¡Pruebas Completadas!

Si completaste TODOS los tests:

✅ Tu chatbot está funcionando perfectamente
✅ Las 6 mejoras están activas
✅ Métricas se están registrando
✅ UX es de nivel profesional

**Siguiente paso:**
→ Lee `MEJORAS-CHATBOT-IMPLEMENTADAS.md` para entender cada mejora en detalle

---

**Tiempo total de pruebas:** ~10 minutos
**Mejoras validadas:** 6/6 ✅
**Estado:** LISTO PARA PRODUCCIÓN 🚀
