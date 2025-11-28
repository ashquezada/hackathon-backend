# Scripts SQL - Sistema de Gestión de Visitas

Este directorio contiene todos los scripts SQL necesarios para crear y poblar la base de datos del sistema de gestión de visitas.

## 📋 Prerequisitos

- SQLite3 instalado
- Base de datos ubicada en: `backend/data/visitas.db`

## 🗑️ Limpiar Base de Datos Existente

Si ya tienes datos previos (tablas `turnos`, `colas`, etc.), primero limpia la base de datos:

```bash
cd backend
sqlite3 data/visitas.db < sql/LIMPIAR_BD.sql
```

**Verificar que se borró todo:**

```bash
sqlite3 data/visitas.db "SELECT name FROM sqlite_master WHERE type='table';"
```

Resultado esperado: vacío o solo `sqlite_sequence`

## 🚀 Crear Base de Datos Completa

### Opción 1: Ejecutar todos los scripts a la vez (RECOMENDADO)

```bash
cd backend
cat sql/PERFILES.sql sql/AREAS.sql sql/USUARIOS.sql sql/VISITANTES.sql sql/VISITAS.sql | sqlite3 data/visitas.db
```

### Opción 2: Ejecutar scripts uno por uno

**IMPORTANTE:** Respetar este orden por las dependencias de Foreign Keys

```bash
cd backend

# 1. Tabla PERFILES (4 registros: Admin, Autorizante, Guardia, Visitante)
sqlite3 data/visitas.db < sql/PERFILES.sql

# 2. Tabla AREAS (20 departamentos)
sqlite3 data/visitas.db < sql/AREAS.sql

# 3. Tabla USUARIOS (22 usuarios del sistema)
sqlite3 data/visitas.db < sql/USUARIOS.sql

# 4. Tabla VISITANTES (24 visitantes externos)
sqlite3 data/visitas.db < sql/VISITANTES.sql

# 5. Tabla VISITAS (registros de visitas)
sqlite3 data/visitas.db < sql/VISITAS.sql
```

## ✅ Verificar que se creó correctamente

### Ver todas las tablas creadas:

```bash
sqlite3 data/visitas.db ".tables"
```

Resultado esperado:
```
areas      perfiles   usuarios   visitantes visitas
```

### Ver el esquema completo:

```bash
sqlite3 data/visitas.db ".schema"
```

### Contar registros en cada tabla:

```bash
sqlite3 data/visitas.db "
SELECT 'perfiles' as tabla, COUNT(*) as registros FROM perfiles
UNION ALL SELECT 'areas', COUNT(*) FROM areas
UNION ALL SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL SELECT 'visitantes', COUNT(*) FROM visitantes
UNION ALL SELECT 'visitas', COUNT(*) FROM visitas;
"
```

Resultado esperado:
```
perfiles    | 4
areas       | 20
usuarios    | 22
visitantes  | 24
visitas     | 5
```

### Ver usuarios por perfil:

```bash
sqlite3 data/visitas.db "
SELECT p.perfil, COUNT(u.id) as cantidad
FROM perfiles p
LEFT JOIN usuarios u ON u.id_perfil = p.id
GROUP BY p.id, p.perfil;
"
```

### Ver áreas con más usuarios:

```bash
sqlite3 data/visitas.db "
SELECT a.area, COUNT(u.id) as usuarios
FROM areas a
LEFT JOIN usuarios u ON u.id_area = a.id
GROUP BY a.id, a.area
ORDER BY usuarios DESC
LIMIT 10;
"
```

## 📁 Descripción de Archivos

| Archivo | Descripción | Registros |
|---------|-------------|-----------|
| `LIMPIAR_BD.sql` | Elimina todas las tablas existentes | - |
| `PERFILES.sql` | Roles de usuario (Admin, Autorizante, Guardia, Visitante) | 4 |
| `AREAS.sql` | Departamentos/áreas de la organización | 20 |
| `USUARIOS.sql` | Usuarios del sistema (empleados, guardias, admins) | 22 |
| `VISITANTES.sql` | Registro de visitantes externos | 24 |
| `VISITAS.sql` | Registros de visitas (externas e internas) | 5 |

## 🔗 Orden de Dependencias

```
PERFILES ──┐
           ├──> USUARIOS ──┐
AREAS ─────┘               ├──> VISITAS
                           │
VISITANTES ────────────────┘
```

## 🛠️ Modo Interactivo

También puedes ejecutar los scripts desde el modo interactivo de SQLite:

```bash
cd backend
sqlite3 data/visitas.db

.read sql/LIMPIAR_BD.sql
.read sql/PERFILES.sql
.read sql/AREAS.sql
.read sql/USUARIOS.sql
.read sql/VISITANTES.sql
.read sql/VISITAS.sql

.tables
.quit
```

## 📊 Datos de Ejemplo Incluidos

### Perfiles (4)
- 1 Admin
- 2 Autorizante
- 3 Guardia
- 4 Visitante

### Usuarios (22)
- 2 Administradores
- 12 Autorizantes (distribuidos en RR.HH., Tecnología, Ventas, Marketing, Finanzas, Operaciones, Legal)
- 5 Guardias de Seguridad
- Todos con emails válidos y relaciones de supervisión coherentes

### Visitantes (24)
- 15 visitantes de empresas
- 5 visitantes particulares (sin empresa)
- 4 candidatos a entrevistas laborales
- Todos con DNI único y email válido

### Visitas (5)
- 3 visitas externas (con visitantes)
- 2 visitas internas (entre usuarios)

## 🔍 Consultas Útiles

Ver visitas completas con toda la información:

```bash
sqlite3 data/visitas.db "SELECT * FROM v_visitas_completas;"
```

Ver guardias disponibles:

```bash
sqlite3 data/visitas.db "
SELECT u.nombre, u.apellido, u.email
FROM usuarios u
WHERE u.id_perfil = 3 AND u.fecha_baja IS NULL;
"
```

Ver autorizantes por área:

```bash
sqlite3 data/visitas.db "
SELECT a.area, u.nombre, u.apellido
FROM usuarios u
JOIN areas a ON u.id_area = a.id
WHERE u.id_perfil = 2 AND u.fecha_baja IS NULL
ORDER BY a.area, u.apellido;
"
```

## 📖 Documentación

Para ver el esquema completo con diagramas visuales, consulta: `backend/ESQUEMA_BD.md`
