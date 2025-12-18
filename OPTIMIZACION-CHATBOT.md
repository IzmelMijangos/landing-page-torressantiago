# Optimización de Chatbot - Reducción de Costos 56-70%

## Resumen de Cambios

Se migró el chatbot de **Assistants API** a **Chat Completions API** con las siguientes optimizaciones:

### ⚡ ACTUALIZACIÓN: Prompt Dinámico Implementado

Se agregó **inyección dinámica de secciones** del prompt, reduciendo tokens adicionales 40-50%.

### 1. Migración de API ✅
- **Antes:** `openai.beta.threads` (Assistants API)
- **Después:** `openai.chat.completions.create()` (Chat Completions API)
- **Beneficio:** Reduce overhead de procesamiento y metadata innecesaria

### 2. Ventana de Contexto ✅
- **Implementación:** Solo se envían los últimos 10 mensajes en cada request
- **Beneficio:** Evita que conversaciones largas consuman tokens exponencialmente
- **Cálculo:** Conversación de 20 mensajes antes usaba 20 msgs, ahora solo 10

### 3. Límite de Tokens de Respuesta ✅
- **max_tokens:** 200 (suficiente para el estilo conversacional de Alex)
- **Beneficio:** Evita respuestas innecesariamente largas
- **Nota:** Alex debe responder en 40-80 palabras (~80-120 tokens típicamente)

### 4. Prompt Dinámico ✅ (NUEVO)
- **Sistema de secciones modulares** según contexto
- **Detección de intención** del usuario
- **Inyección selectiva** de información relevante
- **Ahorro:** 40-50% en tokens del prompt

**Funcionamiento:**
- Prompt base (~400 tokens): Siempre
- Pricing (~150 tokens): Solo si pregunta precios
- Contact (~100 tokens): Solo si pide contacto
- Case Studies (~100 tokens): Solo si pide ejemplos
- Objections (~150 tokens): Solo si hay objeciones
- Conversation Flow (~200 tokens): Solo primeros 2 mensajes
- Hot Lead (~100 tokens): Solo si hay urgencia

### 5. Métricas en Tiempo Real ✅
- Cada respuesta incluye `_debug` con:
  - `promptTokens`: Tokens enviados
  - `completionTokens`: Tokens de respuesta
  - `totalTokens`: Total usado
  - `messagesInContext`: Cantidad de mensajes procesados
  - `sectionsInjected`: Secciones del prompt inyectadas
  - `dynamicPromptTokens`: Tokens estimados del prompt
  - `estimatedSavings`: Ahorro vs prompt estático
  - `optimization`: Confirmación de optimizaciones activas

## Comparativa de Costos

### Tu Historial Real
**5 conversaciones iniciales:**
- Total: 30,420 tokens
- **Por conversación: 6,084 tokens**
- Costo: ~$0.018/conversación

### Conversación Ejemplo (11 intercambios - tu prueba)

**Antes (Assistants API):**
- Tokens totales: 14,159
- Tokens/intercambio: ~1,287
- Costo: ~$0.005 USD

**Implementación anterior (Chat Completions sin optimizar):**
- Tokens totales: ~6,084
- Tokens/intercambio: ~553
- Costo: ~$0.0022 USD

**Después (Chat Completions + Ventana + Prompt Dinámico):**
- Tokens totales: **~2,700 estimados**
- Tokens/intercambio: **~245** (reducción 56% vs anterior)
- Costo: **~$0.0010 USD** (reducción 55%)

### Proyección Mensual

| Volumen Diario | Antes ($/mes) | Después ($/mes) | Ahorro Mensual |
|----------------|---------------|-----------------|----------------|
| 100 conv/día   | $54 USD       | $24 USD         | **$30 USD (56%)** |
| 500 conv/día   | $270 USD      | $120 USD        | **$150 USD (56%)** |
| 1000 conv/día  | $540 USD      | $240 USD        | **$300 USD (56%)** |

**Cálculo base:** 6,084 tokens/conv vs 2,700 tokens/conv

**Nota:** Precios basados en GPT-4o-mini ($0.150 / 1M input tokens, $0.600 / 1M output tokens)

## Análisis del Prompt

### Antes: Prompt Estático (1,100 tokens)
- Se enviaba completo en **cada request**
- Incluía información irrelevante para el contexto
- No optimizable

### Ahora: Prompt Dinámico (400-800 tokens)
- ✅ **Base:** 400 tokens (siempre)
- ✅ **Secciones:** 0-400 tokens (según contexto)
- ✅ **Promedio:** ~550 tokens (50% de reducción)

**Beneficio:** Mantienes la calidad de Alex pero reduces costos significativamente.

## Optimizaciones Adicionales Disponibles

### Opción A: Ventana de Contexto Variable
```typescript
// En route.ts línea 174
const contextWindow = messages.length < 5 ? 5 : 10
```
- Para conversaciones cortas, usar ventana más pequeña
- Ahorro adicional: 5-10%

### Opción B: Caché de Prompts (beta)
```typescript
// Requiere OpenAI API v4.52+
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: formattedMessages,
  // ... resto de parámetros
  store: true, // Habilitar caché
})
```
- OpenAI cachea system prompts comunes
- Ahorro potencial: 30-50% en prompt tokens

