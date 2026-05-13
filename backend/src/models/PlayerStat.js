const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const PlayerStat = sequelize.define(
    'PlayerStat',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      player_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'players', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      match_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'matches', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      goals: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      assists: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      yellow_cards: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      red_cards: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      minutes_played: {
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
      tableName: 'player_stats',
    }
  )

  return PlayerStat
}
