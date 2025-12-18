# 📊 GESTIÓN DE SUSCRIPTORES - GUÍA COMPLETA

**Fecha:** 2025-12-18
**Estado:** ✅ Sistema Completo Implementado

---

## 🎯 DÓNDE ESTÁN TUS SUSCRIPTORES

### Ubicación Actual

Los suscriptores se guardan en archivos JSON locales:

```
data/
├── newsletter-subscribers.json       ← Suscriptores del newsletter
├── lead-magnet-downloads.json        ← Descargas de lead magnets
├── leads.json                        ← Leads del chatbot
└── sent-newsletters.json             ← Historial de newsletters enviados
```

### ⚠️ IMPORTANTE

**En desarrollo:** Los archivos están en `data/` (local)
**En producción:** Los archivos estarán en el servidor

---

## 🖥️ CÓMO GESTIONAR TUS SUSCRIPTORES

### Opción 1: Dashboard Visual (Recomendado) ⭐

**URL:** `http://localhost:3000/admin/leads-dashboard`

**Funciones disponibles:**

1. ✅ **Ver estadísticas en tiempo real**
   - Total de suscriptores activos
   - Suscriptores de hoy y esta semana
   - Desglose por fuente (sidebar, footer, popup, etc.)

2. ✅ **Exportar suscriptores**
   - **CSV** → Para Excel, Google Sheets
   - **JSON** → Para integraciones personalizadas
   - **Formato Brevo** → Para importar a Brevo
   - **Exportar Todo** → Todos los leads (newsletter + downloads + chatbot)

3. ✅ **Acceso rápido**
   - Botón "📧 Enviar Newsletter" → ir directo a enviar newsletter
   - Ver métricas del chatbot y lead magnets

---

## 📥 CÓMO EXPORTAR SUSCRIPTORES

### 1. Exportar a CSV (Para Excel)

**Pasos:**
1. Ve a `/admin/leads-dashboard`
2. Click en "Descargar CSV (Excel)"
3. Se descarga: `suscriptores-2025-12-18.csv`

**El archivo incluye:**
- Email
- Nombre
- Fecha de suscripción
- Fuente (de dónde se suscribió)
- Estado (active/unsubscribed)

**Úsalo para:**
- ✅ Abrir en Excel/Google Sheets
- ✅ Crear reportes
- ✅ Análisis de datos
- ✅ Backup manual

---

### 2. Exportar a JSON

**Pasos:**
1. Click en "Descargar JSON"
2. Se descarga: `leads-json-2025-12-18.json`

**El archivo incluye:**
- Todos los campos completos
- IDs únicos
- Timestamps exactos
- Metadata adicional

**Úsalo para:**
- ✅ Integraciones con otros sistemas
- ✅ Análisis programático
- ✅ Backup completo con metadata

---

### 3. Formato Brevo (Para Importar a Brevo)

**Pasos:**
1. Click en "Formato Brevo"
2. Se descarga: `leads-brevo-2025-12-18.json`

**El archivo está optimizado para Brevo:**
```json
{
  "contacts": [
    {
      "email": "usuario@example.com",
      "attributes": {
        "FIRSTNAME": "Juan",
        "LASTNAME": "",
        "SOURCE": "footer",
        "SUBSCRIBED_DATE": "2025-12-18T16:19:28.350Z"
      }
    }
  ]
}
```

**Cómo importar a Brevo:**
1. Ve a tu cuenta de Brevo: https://app.brevo.com/
2. Menú: **Contacts** → **Import Contacts**
3. Selecciona **Import from a file**
4. Sube el archivo JSON descargado
5. Mapea los campos:
   - Email → Email
   - FIRSTNAME → First Name
   - SOURCE → Atributo personalizado (crea uno si no existe)
6. Click **Import**

**Ventajas:**
- ✅ Sincroniza tu lista local con Brevo
- ✅ Puedes usar las herramientas de email marketing de Brevo
- ✅ Segmentación avanzada en Brevo
- ✅ Campañas automatizadas

---

### 4. Exportar Todo

Click en "Exportar Todo" para obtener:
- Suscriptores del newsletter
- Descargas de lead magnets
- Leads del chatbot

