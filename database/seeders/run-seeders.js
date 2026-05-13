const path = require('path')
const sequelize = require(path.join(__dirname, '../../backend/src/config/database'))
const seeder = require('./20240512000000-initial-data')

async function runSeeders() {
  try {
    console.log('[Seeder] Conectando a la base de datos...')
    await sequelize.authenticate()
    console.log('[Seeder] Conexión exitosa')

    console.log('[Seeder] Sincronizando modelos...')
    // Cargar modelos
    require(path.join(__dirname, '../../backend/src/models'))
    await sequelize.sync({ force: false, alter: true })
    console.log('[Seeder] Modelos sincronizados')

    console.log('[Seeder] Ejecutando seeders...')
    const queryInterface = sequelize.getQueryInterface()
    await seeder.up(queryInterface, sequelize)
    console.log('[Seeder] Datos iniciales cargados exitosamente ✓')

    await sequelize.close()
  } catch (error) {
    console.error('[Seeder] Error:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

if (require.main === module) {
  runSeeders()
}

module.exports = runSeeders
