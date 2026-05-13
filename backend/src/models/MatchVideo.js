const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const MatchVideo = sequelize.define(
    'MatchVideo',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      match_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'matches', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      video_path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      thumbnail_path: {
        type: DataTypes.STRING(500),
      },
      category: {
        type: DataTypes.ENUM('clasicos', 'goles', 'highlights', 'skills'),
        defaultValue: 'highlights',
      },
      duration: {
        type: DataTypes.INTEGER.UNSIGNED,
        comment: 'Duration in seconds',
      },
      order: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'match_videos',
    }
  )

  return MatchVideo
}
