# Testing del Prompt Dinámico

## Cómo Funciona el Sistema

El chatbot ahora usa **prompts dinámicos** que inyectan solo las secciones relevantes según el contexto de la conversación:

### Secciones Disponibles

| Sección | Tokens | Se inyecta cuando... |
|---------|--------|---------------------|
| **BASE** (siempre) | ~400 | En todos los mensajes |
| **Pricing** | ~150 | Usuario pregunta por precios, servicios |
| **Contact** | ~100 | Usuario pide contacto o conversación >8 msgs |
| **Case Studies** | ~100 | Usuario pide ejemplos o conversación >4 msgs |
| **Objections** | ~150 | Usuario expresa dudas, objeciones |
| **Conversation Flow** | ~200 | Solo en primeros 2 mensajes |
| **Hot Lead** | ~100 | Usuario muestra urgencia |

## Casos de Prueba

### Test 1: Saludo Inicial
**Usuario:** "Hola"

**Secciones esperadas:**
- ✅ BASE (400 tokens)
- ✅ CONVERSATION_FLOW (200 tokens)

**Total prompt:** ~600 tokens
**vs Estático:** 1,100 tokens
**Ahorro:** 45%

**Consola esperada:**
```javascript
sectionsInjected: ["Conversation Flow"]
dynamicPromptTokens: ~600
estimatedSavings: "~45% vs static prompt"
```

---

### Test 2: Pregunta de Precio
**Usuario:** "Cuánto cuesta un sitio web?"

**Secciones esperadas:**
- ✅ BASE (400 tokens)
- ✅ PRICING (150 tokens)

**Total prompt:** ~550 tokens
**Ahorro:** 50%

**Consola esperada:**
```javascript
sectionsInjected: ["Pricing"]
dynamicPromptTokens: ~550
estimatedSavings: "~50% vs static prompt"
```

---

### Test 3: Solicitud de Contacto
**Usuario:** "Dame tu WhatsApp por favor"

**Secciones esperadas:**
- ✅ BASE (400 tokens)
- ✅ CONTACT (100 tokens)

**Total prompt:** ~500 tokens
**Ahorro:** 55%

**Consola esperada:**
```javascript
sectionsInjected: ["Contact"]
dynamicPromptTokens: ~500
estimatedSavings: "~55% vs static prompt"
```

---

### Test 4: Lead Caliente (múltiples secciones)
**Conversación:**
1. Usuario: "Necesito una app URGENTE"
2. Usuario: "Cuánto cuesta?"

**Mensaje 2 - Secciones esperadas:**
- ✅ BASE (400 tokens)
- ✅ PRICING (150 tokens)
- ✅ HOT_LEAD (100 tokens)

**Total prompt:** ~650 tokens
**Ahorro:** 41%

**Consola esperada:**
```javascript
sectionsInjected: ["Pricing", "Hot Lead"]
dynamicPromptTokens: ~650
estimatedSavings: "~41% vs static prompt"
```

---

### Test 5: Conversación Larga (>8 mensajes)
**En mensaje 9:**

**Secciones esperadas:**
- ✅ BASE (400 tokens)
- ✅ CONTACT (100 tokens)
- ✅ CASE_STUDIES (100 tokens)
- Posiblemente PRICING u OBJECTIONS según contenido

**Total prompt:** ~600-800 tokens
**Ahorro:** 27-45%

---

### Test 6: Objeción de Precio
**Usuario:** "Me parece muy caro"

**Secciones esperadas:**
- ✅ BASE (400 tokens)
- ✅ OBJECTIONS (150 tokens)
- ✅ CASE_STUDIES (100 tokens)

**Total prompt:** ~650 tokens
**Ahorro:** 41%

**Consola esperada:**
```javascript
sectionsInjected: ["Objections", "Case Studies"]
dynamicPromptTokens: ~650
estimatedSavings: "~41% vs static prompt"
```

---

### Test 7: Tu Conversación Original (11 mensajes)

Replica tu conversación del SaaS de construcción. Aquí está el breakdown estimado:

| Mensaje | Usuario | Secciones Inyectadas | Tokens Prompt |
|---------|---------|---------------------|---------------|
| 1 | "Hola me puede dar más información por favor?" | BASE, FLOW | ~600 |
| 2 | "Si me gustaría crear un saas para mi empresa de construcción" | BASE, PRICING | ~550 |
| 3 | "Pues me gustaría tener mejor control en mis gastos" | BASE, PRICING, CASE_STUDIES | ~650 |
| 4 | "Si agendala por favor" | BASE, CONTACT | ~500 |
| 5 | "Izmel angel torres Mijangos y mi correo es tomiizmel@gmail.com" | BASE, CONTACT, HOT_LEAD | ~600 |
| 6 | "si, a las 10 no puedo será posible que la podamos tener el día de mañana a las 4?" | BASE, CONTACT | ~500 |
| 7 | "Si a esa hora está bien, y mis datos son los mismos" | BASE | ~400 |

