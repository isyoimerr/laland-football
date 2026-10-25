const bcrypt = require('bcrypt')

module.exports = {
  async up(queryInterface) {
    // Usuarios
    await queryInterface.bulkInsert('users', [
      {
        name: 'Usuario Test',
        email: 'user@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Admin Test',
        email: 'admin@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Super Admin',
        email: 'super_admin@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'super_admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    // Ligas
    await queryInterface.bulkInsert('leagues', [
      {
        name: 'La Liga',
        slug: 'la-liga',
        country: 'Spain',
        logo_path: '/assets/ligas/la-liga.png',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Premier League',
        slug: 'premier-league',
        country: 'England',
        logo_path: '/assets/ligas/premier-league.png',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Bundesliga',
        slug: 'bundesliga',
        country: 'Germany',
        logo_path: '/assets/ligas/bundesliga.png',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Serie A',
        slug: 'serie-a',
        country: 'Italy',
        logo_path: '/assets/ligas/serie-a.png',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Ligue 1',
        slug: 'ligue-1',
        country: 'France',
        logo_path: '/assets/ligas/ligue-1.png',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    // Estadios
    await queryInterface.bulkInsert('stadiums', [
      {
        name: 'Camp Nou',
        city: 'Barcelona',
        country: 'Spain',
        capacity: 99354,
        image_path: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Santiago Bernabéu',
        city: 'Madrid',
        country: 'Spain',
        capacity: 81044,
        image_path: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Wanda Metropolitano',
        city: 'Madrid',
        country: 'Spain',
        capacity: 68456,
        image_path: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Old Trafford',
        city: 'Manchester',
        country: 'England',
        capacity: 74310,
        image_path: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Allianz Arena',
        city: 'Munich',
        country: 'Germany',
        capacity: 75000,
        image_path: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Parc des Princes',
        city: 'Paris',
        country: 'France',
        capacity: 47929,
        image_path: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    // Equipos
    const teams = [
      { name: 'FC Barcelona', slug: 'barcelona', league_id: 1, country: 'Spain', logo_path: '/LALAND_FOOTBALL_ASSETS/EQUIPOS/Barcelona/logo.png', background_path: null },
      { name: 'Real Madrid', slug: 'real-madrid', league_id: 1, country: 'Spain', logo_path: '/LALAND_FOOTBALL_ASSETS/EQUIPOS/Real_Madrid/logo.webp', background_path: null },
      { name: 'Atlético Madrid', slug: 'atletico-madrid', league_id: 1, country: 'Spain', logo_path: null, background_path: null },
      { name: 'Manchester United', slug: 'manchester-united', league_id: 2, country: 'England', logo_path: '/LALAND_FOOTBALL_ASSETS/EQUIPOS/Manchester_United/logo.png', background_path: null },
      { name: 'Liverpool FC', slug: 'liverpool', league_id: 2, country: 'England', logo_path: null, background_path: null },
      { name: 'Chelsea', slug: 'chelsea', league_id: 2, country: 'England', logo_path: null, background_path: null },
      { name: 'Bayern Munich', slug: 'bayern-munich', league_id: 3, country: 'Germany', logo_path: null, background_path: null },
      { name: 'Borussia Dortmund', slug: 'borussia-dortmund', league_id: 3, country: 'Germany', logo_path: null, background_path: null },
      { name: 'Inter Milan', slug: 'inter-milan', league_id: 4, country: 'Italy', logo_path: null, background_path: null },
      { name: 'AC Milan', slug: 'ac-milan', league_id: 4, country: 'Italy', logo_path: null, background_path: null },
      { name: 'Paris Saint-Germain', slug: 'paris-saint-germain', league_id: 5, country: 'France', logo_path: null, background_path: null },
      { name: 'Juventus', slug: 'juventus', league_id: 4, country: 'Italy', logo_path: null, background_path: null },
    ]

    await queryInterface.bulkInsert(
      'teams',
      teams.map(t => ({ ...t, created_at: new Date(), updated_at: new Date() }))
    )

    // Jugadores de muestra
    const players = [
      { team_id: 1, name: 'Robert Lewandowski', position: 'ST', number: 9, nationality: 'Polish' },
      { team_id: 1, name: 'Pedri', position: 'MF', number: 8, nationality: 'Spanish' },
      { team_id: 1, name: 'Gavi', position: 'MF', number: 6, nationality: 'Spanish' },
      { team_id: 2, name: 'Vinícius Júnior', position: 'LW', number: 20, nationality: 'Brazilian' },
      { team_id: 2, name: 'Jude Bellingham', position: 'CM', number: 5, nationality: 'English' },
      { team_id: 2, name: 'Kylian Mbappé', position: 'ST', number: 9, nationality: 'French' },
      { team_id: 3, name: 'Antoine Griezmann', position: 'ST', number: 8, nationality: 'French' },
      { team_id: 3, name: 'Jan Oblak', position: 'GK', number: 1, nationality: 'Slovenian' },
      { team_id: 4, name: 'Bruno Fernandes', position: 'CM', number: 8, nationality: 'Portuguese' },
      { team_id: 4, name: 'Harry Maguire', position: 'CB', number: 6, nationality: 'English' },
      { team_id: 5, name: 'Mohamed Salah', position: 'RW', number: 11, nationality: 'Egyptian' },
      { team_id: 5, name: 'Sadio Mané', position: 'LW', number: 10, nationality: 'Senegalese' },
      { team_id: 6, name: 'Reece James', position: 'RB', number: 24, nationality: 'English' },
      { team_id: 6, name: 'Mason Mount', position: 'CAM', number: 19, nationality: 'English' },
      { team_id: 7, name: 'Manuel Neuer', position: 'GK', number: 1, nationality: 'German' },
      { team_id: 7, name: 'Serge Gnabry', position: 'RW', number: 7, nationality: 'German' },
      { team_id: 8, name: 'Marco Reus', position: 'LW', number: 11, nationality: 'German' },
      { team_id: 8, name: 'Mats Hummels', position: 'CB', number: 15, nationality: 'German' },
      { team_id: 9, name: 'Lautaro Martínez', position: 'ST', number: 10, nationality: 'Argentine' },
      { team_id: 9, name: 'Marcelo Brozović', position: 'CM', number: 77, nationality: 'Croatian' },
      { team_id: 10, name: 'Theo Hernández', position: 'LB', number: 19, nationality: 'French' },
      { team_id: 10, name: 'Rafael Leão', position: 'LW', number: 10, nationality: 'Portuguese' },
      { team_id: 11, name: 'Neymar Jr', position: 'LW', number: 10, nationality: 'Brazilian' },
      { team_id: 11, name: 'Achraf Hakimi', position: 'RB', number: 2, nationality: 'Moroccan' },
      { team_id: 12, name: 'Cristiano Ronaldo', position: 'ST', number: 7, nationality: 'Portuguese' },
      { team_id: 12, name: 'Juan Cuadrado', position: 'RW', number: 11, nationality: 'Colombian' },
    ]

    await queryInterface.bulkInsert(
      'players',
      players.map(p => ({ ...p, photo_path: null, created_at: new Date(), updated_at: new Date() }))
    )

    // Partidos
    const now = new Date()
    const matches = [
      {
        home_team_id: 1,
        away_team_id: 2,
        league_id: 1,
        stadium_id: 1,
        match_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        home_score: 0,
        away_score: 0,
      },
      {
        home_team_id: 4,
        away_team_id: 5,
        league_id: 2,
        stadium_id: 4,
        match_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        home_score: 0,
        away_score: 0,
      },
      {
        home_team_id: 7,
        away_team_id: 8,
        league_id: 3,
        stadium_id: 5,
        match_date: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        status: 'finished',
        home_score: 3,
        away_score: 1,
      },
      {
        home_team_id: 3,
        away_team_id: 1,
        league_id: 1,
        stadium_id: 3,
        match_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        home_score: 0,
        away_score: 0,
      },
      {
        home_team_id: 6,
        away_team_id: 2,
        league_id: 2,
        stadium_id: 4,
        match_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        status: 'finished',
        home_score: 2,
        away_score: 2,
      },
    ]

    await queryInterface.bulkInsert(
      'matches',
      matches.map(m => ({ ...m, created_at: new Date(), updated_at: new Date() }))
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('match_events', null)
    await queryInterface.bulkDelete('matches', null)
    await queryInterface.bulkDelete('players', null)
    await queryInterface.bulkDelete('teams', null)
    await queryInterface.bulkDelete('stadiums', null)
    await queryInterface.bulkDelete('leagues', null)
    await queryInterface.bulkDelete('users', null)
  },
}
