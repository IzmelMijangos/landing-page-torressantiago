-- ============================================
-- MIGRACIÓN: Sistema de Chatbot Inteligente
-- Fecha: 2026-02-11
-- Descripción: Tablas para el sistema de chatbot con IA
-- que maneja ventas de mezcal vía WhatsApp
-- ============================================

-- ============================================
-- TABLA 1: configuraciones_chatbot
-- Configuración del bot por palenque
-- ============================================
CREATE TABLE IF NOT EXISTS configuraciones_chatbot (
  id SERIAL PRIMARY KEY,
  palenque_id INTEGER NOT NULL REFERENCES palenques(id) ON DELETE CASCADE,
  modo VARCHAR(20) NOT NULL DEFAULT 'pasivo', -- 'pasivo' o 'activo'
  activo BOOLEAN DEFAULT TRUE,

  -- Configuración de comportamiento
  horario_activo JSONB DEFAULT '{"inicio": "09:00", "fin": "20:00", "dias": [1,2,3,4,5,6]}'::jsonb,
  mensaje_bienvenida TEXT DEFAULT 'Hola! Gracias por contactarnos. ¿En qué puedo ayudarte?',
  mensaje_fuera_horario TEXT DEFAULT 'Gracias por tu mensaje. Nuestro horario es de 9am a 8pm. Te responderemos pronto.',
  tiempo_espera_respuesta INTEGER DEFAULT 120, -- segundos antes de enviar recordatorio

  -- Configuración de ventas (modo activo)
  metodos_pago TEXT[] DEFAULT ARRAY['efectivo', 'transferencia', 'tarjeta'],
  costos_envio JSONB DEFAULT '{"local": 0, "nacional": 150, "internacional": 500}'::jsonb,
  zona_envio_gratis_min NUMERIC(10,2) DEFAULT 1000.00, -- monto mínimo para envío gratis

  -- Configuración de IA
  temperatura_ia NUMERIC(3,2) DEFAULT 0.7,
  personalidad TEXT DEFAULT 'amigable y conocedor',

  -- Metadata adicional
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(palenque_id)
);

CREATE INDEX idx_config_chatbot_palenque ON configuraciones_chatbot(palenque_id);
CREATE INDEX idx_config_chatbot_modo ON configuraciones_chatbot(modo);

COMMENT ON TABLE configuraciones_chatbot IS 'Configuración del chatbot por palenque';
COMMENT ON COLUMN configuraciones_chatbot.modo IS 'pasivo: solo reenvía / activo: vende proactivamente';