**Promedio por mensaje:** ~543 tokens (vs 1,100 estático)
**Ahorro promedio:** 51%

**Tokens totales conversación:**
- Antes (estático): ~6,084 tokens por conversación
- Con ventana de contexto: ~4,500 tokens
- **Con prompt dinámico: ~2,700 tokens** ✨

**Ahorro total:** 56% vs implementación anterior

---

## Cómo Probar

### 1. Agregar Console Log en ChatbotWidget

En `src/app/components/ChatbotWidget.tsx` después de línea 87:

```typescript
setMessages(prev => [...prev, assistantMessage])

// 📊 LOG DE PROMPT DINÁMICO
if (data._debug) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎯 PROMPT DINÁMICO')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Secciones inyectadas:', data._debug.sectionsInjected)
  console.log('Tokens del prompt:', data._debug.dynamicPromptTokens)
  console.log('Ahorro:', data._debug.estimatedSavings)
  console.log('Total tokens:', data._debug.totalTokens)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}
```

### 2. Iniciar el servidor

```bash
npm run dev
```

### 3. Abrir DevTools

1. Abre http://localhost:3000
2. Presiona F12 → Console
3. Abre el chatbot

### 4. Ejecutar Tests

Ejecuta cada caso de prueba de arriba y verifica que:
1. ✅ Las secciones inyectadas sean las correctas
2. ✅ Los tokens del prompt sean ~40-55% menores que 1,100
3. ✅ La calidad de las respuestas se mantenga
4. ✅ Los leads se detecten correctamente

---

## Resultados Esperados por Escenario

### Escenario Simple (saludo inicial)
```
Secciones: ["Conversation Flow"]
Tokens prompt: ~600
Tokens totales: ~800-1,000
Ahorro: ~45%
```

### Escenario Medio (pregunta + respuesta)
```
Secciones: ["Pricing"] o ["Contact"]
Tokens prompt: ~500-550
Tokens totales: ~1,200-1,500
Ahorro: ~50%
```

### Escenario Complejo (lead caliente)
```
Secciones: ["Pricing", "Hot Lead", "Case Studies"]
Tokens prompt: ~750
Tokens totales: ~1,800-2,200
Ahorro: ~32%
```

### Conversación Completa (11 mensajes)
```
Promedio tokens/mensaje: ~543
Tokens totales: ~2,700
Ahorro vs antes: 56%
Ahorro vs estático: 40%
```

---

## Debugging

### Si el ahorro es menor al esperado:

1. **Verifica qué secciones se inyectan:**
   ```javascript
   console.log(data._debug.sectionsInjected)
   ```

2. **Revisa el detector de intención:**
   - Si inyecta demasiadas secciones → ajusta keywords en `chatbot-prompts.ts`
   - Si inyecta muy pocas → agrega más keywords

3. **Compara tokens reales vs estimados:**
   ```javascript
   console.log('Estimado:', data._debug.dynamicPromptTokens)
   console.log('Real (prompt):', data._debug.promptTokens)
   ```
   La diferencia debe ser <10%

### Si las respuestas pierden calidad:

1. **Agrega más secciones cuando sea relevante:**
   - Ejemplo: Si Alex no menciona casos de éxito, verifica que `needsCaseStudies` se active correctamente

2. **Ajusta el threshold de detección:**
   ```typescript
   // En chatbot-prompts.ts
   needsCaseStudies: caseKeywords.some(k => msg.includes(k)) || conversationHistory.length > 3 // Cambiar de 4 a 3
   ```

---

## Métricas de Éxito

Para considerar la optimización exitosa:

- ✅ Ahorro promedio: 40-55% en tokens del prompt
- ✅ Ahorro conversación completa: 50-60% vs antes
- ✅ Calidad de respuestas: Igual o mejor
- ✅ Detección de leads: Sin cambios negativos
- ✅ Conversiones: Se mantienen o mejoran

---

## Próximos Pasos Opcionales

Si quieres optimizar aún más:

### 1. Ajustar Thresholds Dinámicamente
```typescript
// Inyectar CONTACT solo después de 10 mensajes en vez de 8
needsContact: contactKeywords.some(k => msg.includes(k)) || conversationHistory.length > 10
```

### 2. A/B Testing
- 50% usuarios: Prompt dinámico
- 50% usuarios: Prompt estático
- Comparar conversión de leads

### 3. Machine Learning para Detección de Intención
- Usar modelo de clasificación en vez de keywords
- Detectar intención con >95% precisión
- Implementación: 5-10 horas

---

**Fecha:** 2025-12-17
**Estado:** ✅ Implementado y listo para pruebas
**Ahorro estimado adicional:** 40-50% vs prompt estático
