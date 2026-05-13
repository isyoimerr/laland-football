# Changelog — LALAND FOOTBALL

Todos los cambios significativos del proyecto están documentados aquí.

---

## [v0.5.0] — 2026-05-13 (versión actual)

### Estado: Fases 0-5 completas + fixes críticos

### Añadido
- Modelo `Coach` con CRUD completo (`/api/coaches`)
- Modelo `PlayerStat` para estadísticas agregadas por partido
- `GET /api/players/:id/stats` — estadísticas reales (goles, asistencias, tarjetas, minutos)
- Búsqueda global mejorada: coaches y estadios incluidos, navegación teclado ↑↓↵
- `CoachProfile.jsx` — página completa con datos reales de la API
- `LiveTicker.jsx` — conexión Socket.io para eventos en vivo
- `services/socket.js` — cliente Socket.io
- `imageUtils.js` — fallback a iniciales con color para equipos sin logo
- Índices de BD en foreign keys principales (performance)
- `CHECKLIST.md` — guía completa de pruebas por fases
- `.env.example` — plantilla de variables de entorno

### Corregido (bugs críticos)
| Bug | Fix |
|-----|-----|
| `MatchEvent.type` chocaba con Sequelize internals | Renombrado a `eventType` con `field: 'event_type'` |
| Seeder usaba `type:` en vez de `event_type:` | Corregido en `initial-data.js` |
| `stadiumsController.js` leía `photo_path` → no existía | Cambiado a `image_path` |
| `StadiumsManager.jsx` columna `photo_path` | Corregido a `image_path`, permisos arreglados |
| `StadiumDetail.jsx` accedía `.data.matches` (faltaba `.data`) | Corregido a `.data.data.matches` |
| `SearchBar.jsx` accedía `teams.data.teams` (doble `.data`) | Corregido a `.data.data.teams` |
| `Competition.jsx` sumaba puntos de partidos no terminados | Solo considera `status: 'finished'` |
| `GET /api/matches/:id` sin nombres de jugadores en eventos | Agregado `include: [{ model: Player }]` |
| SQL en `playersController.js` usaba `type =` | Corregido a `event_type =` |
| CORS con `process.env.NODE_ENV` directo | Usa config centralizada `nodeEnv` |

### Mejorado
- `teamsController` — filtro `?search=` por nombre y país
- `playersController` — filtro `?search=` por nombre, nacionalidad, posición
- `leaguesController` — filtro `?search=` por nombre y país
- `server.js` — Socket.io con suscripción a partidos, eventos en vivo
- `PlayerProfile.jsx` — estadísticas reales desde `/players/:id/stats`
- `MatchesManager.jsx` — selector de estadio en formulario

---

## [v0.4.x] — Estado pre-fixes (no tenía control de versiones)

> **Nota:** El proyecto no tenía git hasta v0.5.0. Este bloque documenta
> el estado del código ANTES de los fixes de la sesión del 2026-05-13.

### Lo que existía y funcionaba
- Estructura completa de fases 0-5
- API REST para teams, players, leagues, matches, stadiums, coaches
- Panel Admin con 7 secciones (dashboard, teams, players, matches, leagues, stadiums, videos)
- Autenticación JWT con roles
- Frontend React con todas las páginas
- Socket.io básico
- Seed con datos de La Liga, Premier League, Bundesliga

### Lo que fallaba (antes de los fixes)
- MatchEvent causaba error Sequelize en cualquier consulta que lo incluía
- Estadios no se mostraban (photo_path vs image_path)
- StadiumDetail crasheaba al cargar partidos
- SearchBar no mostraba resultados (estructura de respuesta incorrecta)
- Competition contaba puntos incorrectos (incluía partidos en 0-0 programados)
- MatchDetail no mostraba nombres de jugadores en eventos
- Estadísticas de jugadores retornaban error SQL

---

## Próximas versiones planeadas

| Versión | Fase | Descripción |
|---------|------|-------------|
| v0.6.0 | Fase 6 | IA predictiva — predicción de resultados, lineup builder |
| v0.7.0 | Fase 7 | Notificaciones push, alertas de goles en tiempo real |
| v0.8.0 | Fase 8 | App móvil / PWA |
| v1.0.0 | Release | Producción con deploy completo |
