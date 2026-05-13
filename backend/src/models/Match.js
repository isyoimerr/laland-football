const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Match = sequelize.define(
    'Match',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      home_team_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      away_team_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      league_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: { model: 'leagues', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      stadium_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: { model: 'stadiums', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      match_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'live', 'finished', 'cancelled'),
        defaultValue: 'scheduled',
        allowNull: false,
      },
      home_score: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      away_score: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      attendance: {
        type: DataTypes.INTEGER.UNSIGNED,
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
      tableName: 'matches',
    }
  )

  return Match
}
