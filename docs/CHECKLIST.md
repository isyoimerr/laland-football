# LALAND FOOTBALL — Checklist de Pruebas por Fases

> **Cómo usar:** Marca cada ítem con ✅ (OK), ⚠️ (parcial/warning), o ❌ (falla).
> Para probar el backend necesitás MySQL activo (XAMPP → Start MySQL).

---

## Requisitos previos

| # | Verificación | Estado |
|---|---|---|
| 1 | XAMPP → MySQL corriendo (puerto 3306) | ⬜ |
| 2 | `cd backend && npm start` → `Server running on port 3001` | ⬜ |
| 3 | `cd frontend && npm run dev` → `Local: http://localhost:5173` | ⬜ |
| 4 | `GET http://localhost:3001/health` → `{"status":"ok"}` | ⬜ |
| 5 | `npm run db:seed` ejecutado sin errores | ⬜ |

---

## Fase 0 — Setup & Estructura

| # | Verificación | Estado |
|---|---|---|
| 0.1 | Carpetas `backend/`, `frontend/`, `database/`, `docs/` presentes | ⬜ |
| 0.2 | `backend/.env` existe con todas las variables | ⬜ |
| 0.3 | `backend/.env.example` existe (sin valores sensibles) | ⬜ |
| 0.4 | `.gitignore` excluye `node_modules/`, `.env`, `dist/` | ⬜ |
| 0.5 | `backend/node_modules/` instalado (`npm install`) | ⬜ |
| 0.6 | `frontend/node_modules/` instalado (`npm install`) | ⬜ |
| 0.7 | `npm run build` en frontend compila sin errores | ✅ |
| 0.8 | Base de datos `laland_football` creada en MySQL | ⬜ |
| 0.9 | Todas las tablas presentes: `teams`, `players`, `matches`, `leagues`, `stadiums`, `coaches`, `match_events`, `player_stats`, `users`, `match_videos` | ⬜ |

---

## Fase 1 — Landing & Navegación

> URL base: `http://localhost:5173`

| # | Página / Componente | Qué verificar | Estado |
|---|---|---|---|
| 1.1 | `/` — Home | Carga sin errores de consola | ⬜ |
| 1.2 | `/` — HeroSection | Texto, botones CTA visibles | ⬜ |
| 1.3 | `/` — LiveTicker | Se conecta a socket, muestra "Sin eventos en vivo" si no hay partido activo | ⬜ |
| 1.4 | `/` — MatchesPreview | Muestra partidos o placeholder | ⬜ |
| 1.5 | `/` — PlayersSection | Cards de jugadores visibles | ⬜ |
| 1.6 | `/` — VideoCarousel | Carrusel renderiza (vacío si no hay videos) | ⬜ |
| 1.7 | NavBar | Links a `/equipos`, `/competiciones` funcionan | ⬜ |
| 1.8 | NavBar — Búsqueda | SearchBar abre con clic o atajo | ⬜ |
| 1.9 | Footer | Links y datos visibles | ⬜ |
| 1.10 | `/equipos` | Lista de equipos carga | ⬜ |
| 1.11 | `/competiciones` | Lista de ligas carga | ⬜ |
| 1.12 | `*` — 404 | Ruta inexistente muestra página NotFound | ⬜ |

---

## Fase 2 — Autenticación & Roles

> Usuarios de prueba (requiere seed ejecutado):

| Email | Contraseña | Rol |
|---|---|---|
| `user@test.com` | `password123` | user |
| `admin@test.com` | `password123` | admin |
| `super_admin@test.com` | `password123` | super_admin |

| # | Endpoint / Pantalla | Qué verificar | Estado |
|---|---|---|---|
| 2.1 | `POST /api/auth/login` (user) | Devuelve token JWT | ⬜ |
| 2.2 | `POST /api/auth/login` (admin) | Devuelve token + rol admin | ⬜ |
| 2.3 | `POST /api/auth/login` (super_admin) | Devuelve token + rol super_admin | ⬜ |
| 2.4 | `POST /api/auth/login` (credenciales malas) | 401 con mensaje de error | ⬜ |
| 2.5 | `/login` — UI | Formulario funciona, redirige tras login exitoso | ⬜ |
| 2.6 | `/registro` — UI | Formulario registra nuevo usuario | ⬜ |
| 2.7 | Logout | Limpia token, redirige a `/` | ⬜ |
| 2.8 | `/admin` sin autenticar | Muestra pantalla "Acceso requerido" | ⬜ |
| 2.9 | Ruta protegida con token expirado | Redirige a login | ⬜ |

---

## Fase 3 — API REST (Teams, Players, Leagues, Matches)

> Herramienta recomendada: Postman, Insomnia, o `curl`.
> Header auth: `Authorization: Bearer <token>`

### Equipos (`/api/teams`)

