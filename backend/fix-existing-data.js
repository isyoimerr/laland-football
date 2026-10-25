const { Sequelize } = require('sequelize')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '.env') })

const DB_NAME = process.env.DB_NAME || 'laland_football'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASS = process.env.DB_PASSWORD || ''
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 3306

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
})

async function fixExistingData() {
  try {
    await sequelize.authenticate()
    console.log('✓ Conectado a MySQL\n')

    // 1. Clear temporary stadium photos until custom uploads are available.
    console.log('1. Quitando imágenes temporales de estadios...')
    await sequelize.query('UPDATE stadiums SET image_path = NULL')
    console.log('   ✓ Imágenes de estadios eliminadas')

    // 2. Fix team logos (only teams with real files)
    console.log('2. Corrigiendo logos de equipos...')
    const logoFixes = [
      { slug: 'barcelona',          path: '/assets/EQUIPOS/Barcelona/logo.png' },
      { slug: 'real-madrid',        path: '/assets/EQUIPOS/Real_Madrid/logo.png' },
      { slug: 'manchester-united',  path: '/assets/EQUIPOS/Manchester_United/logo.webp' },
    ]
    for (const fix of logoFixes) {
      await sequelize.query('UPDATE teams SET logo_path = ? WHERE slug = ?', { replacements: [fix.path, fix.slug] })
    }
    // Set null for teams without real logo files
    const slugsWithLogos = logoFixes.map(f => f.slug)
    await sequelize.query(
      `UPDATE teams SET logo_path = NULL WHERE slug NOT IN (${slugsWithLogos.map(() => '?').join(',')})`,
      { replacements: slugsWithLogos }
    )
    const totalTeams = await sequelize.query('SELECT COUNT(*) as c FROM teams', { type: Sequelize.QueryTypes.SELECT })
    console.log(`   ✓ ${logoFixes.length} equipos con logo, ${totalTeams[0].c - logoFixes.length} sin logo`)

    // 3. Clear temporary team backgrounds until custom uploads are available.
    console.log('3. Quitando fondos temporales de equipos...')
    await sequelize.query('UPDATE teams SET background_path = NULL')
    console.log('   ✓ Fondos de equipos eliminados')

    // 4. Fix league logos (set to null — no real files exist)
    console.log('4. Corrigiendo logos de ligas...')
    await sequelize.query('UPDATE leagues SET logo_path = NULL')
    console.log('   ✓ Todas las ligas sin logo (sube uno desde el panel admin)')

    // 5. Add indexes for performance
    console.log('5. Agregando índices de base de datos...')
    const mysqlIndexes = [
      'CREATE INDEX idx_players_team_id ON players(team_id)',
      'CREATE INDEX idx_teams_league_id ON teams(league_id)',
      'CREATE INDEX idx_matches_home_team_id ON matches(home_team_id)',
      'CREATE INDEX idx_matches_away_team_id ON matches(away_team_id)',
      'CREATE INDEX idx_matches_league_id ON matches(league_id)',
      'CREATE INDEX idx_matches_stadium_id ON matches(stadium_id)',
      'CREATE INDEX idx_matches_status ON matches(status)',
      'CREATE INDEX idx_match_events_match_id ON match_events(match_id)',
      'CREATE INDEX idx_match_events_player_id ON match_events(player_id)',
      'CREATE INDEX idx_match_events_team_id ON match_events(team_id)',
    ]
    let added = 0
    for (const sql of mysqlIndexes) {
      try {
        await sequelize.query(sql)
        added++
      } catch (e) {
        // Index already exists — ignore
      }
    }
    console.log(`   ✓ ${added} índices nuevos agregados`)

    console.log('\n=== TODAS LAS CORRECCIONES APLICADAS ===')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

fixExistingData()
