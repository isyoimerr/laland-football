# LALAND Football

Plataforma web de fútbol en tiempo real — estadísticas avanzadas, perfiles completos, live scores y panel administrativo.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite, React Router 6, Zustand, TailwindCSS, Framer Motion |
| Gráficos | Recharts + Chart.js |
| Backend | Node.js + Express |
| Base de datos | MySQL (XAMPP) |
| ORM | Sequelize |
| Tiempo real | Socket.io |
| Auth | JWT + bcrypt |

---

## Requisitos previos

- [Node.js](https://nodejs.org/) ≥ 18
- [XAMPP](https://www.apachefriends.org/) con MySQL activo
- npm ≥ 9

---

## Instalación en < 10 minutos

### 1 — Clonar el repositorio

```bash
git clone <url-del-repo> laland-football
cd laland-football
```

### 2 — Crear la base de datos en XAMPP

1. Abrir XAMPP y arrancar el servicio **MySQL**.
2. Ir a `http://localhost/phpmyadmin`.
3. Crear una base de datos llamada `laland_football` (cotejamiento `utf8mb4_unicode_ci`).

### 3 — Configurar variables de entorno del backend

```bash
cd backend
cp .env.example .env
```

Editar `.env` y completar los valores según tu entorno (por defecto funciona con XAMPP sin contraseña).

### 4 — Instalar dependencias

Desde la raíz del proyecto:

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 5 — Levantar los servidores

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → API corriendo en http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → App corriendo en http://localhost:5173
```

### 6 — Verificar

- Abrir `http://localhost:5173` → debe ver la interfaz de LALAND Football.
- Abrir `http://localhost:3001/health` → debe responder `{ "status": "ok" }`.

---

## Estructura del proyecto

```
laland-football/
├── frontend/              # React + Vite (puerto 5173)
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── layout/    # Navbar, Footer, MainLayout
│   │   │   └── ui/        # Button, Card, Badge, Skeleton...
│   │   ├── pages/         # Vistas/rutas
│   │   ├── features/      # Lógica por módulo
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Cliente axios + socket
│   │   ├── store/         # Estado global (Zustand)
│   │   ├── styles/        # Tokens CSS + design system
│   │   └── utils/         # Helpers
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/               # Node + Express (puerto 3001)
│   ├── src/
│   │   ├── controllers/   # Lógica de cada endpoint
│   │   ├── routes/        # Definición de rutas
│   │   ├── services/      # Lógica de negocio
│   │   ├── models/        # Modelos Sequelize
│   │   ├── middlewares/   # auth, errorHandler, rateLimit
│   │   ├── sockets/       # Handlers Socket.io
│   │   ├── validators/    # Validaciones express-validator
│   │   ├── utils/         # Helpers
│   │   └── config/        # DB, env, variables
│   ├── .env.example
│   └── package.json
├── database/
│   ├── migrations/        # Migraciones Sequelize (Fase 1)
│   ├── seeders/           # Datos de prueba (Fase 1)
│   └── schema.md          # Documentación del esquema
├── docs/
│   ├── conventions.md     # Convenciones del proyecto
│   └── api/               # Documentación de endpoints (Fase 3)
└── README.md
```

---

## Scripts disponibles

### Frontend
| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (puerto 5173) |
| `npm run build` | Build de producción |
| `npm run lint` | Verificar errores de ESLint |
| `npm run lint:fix` | Corregir errores automáticamente |
| `npm run format` | Formatear código con Prettier |

### Backend
| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor con hot-reload (nodemon) |
| `npm start` | Servidor de producción |
| `npm run lint` | Verificar errores de ESLint |
| `npm run lint:fix` | Corregir errores automáticamente |

---

## Variables de entorno (backend)

Ver [`backend/.env.example`](backend/.env.example) para la lista completa documentada.

| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto del servidor | `3001` |
| `DB_NAME` | Nombre de la base de datos MySQL | — |
| `DB_USER` | Usuario MySQL | `root` |
| `DB_PASSWORD` | Contraseña MySQL | *(vacío en XAMPP)* |
| `JWT_SECRET` | Clave secreta para JWT | — |
| `JWT_EXPIRES_IN` | Expiración del access token | `15m` |
| `JWT_REFRESH_SECRET` | Clave para refresh tokens | — |
| `CORS_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |

---

## Fases del proyecto

| Fase | Descripción | Estado |
|---|---|---|
| 0 | Setup, arquitectura y design system | ✅ Completa |
| 1 | Modelado de datos MySQL | ⏳ Pendiente |
| 2 | Backend base + autenticación | ⏳ Pendiente |
| 3 | Backend CRUD de entidades deportivas | ⏳ Pendiente |
| 4 | Frontend foundation + design system | ⏳ Pendiente |
| 5 | Vistas públicas | ⏳ Pendiente |
| 6 | Tiempo real (WebSockets) | ⏳ Pendiente |
| 7 | Panel administrativo | ⏳ Pendiente |
| 8 | Estadísticas avanzadas y visualizaciones | ⏳ Pendiente |
| 9 | IA, predicciones y rankings | ⏳ Pendiente |
| 10 | Datos reales (StatsBomb) + notificaciones | ⏳ Pendiente |
| 11 | QA, optimización y cierre | ⏳ Pendiente |

---

## Arquitectura de decisiones

- **Sequelize sobre Knex:** migraciones CLI integradas, soporte oficial MySQL, ecosistema maduro.
- **Zustand sobre Redux Toolkit:** sin boilerplate, API simple, suficiente para este tamaño de proyecto.
- **Recharts + Chart.js:** Recharts para visualizaciones SVG React-nativas; Chart.js para casos específicos de canvas.
- **express-validator:** validación declarativa integrada con Express sin dependencias extra.

---

## Convenciones

Ver [`docs/conventions.md`](docs/conventions.md) para naming, commits, ramas y estructura de código.