| # | Request | Esperado | Estado |
|---|---|---|---|
| 3.1 | `GET /api/teams` | Array de equipos con datos | ⬜ |
| 3.2 | `GET /api/teams/1` | Detalle del equipo ID 1 | ⬜ |
| 3.3 | `GET /api/teams?search=bar` | Filtra por nombre | ⬜ |
| 3.4 | `POST /api/teams` (sin token) | 401 Unauthorized | ⬜ |
| 3.5 | `POST /api/teams` (token admin) | Crea equipo → 201 | ⬜ |
| 3.6 | `PUT /api/teams/1` (token admin) | Edita equipo → 200 | ⬜ |
| 3.7 | `DELETE /api/teams/1` (token admin) | 403 Forbidden (solo super_admin) | ⬜ |
| 3.8 | `DELETE /api/teams/1` (token super_admin) | Elimina equipo → 200 | ⬜ |

### Jugadores (`/api/players`)

| # | Request | Esperado | Estado |
|---|---|---|---|
| 3.9 | `GET /api/players` | Array de jugadores | ⬜ |
| 3.10 | `GET /api/players?team_id=1` | Jugadores del equipo 1 | ⬜ |
| 3.11 | `GET /api/players?position=forward` | Filtra por posición | ⬜ |
| 3.12 | `GET /api/players/1` | Detalle jugador ID 1 | ⬜ |
| 3.13 | `GET /api/players/1/stats` | Estadísticas agregadas del jugador | ⬜ |

### Ligas (`/api/leagues`)

| # | Request | Esperado | Estado |
|---|---|---|---|
| 3.14 | `GET /api/leagues` | Array de ligas | ⬜ |
| 3.15 | `GET /api/leagues/1` | Detalle liga ID 1 | ⬜ |
| 3.16 | `GET /api/leagues/1/standings` | Tabla de posiciones calculada | ⬜ |

### Partidos (`/api/matches`)

| # | Request | Esperado | Estado |
|---|---|---|---|
| 3.17 | `GET /api/matches` | Array de partidos | ⬜ |
| 3.18 | `GET /api/matches?status=finished` | Solo partidos terminados | ⬜ |
| 3.19 | `GET /api/matches?league_id=1` | Partidos de la liga 1 | ⬜ |
| 3.20 | `GET /api/matches/1` | Detalle con eventos y nombres de jugadores | ⬜ |
| 3.21 | `POST /api/matches/1/events` (token admin) | Agrega evento → 201 | ⬜ |

### Estadios & Coaches

| # | Request | Esperado | Estado |
|---|---|---|---|
| 3.22 | `GET /api/stadiums` | Array de estadios con image_path | ⬜ |
| 3.23 | `GET /api/stadiums/1` | Detalle estadio + partidos jugados allí | ⬜ |
| 3.24 | `GET /api/coaches` | Array de técnicos | ⬜ |
| 3.25 | `GET /api/coaches/1` | Detalle técnico | ⬜ |

---

## Fase 4 — Panel Admin (`/admin`)

> Requiere login como `admin@test.com` o `super_admin@test.com`

| # | Sección | Qué verificar | Estado |
|---|---|---|---|
| 4.1 | Dashboard | Estadísticas generales visibles (totales de equipos, jugadores, etc.) | ⬜ |
| 4.2 | Teams Manager | Lista de equipos carga desde API | ⬜ |
| 4.3 | Teams Manager — Crear | Formulario crea equipo nuevo | ⬜ |
| 4.4 | Teams Manager — Editar | Formulario edita equipo | ⬜ |
| 4.5 | Teams Manager — Eliminar | Solo visible/funcional con super_admin | ⬜ |
| 4.6 | Players Manager | Lista de jugadores, filtro por equipo | ⬜ |
| 4.7 | Players Manager — Crear/Editar | Formulario con todos los campos | ⬜ |
| 4.8 | Matches Manager | Lista de partidos, estados | ⬜ |
| 4.9 | Matches Manager — Crear | Selector de equipos, liga, estadio, fecha | ⬜ |
| 4.10 | Matches Manager — Agregar evento | Gol/tarjeta/sustitución con minuto | ⬜ |
| 4.11 | Leagues Manager | Lista de ligas, crear/editar | ⬜ |
| 4.12 | Stadiums Manager | Lista de estadios con image_path | ⬜ |
| 4.13 | Videos Manager | Lista de videos, crear con URL | ⬜ |
| 4.14 | Subida de imágenes | `POST /api/uploads` con multipart/form-data | ⬜ |

---

## Fase 5 — Páginas de Detalle

