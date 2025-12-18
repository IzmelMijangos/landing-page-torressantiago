# Snippet para Testing de Métricas

## Cómo Ver Métricas en Tiempo Real (Durante Desarrollo)

Agrega este código temporal en `ChatbotWidget.tsx` para ver las métricas en la consola del navegador mientras pruebas.

### Paso 1: Agregar Console Log

En `src/app/components/ChatbotWidget.tsx`, después de la línea 87 (después de `setMessages(prev => [...prev, assistantMessage])`):

```typescript
setMessages(prev => [...prev, assistantMessage])

// 📊 TEMPORAL: Log de métricas para testing
if (data._debug) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 MÉTRICAS DE TOKENS')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Prompt tokens:', data._debug.promptTokens)
  console.log('Completion tokens:', data._debug.completionTokens)
  console.log('TOTAL:', data._debug.totalTokens)
  console.log('Mensajes en contexto:', data._debug.messagesInContext)
  console.log('Optimización:', data._debug.optimization)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  if (data.isHotLead) {
    console.log('🔥 HOT LEAD DETECTADO')
    console.log('Score:', data.leadScore)
    console.log('Info:', data.leadInfo)
  }
}

// Si es lead caliente, guardar y notificar
```

### Paso 2: Abrir DevTools
1. Abre tu sitio local (http://localhost:3000)
2. Presiona F12 para abrir DevTools
3. Ve a la pestaña "Console"
4. Abre el chatbot y conversa

### Paso 3: Ver Resultados

Verás algo como:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 MÉTRICAS DE TOKENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prompt tokens: 1,234
Completion tokens: 87
TOTAL: 1,321
Mensajes en contexto: 3
Optimización: Chat Completions API + Context Window
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Comparación con Tu Prueba Original

### Tu prueba original (Assistants API):
```
Intercambios: 11
Tokens totales: 14,159
Promedio: ~1,287 tokens/intercambio
```

### Con optimización (esperado):
```
Intercambios: 11
Tokens totales: ~4,500-5,000
Promedio: ~409-454 tokens/intercambio
Reducción: 68-65%
```

## Snippet para Acumular Métricas de Sesión

Si quieres ver el total acumulado de una conversación completa:

```typescript
// Al inicio del componente ChatbotWidget (después de línea 20)
const [sessionMetrics, setSessionMetrics] = useState({
  totalTokens: 0,
  requests: 0,
  avgTokensPerRequest: 0
})

// En el try block, después de recibir data (después de línea 87)
setMessages(prev => [...prev, assistantMessage])

// Actualizar métricas de sesión
if (data._debug) {
  setSessionMetrics(prev => {
    const newTotal = prev.totalTokens + data._debug.totalTokens
    const newRequests = prev.requests + 1
    return {
      totalTokens: newTotal,
      requests: newRequests,
      avgTokensPerRequest: Math.round(newTotal / newRequests)
    }
  })

  console.log('📊 SESIÓN ACTUAL:', {
    totalTokens: sessionMetrics.totalTokens + data._debug.totalTokens,
    requests: sessionMetrics.requests + 1,
    promedio: Math.round((sessionMetrics.totalTokens + data._debug.totalTokens) / (sessionMetrics.requests + 1))
  })
}
```

## Mostrar Métricas en UI (Solo para Testing)

Si quieres ver las métricas directamente en el chat (útil para demos):

```typescript
// En el render, después del área de mensajes (después de línea 260)
{/* TEMPORAL: Métricas visibles */}
{sessionMetrics.requests > 0 && (
  <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 text-xs text-blue-900">
    <div className="flex justify-between">
      <span>Tokens: {sessionMetrics.totalTokens.toLocaleString()}</span>
      <span>Promedio: {sessionMetrics.avgTokensPerRequest}</span>
      <span>Requests: {sessionMetrics.requests}</span>
    </div>
  </div>
)}
```

## Pruebas Recomendadas

### Test 1: Conversación Corta (3-5 msgs)
Replica esta conversación:
1. Usuario: "Hola"
2. Alex: [respuesta]
3. Usuario: "Necesito una página web"
4. Alex: [respuesta]
5. Usuario: "Cuánto cuesta?"

**Esperado:** 2,500-3,500 tokens totales

### Test 2: Conversación Tu Ejemplo (11 msgs)
Replica tu conversación original sobre el SaaS de construcción.

**Esperado:** 4,500-5,500 tokens totales (vs 14,159 antes)

### Test 3: Conversación Larga (20+ msgs)
Continúa una conversación hasta tener 20+ intercambios.

**Esperado:** 6,000-8,000 tokens totales
**Importante:** El crecimiento se estabiliza gracias a la ventana de contexto

## Cuándo Remover el Código de Testing

Una vez que confirmes que:
1. ✅ El consumo bajó 60-70%
2. ✅ La calidad de respuestas se mantiene
3. ✅ Los leads se detectan correctamente

Entonces:
1. Remueve los `console.log()` del código
2. Remueve el state `sessionMetrics` si lo agregaste
3. Remueve el div de métricas del UI si lo agregaste

O déjalos si quieres monitorear permanentemente en desarrollo.

## Alertas a Configurar

Si un intercambio individual usa >3,000 tokens:
```typescript
if (data._debug.totalTokens > 3000) {
  console.warn('⚠️ Intercambio con tokens excesivos:', data._debug)
}
```

Si la sesión completa excede 15,000 tokens:
```typescript
if (sessionMetrics.totalTokens > 15000) {
  console.error('🚨 Sesión excede límite esperado')
  // Opcional: bloquear nuevos mensajes
}
```

---

**Recuerda:** Estos snippets son para desarrollo/testing. Remueve antes de producción.
