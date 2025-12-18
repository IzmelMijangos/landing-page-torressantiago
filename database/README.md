# Base de Datos PostgreSQL - Torres Santiago

Esta carpeta contiene los scripts SQL y herramientas para la gestión de la base de datos PostgreSQL.

## 📋 Tablas

El sistema usa 4 tablas principales:

1. **newsletter_subscribers** - Suscriptores del newsletter
2. **leads** - Leads generados por chatbot y formularios
3. **lead_magnet_downloads** - Descargas de recursos (PDFs, guías, etc)
4. **sent_newsletters** - Historial de newsletters enviados

## 🚀 Setup Inicial

### 1. Crear cuenta en Neon (PostgreSQL gratuito)

1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta gratuita (hasta 0.5GB gratis)
3. Crea un nuevo proyecto
4. Copia el connection string que te proporciona

### 2. Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local y agrega tu DATABASE_URL
# DATABASE_URL=postgresql://usuario:password@host.neon.tech/database?sslmode=require
```

### 3. Crear las tablas

```bash
# Opción 1: Usando psql
psql $DATABASE_URL -f database/schema.sql

# Opción 2: Usando npm script
npm run db:schema

# Opción 3: Manualmente en la consola de Neon
# Copia el contenido de database/schema.sql y ejecútalo en la consola SQL de Neon
```

### 4. Migrar datos existentes (solo una vez)

Si tienes datos en archivos JSON que necesitas migrar:

```bash
# Instalar dependencias
npm install

# Ejecutar migración
npm run db:migrate
```

Este script migrará automáticamente:
- `data/leads.json` → tabla `leads`
- `data/newsletter-subscribers.json` → tabla `newsletter_subscribers`
- `data/lead-magnet-downloads.json` → tabla `lead_magnet_downloads`
- `data/sent-newsletters.json` → tabla `sent_newsletters`

## 🗄️ Tabla: `newsletter_subscribers`

Almacena todos los suscriptores del newsletter con sus datos y estado.

### Campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | ID autoincrementable (clave primaria) |
| `email` | VARCHAR(255) | Email del suscriptor (único) |
| `name` | VARCHAR(255) | Nombre del suscriptor (opcional) |
| `source` | VARCHAR(50) | Origen: sidebar, inline, footer, popup, sticky-bar |
| `signup_page` | VARCHAR(500) | URL de la página donde se suscribió |
| `signup_date` | TIMESTAMP | Fecha y hora de suscripción |
| `status` | VARCHAR(20) | Estado: active, unsubscribed |
| `emails_sent` | INTEGER | Contador de emails enviados |
| `last_email_sent` | TIMESTAMP | Fecha del último email enviado |
| `unsubscribed_at` | TIMESTAMP | Fecha de cancelación (si aplica) |
| `created_at` | TIMESTAMP | Fecha de creación del registro |
| `updated_at` | TIMESTAMP | Última actualización (automática) |

### Índices

- `idx_subscribers_email`: Búsqueda rápida por email
- `idx_subscribers_status`: Filtrado por estado
- `idx_subscribers_signup_date`: Ordenamiento por fecha
- `idx_subscribers_source`: Análisis por fuente

## 📋 Setup Inicial

### 1. Crear la tabla

```bash
# Opción 1: Desde el archivo SQL
PGPASSWORD='tu_password' psql -h tu-host.neon.tech -U tu_usuario -d tu_database -f database/schema.sql

# Opción 2: Conectar interactivamente
psql 'postgresql://usuario:password@host.neon.tech/database?sslmode=require'
\i database/schema.sql
```

### 2. Verificar creación

```sql
-- Ver estructura de la tabla
\d newsletter_subscribers

-- Contar registros
SELECT COUNT(*) FROM newsletter_subscribers;
```

## 🔧 Queries Útiles

### Ver suscriptores activos

```sql
SELECT id, email, name, source, signup_date
FROM newsletter_subscribers
WHERE status = 'active'
ORDER BY signup_date DESC
LIMIT 10;
```

### Estadísticas por fuente

```sql
SELECT
  source,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
  COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed
