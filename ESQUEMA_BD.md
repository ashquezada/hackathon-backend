# 📊 Esquema de Base de Datos - Sistema de Gestión de Visitas

## Diagrama Entidad-Relación

```
                    ┌──────────────────────┐              ┌──────────────────────┐
                    │      PERFILES        │              │        AREAS         │
                    ├──────────────────────┤              ├──────────────────────┤
                    │ PK  id       INTEGER │              │ PK  id       INTEGER │
                    │     perfil   TEXT    │              │     area     TEXT    │
                    └──────────────────────┘              └──────────────────────┘
                             │                                      │
                             │ 1:N                                  │ 1:N
                             │                                      │
                             └──────────┬   ┬───────────────────────┘
                                        │   │
                                        ▼   ▼
                             ┌──────────────────────┐
                             │      USUARIOS        │
                             ├──────────────────────┤
                             │ PK  id       INTEGER │◄────┐
                             │     dni      INTEGER │     │
                             │     nombre   TEXT    │     │ id_superior
                             │     apellido TEXT    │     │ (auto-ref)
                             │     email    TEXT    │     │
                             │ FK  id_perfil        │     │
                             │ FK  id_area          │     │
                             │ FK  id_superior  ────┼─────┘
                             │     fecha_alta       │
                             │     fecha_baja       │
                             └──────────────────────┘
                                        │
                                        │ 1:N
                                        │ id_anfitrion
                                        │
                                        ▼
                             ┌──────────────────────┐
                             │       VISITAS        │
                             ├──────────────────────┤
                             │ PK  id       INTEGER │
                             │ FK  id_anfitrion     │
                             │ FK? id_visitante     │ ─────┐
                             │ FK? id_usuario       │ ───┐ │
                             │     inicio   DATETIME│    │ │
                             │     fin      DATETIME│    │ │
                             │     motivo   TEXT    │    │ │
                             │     check_in DATETIME│    │ │
                             │     check_out DATETIME│   │ │
                             └──────────────────────┘    │ │
                                                         │ │
                        ┌────────────────────────────────┘ │
                        │ N:1 (opcional)                   │
                        │                                  │
                        │                  N:1 (opcional)  │
                        │                                  │
                        ▼                                  ▼
          ┌──────────────────────┐             ┌──────────────────────┐
          │     VISITANTES       │             │      USUARIOS        │
          ├──────────────────────┤             │  (como visitante)    │
          │ PK  id       INTEGER │             └──────────────────────┘
          │     dni      INTEGER │
          │     nombre   TEXT    │             ⚠️  Visita Externa:
          │     apellido TEXT    │                 dni_visitante ≠ NULL
          │     empresa  TEXT    │                 id_usuario = NULL
          └──────────────────────┘
          
          ℹ️  Se auto-alimenta                  🏢 Visita Interna:
              al crear visitas                     id_usuario ≠ NULL
                                                   dni_visitante = NULL


LEYENDA:
─────────────────────────────────────────────────────────────────────────
  PK    Clave Primaria              1:N   Uno a Muchos
  FK    Clave Foránea               N:1   Muchos a Uno
  FK?   Clave Foránea Opcional      ≠     Diferente de
  ───►  Relación obligatoria        ═══►  Relación CHECK constraint
  ···►  Relación opcional           │     Solo una puede existir
```

## 📋 Tabla: PERFILES

Almacena los perfiles o roles del sistema.

### Campos Detallados

| Campo | Tipo | Nulo | Descripción |
|-------|------|------|-------------|
| **id** | INTEGER | NO | ID único autoincrementable |
| **perfil** | TEXT | NO | Nombre del perfil/rol |

### Relaciones

#### Perfil → Usuarios
- **Tipo**: 1:N (Uno a Muchos)
- **Descripción**: Un perfil puede tener múltiples usuarios asignados
- **Clave Foránea**: `usuarios.id_perfil` → `perfiles(id)`

### Perfiles del Sistema

| ID | Perfil | Descripción | Permisos |
|----|--------|-------------|----------|
| 1 | 🔐 **Admin** | Administrador del sistema | Acceso total, gestión de usuarios |
| 2 | 👤 **Autorizante** | Empleado que autoriza visitas | Autorizar/rechazar visitas, ver historial |
| 3 | 🛡️ **Guardia** | Personal de seguridad | Check-in/check-out, consultar visitas |
| 4 | 👥 **Visitante** | Persona externa | Solo consultar su propia visita |

### Ejemplo de Datos
```
id=1  Admin
id=2  Autorizante
id=3  Guardia
id=4  Visitante
```

---

📄 **Ver SQL completo**: [PERFILES.sql](./sql/PERFILES.sql)

---

## 📋 Tabla: AREAS

Almacena las áreas o departamentos de la organización.

