-- ============================================================
-- TABLA: perfiles
-- Descripción: Define los perfiles/roles de usuario del sistema
-- ============================================================

-- Crear tabla perfiles
CREATE TABLE IF NOT EXISTS perfiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  perfil TEXT NOT NULL UNIQUE CHECK(perfil IN ('Admin', 'Autorizante', 'Guardia', 'Visitante'))
);

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Insertar los 4 perfiles del sistema (NO agregar más registros)
INSERT INTO perfiles (id, perfil) VALUES 
  (1, 'Admin'),         -- Administrador del sistema
  (2, 'Autorizante'),   -- Usuario que autoriza visitas
  (3, 'Guardia'),       -- Personal de seguridad
  (4, 'Visitante');     -- Visitante externo

-- ============================================================
-- ÍNDICES
-- ============================================================

-- El campo perfil ya tiene UNIQUE constraint, lo que crea un índice automático

-- ============================================================
-- CONSULTAS DE EJEMPLO
-- ============================================================

-- Ver todos los perfiles
SELECT * FROM perfiles ORDER BY id;

-- Obtener ID de un perfil específico
SELECT id FROM perfiles WHERE perfil = 'Admin';

-- Contar usuarios por perfil
SELECT 
  p.perfil,
  COUNT(u.id) as cantidad_usuarios
FROM perfiles p
LEFT JOIN usuarios u ON p.id = u.id_perfil
GROUP BY p.perfil
ORDER BY p.id;

-- Ver perfiles sin usuarios asignados
SELECT p.perfil
FROM perfiles p
LEFT JOIN usuarios u ON p.id = u.id_perfil
WHERE u.id IS NULL;

-- ============================================================
-- NOTAS
-- ============================================================
-- 1. Los IDs de perfiles son fijos: 1=Admin, 2=Autorizante, 3=Guardia, 4=Visitante
-- 2. No se debe modificar estos registros ya que hay FKs en otras tablas
-- 3. El CHECK constraint asegura que solo estos 4 valores son válidos
-- 4. UNIQUE constraint previene duplicados y crea índice automático
