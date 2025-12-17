# Guía de Optimización de Imágenes del Blog

## Estado actual

Has descargado imágenes placeholder profesionales que funcionan perfectamente. Este documento te ayuda a optimizarlas o reemplazarlas cuando estés listo.

## Opción 1: Optimizar imágenes actuales

Las imágenes actuales son de buena calidad pero pueden optimizarse:

### Usando herramientas online (Gratis)

**TinyJPG / TinyPNG**
- URL: https://tinyjpg.com
- Sube las 12 imágenes
- Descarga versiones optimizadas (60-80% menos peso)
- Reemplaza en `/public/images/blog/`

**Squoosh (Google)**
- URL: https://squoosh.app
- Control total sobre compresión
- Comparación lado a lado
- Formatos WebP disponibles

### Usando línea de comandos (Avanzado)

Si tienes ImageMagick instalado:

```bash
cd public/images/blog

# Optimizar todas las imágenes (mantener 85% calidad)
for img in *.jpg; do
  convert "$img" -quality 85 -strip "optimized-$img"
done

# Reemplazar originales con optimizadas
for img in optimized-*.jpg; do
  mv "$img" "${img#optimized-}"
done
```

Si tienes jpegoptim:

```bash
cd public/images/blog
jpegoptim --max=85 --strip-all *.jpg
```

## Opción 2: Reemplazar con imágenes de Unsplash

### Paso 1: Seleccionar imágenes

Consulta el archivo `IMAGENES-BLOG-GUIA.md` para ver búsquedas específicas de cada tema en Unsplash.

### Paso 2: Descargar correctamente

1. En Unsplash, haz clic en "Download free"
2. Espera a que descargue (serán archivos grandes: 2-5MB)
3. No uses "Download" con clic derecho (obtendrás menor calidad)

### Paso 3: Redimensionar

Las imágenes de Unsplash son muy grandes. Redimensiónalas antes de usar:

**Tamaño ideal:** 1200x630px (OpenGraph standard)
**Formato:** JPG
**Calidad:** 80-85%
**Peso objetivo:** <150KB por imagen

**Herramientas:**
- Photoshop / GIMP: Redimensionar + Exportar para Web
- https://squoosh.app (online, gratis)
- Canva (redimensionar + exportar)

### Paso 4: Renombrar

Usa exactamente estos nombres:

- ia-pymes.jpg
- roi-chatbots.jpg
- transformacion-digital-oaxaca.jpg
- migracion-nube.jpg
- marketing-vs-desarrollo.jpg
- ciberseguridad-2025.jpg
- apps-moviles-costo.jpg
- desarrollo-web-plantillas.jpg
- ciberseguridad-pymes.jpg
- automatizacion-ia.jpg
- proteccion-datos.jpg
- chatbot-negocio.jpg

### Paso 5: Reemplazar

Simplemente copia las nuevas imágenes a `/public/images/blog/` y reemplaza las existentes.

## Opción 3: Convertir a WebP (Mejor performance)

WebP ofrece mejor compresión que JPG manteniendo calidad.

### Usando Squoosh (Recomendado)

1. Abre https://squoosh.app
2. Arrastra tu imagen
3. Selecciona WebP en el lado derecho
4. Ajusta calidad a 75-80
5. Descarga

### Usando línea de comandos

```bash
cd public/images/blog

# Convertir todas a WebP
for img in *.jpg; do
  cwebp -q 80 "$img" -o "${img%.jpg}.webp"
done
```

**Importante:** Si usas WebP, debes actualizar las referencias en los archivos MDX:

```yaml
# De:
image: "/images/blog/ia-pymes.jpg"

# A:
image: "/images/blog/ia-pymes.webp"
```

## Checklist de optimización

Antes de pasar a producción, verifica:

- [ ] Todas las imágenes pesan <200KB
- [ ] Dimensiones: 1200x630px (ideal para SEO)
- [ ] Formato: JPG o WebP
- [ ] Nombres coinciden exactamente con los MDX
- [ ] Se ven bien en el blog (localhost:3000/blog)
- [ ] Se ven bien en OpenGraph (compartir en redes sociales)

## Verificar OpenGraph

Para verificar cómo se verán en redes sociales:

1. **Facebook Debugger:**
   - https://developers.facebook.com/tools/debug/
   - Pega tu URL: https://torressantiago.com/blog/[slug]

2. **Twitter Card Validator:**
   - https://cards-dev.twitter.com/validator
   - Requiere cuenta de Twitter

3. **LinkedIn Inspector:**
   - https://www.linkedin.com/post-inspector/
   - Pega tu URL

## Tamaños recomendados por uso

**Blog card (listado):**
- Actual: variable según imagen
- Se muestra en h-48 (192px altura)
- El ancho es responsivo

**Blog post header:**
- Actual: width 100%, height auto
- Se muestra con rounded-xl shadow-2xl

**OpenGraph (compartir en redes):**
- Ideal: 1200x630px
- Mínimo: 600x315px
- Máximo: 2400x1260px

## Herramientas recomendadas

**Gratis:**
- TinyJPG/TinyPNG - Compresión automática
- Squoosh - Control total
- GIMP - Editor completo
- Canva - Fácil de usar

**De pago:**
- Adobe Photoshop - Profesional
- Affinity Photo - Una vez, sin suscripción

## Soporte

Si necesitas ayuda con la optimización, avísame y puedo:
- Crear scripts de automatización
- Recomendar configuraciones específicas
- Optimizar imágenes que subas

---

**Nota:** Las imágenes placeholder actuales ya funcionan bien para desarrollo. Solo necesitas optimizar/reemplazar cuando vayas a producción.