### Campos Detallados

| Campo | Tipo | Nulo | Descripción |
|-------|------|------|-------------|
| **id** | INTEGER | NO | ID único autoincrementable |
| **area** | TEXT | NO | Nombre del área/departamento |

### Relaciones

#### Área → Usuarios
- **Tipo**: 1:N (Uno a Muchos)
- **Descripción**: Un área puede tener múltiples usuarios asignados
- **Clave Foránea**: `usuarios.id_area` → `areas(id)`

### Ejemplo de Datos
```
id=1  Recursos Humanos
id=2  Tecnología
id=3  Ventas
id=4  Marketing
id=5  Finanzas
```

---

📄 **Ver SQL completo**: [AREAS.sql](./sql/AREAS.sql)

---

## 📋 Tabla: USUARIOS

Almacena información de todos los usuarios del sistema (autorizantes, guardias, administradores).

### Campos Detallados

| Campo | Tipo | Nulo | Descripción |
|-------|------|------|-------------|
| **id** | INTEGER | NO | ID único autoincrementable |
| **dni** | INTEGER | NO | Documento único por usuario |
| **nombre** | TEXT | NO | Nombre del usuario |
| **apellido** | TEXT | NO | Apellido del usuario |
| **email** | TEXT | NO | Email del usuario (debe contener @) |
| **id_perfil** | INTEGER | NO | Referencia al perfil/rol del usuario |
| **id_area** | INTEGER | SÍ | Referencia al área de trabajo |
| **id_superior** | INTEGER | SÍ | Referencia al supervisor directo |
| **fecha_alta** | DATETIME | NO | Fecha de registro (auto) |
| **fecha_baja** | DATETIME | SÍ | NULL = activo, valor = dado de baja |

### Relaciones

#### Usuario → Perfil
- **Tipo**: N:1 (Muchos a Uno)
- **Descripción**: Muchos usuarios pueden tener el mismo perfil
- **Clave Foránea**: `id_perfil` → `perfiles(id)`

#### Usuario → Área
- **Tipo**: N:1 (Muchos a Uno)
- **Descripción**: Muchos usuarios pueden pertenecer a un área
- **Clave Foránea**: `id_area` → `areas(id)`

#### Auto-referencia: Usuario → Supervisor
- **Tipo**: 1:N (Uno a Muchos)
- **Descripción**: Un usuario puede tener un supervisor. Un supervisor puede tener múltiples subordinados.
- **Clave Foránea**: `id_superior` → `usuarios(id)`

### Índices

- 🔍 `idx_usuarios_dni` → Búsqueda rápida por documento
- 🔍 `idx_usuarios_perfil` → Filtrar por perfil
- 🔍 `idx_usuarios_area` → Filtrar por área
- 🔍 `idx_usuarios_activos` → Solo usuarios activos (fecha_baja IS NULL)

### Casos de Uso

#### Jerarquía Organizacional
```
       Admin (id=1)
          │
    ┌─────┴─────┐
    │           │
Supervisor A  Supervisor B
  (id=2)        (id=3)
    │
┌───┴───┐
│       │
Emp 1  Emp 2
```

#### Ejemplo de Datos
```
id=1  Juan Pérez      (id_perfil=1 Admin)        superior=NULL  area=NULL
id=2  María González  (id_perfil=2 Autorizante)  superior=1     area=1 (RR.HH.)
id=3  Pedro Martínez  (id_perfil=3 Guardia)      superior=1     area=NULL
id=4  Ana López       (id_perfil=2 Autorizante)  superior=2     area=2 (Tecnología)
```

---

📄 **Ver SQL completo**: [USUARIOS.sql](./sql/USUARIOS.sql)

---

## 📋 Tabla: VISITANTES

Almacena el registro histórico de visitantes externos. Se alimenta automáticamente al registrar visitas.

⚠️ **IMPORTANTE**: Esta tabla NO contiene usuarios del sistema. Solo almacena personas que realizan visitas.

### Campos Detallados

| Campo | Tipo | Nulo | Descripción |
|-------|------|------|-------------|
| **id** | INTEGER | NO | ID único autoincrementable (clave primaria) |
| **dni** | INTEGER | NO | Documento del visitante (único) |
| **nombre** | TEXT | NO | Nombre del visitante |
| **apellido** | TEXT | NO | Apellido del visitante |
| **email** | TEXT | NO | Email del visitante (debe contener @) |
| **empresa** | TEXT | SÍ | Empresa a la que pertenece |
| **created_at** | DATETIME | NO | Primera visita registrada (auto) |
| **updated_at** | DATETIME | NO | Última actualización de datos (auto) |

### Características

