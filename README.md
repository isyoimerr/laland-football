<p align="center">
  <img src="https://raw.githubusercontent.com/isyoimerr/laland-football/main/frontend/public/logo.svg" alt="Logo de LALAND Football" width="120" />
</p>

<h1 align="center">LALAND Football</h1>

<p align="center">
  Plataforma full-stack para seguimiento de fútbol: partidos, estadísticas, perfiles y administración de contenido.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?logo=javascript&logoColor=000" alt="Badge JavaScript" />
  <img src="https://img.shields.io/badge/Estado-En%20desarrollo-2563EB" alt="Badge estado del proyecto" />
  <img src="https://img.shields.io/badge/Licencia-Sin%20archivo%20LICENSE-lightgrey" alt="Badge licencia" />
</p>

## Demo y enlaces

- **Demo pública:** pendiente de publicación.
- **Repositorio:** https://github.com/isyoimerr/laland-football
- **Clonación:**

```bash
git clone https://github.com/isyoimerr/laland-football.git
cd laland-football
```

## Vista previa visual

<p align="center">
  <img src="https://raw.githubusercontent.com/isyoimerr/laland-football/main/frontend/public/mockups/mockup-app.svg" alt="Mockup de la aplicación LALAND Football" width="85%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/isyoimerr/laland-football/main/frontend/public/banners/banner-trophy.svg" alt="Banner de trofeo" width="48%" />
  <img src="https://raw.githubusercontent.com/isyoimerr/laland-football/main/frontend/public/images/hero-bg.svg" alt="Fondo visual principal de LALAND Football" width="48%" />
</p>

## Qué es LALAND Football

LALAND Football es una plataforma web orientada a la gestión y visualización de información futbolística. Combina una experiencia pública para usuarios finales con un panel administrativo para operar datos de equipos, jugadores, ligas, partidos y recursos multimedia.

## Funcionalidades de la plataforma pública

- Vista de partidos y marcadores.
- Perfiles de equipos, jugadores, técnicos y estadios.
- Tabla de posiciones por competición.
- Navegación por competiciones y detalles de encuentros.
- Estadísticas por jugador y contenido visual asociado.

## Funcionalidades del panel administrativo

- Gestión CRUD de equipos, jugadores, ligas, partidos, técnicos y estadios.
- Registro de eventos de partido.
- Gestión de videos de partidos y relación video-jugador.
- Carga de archivos por categorías mediante endpoint protegido.
- Soporte de roles (`user`, `admin`, `super_admin`) con validación de acceso.

## Stack tecnológico

### Frontend
- React 18 + Vite
- React Router DOM
- Zustand
- Tailwind CSS
- Framer Motion
- Recharts y Chart.js
- Socket.io Client

### Backend
- Node.js + Express
- MySQL + Sequelize
- Socket.io
- JWT + bcrypt
- express-validator
- Helmet, CORS, rate limiting y Morgan

## Arquitectura y flujo general

1. El cliente React consume la API REST de Express.
2. Express orquesta autenticación, validaciones y reglas de autorización por rol.
3. Sequelize conecta el backend con MySQL para persistencia.
4. Socket.io habilita eventos en tiempo real para actualizaciones de partidos.
5. El panel administrativo opera sobre los mismos recursos expuestos por la API.

## Estructura del repositorio

```text
laland-football/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── store/
│       ├── styles/
│       └── utils/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seeders/
│   │   ├── services/
│   │   └── validators/
│   └── .env.example
├── database/
├── docs/
└── README.md
```

## Requisitos e instalación

### Requisitos
- Node.js >= 18
- npm >= 9
- MySQL activo (XAMPP u otro entorno local)

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/isyoimerr/laland-football.git
   cd laland-football
   ```
2. Crea la base de datos:
   ```sql
   CREATE DATABASE laland_football CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Importa el esquema:
   ```bash
   mysql -u root laland_football < backend/laland_football_schema.sql
   ```
4. Configura variables del backend:
   ```bash
   cd backend
   cp .env.example .env
   ```
5. Instala dependencias:
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   ```
6. Carga datos semilla (desarrollo):
   ```bash
   cd backend
   npm run db:seed
   ```
7. Ejecuta en desarrollo:
   ```bash
   # Terminal 1
   cd backend
   npm run dev

   # Terminal 2
   cd frontend
   npm run dev
   ```

## Variables de entorno y seguridad

Consulta `backend/.env.example` para la referencia completa.

Variables principales:

- `PORT`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
- `CORS_ORIGIN`
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_MAX`

Buenas prácticas:

- No subas archivos `.env` al repositorio.
- Cambia los secretos JWT en cualquier entorno distinto a local.
- Mantén tokens y credenciales fuera de commits e incidencias públicas.

## Usuarios de prueba (desarrollo)

Credenciales documentadas para entorno local con seeders:

| Email | Contraseña | Rol |
|---|---|---|
| `user@test.com` | `password123` | `user` |
| `admin@test.com` | `password123` | `admin` |
| `super_admin@test.com` | `password123` | `super_admin` |

## Endpoints principales

### Autenticación
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Recursos deportivos
- `GET /api/teams` · `GET /api/teams/:id`
- `GET /api/players` · `GET /api/players/:id` · `GET /api/players/:id/stats`
- `GET /api/leagues` · `GET /api/leagues/:id` · `GET /api/leagues/:id/standings`
- `GET /api/matches` · `GET /api/matches/:id`
- `GET /api/coaches` · `GET /api/coaches/:id`
- `GET /api/stadiums` · `GET /api/stadiums/:id`

### Operaciones protegidas (admin / super_admin)
- CRUD sobre equipos, jugadores, ligas, partidos, técnicos y estadios.
- `PATCH /api/matches/:id/events`
- `POST /api/uploads/:category`
- Gestión de videos: `/api/match-videos`

## Scripts

### Backend (`/backend`)

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia backend con nodemon |
| `npm start` | Inicia backend en modo producción |
| `npm run db:seed` | Carga datos de prueba |
| `npm run db:fix` | Ajusta datos existentes |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Corrige problemas de ESLint |
| `npm run format` | Formatea código con Prettier |

### Frontend (`/frontend`)

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia Vite en desarrollo (puerto 5173) |
| `npm run build` | Genera build de producción |
| `npm run preview` | Previsualiza build generado |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Corrige problemas de ESLint |
| `npm run format` | Formatea código con Prettier |

## Estado y roadmap

Estado actual: **en desarrollo activo**.

- ✅ Base funcional full-stack (frontend + backend + MySQL).
- ✅ Autenticación y control de roles.
- ✅ Módulos principales de gestión deportiva.
- 🟡 Tiempo real con Socket.io: implementado parcialmente y en evolución.
- 🟡 Estadísticas avanzadas y visualizaciones: en expansión.
- 🔜 Publicación de demo pública y despliegue productivo.
- 🔜 Notificaciones y mejoras de experiencia en vivo.

## Licencia

Actualmente este repositorio **no incluye archivo `LICENSE`** en la raíz. Si deseas liberar el proyecto formalmente, se recomienda agregar una licencia (por ejemplo, MIT).
