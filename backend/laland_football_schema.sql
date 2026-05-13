-- LALAND Football MySQL schema y datos iniciales
-- Importar en XAMPP con phpMyAdmin o mysql CLI

CREATE DATABASE IF NOT EXISTS `laland_football`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `laland_football`;

-- Tabla de usuarios / roles
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(160) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user','admin','super_admin') NOT NULL DEFAULT 'user',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ligas
DROP TABLE IF EXISTS `leagues`;
CREATE TABLE `leagues` (
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

-- Tabla de estadios
DROP TABLE IF EXISTS `stadiums`;
CREATE TABLE `stadiums` (
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

-- Tabla de equipos
DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `league_id` INT UNSIGNED DEFAULT NULL,
  `country` VARCHAR(80) DEFAULT NULL,
  `logo_path` VARCHAR(255) DEFAULT NULL,
  `background_path` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `teams_slug_unique` (`slug`),
  CONSTRAINT `teams_league_id_fk` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de jugadores
DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `team_id` INT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(140) NOT NULL,
  `position` VARCHAR(60) DEFAULT NULL,
  `number` INT UNSIGNED DEFAULT NULL,
  `nationality` VARCHAR(80) DEFAULT NULL,
  `height` DECIMAL(5,2) DEFAULT NULL,
  `weight` DECIMAL(5,2) DEFAULT NULL,
  `photo_path` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `players_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de partidos
DROP TABLE IF EXISTS `matches`;
CREATE TABLE `matches` (
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

-- Tabla de eventos de partido (goles, tarjetas, sustituciones)
DROP TABLE IF EXISTS `match_events`;
CREATE TABLE `match_events` (
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

-- Tabla de estadísticas por jugador y partido
DROP TABLE IF EXISTS `player_stats`;
CREATE TABLE `player_stats` (
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

-- Tabla de assets/media
DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(160) NOT NULL,
  `type` ENUM('logo','photo','video','background','misc') NOT NULL DEFAULT 'misc',
  `category` VARCHAR(120) DEFAULT NULL,
  `team_id` INT UNSIGNED DEFAULT NULL,
  `player_id` INT UNSIGNED DEFAULT NULL,
  `match_id` INT UNSIGNED DEFAULT NULL,
  `path` VARCHAR(255) NOT NULL,
  `metadata` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `assets_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `assets_player_id_fk` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `assets_match_id_fk` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de entrenadores
DROP TABLE IF EXISTS `coaches`;
CREATE TABLE `coaches` (
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

-- Tabla de videos de partidos
DROP TABLE IF EXISTS `match_videos`;
CREATE TABLE `match_videos` (
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

-- Tabla de relación videos-jugadores
DROP TABLE IF EXISTS `match_video_players`;
CREATE TABLE `match_video_players` (
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

-- Datos iniciales de prueba
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Super Admin', 'admin@lalandfootball.local', '$2b$10$l0rdlLuSLf1XBs7NMuOQJu6k1G7X7mdmkri/cYMA.1.Et7/NZ2Fza', 'super_admin');

INSERT INTO `leagues` (`name`, `slug`, `country`) VALUES
('La Liga', 'la_liga', 'España'),
('Premier League', 'premier_league', 'Inglaterra'),
('Bundesliga', 'bundesliga', 'Alemania'),
('Ligue 1', 'ligue_1', 'Francia');

INSERT INTO `stadiums` (`name`, `city`, `country`, `capacity`) VALUES
('Camp Nou', 'Barcelona', 'España', 99354),
('Santiago Bernabéu', 'Madrid', 'España', 81044);

INSERT INTO `teams` (`name`, `slug`, `league_id`, `country`, `logo_path`, `background_path`) VALUES
('Barcelona', 'barcelona', 1, 'España', 'EQUIPOS/Barcelona/logo.png', 'EQUIPOS/Barcelona/fondo.jpg'),
('Real Madrid', 'real_madrid', 1, 'España', 'EQUIPOS/Real_Madrid/logo.png', 'EQUIPOS/Real_Madrid/fondo.jpg'),
('Manchester United', 'manchester_united', 2, 'Inglaterra', 'EQUIPOS/Manchester_United/logo.webp', 'EQUIPOS/Manchester_United/fondo.jpg'),
('Bayern Munich', 'bayern_munich', 3, 'Alemania', NULL, 'EQUIPOS/Bayern_Munich/fondo.jpg'),
('PSG', 'psg', 4, 'Francia', NULL, 'EQUIPOS/PSG/fondo.jpg');

INSERT INTO `players` (`team_id`, `name`, `position`, `number`, `photo_path`) VALUES
(1, 'Lionel Messi', 'Delantero', 10, 'MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Jugador_01_accion.webp'),
(2, 'Karim Benzema', 'Delantero', 9, 'MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Jugador_02_perfil.png');

INSERT INTO `matches` (`home_team_id`, `away_team_id`, `league_id`, `stadium_id`, `match_date`, `status`, `home_score`, `away_score`, `attendance`) VALUES
(1, 2, 1, 2, '2024-10-24 18:00:00', 'finished', 2, 1, 85000);

INSERT INTO `match_events` (`match_id`, `player_id`, `team_id`, `event_type`, `minute`, `description`) VALUES
(1, 1, 1, 'goal', 23, 'Gol de Messi tras pase filtrado'),
(1, 2, 2, 'goal', 67, 'Gol de Benzema de cabeza');

INSERT INTO `player_stats` (`player_id`, `match_id`, `minutes_played`, `goals`, `assists`, `yellow_cards`, `red_cards`) VALUES
(1, 1, 90, 1, 1, 0, 0),
(2, 1, 90, 1, 0, 0, 0);

INSERT INTO `assets` (`title`, `type`, `category`, `team_id`, `player_id`, `match_id`, `path`, `metadata`) VALUES
('Fondo Barcelona', 'background', 'team', 1, NULL, NULL, 'EQUIPOS/Barcelona/fondo.jpg', JSON_OBJECT('source','multimedia')),
('Logo Barcelona', 'logo', 'team', 1, NULL, NULL, 'EQUIPOS/Barcelona/logo.png', JSON_OBJECT('source','multimedia')),
('Video Clásico Barcelona vs Real', 'video', 'highlight', NULL, NULL, 1, 'VIDEOS/Clasicos/Barcelona_vs_Real_Madrid_2020.mp4', NULL);