- 🔄 **Auto-alimentación**: Se crea/actualiza automáticamente al registrar visitas
- 🔑 **ID como PK**: Identificador único autoincrementable
- 📋 **DNI único**: Documento con constraint UNIQUE, no puede duplicarse
- 📝 **Histórico**: Mantiene registro de todos los visitantes que han ingresado
- 🏢 **Empresa opcional**: No todos los visitantes representan empresas
- ⚡ **Reutilizable**: Al volver a visitar, se reutilizan los datos existentes

### Relaciones

#### Visitante → Visitas
- **Tipo**: 1:N (Uno a Muchos)
- **Descripción**: Un visitante puede tener múltiples visitas registradas
- **Clave Foránea**: `visitas.id_visitante` → `visitantes(id)`
- **Nota**: Se mantiene compatibilidad con dni para búsquedas

### Índices

- 🔍 `PRIMARY KEY(id)` → Identificador único
- 🔍 `UNIQUE(dni)` → DNI único, búsqueda rápida por documento
- 🔍 `idx_visitantes_empresa` → Filtrar por empresa
- 🔍 `idx_visitantes_nombre` → Búsqueda por nombre/apellido

### Casos de Uso

#### Flujo de Registro de Visita
```
1. Usuario registra nueva visita con DNI
2. Sistema verifica si existe en VISITANTES
3a. Si existe: Reutiliza datos existentes
3b. Si NO existe: Crea nuevo registro en VISITANTES
4. Crea registro en VISITAS relacionado
```

#### Actualización de Datos
```
- Al registrar visita, si los datos cambiaron (ej: nueva empresa)
- Sistema actualiza registro en VISITANTES
- Mantiene historial de cambios en updated_at
```

### Ejemplo de Datos
```
id=1  dni="12345678"  nombre="Carlos"  apellido="Rodríguez"  empresa="TechCorp SA"
id=2  dni="87654321"  nombre="Laura"   apellido="Fernández"  empresa="Consultora ABC"
id=3  dni="11223344"  nombre="Miguel"  apellido="Santos"     empresa=NULL (particular)
```

### Consultas Comunes

```sql
-- Ver visitantes frecuentes (más de 3 visitas)
SELECT v.dni, v.nombre, v.apellido, v.empresa, COUNT(vis.id) as total_visitas
FROM visitantes v
INNER JOIN visitas vis ON vis.dni_visitante = v.dni
GROUP BY v.dni
HAVING COUNT(vis.id) > 3
ORDER BY total_visitas DESC;

-- Visitantes por empresa
SELECT empresa, COUNT(*) as cantidad
FROM visitantes
WHERE empresa IS NOT NULL
GROUP BY empresa
ORDER BY cantidad DESC;

-- Visitantes nuevos del mes
SELECT * FROM visitantes
WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now');
```

---

📄 **Ver SQL completo**: [VISITANTES.sql](./sql/VISITANTES.sql)

---

## 📋 Tabla: VISITAS

Registra todas las visitas realizadas en la organización, con su inicio, fin y relaciones con anfitriones y visitantes.

### Campos Detallados

| Campo | Tipo | Nulo | Descripción |
|-------|------|------|-------------|
| **id** | INTEGER | NO | ID único autoincrementable |
| **id_anfitrion** | INTEGER | NO | Usuario que recibe la visita (FK a usuarios) |
| **id_visitante** | INTEGER | SÍ* | ID del visitante externo (FK a visitantes) |
| **id_usuario** | INTEGER | SÍ* | ID del usuario visitante (FK a usuarios) |
| **inicio** | DATETIME | NO | Fecha y hora de inicio de la visita |
| **fin** | DATETIME | NO | Fecha y hora de fin de la visita |
| **motivo** | TEXT | NO | Motivo/propósito de la visita |
| **check_in** | DATETIME | SÍ | Hora real de ingreso (registrada por guardia) |
| **check_out** | DATETIME | SÍ | Hora real de salida (registrada por guardia) |
| **created_at** | DATETIME | NO | Timestamp de creación (auto) |
| **updated_at** | DATETIME | NO | Timestamp de última actualización (auto) |

**\* IMPORTANTE**: `id_visitante` o `id_usuario` - Al menos UNO debe tener valor (CHECK constraint)

### Tipos de Visitas

📍 **Visita Externa**: 
- `id_visitante` tiene valor
- `id_usuario` es NULL
- El visitante es una persona externa (tabla VISITANTES)

🏢 **Visita Interna**:
- `id_usuario` tiene valor
- `id_visitante` es NULL
- El visitante es un usuario del sistema (tabla USUARIOS)

### Relaciones

#### Visita → Anfitrión (Usuario)
- **Tipo**: N:1 (Muchos a Uno) - OBLIGATORIO
- **Descripción**: Cada visita tiene un anfitrión (usuario que recibe)
- **Clave Foránea**: `id_anfitrion` → `usuarios(id)`