-- ============================================
-- TABLA 2: productos_mezcal
-- Catálogo de productos por palenque
-- ============================================
CREATE TABLE IF NOT EXISTS productos_mezcal (
  id SERIAL PRIMARY KEY,
  palenque_id INTEGER NOT NULL REFERENCES palenques(id) ON DELETE CASCADE,
  sku VARCHAR(50),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo_agave VARCHAR(100), -- espadín, tobalá, etc.
  grados_alcohol NUMERIC(4,2), -- ej: 45.5

  -- Presentaciones y precios
  presentaciones JSONB NOT NULL, -- [{"ml": 750, "precio": 450, "stock": 10}, ...]

  -- Info adicional
  proceso VARCHAR(50), -- artesanal, ancestral, etc.
  region VARCHAR(100),
  imagen_url TEXT,

  -- Control
  activo BOOLEAN DEFAULT TRUE,
  destacado BOOLEAN DEFAULT FALSE,
  orden_display INTEGER DEFAULT 0,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_productos_palenque ON productos_mezcal(palenque_id);
CREATE INDEX idx_productos_activo ON productos_mezcal(activo);
CREATE INDEX idx_productos_destacado ON productos_mezcal(destacado);
CREATE INDEX idx_productos_sku ON productos_mezcal(sku);

COMMENT ON TABLE productos_mezcal IS 'Catálogo de productos de mezcal por palenque';
COMMENT ON COLUMN productos_mezcal.presentaciones IS 'Array de presentaciones con ML, precio y stock';

-- ============================================
-- TABLA 3: conversaciones_chatbot
-- Conversaciones de WhatsApp con clientes
-- ============================================
CREATE TABLE IF NOT EXISTS conversaciones_chatbot (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  palenque_id INTEGER NOT NULL REFERENCES palenques(id) ON DELETE CASCADE,
  lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,

  -- Info del cliente
  telefono VARCHAR(50) NOT NULL, -- número de WhatsApp
  nombre_cliente VARCHAR(255),

  -- Estado de la conversación
  estado VARCHAR(30) DEFAULT 'activa', -- activa, pausada, cerrada, convertida
  modo_conversacion VARCHAR(20) DEFAULT 'pasivo', -- pasivo, activo

  -- Tracking
  ultima_interaccion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_cierre TIMESTAMP WITH TIME ZONE,

  -- Intención detectada
  intencion_principal VARCHAR(50), -- consulta_catalogo, hacer_pedido, etc.
  score_intencion NUMERIC(3,2), -- confianza de la IA (0.00 - 1.00)

  -- Resultados
  genera_lead BOOLEAN DEFAULT FALSE,
  genera_venta BOOLEAN DEFAULT FALSE,
  monto_venta NUMERIC(10,2),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb, -- contexto adicional
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversaciones_palenque ON conversaciones_chatbot(palenque_id);
CREATE INDEX idx_conversaciones_telefono ON conversaciones_chatbot(telefono);
CREATE INDEX idx_conversaciones_estado ON conversaciones_chatbot(estado);
CREATE INDEX idx_conversaciones_lead ON conversaciones_chatbot(lead_id);
CREATE INDEX idx_conversaciones_ultima ON conversaciones_chatbot(ultima_interaccion);

COMMENT ON TABLE conversaciones_chatbot IS 'Registro de conversaciones de WhatsApp';
COMMENT ON COLUMN conversaciones_chatbot.modo_conversacion IS 'Define si el bot está en modo pasivo o activo';

-- ============================================
-- TABLA 4: mensajes_whatsapp
-- Mensajes individuales de cada conversación
-- ============================================
CREATE TABLE IF NOT EXISTS mensajes_whatsapp (
  id SERIAL PRIMARY KEY,
  conversacion_id INTEGER NOT NULL REFERENCES conversaciones_chatbot(id) ON DELETE CASCADE,

  -- Info del mensaje
  mensaje_id VARCHAR(100), -- ID de Twilio
  direccion VARCHAR(10) NOT NULL, -- 'entrante' o 'saliente'
  contenido TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'texto', -- texto, imagen, audio, documento

  -- Metadata del mensaje
  media_url TEXT, -- para imágenes/documentos
  estado VARCHAR(20) DEFAULT 'enviado', -- enviado, entregado, leido, fallido

  -- Timestamps
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  leido_at TIMESTAMP WITH TIME ZONE,

  -- Metadata adicional
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mensajes_conversacion ON mensajes_whatsapp(conversacion_id);
CREATE INDEX idx_mensajes_direccion ON mensajes_whatsapp(direccion);
CREATE INDEX idx_mensajes_timestamp ON mensajes_whatsapp(timestamp);
CREATE INDEX idx_mensajes_estado ON mensajes_whatsapp(estado);

COMMENT ON TABLE mensajes_whatsapp IS 'Mensajes individuales de conversaciones de WhatsApp';
COMMENT ON COLUMN mensajes_whatsapp.direccion IS 'entrante: del cliente / saliente: del bot';

-- ============================================
-- TABLA 5: intenciones_detectadas
-- Log de intenciones detectadas por la IA
-- ============================================
CREATE TABLE IF NOT EXISTS intenciones_detectadas (
  id SERIAL PRIMARY KEY,
  conversacion_id INTEGER NOT NULL REFERENCES conversaciones_chatbot(id) ON DELETE CASCADE,
  mensaje_id INTEGER REFERENCES mensajes_whatsapp(id) ON DELETE CASCADE,

  -- Intención detectada
  intencion VARCHAR(50) NOT NULL, -- saludo, consulta_catalogo, hacer_pedido, etc.
  confianza NUMERIC(3,2) NOT NULL, -- 0.00 - 1.00

  -- Entidades extraídas
  entidades JSONB DEFAULT '{}'::jsonb, -- {"producto": "espadín", "cantidad": 2, "presentacion": "750ml"}

  -- Respuesta generada
  respuesta_sugerida TEXT,
  respuesta_enviada TEXT,
  respuesta_aceptada BOOLEAN DEFAULT TRUE,

  -- Metadata
  modelo_ia VARCHAR(50) DEFAULT 'gemini-pro',
  prompt_usado TEXT,
  tiempo_procesamiento INTEGER, -- milisegundos

  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_intenciones_conversacion ON intenciones_detectadas(conversacion_id);
CREATE INDEX idx_intenciones_tipo ON intenciones_detectadas(intencion);
CREATE INDEX idx_intenciones_confianza ON intenciones_detectadas(confianza);
CREATE INDEX idx_intenciones_timestamp ON intenciones_detectadas(timestamp);

COMMENT ON TABLE intenciones_detectadas IS 'Log de intenciones detectadas por IA en las conversaciones';
COMMENT ON COLUMN intenciones_detectadas.entidades IS 'Entidades extraídas del mensaje (productos, cantidades, etc)';

-- ============================================
-- TABLA 6: carritos_temporales
-- Carritos de compra en proceso
-- ============================================
CREATE TABLE IF NOT EXISTS carritos_temporales (
  id SERIAL PRIMARY KEY,
  conversacion_id INTEGER NOT NULL REFERENCES conversaciones_chatbot(id) ON DELETE CASCADE,
  palenque_id INTEGER NOT NULL REFERENCES palenques(id) ON DELETE CASCADE,

  -- Items del carrito
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- [{"producto_id": 1, "nombre": "Espadín 750ml", "cantidad": 2, "precio_unitario": 450, "subtotal": 900}, ...]

  -- Totales
  subtotal NUMERIC(10,2) DEFAULT 0.00,
  costo_envio NUMERIC(10,2) DEFAULT 0.00,
  descuento NUMERIC(10,2) DEFAULT 0.00,
  total NUMERIC(10,2) DEFAULT 0.00,

  -- Info de envío
  direccion_envio JSONB, -- {"calle": "", "ciudad": "", "estado": "", "cp": "", "referencia": ""}
  metodo_pago VARCHAR(30),
  notas_especiales TEXT,

  -- Estado
  estado VARCHAR(20) DEFAULT 'activo', -- activo, abandonado, convertido
  fecha_abandono TIMESTAMP WITH TIME ZONE,
  fecha_conversion TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carritos_conversacion ON carritos_temporales(conversacion_id);
CREATE INDEX idx_carritos_palenque ON carritos_temporales(palenque_id);
CREATE INDEX idx_carritos_estado ON carritos_temporales(estado);
CREATE INDEX idx_carritos_updated ON carritos_temporales(updated_at);

COMMENT ON TABLE carritos_temporales IS 'Carritos de compra en proceso durante conversaciones';
COMMENT ON COLUMN carritos_temporales.items IS 'Array de productos en el carrito';

-- ============================================
-- TABLA 7: plantillas_mensajes
-- Plantillas de mensajes predefinidas
-- ============================================
CREATE TABLE IF NOT EXISTS plantillas_mensajes (
  id SERIAL PRIMARY KEY,
  palenque_id INTEGER REFERENCES palenques(id) ON DELETE CASCADE, -- NULL = plantilla global

  -- Info de la plantilla
  clave VARCHAR(50) NOT NULL, -- saludo_inicial, consulta_catalogo, confirmar_pedido, etc.
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,

  -- Contenido
  contenido TEXT NOT NULL,
  variables TEXT[], -- variables que acepta: {nombre}, {producto}, etc.

  -- Categoría
  categoria VARCHAR(30), -- bienvenida, ventas, soporte, recordatorio

  -- Control
  activo BOOLEAN DEFAULT TRUE,
  es_global BOOLEAN DEFAULT FALSE, -- si es plantilla del sistema

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(palenque_id, clave)
);

CREATE INDEX idx_plantillas_palenque ON plantillas_mensajes(palenque_id);
CREATE INDEX idx_plantillas_clave ON plantillas_mensajes(clave);
CREATE INDEX idx_plantillas_categoria ON plantillas_mensajes(categoria);

COMMENT ON TABLE plantillas_mensajes IS 'Plantillas de mensajes reutilizables para el chatbot';
COMMENT ON COLUMN plantillas_mensajes.variables IS 'Variables que se pueden usar en el contenido';

-- ============================================
-- TABLA 8: seguimientos_automaticos
-- Recordatorios y seguimientos programados
-- ============================================
CREATE TABLE IF NOT EXISTS seguimientos_automaticos (
  id SERIAL PRIMARY KEY,
  palenque_id INTEGER NOT NULL REFERENCES palenques(id) ON DELETE CASCADE,
  conversacion_id INTEGER REFERENCES conversaciones_chatbot(id) ON DELETE CASCADE,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,

  -- Info del seguimiento
  tipo VARCHAR(30) NOT NULL, -- dia_3, dia_7, dia_30, carrito_abandonado, sin_respuesta
  estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, enviado, fallido, cancelado

  -- Contenido
  mensaje TEXT NOT NULL,
  plantilla_id INTEGER REFERENCES plantillas_mensajes(id) ON DELETE SET NULL,

  -- Programación
  fecha_programada TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_enviado TIMESTAMP WITH TIME ZONE,
  intentos INTEGER DEFAULT 0,
  max_intentos INTEGER DEFAULT 3,

  -- Resultado
  respuesta_recibida BOOLEAN DEFAULT FALSE,
  fecha_respuesta TIMESTAMP WITH TIME ZONE,
  genera_conversacion BOOLEAN DEFAULT FALSE,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_seguimientos_palenque ON seguimientos_automaticos(palenque_id);
CREATE INDEX idx_seguimientos_conversacion ON seguimientos_automaticos(conversacion_id);
CREATE INDEX idx_seguimientos_lead ON seguimientos_automaticos(lead_id);
CREATE INDEX idx_seguimientos_estado ON seguimientos_automaticos(estado);
CREATE INDEX idx_seguimientos_fecha ON seguimientos_automaticos(fecha_programada);
CREATE INDEX idx_seguimientos_tipo ON seguimientos_automaticos(tipo);

COMMENT ON TABLE seguimientos_automaticos IS 'Sistema de recordatorios y seguimientos automáticos';
COMMENT ON COLUMN seguimientos_automaticos.tipo IS 'Tipo de seguimiento programado';

-- ============================================
-- TRIGGERS: updated_at automático
-- ============================================

-- Trigger para configuraciones_chatbot
CREATE TRIGGER update_configuraciones_chatbot_updated_at BEFORE UPDATE
  ON configuraciones_chatbot FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para productos_mezcal
CREATE TRIGGER update_productos_mezcal_updated_at BEFORE UPDATE
  ON productos_mezcal FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para conversaciones_chatbot
CREATE TRIGGER update_conversaciones_chatbot_updated_at BEFORE UPDATE
  ON conversaciones_chatbot FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para carritos_temporales
CREATE TRIGGER update_carritos_temporales_updated_at BEFORE UPDATE
  ON carritos_temporales FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para plantillas_mensajes
CREATE TRIGGER update_plantillas_mensajes_updated_at BEFORE UPDATE
  ON plantillas_mensajes FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para seguimientos_automaticos
CREATE TRIGGER update_seguimientos_automaticos_updated_at BEFORE UPDATE
  ON seguimientos_automaticos FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PLANTILLAS INICIALES (Globales)
-- ============================================

INSERT INTO plantillas_mensajes (palenque_id, clave, nombre, descripcion, contenido, variables, categoria, es_global) VALUES
(NULL, 'saludo_inicial', 'Saludo Inicial', 'Primera respuesta al contactar',
 'Hola {nombre}! 👋 Gracias por contactarnos. Soy el asistente virtual de {palenque}. ¿En qué puedo ayudarte hoy?',
 ARRAY['nombre', 'palenque'], 'bienvenida', TRUE),

(NULL, 'consultar_catalogo', 'Consultar Catálogo', 'Respuesta para mostrar catálogo',
 'Con gusto! 🥃 Estos son nuestros mezcales disponibles:\n\n{catalogo}\n\n¿Te interesa alguno en particular?',
 ARRAY['catalogo'], 'ventas', TRUE),

(NULL, 'confirmar_pedido', 'Confirmar Pedido', 'Confirmación de pedido',
 'Perfecto! 📦 Tu pedido:\n\n{items}\n\nSubtotal: ${subtotal}\nEnvío: ${envio}\nTotal: ${total}\n\n¿Confirmas tu pedido?',
 ARRAY['items', 'subtotal', 'envio', 'total'], 'ventas', TRUE),

(NULL, 'fuera_horario', 'Fuera de Horario', 'Respuesta automática fuera de horario',
 'Gracias por tu mensaje! 🌙 Nuestro horario de atención es de {horario}. Te responderemos a la brevedad.',
 ARRAY['horario'], 'soporte', TRUE),

(NULL, 'recordatorio_dia3', 'Recordatorio Día 3', 'Seguimiento día 3',
 'Hola {nombre}! 👋 Te contacto de {palenque}. ¿Ya tuviste oportunidad de probar nuestros mezcales? ¿Te gustaría conocer más?',
 ARRAY['nombre', 'palenque'], 'recordatorio', TRUE),

(NULL, 'carrito_abandonado', 'Carrito Abandonado', 'Recordatorio de carrito abandonado',
 'Hola {nombre}! Veo que dejaste productos en tu carrito. ¿Te gustaría completar tu pedido? 🛒',
 ARRAY['nombre'], 'recordatorio', TRUE)

ON CONFLICT DO NOTHING;

-- ============================================
-- FIN DE MIGRACIÓN
-- ============================================
