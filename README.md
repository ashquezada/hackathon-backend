# Backend - API Turnero

API REST para el sistema de gestión de turnos desarrollado con Node.js y Express.

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/       # Configuraciones
│   ├── controllers/  # Lógica de negocio
│   ├── models/       # Modelos de datos
│   ├── routes/       # Definición de rutas
│   └── index.js      # Punto de entrada
├── .env              # Variables de entorno
├── .env.example      # Ejemplo de variables
└── package.json      # Dependencias
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

### Turnos (próximamente)
- `GET /api/turnos` - Listar todos los turnos
- `POST /api/turnos` - Crear nuevo turno
- `GET /api/turnos/:id` - Obtener turno específico
- `PUT /api/turnos/:id` - Actualizar turno
- `DELETE /api/turnos/:id` - Eliminar turno

## Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

- `PORT` - Puerto del servidor (default: 3000)
- `NODE_ENV` - Entorno de ejecución (development/production)

## Tecnologías

- Node.js
- Express.js
- CORS
- dotenv