**Úsalo para:**
- ✅ Backup completo
- ✅ Migración a otra plataforma
- ✅ Análisis global de todos los leads

---

## 🔄 SINCRONIZACIÓN CON BREVO

### ¿Por qué sincronizar?

Tu sitio web captura leads → Se guardan localmente → Necesitas tenerlos en Brevo para:
- Crear campañas de email marketing
- Segmentar audiencias
- Ver estadísticas de apertura/clicks
- Automatizar emails

### Flujo Recomendado

**Opción A: Manual (Semanal)**
1. Cada semana exporta en formato Brevo
2. Importa a Brevo
3. Brevo automáticamente detecta duplicados

**Opción B: Automático (Futuro)**
Sistema puede sincronizar automáticamente vía API de Brevo

---

## 📊 VER SUSCRIPTORES DIRECTAMENTE

### Desde el Servidor

```bash
# Ver suscriptores del newsletter
cat data/newsletter-subscribers.json

# Ver descargas de lead magnets
cat data/lead-magnet-downloads.json

# Ver leads del chatbot
cat data/leads.json

# Contar suscriptores activos
cat data/newsletter-subscribers.json | jq '[.[] | select(.status=="active")] | length'
```

### Formato de un Suscriptor

```json
{
  "id": "sub_1766074768350_ci49aqrvt",
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "timestamp": "2025-12-18T16:19:28.350Z",
  "source": "footer",
  "page": "/blog/desarrollo-web",
  "status": "active",
  "emailsSent": 0
}
```

**Campos importantes:**
- `id`: Identificador único
- `email`: Email del suscriptor
- `name`: Nombre (opcional, puede ser vacío)
- `timestamp`: Cuándo se suscribió
- `source`: De dónde se suscribió (sidebar, footer, popup, etc.)
- `page`: En qué página estaba cuando se suscribió
- `status`: active o unsubscribed
- `emailsSent`: Cuántos emails ha recibido

---

## 🗄️ MIGRAR A BASE DE DATOS (Recomendado para Producción)

### Actualmente: Archivos JSON (OK para empezar)

**Ventajas:**
- ✅ Simple
- ✅ Sin costos adicionales
- ✅ Fácil de hacer backup

**Desventajas:**
- ❌ No escala bien (>10,000 suscriptores)
- ❌ Puede haber race conditions con múltiples requests
- ❌ Difícil hacer queries complejas

### Futuro: Base de Datos

**Opciones recomendadas:**

**1. Supabase (PostgreSQL) - RECOMENDADO**
- ✅ Gratuito hasta 500MB
- ✅ PostgreSQL real
- ✅ Auth incluido
- ✅ API automática
- Costo: $0 - $25/mes

**2. MongoDB Atlas**
- ✅ Gratuito hasta 512MB
- ✅ NoSQL flexible
- Costo: $0 - $57/mes

**3. PlanetScale (MySQL)**
- ✅ Gratuito hasta 5GB
- ✅ MySQL serverless
- Costo: $0 - $29/mes

### Cuándo Migrar?

**Migra cuando:**
- ✅ Tienes más de 1,000 suscriptores
- ✅ Envías newsletters frecuentemente (diario)
- ✅ Necesitas queries complejas
- ✅ Quieres segmentación avanzada

**Por ahora (archivos JSON):**
- ✅ OK si tienes < 5,000 suscriptores
- ✅ OK si envías 1-2 newsletters por semana
- ✅ Haz backups regulares

---

## 💾 BACKUPS

### Backup Manual

**Copiar la carpeta data:**
```bash
# Crear backup
cp -r data/ data-backup-$(date +%Y-%m-%d)

# O comprimir
tar -czf data-backup-$(date +%Y-%m-%d).tar.gz data/
```

**Frecuencia recomendada:**
- Antes de enviar cada newsletter
- Semanalmente

### Backup Automático (Futuro)

Puedes configurar un cron job:
```bash
# Añadir a crontab (cada día a las 2am)
0 2 * * * cd /ruta/proyecto && tar -czf backups/data-$(date +\%Y-\%m-\%d).tar.gz data/
```

---

## 📧 GESTIÓN EN BREVO

