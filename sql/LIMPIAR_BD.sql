-- ============================================================
-- SCRIPT PARA LIMPIAR LA BASE DE DATOS
-- ============================================================
-- Este script elimina todas las tablas existentes y sus datos
-- Útil para empezar desde cero con el nuevo esquema

-- IMPORTANTE: Ejecutar este script eliminará TODOS los datos
-- Hacer backup antes si es necesario

-- ============================================================
-- OPCIÓN 1: ELIMINAR TABLAS EN ORDEN (respetando FKs)
-- ============================================================

-- Primero eliminar las vistas y tablas que tienen dependencias
DROP VIEW IF EXISTS v_visitas_completas;
DROP TABLE IF EXISTS visitas;

-- Luego las tablas base
DROP TABLE IF EXISTS visitantes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS areas;
DROP TABLE IF EXISTS perfiles;

-- También eliminar tablas antiguas si existen
DROP TABLE IF EXISTS turnos;
DROP TABLE IF EXISTS colas;

-- ============================================================
-- OPCIÓN 2: SOLO VACIAR DATOS (mantener estructura)
-- ============================================================

-- Si solo quieres borrar los datos pero mantener las tablas:
-- DELETE FROM visitas;
-- DELETE FROM visitantes;
-- DELETE FROM usuarios;
-- DELETE FROM areas;
-- DELETE FROM perfiles;

-- Resetear los autoincrement
-- DELETE FROM sqlite_sequence WHERE name IN ('visitas', 'visitantes', 'usuarios', 'areas', 'perfiles');

-- ============================================================
-- VERIFICACIÓN
-- ============================================================

-- Listar todas las tablas que quedan en la BD
SELECT name FROM sqlite_master WHERE type='table';

-- Si el resultado está vacío o solo muestra sqlite_sequence, 
-- la limpieza fue exitosa
