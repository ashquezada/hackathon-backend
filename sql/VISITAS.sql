-- ============================================================
-- TABLA: visitas
-- Descripción: Registra todas las visitas (externas e internas)
-- ============================================================

-- Crear tabla visitas
CREATE TABLE IF NOT EXISTS visitas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_anfitrion INTEGER NOT NULL,
  id_visitante INTEGER,
  id_usuario INTEGER,
  inicio DATETIME NOT NULL,
  fin DATETIME NOT NULL,
  motivo TEXT NOT NULL,
  check_in DATETIME,
  check_out DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones
  FOREIGN KEY (id_anfitrion) REFERENCES usuarios(id),
  FOREIGN KEY (id_visitante) REFERENCES visitantes(id),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  
  -- CHECK: Exactamente UNO de los dos debe tener valor
  CHECK (
    (id_visitante IS NOT NULL AND id_usuario IS NULL) OR 
    (id_visitante IS NULL AND id_usuario IS NOT NULL)
  )
);

-- ============================================================
-- ÍNDICES
-- ============================================================

-- Búsquedas por anfitrión
CREATE INDEX idx_visitas_anfitrion ON visitas(id_anfitrion);

-- Historial de visitante externo
CREATE INDEX idx_visitas_visitante ON visitas(id_visitante);

-- Historial de usuario visitante
CREATE INDEX idx_visitas_usuario ON visitas(id_usuario);

-- Búsquedas por rango de fechas
CREATE INDEX idx_visitas_fechas ON visitas(inicio, fin);

-- Ordenar por fecha de inicio
CREATE INDEX idx_visitas_inicio ON visitas(inicio);

-- ============================================================
-- DATOS DE EJEMPLO
-- ============================================================
-- NOTA: No se agregan datos adicionales según requerimiento
-- Los datos de ejemplo anteriores se mantienen para referencia

-- Visitas externas (con visitantes de la tabla VISITANTES)
INSERT INTO visitas (id_anfitrion, id_visitante, id_usuario, inicio, fin, motivo, check_in, check_out) VALUES
(2, 1, NULL, '2024-11-27 10:00:00', '2024-11-27 11:30:00', 'Reunión comercial con proveedor', '2024-11-27 10:05:00', '2024-11-27 11:25:00'),
(4, 2, NULL, '2024-11-27 09:00:00', '2024-11-27 10:00:00', 'Entrevista laboral candidato', '2024-11-27 08:55:00', '2024-11-27 10:10:00'),
(2, 3, NULL, '2024-11-27 14:00:00', '2024-11-27 15:30:00', 'Consultoría técnica', '2024-11-27 14:10:00', NULL);

-- Visitas internas (usuarios visitando a otros usuarios)
INSERT INTO visitas (id_anfitrion, id_visitante, id_usuario, inicio, fin, motivo, check_in, check_out) VALUES
(2, NULL, 4, '2024-11-27 11:00:00', '2024-11-27 12:00:00', 'Coordinación de proyecto interdepartamental', '2024-11-27 11:02:00', '2024-11-27 11:58:00'),
(4, NULL, 2, '2024-11-27 15:00:00', '2024-11-27 16:00:00', 'Revisión de presupuestos', NULL, NULL);

-- ============================================================
-- CONSULTAS ÚTILES
-- ============================================================

-- Ver todas las visitas con información completa
SELECT 
  v.id,
  v.inicio,
  v.fin,
  v.motivo,
  u_anf.nombre || ' ' || u_anf.apellido as anfitrion,
  COALESCE(
    vis.nombre || ' ' || vis.apellido, 
    u_vis.nombre || ' ' || u_vis.apellido
  ) as visitante,
  COALESCE(vis.empresa, a.area) as procedencia,
  CASE 
    WHEN v.id_visitante IS NOT NULL THEN 'Externa'
    ELSE 'Interna'
  END as tipo_visita
FROM visitas v
INNER JOIN usuarios u_anf ON v.id_anfitrion = u_anf.id
LEFT JOIN visitantes vis ON v.id_visitante = vis.id
LEFT JOIN usuarios u_vis ON v.id_usuario = u_vis.id
LEFT JOIN areas a ON u_vis.id_area = a.id
ORDER BY v.inicio DESC;

-- Visitas de hoy
SELECT * FROM visitas
WHERE DATE(inicio) = DATE('now')
ORDER BY inicio;

-- Visitas futuras (programadas)
SELECT * FROM visitas
WHERE inicio > CURRENT_TIMESTAMP
ORDER BY inicio;

