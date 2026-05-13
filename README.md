# LALAND Football

**Plataforma web de fútbol en tiempo real** — live scores, estadísticas avanzadas, perfiles de equipos y jugadores, tabla de posiciones y panel administrativo completo.

Construido con vibe coding: idea, iteración rápida y entrega continua.

---

## Vista general

LALAND Football es una plataforma de nivel profesional inspirada en Sofascore y FotMob. Permite seguir partidos en vivo, consultar estadísticas detalladas, gestionar competiciones y administrar todos los datos desde un panel integrado.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite, React Router 6, Zustand, TailwindCSS, Framer Motion |
| Gráficos | Recharts + Chart.js |
| Backend | Node.js + Express |
| Base de datos | MySQL |
| ORM | Sequelize |
| Tiempo real | Socket.io |
| Autenticación | JWT + bcrypt |
| Validación | express-validator |

---

## Funcionalidades

**Plataforma pública**
- Live scores con marcador en tiempo real via WebSocket
- Perfiles completos de equipos, jugadores, técnicos y estadios
- Tabla de posiciones calculada automáticamente por competición
- Calendario de próximos partidos y resultados históricos
- Búsqueda global con navegación por teclado
- Estadísticas por jugador: goles, asistencias, tarjetas, minutos jugados

**Panel administrativo**
- Dashboard con métricas generales
- Gestión de equipos, jugadores, partidos, ligas, estadios y videos
- Registro de eventos en vivo: goles, tarjetas, sustituciones, lesiones
- Control de roles: user, admin, super_admin
- Subida de imágenes

---

## Requisitos

- Node.js >= 18
- MySQL (XAMPP recomendado para desarrollo local)
- npm >= 9

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/yoimer777/laland-football.git
cd laland-football
```

### 2. Crear la base de datos

Iniciar MySQL y ejecutar:

```sql
CREATE DATABASE laland_football CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Luego importar el schema:

```bash
mysql -u root laland_football < backend/laland_football_schema.sql
```

### 3. Configurar variables de entorno

```bash
cd backend
cp .env.example .env
```

Editar `.env` con los datos de tu entorno (funciona por defecto con XAMPP sin contraseña).

### 4. Instalar dependencias

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 5. Cargar datos de prueba

```bash
cd backend
npm run db:seed
```

### 6. Iniciar los servidores

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Servidor en http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App en http://localhost:5173
```

---

## Usuarios de prueba

| Email | Contrasena | Rol |
|---|---|---|
| user@test.com | password123 | user |
| admin@test.com | password123 | admin |
| super_admin@test.com | password123 | super_admin |

---

## Endpoints principales

```
GET    /api/teams                       Listar equipos
GET    /api/teams/:id                   Detalle equipo
POST   /api/teams                       Crear equipo (admin)
PUT    /api/teams/:id                   Editar equipo (admin)
DELETE /api/teams/:id                   Eliminar equipo (super_admin)

GET    /api/players?team_id=&position=  Listar/filtrar jugadores
GET    /api/players/:id/stats           Estadisticas del jugador

GET    /api/matches?status=&league_id=  Listar/filtrar partidos
POST   /api/matches/:id/events          Registrar evento en vivo (admin)

GET    /api/leagues/:id/standings       Tabla de posiciones

GET    /api/coaches                     Listar tecnicos
GET    /api/stadiums                    Listar estadios

POST   /api/auth/login                  Iniciar sesion
POST   /api/auth/register               Registrar usuario
```

---

## Estructura del proyecto

```
laland-football/
├── frontend/                  React + Vite (puerto 5173)
│   └── src/
│       ├── components/        Componentes reutilizables
│       │   ├── admin/         Panel administrativo
│       │   ├── landing/       Secciones de la pagina principal
│       │   ├── layout/        Navbar, Footer, MainLayout
│       │   └── common/        SearchBar, ImageWithFallback, VideoPlayer
│       ├── pages/             Vistas principales
│       ├── services/          Cliente Axios + Socket.io
│       ├── store/             Estado global con Zustand
│       └── utils/             Helpers de imagenes, permisos, sonido
├── backend/                   Node.js + Express (puerto 3001)
│   └── src/
│       ├── controllers/       Logica de cada endpoint
│       ├── models/            Modelos Sequelize
│       ├── routes/            Definicion de rutas
│       ├── middlewares/       Auth, errorHandler, rate limiting
│       ├── sockets/           Handlers Socket.io en tiempo real
│       └── seeders/           Datos de prueba
├── database/                  Schema SQL y migraciones
└── docs/                      Checklist de pruebas y convenciones
```

---

## Scripts

### Backend
| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor con hot-reload |
| `npm start` | Servidor de produccion |
| `npm run db:seed` | Cargar datos de prueba |
| `npm run db:fix` | Corregir rutas de imagenes en BD |

### Frontend
| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run lint` | Verificar errores ESLint |

---

## Variables de entorno

Ver [`backend/.env.example`](backend/.env.example) para la lista completa.

| Variable | Descripcion | Default |
|---|---|---|
| `PORT` | Puerto del servidor | `3001` |
| `DB_NAME` | Nombre de la base de datos | — |
| `DB_USER` | Usuario MySQL | `root` |
| `DB_PASSWORD` | Contrasena MySQL | *(vacio)* |
| `JWT_SECRET` | Clave secreta para tokens | — |
| `CORS_ORIGIN` | Origen permitido | `http://localhost:5173` |

---

## Estado del proyecto

| Fase | Descripcion | Estado |
|---|---|---|
| 0 | Setup, arquitectura y design system | Completa |
| 1 | Modelado de datos MySQL | Completa |
| 2 | Autenticacion JWT y roles | Completa |
| 3 | API REST — equipos, jugadores, ligas, partidos | Completa |
| 4 | Panel administrativo | Completa |
| 5 | Vistas publicas y perfiles | Completa |
| 6 | Tiempo real con Socket.io | En progreso |
| 7 | Estadisticas avanzadas y graficos | Pendiente |
| 8 | Predicciones con IA | Pendiente |
| 9 | Notificaciones push | Pendiente |
| 10 | Deploy a produccion | Pendiente |

---

## Licencia

MIT
