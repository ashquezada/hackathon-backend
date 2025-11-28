# Backend - API Gestión de Visitas

API REST para el sistema de gestión de visitas desarrollado con Node.js, Express y SQLite.

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuraciones (SQLite, database)
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   └── index.js         # Punto de entrada
├── data/
│   └── visitas.db       # Base de datos SQLite
├── .env                 # Variables de entorno
├── .env.example         # Ejemplo de variables
└── package.json         # Dependencias
```

## Instalación

```bash
npm install
```

## Uso

### Modo Desarrollo (con auto-reload)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

## Endpoints Disponibles

### Base
- `GET /` - Información de la API
- `GET /api/health` - Estado del servidor

### Visitas
- `POST /api/visitas` - Registrar nueva visita
- `GET /api/visitas` - Listar visitas (con filtros: ?estado=esperando&area=TI&fecha=2024-01-01)
- `GET /api/visitas/siguiente` - Obtener siguiente visita en espera
- `GET /api/visitas/estadisticas` - Estadísticas de visitas
- `GET /api/visitas/:id` - Obtener visita específica
- `PUT /api/visitas/:id` - Actualizar visita (cambiar estado, agregar observaciones)
- `DELETE /api/visitas/:id` - Cancelar visita

### Administración
- `GET /api/admin/estadisticas-visitas` - Estadísticas detalladas
- `POST /api/admin/reiniciar-visitas` - Reiniciar sistema (solo desarrollo)

## Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```bash
PORT=3000                           # Puerto del servidor
NODE_ENV=development                # Entorno (development/production)
SQLITE_DB_PATH=./data/visitas.db   # Ruta de la base de datos SQLite
```

## Base de Datos SQLite

### Ver tablas
```bash
sqlite3 data/visitas.db ".tables"
```

### Ver estructura de tabla
```bash
sqlite3 data/visitas.db ".schema visitas"
```

### Ver todos los registros
```bash
sqlite3 data/visitas.db "SELECT * FROM visitas"
```

### Contar registros
```bash
sqlite3 data/visitas.db "SELECT COUNT(*) FROM visitas"
```

### Consultas por estado
```bash
sqlite3 data/visitas.db "SELECT * FROM visitas WHERE estado='esperando'"
```

### Modo interactivo
```bash
sqlite3 data/visitas.db
# Luego puedes ejecutar queries SQL directamente
# .quit para salir
```

## Tecnologías

- Node.js v20+
- Express.js
- SQLite3
- CORS
- dotenv
- nodemon (desarrollo)
