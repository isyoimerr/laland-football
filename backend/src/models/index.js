const sequelize = require('../config/database')

const User = require('./User')(sequelize)
const League = require('./League')(sequelize)
const Stadium = require('./Stadium')(sequelize)
const Team = require('./Team')(sequelize)
const Player = require('./Player')(sequelize)
const Match = require('./Match')(sequelize)
const MatchEvent = require('./MatchEvent')(sequelize)
const MatchVideo = require('./MatchVideo')(sequelize)
const MatchVideoPlayer = require('./MatchVideoPlayer')(sequelize)
const Coach = require('./Coach')(sequelize)
const PlayerStat = require('./PlayerStat')(sequelize)

// Relaciones existentes
League.hasMany(Team, { foreignKey: 'league_id' })
Team.belongsTo(League, { foreignKey: 'league_id' })

Team.hasMany(Player, { foreignKey: 'team_id' })
Player.belongsTo(Team, { foreignKey: 'team_id' })

Stadium.hasMany(Match, { foreignKey: 'stadium_id' })
Match.belongsTo(Stadium, { foreignKey: 'stadium_id' })

League.hasMany(Match, { foreignKey: 'league_id' })
Match.belongsTo(League, { foreignKey: 'league_id' })

Team.hasMany(Match, { foreignKey: 'home_team_id', as: 'homeMatches' })
Team.hasMany(Match, { foreignKey: 'away_team_id', as: 'awayMatches' })
Match.belongsTo(Team, { foreignKey: 'home_team_id', as: 'homeTeam' })
Match.belongsTo(Team, { foreignKey: 'away_team_id', as: 'awayTeam' })

Match.hasMany(MatchEvent, { foreignKey: 'match_id' })
MatchEvent.belongsTo(Match, { foreignKey: 'match_id' })

Team.hasMany(MatchEvent, { foreignKey: 'team_id' })
MatchEvent.belongsTo(Team, { foreignKey: 'team_id' })

Player.hasMany(MatchEvent, { foreignKey: 'player_id' })
MatchEvent.belongsTo(Player, { foreignKey: 'player_id' })

// Relaciones de videos
Match.hasMany(MatchVideo, { foreignKey: 'match_id', as: 'videos' })
MatchVideo.belongsTo(Match, { foreignKey: 'match_id' })

MatchVideo.hasMany(MatchVideoPlayer, { foreignKey: 'match_video_id', as: 'players' })
MatchVideoPlayer.belongsTo(MatchVideo, { foreignKey: 'match_video_id' })

MatchVideoPlayer.belongsTo(Player, { foreignKey: 'player_id' })
Player.hasMany(MatchVideoPlayer, { foreignKey: 'player_id' })

MatchVideoPlayer.belongsTo(Team, { foreignKey: 'team_id' })
Team.hasMany(MatchVideoPlayer, { foreignKey: 'team_id' })

// Coach relations
Team.hasMany(Coach, { foreignKey: 'team_id' })
Coach.belongsTo(Team, { foreignKey: 'team_id' })

// PlayerStat relations
Player.hasMany(PlayerStat, { foreignKey: 'player_id' })
PlayerStat.belongsTo(Player, { foreignKey: 'player_id' })
Match.hasMany(PlayerStat, { foreignKey: 'match_id' })
PlayerStat.belongsTo(Match, { foreignKey: 'match_id' })

module.exports = {
  sequelize,
  User,
  League,
  Stadium,
  Team,
  Player,
  Match,
  MatchEvent,
  MatchVideo,
  MatchVideoPlayer,
  Coach,
  PlayerStat,
}
