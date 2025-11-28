-- ============================================================
-- TABLA: visitantes
-- Descripción: Registro histórico de visitantes externos
-- ============================================================
-- IMPORTANTE: Esta tabla se alimenta automáticamente al 
-- registrar visitas, NO contiene usuarios del sistema.
-- ============================================================

-- Crear tabla visitantes
CREATE TABLE IF NOT EXISTS visitantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dni INTEGER NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL CHECK(email LIKE '%@%'),
  empresa TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ÍNDICES
-- ============================================================

-- DNI ya tiene índice automático por UNIQUE constraint

-- Búsqueda por empresa
CREATE INDEX idx_visitantes_empresa ON visitantes(empresa);

-- Búsqueda por nombre/apellido
CREATE INDEX idx_visitantes_nombre ON visitantes(nombre, apellido);

-- ============================================================
-- DATOS DE EJEMPLO
-- ============================================================
-- NOTA: En producción, estos datos se crean automáticamente
-- al registrar visitas, NO manualmente.

-- INSERT OR IGNORE respeta el UNIQUE constraint del DNI
INSERT OR IGNORE INTO visitantes (dni, nombre, apellido, email, empresa) VALUES
-- Visitantes de empresas
(15234567, 'Carlos', 'Rodríguez', 'carlos.rodriguez@techcorp.com', 'TechCorp SA'),
(26345678, 'Laura', 'Fernández', 'laura.fernandez@consultora.com', 'Consultora ABC'),
(37456789, 'Ana', 'Martínez', 'ana.martinez@innovatech.com', 'Innovatech'),
(48567890, 'Pedro', 'González', 'pedro.gonzalez@global.com', 'Global Services'),
(59678901, 'Sandra', 'Jiménez', 'sandra.jimenez@proveedorplus.com', 'Proveedor Plus'),
(60789012, 'Alejandro', 'Vargas', 'alejandro.vargas@distribuidora.com', 'Distribuidora Central'),
(71890123, 'Beatriz', 'Campos', 'beatriz.campos@logistica360.com', 'Logística 360'),
(82901234, 'Javier', 'Reyes', 'javier.reyes@marketing-pro.com', 'Marketing Pro'),
(93012345, 'Daniela', 'Núñez', 'daniela.nunez@designstudio.com', 'Design Studio'),
(14123456, 'Rodrigo', 'Paredes', 'rodrigo.paredes@techsolutions.com', 'Tech Solutions'),
(25234567, 'Mónica', 'Gutiérrez', 'monica.gutierrez@finanzascorp.com', 'Finanzas Corp'),
(36345678, 'Gustavo', 'Medina', 'gustavo.medina@auditores.com', 'Auditores Asociados'),
(47456789, 'Cecilia', 'Acosta', 'cecilia.acosta@capacitacion.com', 'Capacitación Total'),
(58567890, 'Martín', 'Delgado', 'martin.delgado@constructora.com', 'Constructora del Sur'),
(69678901, 'Natalia', 'Rojas', 'natalia.rojas@publicidad.com', 'Publicidad Express'),

-- Visitantes particulares (sin empresa)
(19876543, 'Miguel', 'Santos', 'miguel.santos@gmail.com', NULL),
(28765432, 'Elena', 'Pacheco', 'elena.pacheco@hotmail.com', NULL),
(37654321, 'Francisco', 'Molina', 'francisco.molina@yahoo.com', NULL),
(46543210, 'Lucía', 'Benítez', 'lucia.benitez@outlook.com', NULL),
(54321098, 'Raúl', 'Cabrera', 'raul.cabrera@gmail.com', NULL),

-- Candidatos a entrevistas
(61234567, 'Andrea', 'Lara', 'andrea.lara@gmail.com', 'Estudiante - Universidad Nacional'),
(72345678, 'Sebastián', 'Ponce', 'sebastian.ponce@hotmail.com', 'Recién Graduado'),
(83456789, 'Victoria', 'Ríos', 'victoria.rios@gmail.com', 'Profesional Independiente'),
(94567890, 'Mateo', 'Cordero', 'mateo.cordero@outlook.com', 'Freelancer');

-- ============================================================
-- CONSULTAS ÚTILES
-- ============================================================

-- Ver todos los visitantes
SELECT * FROM visitantes ORDER BY apellido, nombre;