-- Visitas en curso
SELECT * FROM visitas
WHERE inicio <= CURRENT_TIMESTAMP 
  AND fin >= CURRENT_TIMESTAMP;

-- Historial de visitas por anfitrión
SELECT 
  v.id,
  v.inicio,
  v.fin,
  v.motivo,
  COALESCE(vis.nombre || ' ' || vis.apellido, 
           u_vis.nombre || ' ' || u_vis.apellido) as visitante,
  CASE 
    WHEN v.id_visitante IS NOT NULL THEN 'Externa'
    ELSE 'Interna'
  END as tipo
FROM visitas v
LEFT JOIN visitantes vis ON v.id_visitante = vis.id
LEFT JOIN usuarios u_vis ON v.id_usuario = u_vis.id
WHERE v.id_anfitrion = 2
ORDER BY v.inicio DESC;

-- Historial de un visitante externo
SELECT 
  v.id,
  v.inicio,
  v.fin,
  v.motivo,
  u.nombre || ' ' || u.apellido as anfitrion,
  a.area
FROM visitas v
INNER JOIN usuarios u ON v.id_anfitrion = u.id
LEFT JOIN areas a ON u.id_area = a.id
WHERE v.id_visitante = 1  -- Usar ID del visitante, no DNI
ORDER BY v.inicio DESC;

-- Historial de un usuario visitante (visitas internas)
SELECT 
  v.id,
  v.inicio,
  v.fin,
  v.motivo,
  u.nombre || ' ' || u.apellido as anfitrion,
  a.area as area_visitada
FROM visitas v
INNER JOIN usuarios u ON v.id_anfitrion = u.id
LEFT JOIN areas a ON u.id_area = a.id
WHERE v.id_usuario = 4
ORDER BY v.inicio DESC;

-- Estadísticas por tipo de visita
SELECT 
  CASE 
    WHEN id_visitante IS NOT NULL THEN 'Externa'
    ELSE 'Interna'
  END as tipo_visita,
  COUNT(*) as total,
  AVG((JULIANDAY(fin) - JULIANDAY(inicio)) * 24 * 60) as duracion_promedio_minutos
FROM visitas
GROUP BY tipo_visita;

-- Visitas por anfitrión (ranking)
SELECT 
  u.nombre || ' ' || u.apellido as anfitrion,
  a.area,
  COUNT(v.id) as total_visitas,
  SUM(CASE WHEN v.id_visitante IS NOT NULL THEN 1 ELSE 0 END) as externas,
  SUM(CASE WHEN v.id_usuario IS NOT NULL THEN 1 ELSE 0 END) as internas
FROM usuarios u
LEFT JOIN visitas v ON v.id_anfitrion = u.id
LEFT JOIN areas a ON u.id_area = a.id
GROUP BY u.id
HAVING total_visitas > 0
ORDER BY total_visitas DESC;

-- Visitas del mes actual
SELECT * FROM visitas
WHERE strftime('%Y-%m', inicio) = strftime('%Y-%m', 'now')
ORDER BY inicio DESC;

-- Visitantes frecuentes (externos)
SELECT 
  vis.id,
  vis.dni,
  vis.nombre,
  vis.apellido,
  vis.empresa,
  COUNT(v.id) as total_visitas,
  MAX(v.inicio) as ultima_visita
FROM visitantes vis
INNER JOIN visitas v ON v.id_visitante = vis.id
GROUP BY vis.dni
HAVING COUNT(v.id) >= 3
ORDER BY total_visitas DESC;

-- ============================================================
-- OPERACIONES COMUNES
-- ============================================================

-- Registrar visita externa
INSERT INTO visitas (id_anfitrion, id_visitante, id_usuario, inicio, fin, motivo)
VALUES (2, 1, NULL, '2024-11-28 10:00:00', '2024-11-28 11:00:00', 'Reunión de seguimiento');

-- Registrar visita interna
INSERT INTO visitas (id_anfitrion, id_visitante, id_usuario, inicio, fin, motivo)
VALUES (4, NULL, 2, '2024-11-28 14:00:00', '2024-11-28 15:00:00', 'Capacitación');

-- Actualizar horario de visita
UPDATE visitas 
SET inicio = '2024-11-28 11:00:00',
    fin = '2024-11-28 12:00:00',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Extender duración de visita
UPDATE visitas 
SET fin = DATETIME(fin, '+30 minutes'),
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Cancelar visita (soft delete con campo adicional - requiere agregar campo)
-- O simplemente eliminar si no se requiere historial de cancelaciones
DELETE FROM visitas WHERE id = 1;

-- ============================================================
-- TRIGGER: Actualizar updated_at automáticamente
-- ============================================================