| # | URL | Qué verificar | Estado |
|---|---|---|---|
| 5.1 | `/partidos/1` | Cabecera con equipos, marcador, eventos | ⬜ |
| 5.2 | `/partidos/1` | Nombres de jugadores en eventos (no solo IDs) | ⬜ |
| 5.3 | `/equipos/1` | Nombre, logo o iniciales, país | ⬜ |
| 5.4 | `/equipos/1` — Tab Plantilla | Lista de jugadores del equipo | ⬜ |
| 5.5 | `/equipos/1` — Tab Partidos | Historial de partidos del equipo | ⬜ |
| 5.6 | `/jugadores/1` | Nombre, posición, estadísticas reales | ⬜ |
| 5.7 | `/tecnicos/1` | Nombre, equipo, rol, foto o placeholder | ⬜ |
| 5.8 | `/estadios/1` | Nombre, capacidad, imagen o placeholder | ⬜ |
| 5.9 | `/estadios/1` | Partidos jugados en el estadio | ⬜ |
| 5.10 | `/competiciones/1` | Nombre de liga, logo o placeholder | ⬜ |
| 5.11 | `/competiciones/1` — Tab Clasificación | Tabla de posiciones correcta (solo partidos `finished`) | ⬜ |
| 5.12 | `/competiciones/1` — Tab Próximos | Partidos `scheduled` de la liga | ⬜ |
| 5.13 | `/competiciones/1` — Tab Resultados | Partidos `finished` de la liga | ⬜ |

---

## Fase 5+ — Features Avanzadas

| # | Feature | Qué verificar | Estado |
|---|---|---|---|
| 6.1 | Búsqueda global | SearchBar abre con `/` o clic en lupa | ⬜ |
| 6.2 | Búsqueda — Resultados | Muestra equipos, jugadores, técnicos, estadios agrupados | ⬜ |
| 6.3 | Búsqueda — Navegación teclado | ↑↓ mueve selección, Enter navega | ⬜ |
| 6.4 | Búsqueda — Link a perfil | Clic en resultado navega a página correcta | ⬜ |
| 6.5 | Socket.io — Conexión | `services/socket.js` conecta a `ws://localhost:3001` | ⬜ |
| 6.6 | LiveTicker — Partido en vivo | Con partido `live` en DB muestra eventos en tiempo real | ⬜ |
| 6.7 | Imágenes — Equipos reales | Barcelona, Real Madrid, Man Utd muestran logo | ⬜ |
| 6.8 | Imágenes — Fallback | Equipos sin logo muestran iniciales con color | ⬜ |
| 6.9 | Videos — VideoCarousel | Si hay videos en DB se muestran en Home | ⬜ |
| 6.10 | Estadísticas jugador | `/jugadores/:id/stats` devuelve goles, asistencias, tarjetas | ⬜ |

---

## Errores conocidos corregidos (verificar que NO reaparezcan)

| # | Bug original | Fix aplicado | Estado |
|---|---|---|---|
| B1 | `MatchEvent.type` chocaba con Sequelize internals | Renombrado a `eventType` con `field: 'event_type'` | ⬜ |
| B2 | Seeder usaba `type:` en lugar de `event_type:` | Corregido en `initial-data.js` | ⬜ |
| B3 | `stadiumsController.js` leía `photo_path` en vez de `image_path` | Corregido | ⬜ |
| B4 | `StadiumsManager.jsx` columna `photo_path` → `image_path` | Corregido | ⬜ |
| B5 | `StadiumDetail.jsx` accedía `matchesRes.data.matches` (faltaba `.data`) | Corregido | ⬜ |
| B6 | `SearchBar.jsx` accedía `teams.data.teams` (faltaba `.data`) | Corregido a `.data.data.teams` | ⬜ |
| B7 | `Competition.jsx` contaba puntos de partidos no terminados | Solo considera `status: 'finished'` | ⬜ |
| B8 | `GET /api/matches/:id` no incluía jugador en eventos | Agregado `include: [{ model: Player }]` | ⬜ |
| B9 | `playersController.js` SQL usaba `type =` en vez de `event_type =` | Corregido | ⬜ |

---

## Git & Versiones

| # | Verificación | Estado |
|---|---|---|
| G1 | `git log --oneline` muestra commit inicial | ⬜ |
| G2 | `git tag` muestra `v0.5.0` | ⬜ |
| G3 | `.env` NO está en el commit (verificar con `git show HEAD`) | ⬜ |
| G4 | `node_modules/` NO está en el commit | ⬜ |
| G5 | Repo subido a GitHub | ⬜ |

---

## Notas

- **MySQL local**: usa XAMPP, iniciar módulo MySQL antes de `npm start`
- **Seed**: `cd backend && npm run db:seed` (solo con MySQL activo)
- **Assets**: las imágenes de equipos están en `LALAND_FOOTBALL_ASSETS/EQUIPOS/`
- **Logos reales**: Barcelona (`barca/`), Real Madrid (`real_madrid/`), Manchester United (`manchester_united/`)
- **Puerto backend**: 3001 | **Puerto frontend**: 5173