-- Buscar visitante por DNI
SELECT * FROM visitantes WHERE dni = 12345678;

-- Buscar visitantes por nombre parcial
SELECT * FROM visitantes 
WHERE nombre LIKE '%Carlos%' OR apellido LIKE '%Carlos%';

-- Visitantes por empresa
SELECT empresa, COUNT(*) as cantidad
FROM visitantes
WHERE empresa IS NOT NULL
GROUP BY empresa
ORDER BY cantidad DESC;

-- Visitantes sin empresa (particulares)
SELECT * FROM visitantes WHERE empresa IS NULL;

-- Visitantes frecuentes (más de 3 visitas)
SELECT 
  v.dni,
  v.nombre,
  v.apellido,
  v.empresa,
  COUNT(vis.id) as total_visitas,
  MAX(vis.created_at) as ultima_visita
FROM visitantes v
INNER JOIN visitas vis ON vis.dni_visitante = v.dni
GROUP BY v.dni
HAVING COUNT(vis.id) > 3
ORDER BY total_visitas DESC;

-- Visitantes nuevos del mes actual
SELECT * FROM visitantes
WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
ORDER BY created_at DESC;

-- Historial completo de un visitante
SELECT 
  vis.id,
  vis.fecha_creacion,
  vis.motivo,
  vis.persona_visitada,
  vis.area,
  vis.estado
FROM visitas vis
WHERE vis.dni_visitante = '12345678'
ORDER BY vis.fecha_creacion DESC;

-- ============================================================
-- OPERACIONES COMUNES
-- ============================================================

-- Insertar o actualizar visitante (UPSERT)
-- Si el DNI existe, actualiza nombre/apellido/email/empresa
-- Si NO existe, crea nuevo registro con id autoincremental
INSERT INTO visitantes (dni, nombre, apellido, email, empresa, updated_at)
VALUES (12345678, 'Carlos Alberto', 'Rodríguez', 'carlos.a.rodriguez@techcorp.com', 'TechCorp SA', CURRENT_TIMESTAMP)
ON CONFLICT(dni) DO UPDATE SET
  nombre = excluded.nombre,
  apellido = excluded.apellido,
  email = excluded.email,
  empresa = excluded.empresa,
  updated_at = CURRENT_TIMESTAMP;

-- Actualizar empresa de un visitante
UPDATE visitantes 
SET empresa = 'Nueva Empresa SRL',
    updated_at = CURRENT_TIMESTAMP
WHERE dni = 12345678;

-- Estadísticas de visitantes
SELECT 
  COUNT(*) as total_visitantes,
  COUNT(DISTINCT empresa) as total_empresas,
  SUM(CASE WHEN empresa IS NULL THEN 1 ELSE 0 END) as sin_empresa
FROM visitantes;

-- ============================================================
-- TRIGGER: Actualizar updated_at automáticamente
-- ============================================================

CREATE TRIGGER IF NOT EXISTS trg_visitantes_updated_at
AFTER UPDATE ON visitantes
FOR EACH ROW
BEGIN
  UPDATE visitantes 
  SET updated_at = CURRENT_TIMESTAMP 
  WHERE id = NEW.id;
END;

-- ============================================================
-- VALIDACIONES (nivel aplicación)
-- ============================================================

-- DNI debe ser numérico, no puede estar vacío y debe ser único
-- Email debe contener el carácter @ (CHECK constraint)
-- Nombre y apellido son obligatorios
-- Empresa es opcional (puede ser NULL para visitantes particulares)
-- Al registrar visita, verificar si visitante existe:
--   - Si existe: reutilizar datos (opcionalmente actualizar)
--   - Si NO existe: crear nuevo registro automáticamente
-- DNI debe ser numérico válido según país

-- ============================================================
-- NOTAS IMPORTANTES
-- ============================================================

-- 1. Esta tabla se alimenta AUTOMÁTICAMENTE al registrar visitas
-- 2. NO contiene usuarios del sistema (ver tabla USUARIOS)
-- 3. ID es clave primaria autoincremental
-- 4. DNI tiene constraint UNIQUE para evitar duplicados
-- 5. Al volver a visitar, se reutilizan datos existentes (buscar por DNI)
-- 6. Si datos cambian (ej: nueva empresa), se actualiza el registro
-- 7. Mantiene historial completo de todos los visitantes
-- 8. Útil para reportes, estadísticas y búsqueda rápida