CREATE TRIGGER IF NOT EXISTS trg_visitas_updated_at
AFTER UPDATE ON visitas
FOR EACH ROW
BEGIN
  UPDATE visitas 
  SET updated_at = CURRENT_TIMESTAMP 
  WHERE id = NEW.id;
END;

-- ============================================================
-- VALIDACIONES (nivel aplicación)
-- ============================================================

-- Exactamente UNO de id_visitante o id_usuario debe tener valor (CHECK constraint)
-- inicio debe ser anterior a fin
-- id_anfitrion debe existir en tabla usuarios y estar activo
-- Si id_visitante tiene valor, debe existir en tabla visitantes
-- Si id_usuario tiene valor, debe existir en tabla usuarios y estar activo
-- motivo no puede estar vacío
-- check_in y check_out son opcionales:
--   * check_in: Momento real en que el visitante ingresa (registrado por guardia)
--   * check_out: Momento real en que el visitante sale (registrado por guardia)
--   * Pueden estar NULL si la visita aún no ocurrió o está en progreso
--   * Si check_out existe, check_in debe existir
--   * check_out debe ser posterior a check_in
-- No permitir solapamiento de horarios para el mismo anfitrión (validación opcional)
-- No permitir visitas en el pasado (validación opcional según caso de uso)

-- ============================================================
-- VISTAS ÚTILES
-- ============================================================

-- Vista: Visitas con información completa
CREATE VIEW IF NOT EXISTS v_visitas_completas AS
SELECT 
  v.id,
  v.inicio,
  v.fin,
  CAST((JULIANDAY(v.fin) - JULIANDAY(v.inicio)) * 24 * 60 AS INTEGER) as duracion_minutos,
  v.check_in,
  v.check_out,
  CASE 
    WHEN v.check_in IS NULL THEN 'Pendiente'
    WHEN v.check_out IS NULL THEN 'En curso'
    ELSE 'Finalizada'
  END as estado_visita,
  CAST((JULIANDAY(v.check_out) - JULIANDAY(v.check_in)) * 24 * 60 AS INTEGER) as duracion_real_minutos,
  v.motivo,
  u_anf.id as id_anfitrion,
  u_anf.nombre || ' ' || u_anf.apellido as anfitrion,
  u_anf.id_area as id_area_anfitrion,
  a_anf.area as area_anfitrion,
  CASE 
    WHEN v.id_visitante IS NOT NULL THEN 'Externa'
    ELSE 'Interna'
  END as tipo_visita,
  COALESCE(CAST(vis.id AS TEXT), CAST(u_vis.id AS TEXT)) as identificador_visitante,
  COALESCE(vis.nombre || ' ' || vis.apellido, 
           u_vis.nombre || ' ' || u_vis.apellido) as nombre_visitante,
  COALESCE(vis.empresa, a_vis.area) as procedencia_visitante,
  v.created_at,
  v.updated_at
FROM visitas v
INNER JOIN usuarios u_anf ON v.id_anfitrion = u_anf.id
LEFT JOIN areas a_anf ON u_anf.id_area = a_anf.id
LEFT JOIN visitantes vis ON v.id_visitante = vis.id
LEFT JOIN usuarios u_vis ON v.id_usuario = u_vis.id
LEFT JOIN areas a_vis ON u_vis.id_area = a_vis.id;

-- ============================================================
-- NOTAS IMPORTANTES
-- ============================================================

-- 1. Una visita SIEMPRE tiene un anfitrión (id_anfitrion obligatorio)
-- 2. Exactamente UNO de id_visitante o id_usuario debe tener valor (CHECK constraint)
-- 3. Visita Externa: id_visitante NOT NULL, id_usuario NULL
-- 4. Visita Interna: id_usuario NOT NULL, id_visitante NULL
-- 5. inicio y fin son obligatorios (formato DATETIME: 'YYYY-MM-DD HH:MM:SS')
-- 6. motivo es obligatorio (texto libre)
-- 7. check_in y check_out son opcionales (DATETIME)
--    - check_in: se registra cuando el visitante ingresa (guardia)
--    - check_out: se registra cuando el visitante sale (guardia)
--    - Estado: NULL/NULL=Pendiente, NOT NULL/NULL=En curso, NOT NULL/NOT NULL=Finalizada
-- 8. created_at y updated_at se manejan automáticamente
-- 9. Trigger actualiza updated_at en cada UPDATE
-- 9. Los índices mejoran rendimiento de búsquedas frecuentes
-- 10. La vista v_visitas_completas facilita consultas con toda la información
