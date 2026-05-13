const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Player = sequelize.define(
    'Player',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      team_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: { model: 'teams', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING(140),
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING(60),
      },
      number: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      nationality: {
        type: DataTypes.STRING(80),
      },
      height: {
        type: DataTypes.DECIMAL(5, 2),
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2),
      },
      photo_path: {
        type: DataTypes.STRING(255),
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
      tableName: 'players',
    }
  )

  return Player
}