#### Visita → Visitante Externo
- **Tipo**: N:1 (Muchos a Uno) - OPCIONAL
- **Descripción**: Si es visita externa, referencia a VISITANTES
- **Clave Foránea**: `id_visitante` → `visitantes(id)`

#### Visita → Usuario Visitante
- **Tipo**: N:1 (Muchos a Uno) - OPCIONAL
- **Descripción**: Si es visita interna, referencia a USUARIOS
- **Clave Foránea**: `id_usuario` → `usuarios(id)`

### Índices

- 🔍 `idx_visitas_anfitrion` → Búsquedas por anfitrión
- 🔍 `idx_visitas_visitante` → Historial de visitante externo
- 🔍 `idx_visitas_usuario` → Historial de usuario visitante
- 🔍 `idx_visitas_fechas` → Búsquedas por rango de fechas
- 🔍 `idx_visitas_inicio` → Ordenar por fecha de inicio

### Validaciones y Restricciones

✅ **CHECK Constraint**:
```sql
CHECK ((id_visitante IS NOT NULL AND id_usuario IS NULL) OR 
       (id_visitante IS NULL AND id_usuario IS NOT NULL))
```
Garantiza que exactamente UNO de los dos campos tenga valor.

✅ **Campos Obligatorios**:
- `id_anfitrion` - Siempre debe existir
- `inicio` - Fecha/hora de inicio requerida
- `fin` - Fecha/hora de fin requerida
- `motivo` - Propósito de la visita requerido

✅ **Check-in / Check-out** (Opcionales):
- `check_in` - Hora real en que el visitante ingresa (registrada por guardia)
- `check_out` - Hora real en que el visitante sale (registrada por guardia)
- **Estados de visita**:
  - `check_in=NULL, check_out=NULL` → **Pendiente** (visita no iniciada)
  - `check_in≠NULL, check_out=NULL` → **En curso** (visitante dentro del edificio)
  - `check_in≠NULL, check_out≠NULL` → **Finalizada** (visita completada)

### Casos de Uso

#### Visita Externa (Proveedor, Cliente, etc.)
```sql
INSERT INTO visitas (id_anfitrion, id_visitante, inicio, fin, motivo)
VALUES (5, 1, '2024-11-27 10:00', '2024-11-27 11:30', 'Reunión comercial');
```

#### Visita Interna (Usuario de otra área)
```sql
INSERT INTO visitas (id_anfitrion, id_usuario, inicio, fin, motivo)
VALUES (5, 10, '2024-11-27 14:00', '2024-11-27 15:00', 'Coordinación proyecto');
```

#### Registrar Check-in (Guardia registra ingreso)
```sql
UPDATE visitas 
SET check_in = CURRENT_TIMESTAMP
WHERE id = 1;
```

#### Registrar Check-out (Guardia registra salida)
```sql
UPDATE visitas 
SET check_out = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Ejemplo de Datos
```
id=1  anfitrion=5  visitante=1  usuario=NULL  inicio=2024-11-27 10:00  fin=11:30  motivo="Reunión comercial"
id=2  anfitrion=5  visitante=NULL  usuario=10   inicio=2024-11-27 14:00  fin=15:00  motivo="Coordinación proyecto"
id=3  anfitrion=8  visitante=2  usuario=NULL  inicio=2024-11-27 09:00  fin=10:00  motivo="Entrevista laboral"
```

### Consultas Comunes

```sql
-- Visitas de hoy
SELECT * FROM visitas
WHERE DATE(inicio) = DATE('now');

-- Visitas por anfitrión con datos del visitante
SELECT 
  v.id,
  v.inicio,
  v.fin,
  v.motivo,
  u_anf.nombre || ' ' || u_anf.apellido as anfitrion,
  COALESCE(vis.nombre || ' ' || vis.apellido, 
           u_vis.nombre || ' ' || u_vis.apellido) as visitante,
  CASE 
    WHEN v.id_visitante IS NOT NULL THEN 'Externa'
    ELSE 'Interna'
  END as tipo_visita
FROM visitas v
INNER JOIN usuarios u_anf ON v.id_anfitrion = u_anf.id
LEFT JOIN visitantes vis ON v.id_visitante = vis.id
LEFT JOIN usuarios u_vis ON v.id_usuario = u_vis.id
WHERE v.id_anfitrion = 5
ORDER BY v.inicio DESC;

-- Estadísticas de visitas por tipo
SELECT 
  CASE 
    WHEN id_visitante IS NOT NULL THEN 'Externa'
    ELSE 'Interna'
  END as tipo,
  COUNT(*) as total
FROM visitas
GROUP BY tipo;
```

---

📄 **Ver SQL completo**: [VISITAS.sql](./sql/VISITAS.sql)
