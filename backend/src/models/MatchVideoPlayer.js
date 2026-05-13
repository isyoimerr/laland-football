const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const MatchVideoPlayer = sequelize.define(
    'MatchVideoPlayer',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      match_video_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'match_videos', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      player_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'players', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      team_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: { model: 'teams', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      minute_appears: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      notes: {
        type: DataTypes.STRING(255),
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'match_video_players',
    }
  )

  return MatchVideoPlayer
}
