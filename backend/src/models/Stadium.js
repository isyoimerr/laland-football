const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Stadium = sequelize.define(
    'Stadium',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(140),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
      },
      country: {
        type: DataTypes.STRING(80),
      },
      capacity: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      image_path: {
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
      tableName: 'stadiums',
    }
  )

  return Stadium
}
