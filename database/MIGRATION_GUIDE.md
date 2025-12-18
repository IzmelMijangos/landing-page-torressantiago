# Guía de Migración: JSON → PostgreSQL

Esta guía te ayudará a migrar tu aplicación de archivos JSON a PostgreSQL paso a paso.

## 📌 Resumen

La aplicación originalmente guardaba datos en archivos JSON locales:
- `data/leads.json` - Leads del chatbot
- `data/newsletter-subscribers.json` - Suscriptores del newsletter
- `data/lead-magnet-downloads.json` - Descargas de recursos
- `data/sent-newsletters.json` - Historial de newsletters enviados

Ahora todos estos datos se almacenan en PostgreSQL (Neon) para mayor escalabilidad, seguridad y rendimiento.

## ✅ Pre-requisitos

- [ ] Node.js 18+ instalado
- [ ] Cuenta en [Neon.tech](https://neon.tech) (gratis)
- [ ] Acceso a las variables de entorno del proyecto
- [ ] Backup de los archivos JSON actuales (si existen)

## 🚀 Pasos de Migración

### Paso 1: Crear Base de Datos en Neon

1. Ve a [console.neon.tech](https://console.neon.tech)
2. Crea una nueva cuenta o inicia sesión
3. Haz clic en "Create Project"
4. Configura:
   - **Project name**: `torres-santiago` (o el nombre que prefieras)
   - **Region**: Selecciona la más cercana (ej: US East - Virginia)
   - **Database name**: `torressantiago_db`
5. Haz clic en "Create Project"
6. Copia el **Connection String** que aparece (algo como):
   ```
   postgresql://usuario:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/torressantiago_db?sslmode=require
   ```

### Paso 2: Configurar Variables de Entorno

1. Crea el archivo `.env.local` (si no existe):
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y agrega tu DATABASE_URL:
   ```bash
   # Reemplaza con tu connection string de Neon
   DATABASE_URL=postgresql://usuario:password@ep-xxxx.us-east-2.aws.neon.tech/torressantiago_db?sslmode=require

   # También necesitarás estas variables (si no las tienes)
   BREVO_API_KEY=tu_api_key_de_brevo
   OPENAI_API_KEY=tu_api_key_de_openai
   NEXT_PUBLIC_BASE_URL=https://www.torressantiago.com
   ```

3. **IMPORTANTE**: Nunca hagas commit de `.env.local` a git (ya está en .gitignore)

### Paso 3: Instalar Dependencias

```bash
# Instalar o actualizar dependencias
npm install
```

Esto instalará:
- `pg` - Cliente de PostgreSQL para Node.js
- `@types/pg` - Tipos TypeScript para pg
- `tsx` - Ejecutor TypeScript para el script de migración

### Paso 4: Crear las Tablas

Hay 3 formas de crear las tablas:

**Opción A: Usando npm script (Recomendado si tienes psql instalado)**
```bash
npm run db:schema
```

**Opción B: Usando psql directamente**
```bash
psql $DATABASE_URL -f database/schema.sql
```

**Opción C: Manualmente en la consola de Neon (Recomendado si no tienes psql)**
1. Ve a [console.neon.tech](https://console.neon.tech)
2. Selecciona tu proyecto
3. Ve a "SQL Editor"
4. Copia todo el contenido de `database/schema.sql`
5. Pégalo en el editor
6. Haz clic en "Run"

### Paso 5: Verificar que las Tablas se Crearon

```bash
# Verificar conexión y tablas
psql $DATABASE_URL -c "\dt"
```

Deberías ver 4 tablas:
- `leads`
- `newsletter_subscribers`
- `lead_magnet_downloads`
- `sent_newsletters`

Si no tienes `psql` instalado, verifica en la consola de Neon:
1. Ve a "SQL Editor"
2. Ejecuta: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`

### Paso 6: Backup de Datos JSON (Importante)

Antes de migrar, haz un backup de tus datos actuales:

```bash
# Crear carpeta de backup
mkdir -p data-backup

# Copiar archivos JSON
cp data/*.json data-backup/

# Verificar que se copiaron
ls -la data-backup/
```

### Paso 7: Migrar Datos de JSON a PostgreSQL

```bash
# Ejecutar script de migración
npm run db:migrate
```

Este script:
- Lee todos los archivos JSON de la carpeta `data/`
- Inserta los datos en las tablas correspondientes
- Muestra estadísticas de cuántos registros se migraron
- Maneja duplicados automáticamente (no sobrescribe datos existentes)

**Salida esperada:**
```
🚀 Iniciando migración de datos JSON a PostgreSQL...
✅ Conexión a la base de datos exitosa
🔍 Verificando tablas en la base de datos...
  ✅ Tabla "leads" existe
  ✅ Tabla "newsletter_subscribers" existe
  ✅ Tabla "lead_magnet_downloads" existe
  ✅ Tabla "sent_newsletters" existe

📊 Migrando 45 leads...
  ✅ 45 leads migrados, 0 omitidos

📧 Migrando 123 suscriptores...
  ✅ 123 suscriptores migrados, 0 omitidos

📥 Migrando 12 descargas...
  ✅ 12 descargas migradas, 0 omitidas

📨 Migrando 5 newsletters...
  ✅ 5 newsletters migrados, 0 omitidos

📊 Estadísticas finales:
  Leads: 45
  Suscriptores: 123
  Descargas: 12
  Newsletters enviados: 5

✅ Migración completada exitosamente!
```

### Paso 8: Verificar la Migración

Verifica que los datos se migraron correctamente:

```bash
# Ver conteo de registros en cada tabla
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

O usa la consola de Neon:
```sql
SELECT 'leads' as tabla, COUNT(*) as registros FROM leads
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'lead_magnet_downloads', COUNT(*) FROM lead_magnet_downloads
UNION ALL
SELECT 'sent_newsletters', COUNT(*) FROM sent_newsletters;
```

### Paso 9: Probar las APIs

Inicia el servidor de desarrollo y prueba que todo funcione:

```bash
npm run dev
```

Prueba estos endpoints:

1. **Newsletter Subscribe**
   ```bash
   curl -X POST http://localhost:3000/api/leads/subscribe \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test User","source":"inline"}'
   ```

2. **Crear Lead**
   ```bash
   curl -X POST http://localhost:3000/api/leads \
     -H "Content-Type: application/json" \
     -d '{"email":"lead@example.com","name":"Lead Test","score":75,"source":"chatbot"}'
   ```

3. **Ver Leads**
   ```bash
   curl http://localhost:3000/api/leads
   ```

4. **Ver Suscriptores**
   ```bash
   curl http://localhost:3000/api/leads/subscribe
   ```

### Paso 10: Desplegar a Producción

#### Para Google App Engine:

1. Agrega la variable DATABASE_URL en `app.yaml`:
   ```yaml
   env_variables:
     DATABASE_URL: "postgresql://usuario:password@host.neon.tech/database?sslmode=require"
     BREVO_API_KEY: "tu_api_key"
     # ... otras variables
   ```

2. Despliega:
   ```bash
   gcloud app deploy
   ```

#### Para Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega `DATABASE_URL` con tu connection string
4. Redeploy:
   ```bash
   vercel --prod
   ```

#### Para Firebase Hosting + Cloud Functions:

1. Configura las variables en Cloud Functions
2. Actualiza tus funciones para usar las nuevas APIs

### Paso 11: Limpieza (Opcional)

Una vez que todo funcione en producción:

```bash
# Los archivos JSON ya no se usan y están en .gitignore
# Puedes mantenerlos como backup o eliminarlos

# Opción 1: Mantener como backup (recomendado)
# No hacer nada - los archivos están ignorados por git

# Opción 2: Eliminar (solo si estás seguro)
# rm data/*.json
```

## 🚨 Troubleshooting

### Error: "DATABASE_URL no está configurada"

**Solución**: Verifica que tienes `DATABASE_URL` en tu `.env.local` y que has reiniciado el servidor de desarrollo.

### Error: "Tabla no existe"

**Solución**: Ejecuta el schema.sql para crear las tablas:
```bash
npm run db:schema
```

### Error: "duplicate key value violates unique constraint"

**Solución**: Los datos ya existen en la base de datos. El script de migración no sobrescribe datos existentes. Esto es normal si ejecutas la migración múltiples veces.

### Error: "Connection refused" o "timeout"

**Solución**:
1. Verifica que el connection string sea correcto
2. Verifica que tengas acceso a internet
3. Verifica que el proyecto de Neon esté activo (no en modo sleep)

### Error al instalar tsx o pg

**Solución**:
```bash
# Limpiar caché e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

## 📊 Comparación: Antes vs Después

### Antes (JSON)
- ❌ Archivos pueden corromperse
- ❌ No hay validación de datos
- ❌ Difícil de escalar
- ❌ Sin búsquedas complejas
- ❌ Sin respaldos automáticos
- ❌ Problemas de concurrencia

### Después (PostgreSQL)
- ✅ Base de datos robusta y confiable
- ✅ Validación a nivel de esquema
- ✅ Escalable a millones de registros
- ✅ Búsquedas y filtros avanzados
- ✅ Backups automáticos en Neon
- ✅ Transacciones y concurrencia

## 🔗 Recursos Adicionales

- [Documentación de Neon](https://neon.tech/docs/introduction)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [node-postgres (pg) Docs](https://node-postgres.com/)
- [Neon Free Tier Limits](https://neon.tech/docs/introduction/technical-preview-free-tier)

## 💡 Mejores Prácticas

1. **Backups Regulares**: Neon hace backups automáticos, pero puedes hacer backups manuales:
   ```bash
   pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
   ```

2. **Monitoreo**: Usa la consola de Neon para monitorear:
   - Uso de almacenamiento
   - Consultas lentas
   - Conexiones activas

3. **Seguridad**:
   - Nunca hagas commit de credenciales
   - Usa variables de entorno
   - Rotación de contraseñas periódica

4. **Performance**:
   - Los índices ya están creados en el schema
   - Monitorea consultas lentas en Neon
   - Considera connection pooling para producción

## ✅ Checklist Final

- [ ] Base de datos creada en Neon
- [ ] Variables de entorno configuradas
- [ ] Tablas creadas correctamente
- [ ] Backup de archivos JSON creado
- [ ] Migración de datos ejecutada
- [ ] Datos verificados en la base de datos
- [ ] APIs probadas localmente
- [ ] Variables de entorno configuradas en producción
- [ ] Aplicación desplegada
- [ ] Todo funciona en producción

¡Felicidades! Has migrado exitosamente a PostgreSQL 🎉
