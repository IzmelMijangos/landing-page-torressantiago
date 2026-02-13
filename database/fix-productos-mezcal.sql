-- Fix productos_mezcal table structure for chatbot
-- Add new fields and make old fields nullable

-- Add new required fields
ALTER TABLE productos_mezcal ADD COLUMN IF NOT EXISTS sku VARCHAR(50);
ALTER TABLE productos_mezcal ADD COLUMN IF NOT EXISTS tipo_agave VARCHAR(100);
ALTER TABLE productos_mezcal ADD COLUMN IF NOT EXISTS presentaciones JSONB;
ALTER TABLE productos_mezcal ADD COLUMN IF NOT EXISTS proceso VARCHAR(50);
ALTER TABLE productos_mezcal ADD COLUMN IF NOT EXISTS region VARCHAR(100);
ALTER TABLE productos_mezcal ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;
ALTER TABLE productos_mezcal ADD COLUMN IF NOT EXISTS orden_display INTEGER DEFAULT 0;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos_mezcal(activo);
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos_mezcal(sku);

-- Migrate existing data to new format
-- Convert old single-price structure to presentaciones array
UPDATE productos_mezcal
SET presentaciones = jsonb_build_array(
  jsonb_build_object(
    'ml', COALESCE(volumen_ml, 750),
    'precio', precio,
    'stock', COALESCE(stock, 0)
  )
),
tipo_agave = tipo,
activo = disponible
WHERE presentaciones IS NULL;

-- Add comment
COMMENT ON COLUMN productos_mezcal.presentaciones IS 'Array de presentaciones con ML, precio y stock';
COMMENT ON COLUMN productos_mezcal.activo IS 'Reemplaza campo disponible para consistencia';

-- Optional: Make old fields nullable for backwards compatibility
-- ALTER TABLE productos_mezcal ALTER COLUMN precio DROP NOT NULL;
-- ALTER TABLE productos_mezcal ALTER COLUMN tipo DROP NOT NULL;