### Crear Lista de Contactos

1. Ve a Brevo: https://app.brevo.com/
2. **Contacts** → **Lists**
3. Click **Create a list**
4. Nombre: "Newsletter Torres Santiago"
5. Importa los contactos exportados desde tu sitio

### Segmentar por Fuente

Usa el campo `SOURCE` para segmentar:
- `sidebar` → Lectores del blog
- `footer` → Visitantes generales
- `popup` → Alto interés (no se fueron inmediatamente)
- `sticky-bar` → Scrollearon bastante

**Ejemplo de segmento:**
- Crea segmento "Blog Readers" con SOURCE = "sidebar"
- Envía newsletters más técnicos a este segmento

---

## 📊 MÉTRICAS IMPORTANTES

### En tu Dashboard

- **Total suscriptores**: Cuántos tienes
- **Tasa de crecimiento**: Nuevos por semana
- **Fuente más efectiva**: Dónde se suscriben más
- **Tasa de conversión**: Visitantes → Suscriptores

### En Brevo (después de sincronizar)

- **Tasa de apertura**: % que abren tus emails
- **Tasa de clicks**: % que hacen click en links
- **Unsubs cribes**: Cuántos se dan de baja
- **Bounces**: Emails inválidos

**Benchmarks buenos:**
- Tasa de apertura: 20-30%
- Tasa de clicks: 2-5%
- Unsubscribes: < 0.5%

---

## 🚀 BEST PRACTICES

### 1. Limpieza de Lista

**Cada mes:**
- Exporta suscriptores
- Identifica inactivos (no abren emails)
- Considera removerlos o enviar campaña de re-engagement

### 2. Segmentación

**Segmenta por:**
- Fuente de suscripción
- Fecha de suscripción (nuevos vs antiguos)
- Lead magnets descargados
- Engagement (aperturas/clicks)

### 3. GDPR/Privacidad

**Implementado:**
- ✅ Consentimiento explícito al suscribirse
- ✅ Link de unsubscribe en cada email
- ✅ Opción de cancelar suscripción

**Todavía falta:**
- [ ] Página de preferencias
- [ ] Exportar datos del usuario (GDPR right)
- [ ] Borrar datos del usuario (right to be forgotten)

### 4. Backup Regular

- Exporta CSV semanalmente
- Guarda en Google Drive o Dropbox
- Mantén al menos 3 backups históricos

---

## 🔧 TROUBLESHOOTING

### "No veo mis suscriptores en el dashboard"

**Solución:**
1. Verifica que existe `data/newsletter-subscribers.json`
2. Revisa permisos del archivo
3. Reinicia el servidor

### "El CSV está vacío"

**Solución:**
1. Verifica que tienes suscriptores (ve al dashboard)
2. Intenta con formato JSON primero
3. Revisa la consola del navegador para errores

### "No puedo importar a Brevo"

**Solución:**
1. Usa formato Brevo específico (botón morado)
2. Verifica que tu cuenta de Brevo esté activa
3. Asegúrate de tener permisos de importación

---

## 📞 RESUMEN RÁPIDO

### Para ver tus suscriptores:

1. **Dashboard:** `http://localhost:3000/admin/leads-dashboard`
2. **Archivo:** `data/newsletter-subscribers.json`
3. **Exportar CSV:** Click botón verde en dashboard

### Para usar en campañas de email:

1. Exporta en formato Brevo (botón morado)
2. Importa a Brevo
3. Crea campañas desde Brevo

### Para backup:

1. Exporta CSV semanalmente
2. O copia la carpeta `data/`
3. Guarda en lugar seguro

---

## ✅ TODO LO QUE PUEDES HACER AHORA

✅ Ver suscriptores en dashboard
✅ Exportar a CSV para Excel
✅ Exportar a JSON para integraciones
✅ Exportar a formato Brevo
✅ Ver estadísticas en tiempo real
✅ Enviar newsletters a suscriptores
✅ Hacer backups manuales

🔜 **Próximamente:**
- Sincronización automática con Brevo
- Migración a base de datos
- Segmentación avanzada
- Email automation workflows

---

**¿Dudas?** Revisa el dashboard o los archivos JSON directamente.
