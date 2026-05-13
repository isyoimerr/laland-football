-- Verificar estado de la base de datos LALAND Football
-- Ejecutar para ver qué tablas existen y cuáles faltan

USE `laland_football`;

-- Verificar tablas existentes
SELECT 'TABLAS EXISTENTES:' as info;
SHOW TABLES;

-- Verificar estructura de tablas clave
SELECT 'ESTRUCTURA DE USERS:' as info;
DESCRIBE users;

SELECT 'ESTRUCTURA DE TEAMS:' as info;
DESCRIBE teams;

SELECT 'ESTRUCTURA DE PLAYERS:' as info;
DESCRIBE players;

SELECT 'ESTRUCTURA DE ASSETS:' as info;
DESCRIBE assets;

-- Verificar si existen las nuevas tablas
SELECT 'NUEVAS TABLAS (si aparecen, ya están actualizadas):' as info;
SELECT TABLE_NAME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'laland_football'
AND TABLE_NAME IN ('leagues', 'stadiums', 'matches', 'match_events', 'player_statistics');

-- Contar registros en cada tabla
SELECT 'REGISTROS POR TABLA:' as info;
SELECT 'users' as tabla, COUNT(*) as registros FROM users
UNION ALL
SELECT 'teams', COUNT(*) FROM teams
UNION ALL
SELECT 'players', COUNT(*) FROM players
UNION ALL
SELECT 'assets', COUNT(*) FROM assets
UNION ALL
SELECT 'leagues', COUNT(*) FROM leagues
UNION ALL
SELECT 'stadiums', COUNT(*) FROM stadiums
UNION ALL
SELECT 'matches', COUNT(*) FROM matches
UNION ALL
SELECT 'match_events', COUNT(*) FROM match_events
UNION ALL
SELECT 'player_statistics', COUNT(*) FROM player_statistics;

-- Verificar usuario admin
SELECT 'USUARIO SUPER ADMIN:' as info;
SELECT id, name, email, role, is_active FROM users WHERE role = 'super_admin';

-- Verificar datos de ejemplo
SELECT 'DATOS DE EJEMPLO:' as info;
SELECT 'Equipos con liga asignada:' as info, COUNT(*) as cantidad FROM teams WHERE league_id IS NOT NULL;
SELECT 'Partidos registrados:' as info, COUNT(*) as cantidad FROM matches;
SELECT 'Goles registrados:' as info, SUM(goals) as total FROM player_statistics;