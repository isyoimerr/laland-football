require('dotenv').config()
const sequelize = require('./src/config/database')
const seeder = require('./src/seeders/initial-data')

async function runSeeders() {
  try {
    console.log('[Seeder] Conectando a la base de datos...')
    await sequelize.authenticate()
    console.log('[Seeder] Conexión exitosa')

    // Cargar modelos antes de limpiar/sincronizar
    require('./src/models')

    console.log('[Seeder] Limpiando datos existentes...')
    const qi = sequelize.getQueryInterface()
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
      await sequelize.query('TRUNCATE TABLE match_events')
      await sequelize.query('TRUNCATE TABLE matches')
      await sequelize.query('TRUNCATE TABLE player_stats')
      await sequelize.query('TRUNCATE TABLE match_video_players')
      await sequelize.query('TRUNCATE TABLE match_videos')
      await sequelize.query('TRUNCATE TABLE coaches')
      await sequelize.query('TRUNCATE TABLE players')
      await sequelize.query('TRUNCATE TABLE teams')
      await sequelize.query('TRUNCATE TABLE stadiums')
      await sequelize.query('TRUNCATE TABLE leagues')
      await sequelize.query('TRUNCATE TABLE users')
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    } catch (e) {
      console.log('[Seeder] Tablas vacías, continuando...')
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1').catch(() => {})
    }

    console.log('[Seeder] Sincronizando esquema...')
    await sequelize.sync({ alter: true })
    console.log('[Seeder] Esquema sincronizado')

    console.log('[Seeder] Insertando datos...')
    await seeder.up(qi, sequelize)
    console.log('[Seeder] ✓ Datos cargados correctamente')

    await sequelize.close()
  } catch (error) {
    console.error('[Seeder] Error:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  runSeeders()
}

module.exports = runSeeders
