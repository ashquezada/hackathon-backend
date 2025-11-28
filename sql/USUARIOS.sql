-- ============================================
-- Tabla: USUARIOS
-- Descripción: Almacena información de todos los usuarios del sistema
-- ============================================

CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dni INTEGER NOT NULL UNIQUE,
  pass TEXT NOT NULL,
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

INSERT INTO usuarios (dni, pass, nombre, apellido, email, id_perfil, id_area, id_superior) VALUES
-- Gerentes (perfil 1)
(12345678, '12345678', 'Juan', 'Pérez', 'juan.perez@empresa.com', 1, 1, NULL),
(23456789, '23456789', 'Laura', 'Fernández', 'laura.fernandez@empresa.com', 1, 2, NULL),

-- Directores (perfil 2)
(87654321, '87654321', 'María', 'González', 'maria.gonzalez@empresa.com', 2, 1, 1),
(99887766, '99887766', 'Carlos', 'Rodríguez', 'carlos.rodriguez@empresa.com', 2, 2, 2),
(34567890, '34567890', 'Patricia', 'Sánchez', 'patricia.sanchez@empresa.com', 2, 3, 1),

-- Coordinadores de Sorteos (perfil 3)
(55667788, '55667788', 'Ana', 'López', 'ana.lopez@empresa.com', 3, 4, 3),
(45678901, '45678901', 'Roberto', 'Gómez', 'roberto.gomez@empresa.com', 3, 4, 3),
(56789012, '56789012', 'Claudia', 'Morales', 'claudia.morales@empresa.com', 3, 4, 6),

-- Relaciones Institucionales (perfil 4)
(67890123, '67890123', 'Fernando', 'Ruiz', 'fernando.ruiz@empresa.com', 4, 5, 1),
(78901234, '78901234', 'Valeria', 'Castro', 'valeria.castro@empresa.com', 4, 5, 9),
(89012345, '89012345', 'Diego', 'Mendoza', 'diego.mendoza@empresa.com', 4, 5, 9),

-- Auxiliares Administrativos (perfil 5)
(90123456, '90123456', 'Sofía', 'Torres', 'sofia.torres@empresa.com', 5, 6, 4),
(11111111, '11111111', 'Andrés', 'Vega', 'andres.vega@empresa.com', 5, 7, 5),
(22222222, '22222222', 'Carolina', 'Ramírez', 'carolina.ramirez@empresa.com', 5, 8, 3),
(33333333, '33333333', 'Miguel', 'Flores', 'miguel.flores@empresa.com', 5, 9, 4),
(44444444, '44444444', 'Isabel', 'Herrera', 'isabel.herrera@empresa.com', 5, 10, 5),

-- Recepcionistas (perfil 6) - 2 usuarios
(11223344, '11223344', 'Pedro', 'Martínez', 'pedro.martinez@empresa.com', 6, NULL, 1),
(22334455, '22334455', 'Lucía', 'Ramírez', 'lucia.ramirez@empresa.com', 6, NULL, 1);

-- ============================================
-- CONSULTAS ÚTILES
-- ============================================

-- Obtener todos los usuarios activos
SELECT * FROM usuarios WHERE fecha_baja IS NULL;

-- Obtener usuarios por perfil específico
SELECT u.*, p.perfil, a.area
FROM usuarios u
INNER JOIN perfiles p ON u.id_perfil = p.id
LEFT JOIN areas a ON u.id_area = a.id
WHERE p.perfil = 'Director' 
  AND u.fecha_baja IS NULL;

-- Obtener equipo de un supervisor
SELECT u.* FROM usuarios u
WHERE u.id_superior = 2
  AND u.fecha_baja IS NULL;

-- Obtener jerarquía completa de un usuario
WITH RECURSIVE jerarquia AS (
  SELECT id, dni, nombre, apellido, id_perfil, id_superior, 0 as nivel
  FROM usuarios
  WHERE id = 1
  
  UNION ALL
  
  SELECT u.id, u.dni, u.nombre, u.apellido, u.id_perfil, u.id_superior, j.nivel + 1
  FROM usuarios u
  INNER JOIN jerarquia j ON u.id_superior = j.id
)
SELECT * FROM jerarquia;

-- Obtener todos los recepcionistas
SELECT u.*, p.perfil
FROM usuarios u
INNER JOIN perfiles p ON u.id_perfil = p.id
WHERE p.perfil = 'Recepcionista'
  AND u.fecha_baja IS NULL;

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
