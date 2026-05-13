const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const MatchEvent = sequelize.define(
    'MatchEvent',
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
      eventType: {
        type: DataTypes.ENUM('goal', 'yellow_card', 'red_card', 'substitution', 'injury'),
        allowNull: false,
        field: 'event_type',
      },
      player_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: { model: 'players', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      team_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      minute: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
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
      tableName: 'match_events',
    }
  )

  return MatchEvent
}
