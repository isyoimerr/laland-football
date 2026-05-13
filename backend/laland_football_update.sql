-- LALAND Football - Script de actualización de base de datos
-- Ejecutar después de importar el schema inicial
-- Este script agrega las nuevas tablas y datos sin borrar lo existente

USE `laland_football`;

-- PRIMERO: Crear todas las nuevas tablas
-- Tabla de ligas (si no existe)
CREATE TABLE IF NOT EXISTS `leagues` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `country` VARCHAR(80) DEFAULT NULL,
  `logo_path` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `leagues_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de estadios (si no existe)
CREATE TABLE IF NOT EXISTS `stadiums` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(140) NOT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `country` VARCHAR(80) DEFAULT NULL,
  `capacity` INT UNSIGNED DEFAULT NULL,
  `image_path` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de partidos (si no existe)
CREATE TABLE IF NOT EXISTS `matches` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `home_team_id` INT UNSIGNED NOT NULL,
  `away_team_id` INT UNSIGNED NOT NULL,
  `league_id` INT UNSIGNED DEFAULT NULL,
  `stadium_id` INT UNSIGNED DEFAULT NULL,
  `match_date` DATETIME NOT NULL,
  `status` ENUM('scheduled','live','finished','cancelled') NOT NULL DEFAULT 'scheduled',
  `home_score` INT UNSIGNED DEFAULT 0,
  `away_score` INT UNSIGNED DEFAULT 0,
  `attendance` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `matches_home_team_id_fk` FOREIGN KEY (`home_team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `matches_away_team_id_fk` FOREIGN KEY (`away_team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `matches_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `matches_stadium_id_fk` FOREIGN KEY (`stadium_id`) REFERENCES `stadiums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de eventos de partido (si no existe)
CREATE TABLE IF NOT EXISTS `match_events` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `match_id` INT UNSIGNED NOT NULL,
  `player_id` INT UNSIGNED DEFAULT NULL,
  `team_id` INT UNSIGNED DEFAULT NULL,
  `event_type` ENUM('goal','yellow_card','red_card','substitution','injury') NOT NULL,
  `minute` INT UNSIGNED NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `match_events_match_id_fk` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `match_events_player_id_fk` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `match_events_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de estadísticas por jugador y partido (si no existe)
CREATE TABLE IF NOT EXISTS `player_stats` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `player_id` INT UNSIGNED NOT NULL,
  `match_id` INT UNSIGNED NOT NULL,
  `minutes_played` INT UNSIGNED DEFAULT 0,
  `goals` INT UNSIGNED DEFAULT 0,
  `assists` INT UNSIGNED DEFAULT 0,
  `yellow_cards` INT UNSIGNED DEFAULT 0,
  `red_cards` INT UNSIGNED DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `player_stats_unique` (`player_id`,`match_id`),
  CONSTRAINT `player_stats_player_id_fk` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `player_stats_match_id_fk` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos iniciales (solo si no existen)
INSERT IGNORE INTO `leagues` (`name`, `slug`, `country`) VALUES
('La Liga', 'la_liga', 'España'),
('Premier League', 'premier_league', 'Inglaterra'),
('Bundesliga', 'bundesliga', 'Alemania'),
('Ligue 1', 'ligue_1', 'Francia');

INSERT IGNORE INTO `stadiums` (`name`, `city`, `country`, `capacity`) VALUES
('Camp Nou', 'Barcelona', 'España', 99354),
('Santiago Bernabéu', 'Madrid', 'España', 81044);

-- Actualizar equipos existentes con league_id (si no tienen)
UPDATE `teams` SET `league_id` = 1 WHERE `slug` IN ('barcelona', 'real_madrid') AND `league_id` IS NULL;
UPDATE `teams` SET `league_id` = 2 WHERE `slug` = 'manchester_united' AND `league_id` IS NULL;
UPDATE `teams` SET `league_id` = 3 WHERE `slug` = 'bayern_munich' AND `league_id` IS NULL;
UPDATE `teams` SET `league_id` = 4 WHERE `slug` = 'psg' AND `league_id` IS NULL;

-- Insertar partido de ejemplo (solo si no existe)
INSERT IGNORE INTO `matches` (`home_team_id`, `away_team_id`, `league_id`, `stadium_id`, `match_date`, `status`, `home_score`, `away_score`, `attendance`) VALUES
(1, 2, 1, 2, '2024-10-24 18:00:00', 'finished', 2, 1, 85000);

-- Insertar eventos del partido (solo si no existen)
INSERT IGNORE INTO `match_events` (`match_id`, `player_id`, `team_id`, `event_type`, `minute`, `description`) VALUES
(1, 1, 1, 'goal', 23, 'Gol de Messi tras pase filtrado'),
(1, 2, 2, 'goal', 67, 'Gol de Benzema de cabeza');

-- Insertar estadísticas de jugadores (solo si no existen)
INSERT IGNORE INTO `player_stats` (`player_id`, `match_id`, `minutes_played`, `goals`, `assists`, `yellow_cards`, `red_cards`) VALUES
(1, 1, 90, 1, 1, 0, 0),
(2, 1, 90, 1, 0, 0, 0);

-- SEGUNDO: Agregar columnas a tablas existentes (después de crear las nuevas tablas)
-- Agregar columna league_id a teams (solo si no existe)
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'teams' AND COLUMN_NAME = 'league_id') = 0,
    'ALTER TABLE `teams` ADD COLUMN `league_id` INT UNSIGNED DEFAULT NULL AFTER `slug`, ADD CONSTRAINT `teams_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;',
    'SELECT "Columna league_id ya existe en teams";'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Agregar columna match_id a assets (solo si no existe)
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'assets' AND COLUMN_NAME = 'match_id') = 0,
    'ALTER TABLE `assets` ADD COLUMN `match_id` INT UNSIGNED DEFAULT NULL AFTER `player_id`, ADD CONSTRAINT `assets_match_id_fk` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;',
    'SELECT "Columna match_id ya existe en assets";'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Actualizar assets existentes con match_id si corresponde (después de agregar la columna)
UPDATE `assets` SET `match_id` = 1 WHERE `title` = 'Video Clásico Barcelona vs Real' AND `match_id` IS NULL;

-- TERCERO: Crear tablas nuevas adicionales
CREATE TABLE IF NOT EXISTS `coaches` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `team_id` INT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(140) NOT NULL,
  `nationality` VARCHAR(80) DEFAULT NULL,
  `birth_date` DATE DEFAULT NULL,
  `photo_path` VARCHAR(255) DEFAULT NULL,
  `role` VARCHAR(60) DEFAULT 'Head Coach',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `coaches_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `match_videos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `match_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `video_path` VARCHAR(500) NOT NULL,
  `thumbnail_path` VARCHAR(500) DEFAULT NULL,
  `category` ENUM('clasicos','goles','highlights','skills') DEFAULT 'highlights',
  `duration` INT UNSIGNED DEFAULT NULL COMMENT 'Duration in seconds',
  `order` INT UNSIGNED DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `match_videos_match_id_fk` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `match_video_players` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `match_video_id` INT UNSIGNED NOT NULL,
  `player_id` INT UNSIGNED NOT NULL,
  `team_id` INT UNSIGNED DEFAULT NULL,
  `minute_appears` INT UNSIGNED DEFAULT NULL,
  `notes` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `mvp_video_id_fk` FOREIGN KEY (`match_video_id`) REFERENCES `match_videos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mvp_player_id_fk` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mvp_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mensaje de confirmación
SELECT '✅ Actualización completada exitosamente' as status;