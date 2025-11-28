-- ============================================
-- Tabla: USUARIOS
-- Descripción: Almacena información de todos los usuarios del sistema
-- ============================================

CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dni INTEGER NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL CHECK(email LIKE '%@%'),
  id_perfil INTEGER NOT NULL,
  id_area INTEGER,
  id_superior INTEGER,
  fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_baja DATETIME,
  
  -- Relaciones
  FOREIGN KEY (id_perfil) REFERENCES perfiles(id),
  FOREIGN KEY (id_area) REFERENCES areas(id),
  FOREIGN KEY (id_superior) REFERENCES usuarios(id)
);

-- ============================================
-- ÍNDICES
-- ============================================

-- Búsqueda rápida por documento
CREATE INDEX idx_usuarios_dni ON usuarios(dni);

-- Filtrar por perfil
CREATE INDEX idx_usuarios_perfil ON usuarios(id_perfil);

-- Filtrar por área
CREATE INDEX idx_usuarios_area ON usuarios(id_area);

-- Filtrar usuarios activos
CREATE INDEX idx_usuarios_activos ON usuarios(fecha_baja) WHERE fecha_baja IS NULL;

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

INSERT INTO usuarios (dni, nombre, apellido, email, id_perfil, id_area, id_superior) VALUES
-- Administradores
(12345678, 'Juan', 'Pérez', 'juan.perez@empresa.com', 1, NULL, NULL),
(23456789, 'Laura', 'Fernández', 'laura.fernandez@empresa.com', 1, NULL, NULL),

-- Autorizantes - Recursos Humanos
(87654321, 'María', 'González', 'maria.gonzalez@empresa.com', 2, 1, 1),
(99887766, 'Carlos', 'Rodríguez', 'carlos.rodriguez@empresa.com', 2, 1, 2),
(34567890, 'Patricia', 'Sánchez', 'patricia.sanchez@empresa.com', 2, 1, 2),

-- Autorizantes - Tecnología
(55667788, 'Ana', 'López', 'ana.lopez@empresa.com', 2, 2, 1),
(45678901, 'Roberto', 'Gómez', 'roberto.gomez@empresa.com', 2, 2, 3),
(56789012, 'Claudia', 'Morales', 'claudia.morales@empresa.com', 2, 2, 3),

-- Autorizantes - Ventas
(67890123, 'Fernando', 'Ruiz', 'fernando.ruiz@empresa.com', 2, 3, 1),
(78901234, 'Valeria', 'Castro', 'valeria.castro@empresa.com', 2, 3, 8),

-- Autorizantes - Marketing
(89012345, 'Diego', 'Mendoza', 'diego.mendoza@empresa.com', 2, 4, 1),
(90123456, 'Sofía', 'Torres', 'sofia.torres@empresa.com', 2, 4, 10),

-- Autorizantes - Finanzas
(11111111, 'Andrés', 'Vega', 'andres.vega@empresa.com', 2, 5, 1),
(22222222, 'Carolina', 'Ramírez', 'carolina.ramirez@empresa.com', 2, 5, 12),

-- Autorizantes - Operaciones
(33333333, 'Miguel', 'Flores', 'miguel.flores@empresa.com', 2, 6, 1),

-- Autorizantes - Legal
(44444444, 'Isabel', 'Herrera', 'isabel.herrera@empresa.com', 2, 8, 1),

-- Guardias de Seguridad
(11223344, 'Pedro', 'Martínez', 'pedro.martinez@empresa.com', 3, 13, 1),
(22334455, 'Jorge', 'Silva', 'jorge.silva@empresa.com', 3, 13, 1),
(33445566, 'Ricardo', 'Ortiz', 'ricardo.ortiz@empresa.com', 3, 13, 1),
(44556677, 'Eduardo', 'Navarro', 'eduardo.navarro@empresa.com', 3, 13, 1),
(55667799, 'Gabriel', 'Rojas', 'gabriel.rojas@empresa.com', 3, 13, 1);

-- ============================================
-- CONSULTAS ÚTILES
-- ============================================

-- Obtener todos los usuarios activos
SELECT * FROM usuarios WHERE fecha_baja IS NULL;

-- Obtener autorizantes de un área específica
SELECT u.*, p.perfil, a.area
FROM usuarios u
INNER JOIN perfiles p ON u.id_perfil = p.id
LEFT JOIN areas a ON u.id_area = a.id
WHERE p.perfil = 'Autorizante' 
  AND u.id_area = 1 
  AND u.fecha_baja IS NULL;

-- Obtener equipo de un supervisor
SELECT u.* FROM usuarios u
WHERE u.id_superior = 2
  AND u.fecha_baja IS NULL;

-- Obtener jerarquía completa de un usuario
WITH RECURSIVE jerarquia AS (
  SELECT id, dni, nombre, apellido, rol, id_superior, 0 as nivel
  FROM usuarios
  WHERE id = 1
  
  UNION ALL
  
  SELECT u.id, u.dni, u.nombre, u.apellido, u.rol, u.id_superior, j.nivel + 1
  FROM usuarios u
  INNER JOIN jerarquia j ON u.id_superior = j.id
)
SELECT * FROM jerarquia;

-- ============================================
-- OPERACIONES COMUNES
-- ============================================

-- Dar de baja un usuario
UPDATE usuarios 
SET fecha_baja = CURRENT_TIMESTAMP 
WHERE id = 5;

-- Reactivar un usuario
UPDATE usuarios 
SET fecha_baja = NULL 
WHERE id = 5;

-- Cambiar supervisor de un usuario
UPDATE usuarios 
SET id_superior = 3 
WHERE id = 4;

-- Cambiar perfil de un usuario
UPDATE usuarios 
SET id_perfil = 1  -- Cambiar a Admin
WHERE id = 2;

-- Obtener estadísticas por perfil
SELECT 
  p.perfil,
  COUNT(*) as total,
  SUM(CASE WHEN u.fecha_baja IS NULL THEN 1 ELSE 0 END) as activos,
  SUM(CASE WHEN u.fecha_baja IS NOT NULL THEN 1 ELSE 0 END) as inactivos
FROM usuarios u
INNER JOIN perfiles p ON u.id_perfil = p.id
GROUP BY p.perfil;

-- ============================================
-- VALIDACIONES (nivel aplicación)
-- ============================================

-- DNI debe ser numérico y válido según país
-- Email debe contener el carácter @ (CHECK constraint)
-- Nombre y apellido no pueden estar vacíos
-- Un usuario no puede ser su propio superior
-- Al dar de baja, verificar que no tenga visitas pendientes de autorizar
-- Solo administradores pueden cambiar roles
-- Validar que id_superior exista y esté activo