FROM newsletter_subscribers
GROUP BY source
ORDER BY total DESC;
```

### Suscripciones por día (últimos 7 días)

```sql
SELECT
  DATE(signup_date) as fecha,
  COUNT(*) as suscripciones
FROM newsletter_subscribers
WHERE signup_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(signup_date)
ORDER BY fecha DESC;
```

### Buscar suscriptor por email

```sql
SELECT * FROM newsletter_subscribers
WHERE email ILIKE '%ejemplo@gmail.com%';
```

### Cancelar suscripción manualmente

```sql
UPDATE newsletter_subscribers
SET
  status = 'unsubscribed',
  unsubscribed_at = CURRENT_TIMESTAMP
WHERE email = 'usuario@ejemplo.com';
```

### Reactivar suscripción

```sql
UPDATE newsletter_subscribers
SET
  status = 'active',
  unsubscribed_at = NULL,
  signup_date = CURRENT_TIMESTAMP
WHERE email = 'usuario@ejemplo.com';
```

## 🔒 Backup y Mantenimiento

### Exportar datos a CSV

```sql
COPY (
  SELECT email, name, source, signup_date, status
  FROM newsletter_subscribers
  WHERE status = 'active'
) TO '/tmp/suscriptores_activos.csv' CSV HEADER;
```

### Backup de la tabla

```bash
pg_dump -h host.neon.tech -U usuario -d database -t newsletter_subscribers > backup_subscribers.sql
```

### Restaurar desde backup

```bash
psql -h host.neon.tech -U usuario -d database < backup_subscribers.sql
```

## 📊 Monitoreo

### Métricas clave

```sql
SELECT
  COUNT(*) as total_suscriptores,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as activos,
  COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as cancelados,
  COUNT(CASE WHEN signup_date >= CURRENT_DATE THEN 1 END) as hoy,
  COUNT(CASE WHEN signup_date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as esta_semana,
  COUNT(CASE WHEN signup_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as este_mes
FROM newsletter_subscribers;
```

## 🚀 Integración con la API

El endpoint `/api/leads/subscribe` usa esta tabla para:

1. **POST**: Registrar nuevas suscripciones
2. **GET**: Obtener estadísticas

Ver código en: `src/app/api/leads/subscribe/route.ts`

## 📝 Notas Importantes

- Todas las tablas usan `TIMESTAMP WITH TIME ZONE` para manejar correctamente zonas horarias
- Los triggers actualizan automáticamente el campo `updated_at` en todas las tablas
- Los campos de email tienen restricción UNIQUE para evitar duplicados
- Se usa SSL obligatorio para todas las conexiones (`sslmode=require`)
- Los archivos JSON originales se mantienen como backup pero ya no se usan
- Todas las APIs ahora leen/escriben directamente en PostgreSQL

## 🔧 Comandos útiles

### Verificar conexión
```bash
psql $DATABASE_URL -c "SELECT NOW();"
```

### Ver todas las tablas
```bash
psql $DATABASE_URL -c "\dt"
```

### Contar registros en cada tabla
```bash
psql $DATABASE_URL -c "
SELECT
  'leads' as tabla, COUNT(*) as registros FROM leads
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'lead_magnet_downloads', COUNT(*) FROM lead_magnet_downloads
UNION ALL
SELECT 'sent_newsletters', COUNT(*) FROM sent_newsletters;
"
```

## 🚨 Troubleshooting

### Error: "DATABASE_URL no está configurada"
Asegúrate de que tienes la variable `DATABASE_URL` en tu archivo `.env.local`

### Error: "Tabla no existe"
Ejecuta el schema.sql para crear las tablas:
```bash
npm run db:schema
```

### Error: "Cannot connect to database"
Verifica que:
1. La conexión string sea correcta
2. Tengas acceso a internet
3. El proyecto de Neon esté activo

## 🔗 Enlaces útiles

- [Neon Console](https://console.neon.tech/) - Administrar base de datos
- [PostgreSQL Docs](https://www.postgresql.org/docs/) - Documentación oficial
- [Neon Pricing](https://neon.tech/pricing) - Plan gratuito y opciones de pago