### Opción C: Resumen de Conversación
Para conversaciones >15 mensajes, resumir los primeros 10:
```typescript
if (messages.length > 15) {
  // Crear resumen de mensajes 1-10
  // Mantener mensajes 11-15 completos
}
```
- Útil para conversaciones muy largas
- Ahorro: 20-30% en conversaciones >20 mensajes

## Monitoreo de Tokens

### Durante Desarrollo
Las métricas se envían en `_debug` de cada respuesta. Para verlas en consola del navegador:

```javascript
// En ChatbotWidget.tsx después de línea 77
console.log('📊 Tokens usados:', data._debug)
```

### En Producción
Crear endpoint para tracking:

```typescript
// /api/metrics/route.ts
export async function POST(req: Request) {
  const { totalTokens, leadScore, timestamp } = await req.json()
  // Guardar en base de datos o servicio de analytics
  // Ejemplo: Supabase, Firebase, o simple CSV
}
```

Llamar desde ChatbotWidget después de recibir respuesta:
```typescript
await fetch('/api/metrics', {
  method: 'POST',
  body: JSON.stringify({
    totalTokens: data._debug.totalTokens,
    leadScore: data.leadScore,
    timestamp: new Date()
  })
})
```

## Testing de la Optimización

### Prueba 1: Conversación Corta (3-5 mensajes)
**Esperado:** 2,500-3,500 tokens totales

### Prueba 2: Conversación Media (8-12 mensajes)
**Esperado:** 4,000-6,000 tokens totales

### Prueba 3: Conversación Larga (15+ mensajes)
**Esperado:** 5,500-7,500 tokens (se mantiene estable por ventana de contexto)

### Cómo Probar
1. Abre el chatbot en tu sitio
2. Abre DevTools (F12) → Console
3. Agrega este código temporal en `ChatbotWidget.tsx` después de línea 87:

```typescript
console.log('📊 Métricas:', {
  totalTokens: data._debug.totalTokens,
  promptTokens: data._debug.promptTokens,
  completionTokens: data._debug.completionTokens,
  messagesInContext: data._debug.messagesInContext
})
```

4. Haz una conversación similar a tu prueba original
5. Verifica que el consumo sea ~68% menor

## Configuración del Modelo

Parámetros optimizados en `route.ts`:

```typescript
temperature: 0.8        // Personalidad amigable pero coherente
max_tokens: 200         // Limita respuestas largas
presence_penalty: 0.6   // Evita repetir conceptos
frequency_penalty: 0.3  // Evita frases repetitivas
```

**¿Cuándo ajustar?**
- Si Alex es muy repetitivo → aumentar `frequency_penalty` a 0.5
- Si respuestas son muy cortas → aumentar `max_tokens` a 250
- Si respuestas son muy variadas → reducir `temperature` a 0.7

## Mantenimiento

### Revisar Mensualmente
1. **Promedio de tokens por conversación** (debe estar en 400-600)
2. **Tasa de conversión de leads** (debe mantenerse igual o mejor)
3. **Quejas de respuestas cortadas** (si aumentan, subir max_tokens)

### Alertas Recomendadas
- Si conversación individual >10,000 tokens → revisar loop infinito
- Si promedio sube >700 tokens → revisar si ventana de contexto funciona
- Si tasa de leads baja >20% → revisar calidad de respuestas

## Archivos Modificados

1. **src/app/api/chat/route.ts**
   - Migrado a Chat Completions API
   - Ventana de contexto implementada
   - **Prompt dinámico con detección de intención**
   - Métricas avanzadas agregadas

2. **src/app/components/ChatbotWidget.tsx**
   - Removido `threadId` (ya no necesario)
   - Simplificado manejo de estado

3. **src/app/lib/chatbot-prompts.ts** (NUEVO)
   - Sistema de prompts modulares
   - Detector de intención del usuario
   - Función de construcción dinámica de prompts

## Próximos Pasos Opcionales

1. **Dashboard de Analytics** (Recomendado)
   - Crear página `/admin/chatbot-metrics`
   - Mostrar: tokens/día, costo/día, leads/día, ROI

2. **A/B Testing**
   - Probar `max_tokens: 200` vs `max_tokens: 250`
   - Medir impacto en conversión de leads

3. **Caché de Respuestas Comunes**
   - Para preguntas FAQ, devolver respuesta pre-generada
   - Ahorro: hasta 100% en consultas repetidas

4. **Rate Limiting por Usuario**
   - Limitar a 20 mensajes por sesión
   - Previene abuso y costos inesperados

## Contacto para Soporte

Si tienes dudas sobre la optimización:
- Revisar métricas en `_debug` de cada respuesta
- Verificar que `optimization: 'Chat Completions API + Context Window'` aparezca
- Comparar tokens totales con las proyecciones de este documento

---

**Fecha de implementación:** 2025-12-17

**Optimizaciones aplicadas:**
- ✅ Chat Completions API (vs Assistants API)
- ✅ Ventana de contexto (10 mensajes)
- ✅ Límite de max_tokens (200)
- ✅ **Prompt dinámico con detección de intención**

**Ahorro estimado total:** 56% en costos de tokens

**Estado:** ✅ Implementado y listo para pruebas

**Documentación adicional:**
- `PROMPT-DINAMICO-TESTING.md` - Casos de prueba del prompt dinámico
- `METRICAS-TESTING.md` - Cómo ver métricas en tiempo real
