# Convenciones del Proyecto — LALAND Football

## Idioma

- **UI y textos de usuario:** español
- **Código (variables, funciones, archivos, comentarios técnicos, commits):** inglés

---

## Naming

### Archivos y carpetas

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componentes React | PascalCase | `MatchCard.jsx`, `PlayerAvatar.jsx` |
| Páginas React | PascalCase | `MatchDetail.jsx`, `TeamProfile.jsx` |
| Hooks | camelCase con prefijo `use` | `useMatchData.js`, `useSocket.js` |
| Servicios / utils | camelCase | `api.js`, `formatDate.js` |
| Stores Zustand | camelCase con sufijo `Store` | `authStore.js`, `matchStore.js` |
| Rutas Express | camelCase plural | `matches.js`, `players.js` |
| Controladores | camelCase | `matchController.js` |
| Modelos Sequelize | PascalCase singular | `Match.js`, `Player.js` |
| Migraciones | timestamp + descripción | `20240601000001-create-users.js` |

### Variables y funciones

- **Frontend:** camelCase → `matchScore`, `fetchTeamById`, `isLoading`
- **Backend:** camelCase → `getUserById`, `createMatch`, `validateToken`
- **Constantes globales:** UPPER_SNAKE_CASE → `MAX_PAGE_SIZE`, `DEFAULT_TIMEOUT`
- **Componentes React:** siempre named exports (no default en index)
- **Clases CSS Tailwind:** siempre en JSX, nunca en archivos `.css` separados salvo la capa `@layer components`

---

## Commits (Conventional Commits)

Formato: `<tipo>(<scope opcional>): <descripción corta en inglés>`

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `chore` | Dependencias, configuración, tooling |
| `refactor` | Refactoring sin cambio funcional |
| `docs` | Solo documentación |
| `style` | Formato, linter (sin lógica) |
| `test` | Añadir o modificar tests |
| `perf` | Mejora de performance |

**Ejemplos válidos:**
```
feat(auth): add JWT refresh token endpoint
fix(matches): correct live score calculation for extra time
chore(deps): upgrade socket.io to v4.7.5
docs(api): document match endpoints in swagger
refactor(players): extract statistics calculation to service layer
```

**Reglas:**
- Descripción en imperativo presente: "add", "fix", "update" (no "added", "fixed")
- Máximo 72 caracteres en la primera línea
- Sin punto final en la primera línea
- Cuerpo del commit si se necesita contexto adicional (separado por línea en blanco)

---

## Estructura de ramas

| Rama | Propósito |
|---|---|
| `main` | Producción — siempre estable |
| `develop` | Integración — base para features |
| `feat/<nombre>` | Nueva funcionalidad |
| `fix/<nombre>` | Corrección de bug |
| `chore/<nombre>` | Config, deps, tooling |

**Flujo:**
1. Crear rama desde `develop`: `git checkout -b feat/match-detail`
2. Commits atómicos en la rama
3. PR a `develop` con descripción clara
4. Merge a `main` solo cuando la fase esté completa y probada

---

## Estructura de componentes React

```jsx
// 1. Imports externos
import { useState } from 'react'
import { motion } from 'framer-motion'

// 2. Imports internos (alias @)
import { formatDate } from '@utils/formatDate'
import useAuthStore from '@store/authStore'

// 3. Constantes del módulo
const ANIMATION = { initial: { opacity: 0 }, animate: { opacity: 1 } }

// 4. Componente (named export)
export default function ComponentName({ propA, propB }) {
  // 4a. Hooks
  // 4b. Estado derivado / memos
  // 4c. Handlers
  // 4d. Render
  return (...)
}
```

**Reglas:**
- Máximo 300 líneas por archivo
- Máximo 50 líneas por función/handler
- Si un componente necesita más de 3 props de estado, considerar extraer un hook custom
- PropTypes obligatorio en componentes con props (hasta que se apruebe TypeScript)

---

## Estructura de endpoints Express

```js
// routes/matches.js
router.get('/', authenticate, matchController.getAll)
router.get('/:id', matchController.getById)
router.post('/', authenticate, requireRole('admin'), validate(matchSchema), matchController.create)
```

```js
// controllers/matchController.js
async function getAll(req, res, next) {
  try {
    const result = await matchService.findAll(req.query)
    res.json({ status: 'ok', data: result })
  } catch (err) {
    next(err)
  }
}
```

**Formato de respuesta estándar:**
```json
// Éxito
{ "status": "ok", "data": {...}, "meta": { "page": 1, "total": 100 } }

// Error
{ "status": "error", "message": "Descripción del error", "errors": [...] }
```

---

## Paginación estándar

Todos los listados grandes usan:
```
GET /api/teams?page=1&limit=20&sort=-created_at&search=barcelona
```

Respuesta:
```json
{
  "status": "ok",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Reglas de calidad

1. **Sin `console.log`** en código que va a producción — solo `console.warn` / `console.error` / `console.info` en backend con contexto.
2. **Sin `TODO` / `FIXME`** en código final — si hay deuda técnica, documentarla en la entrega de fase.
3. **Sin mock data** en código de producción — los seeders van en `database/seeders/`.
4. **Sin warnings en consola** al hacer `npm run dev` o `npm run build`.
5. **Validación en ambas capas** — frontend valida UX, backend valida seguridad.
6. **Índices en MySQL** — toda columna usada en WHERE, JOIN u ORDER BY necesita índice.
7. **Paginación obligatoria** en cualquier listado que pueda superar 50 registros.
