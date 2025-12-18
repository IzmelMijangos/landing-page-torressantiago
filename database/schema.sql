-- Schema para la tabla de suscriptores del newsletter
-- Ejecutar este archivo en tu base de datos Neon PostgreSQL

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  source VARCHAR(50) NOT NULL DEFAULT 'inline',
  signup_page VARCHAR(500),
  signup_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  emails_sent INTEGER DEFAULT 0,
  last_email_sent TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_signup_date ON newsletter_subscribers(signup_date);
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON newsletter_subscribers(source);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE
    ON newsletter_subscribers FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE newsletter_subscribers IS 'Tabla de suscriptores del newsletter de Torres Santiago';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Origen de la suscripción: sidebar, inline, footer, popup, sticky-bar';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Estado: active, unsubscribed';

-- ============================================
-- TABLA: leads (Leads del chatbot)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  lead_id VARCHAR(100) UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  service VARCHAR(255),
  conversation JSONB,
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_timestamp ON leads(timestamp);
CREATE INDEX IF NOT EXISTS idx_leads_notified ON leads(notified);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Trigger para actualizar updated_at en leads
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE
    ON leads FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE leads IS 'Leads generados por el chatbot y otros canales';
COMMENT ON COLUMN leads.score IS 'Puntuación del lead (0-100), >= 50 es lead caliente';
COMMENT ON COLUMN leads.conversation IS 'Historial de conversación en formato JSON';

-- ============================================
-- TABLA: sent_newsletters
-- ============================================
CREATE TABLE IF NOT EXISTS sent_newsletters (
  id SERIAL PRIMARY KEY,
  newsletter_id VARCHAR(100) UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  subject VARCHAR(500) NOT NULL,
  post_slugs TEXT[],
  recipient_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  fail_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'sending',
  test_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para sent_newsletters
CREATE INDEX IF NOT EXISTS idx_sent_newsletters_timestamp ON sent_newsletters(timestamp);
CREATE INDEX IF NOT EXISTS idx_sent_newsletters_status ON sent_newsletters(status);

-- Trigger para actualizar updated_at en sent_newsletters
CREATE TRIGGER update_sent_newsletters_updated_at BEFORE UPDATE
    ON sent_newsletters FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE sent_newsletters IS 'Historial de newsletters enviados';
COMMENT ON COLUMN sent_newsletters.status IS 'Estado: sending, completed, failed';
COMMENT ON COLUMN sent_newsletters.post_slugs IS 'Array de slugs de posts incluidos';

-- ============================================
-- TABLA: lead_magnet_downloads
-- ============================================
CREATE TABLE IF NOT EXISTS lead_magnet_downloads (
  id SERIAL PRIMARY KEY,
  download_id VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  resource VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(500),
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para lead_magnet_downloads
CREATE INDEX IF NOT EXISTS idx_downloads_email ON lead_magnet_downloads(email);
CREATE INDEX IF NOT EXISTS idx_downloads_resource ON lead_magnet_downloads(resource);
CREATE INDEX IF NOT EXISTS idx_downloads_timestamp ON lead_magnet_downloads(timestamp);

-- Trigger para actualizar updated_at en lead_magnet_downloads
CREATE TRIGGER update_lead_magnet_downloads_updated_at BEFORE UPDATE
    ON lead_magnet_downloads FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE lead_magnet_downloads IS 'Registro de descargas de lead magnets (ebooks, guías, etc)';
COMMENT ON COLUMN lead_magnet_downloads.resource IS 'ID del recurso descargado (ej: checklist-desarrollo-web)';
