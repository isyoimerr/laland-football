const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Team = sequelize.define(
    'Team',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      league_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: { model: 'leagues', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      country: {
        type: DataTypes.STRING(80),
      },
      logo_path: {
        type: DataTypes.STRING(255),
      },
      background_path: {
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
      tableName: 'teams',
    }
  )

  return Team
}
