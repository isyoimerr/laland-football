-- Migration: Create match_videos and match_video_players tables
-- Creates automatically via sequelize.sync(), stored here as reference

CREATE TABLE IF NOT EXISTS `match_videos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `match_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `video_path` VARCHAR(500) NOT NULL,
  `thumbnail_path` VARCHAR(500),
  `category` ENUM('clasicos', 'goles', 'highlights', 'skills') DEFAULT 'highlights',
  `duration` INT UNSIGNED COMMENT 'Duration in seconds',
  `order` INT UNSIGNED DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `match_video_players` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `match_video_id` INT UNSIGNED NOT NULL,
  `player_id` INT UNSIGNED NOT NULL,
  `team_id` INT UNSIGNED,
  `minute_appears` INT UNSIGNED,
  `notes` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`match_video_id`) REFERENCES `match_videos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
