-- ============================================
-- Tabla: AREAS
-- Descripción: Almacena las áreas o departamentos de la organización
-- ============================================

CREATE TABLE areas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  area TEXT NOT NULL UNIQUE
);

-- ============================================
-- ÍNDICES
-- ============================================

-- Búsqueda rápida por nombre de área
CREATE INDEX idx_areas_area ON areas(area);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

INSERT INTO areas (area) VALUES
('Recursos Humanos'),
('Tecnología'),
('Ventas'),
('Marketing'),
('Finanzas'),
('Operaciones'),
('Administración'),
('Legal'),
('Logística'),
('Atención al Cliente'),
('Desarrollo de Software'),
('Diseño y Creatividad'),
('Seguridad'),
('Compras'),
('Calidad'),
('Investigación y Desarrollo'),
('Comunicación Corporativa'),
('Auditoría Interna'),
('Soporte Técnico'),
('Producción');

-- ============================================
-- CONSULTAS ÚTILES
-- ============================================

-- Obtener todas las áreas
SELECT * FROM areas ORDER BY area;

-- Obtener área por ID
SELECT * FROM areas WHERE id = 2;

-- Buscar área por nombre
SELECT * FROM areas WHERE area LIKE '%Tecno%';

-- Contar usuarios por área
SELECT 
  a.id,
  a.area,
  COUNT(u.id) as total_usuarios,
  SUM(CASE WHEN u.fecha_baja IS NULL THEN 1 ELSE 0 END) as usuarios_activos
FROM areas a
LEFT JOIN usuarios u ON u.id_area = a.id
GROUP BY a.id, a.area
ORDER BY total_usuarios DESC;

-- Áreas sin usuarios asignados
SELECT a.*
FROM areas a
LEFT JOIN usuarios u ON u.id_area = a.id
WHERE u.id IS NULL;

-- ============================================
-- OPERACIONES COMUNES
-- ============================================

-- Agregar nueva área
INSERT INTO areas (area) VALUES ('Desarrollo de Producto');

-- Actualizar nombre de área
UPDATE areas 
SET area = 'IT & Sistemas' 
WHERE id = 2;

-- Eliminar área (solo si no tiene usuarios asignados)
DELETE FROM areas 
WHERE id = 10 
  AND NOT EXISTS (SELECT 1 FROM usuarios WHERE id_area = 10);

-- Obtener autorizantes por área
SELECT 
  a.area,
  u.nombre,
  u.apellido,
  u.dni
FROM areas a
INNER JOIN usuarios u ON u.id_area = a.id
WHERE u.rol = 'autorizante'
  AND u.fecha_baja IS NULL
ORDER BY a.area, u.apellido;

-- ============================================
-- VALIDACIONES (nivel aplicación)
-- ============================================

-- El nombre del área no puede estar vacío
-- El nombre del área debe ser único
-- No se puede eliminar un área que tenga usuarios asignados
-- Validar que el área exista antes de asignarla a un usuario
