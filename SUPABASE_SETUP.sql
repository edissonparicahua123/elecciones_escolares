-- ===============================================
-- CONFIGURACIÓN DE BASE DE DATOS PARA SUPABASE
-- Sistema de Votación Escolar
-- ===============================================

-- Crear tabla de partidos
CREATE TABLE IF NOT EXISTS parties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  symbol TEXT,
  color TEXT NOT NULL,
  description TEXT,
  slogan TEXT,
  logo_url TEXT,
  votes INTEGER DEFAULT 0 CHECK (votes >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_parties_votes ON parties(votes DESC);
CREATE INDEX IF NOT EXISTS idx_parties_name ON parties(name);

-- Habilitar Row Level Security
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;

-- Política para lectura (todos pueden leer)
CREATE POLICY "Permitir lectura a todos" ON parties
  FOR SELECT
  USING (true);

-- Política para inserción
CREATE POLICY "Permitir inserción a todos" ON parties
  FOR INSERT
  WITH CHECK (true);

-- Política para actualización
CREATE POLICY "Permitir actualización a todos" ON parties
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política para eliminación
CREATE POLICY "Permitir eliminación a todos" ON parties
  FOR DELETE
  USING (true);

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_parties_updated_at 
  BEFORE UPDATE ON parties 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo (opcional)
INSERT INTO parties (name, symbol, color, description, slogan, logo_url, votes) VALUES
  ('Partido Verde', 'tierra', '#22C55E', 'Comprometidos con el medio ambiente', 'Por un futuro verde', '', 0),
  ('Partido Azul', 'agua', '#3B82F6', 'Educación de calidad para todos', 'Juntos por la educación', '', 0),
  ('Partido Rojo', 'fuego', '#EF4444', 'Innovación y tecnología', 'El futuro es ahora', '', 0)
ON CONFLICT (name) DO NOTHING;

-- Verificar la creación
SELECT 'Configuración completada exitosamente' AS status;
SELECT * FROM parties;