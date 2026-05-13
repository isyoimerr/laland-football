const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Coach = sequelize.define(
    'Coach',
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
      nationality: {
        type: DataTypes.STRING(80),
      },
      birth_date: {
        type: DataTypes.DATEONLY,
      },
      photo_path: {
        type: DataTypes.STRING(255),
      },
      role: {
        type: DataTypes.STRING(60),
        defaultValue: 'Head Coach',
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
      tableName: 'coaches',
    }
  )

  return Coach
}
