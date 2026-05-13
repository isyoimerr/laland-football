# LALAND Football - Actualización de Base de Datos

## 📋 Estado Actual

Tu base de datos ya tiene las tablas básicas:
- `users` (con super admin)
- `teams`
- `players`
- `assets`

## 🔄 Actualización Necesaria

Para agregar funcionalidades completas de fútbol (partidos, goles, estadísticas), necesitas actualizar la BD.

## 🚀 Cómo Actualizar

### Opción 1: Script Automático (Recomendado)

```bash
cd "/home/ing-ospino/LALAND FOOTBALL/backend"
./update_database.sh
```

### Opción 2: Manual con phpMyAdmin

1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Selecciona BD: `laland_football`
3. Importa: `laland_football_update.sql`

### Opción 3: Manual con MySQL CLI

```bash
cd "/home/ing-ospino/LALAND FOOTBALL/backend"
mysql -u root -p laland_football < laland_football_update.sql
mysql -u root -p laland_football < check_database.sql
```

## 📊 Qué se Agrega

### Nuevas Tablas:
- `leagues` - Ligas (La Liga, Premier League, etc.)
- `stadiums` - Estadios
- `matches` - Partidos
- `match_events` - Eventos (goles, tarjetas, etc.)
- `player_statistics` - Estadísticas por jugador/partido

### Nuevas Columnas:
- `teams.league_id` - Liga del equipo
- `assets.match_id` - Vincular assets a partidos

### Datos de Ejemplo:
- Ligas principales
- Estadios famosos
- Un partido Barcelona vs Real Madrid
- Goles y estadísticas del partido

## ✅ Verificación

Después de actualizar, ejecuta:

```bash
mysql -u root -p laland_football < check_database.sql
```

Deberías ver:
- 9 tablas en total
- Datos de ejemplo cargados
- Usuario super admin activo

## 🎯 Funcionalidades Habilitadas

Con esta actualización puedes:
- ✅ Gestionar ligas y estadios
- ✅ Crear y editar partidos
- ✅ Registrar goles y eventos
- ✅ Ver estadísticas por jugador
- ✅ Vincular videos/fotos a partidos
- ✅ Editar resultados en tiempo real

## 🔄 Próximas Fases

Después de esta actualización, podemos agregar:
1. **API Routes** - Endpoints para CRUD de partidos/goles
2. **Auth System** - Login/registro con JWT
3. **Admin Panel** - Interfaz para gestionar todo
4. **Frontend** - App visual para usuarios finales

¿Listo para ejecutar la actualización?