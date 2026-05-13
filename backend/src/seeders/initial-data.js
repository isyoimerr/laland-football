const bcrypt = require('bcrypt')

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')

    // TRUNCATE para resetear auto_increment y limpiar datos previos
    await queryInterface.sequelize.query('TRUNCATE TABLE match_events')
    await queryInterface.sequelize.query('TRUNCATE TABLE matches')
    await queryInterface.sequelize.query('TRUNCATE TABLE players')
    await queryInterface.sequelize.query('TRUNCATE TABLE teams')
    await queryInterface.sequelize.query('TRUNCATE TABLE stadiums')
    await queryInterface.sequelize.query('TRUNCATE TABLE leagues')
    await queryInterface.sequelize.query('TRUNCATE TABLE users')

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')

    // ── USUARIOS ──────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('users', [
      {
        name: 'Usuario Demo',
        email: 'demo@lalandfootball.com',
        password: await bcrypt.hash('demo1234', 10),
        role: 'super_admin',
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
        email: 'super@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'super_admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    // ── LIGAS (IDs 1-6) ───────────────────────────────────────────────────────
    await queryInterface.bulkInsert('leagues', [
      { name: 'La Liga',         slug: 'la-liga',          country: 'Spain',    logo_path: null, created_at: new Date(), updated_at: new Date() },
      { name: 'Premier League',  slug: 'premier-league',   country: 'England',  logo_path: null, created_at: new Date(), updated_at: new Date() },
      { name: 'Bundesliga',      slug: 'bundesliga',       country: 'Germany',  logo_path: null, created_at: new Date(), updated_at: new Date() },
      { name: 'Serie A',         slug: 'serie-a',          country: 'Italy',    logo_path: null, created_at: new Date(), updated_at: new Date() },
      { name: 'Ligue 1',         slug: 'ligue-1',          country: 'France',   logo_path: null, created_at: new Date(), updated_at: new Date() },
      { name: 'Liga LALAND',     slug: 'liga-laland',      country: 'Colombia', logo_path: null, created_at: new Date(), updated_at: new Date() },
    ])

    // ── ESTADIOS (IDs 1-12) ───────────────────────────────────────────────────
    const stadiumImgs = [
      '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Estadio_01_panoramica.webp',
      '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Estadio_02_interior.webp',
      '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Estadio_03_nocturno.webp',
    ]
    await queryInterface.bulkInsert('stadiums', [
      { name: 'Santiago Bernabéu',  city: 'Madrid',     country: 'Spain',    capacity: 81044, image_path: stadiumImgs[0], created_at: new Date(), updated_at: new Date() },
      { name: 'Camp Nou',           city: 'Barcelona',  country: 'Spain',    capacity: 99354, image_path: stadiumImgs[1], created_at: new Date(), updated_at: new Date() },
      { name: 'Wanda Metropolitano',city: 'Madrid',     country: 'Spain',    capacity: 68456, image_path: stadiumImgs[2], created_at: new Date(), updated_at: new Date() },
      { name: 'Old Trafford',       city: 'Manchester', country: 'England',  capacity: 74310, image_path: stadiumImgs[0], created_at: new Date(), updated_at: new Date() },
      { name: 'Anfield',            city: 'Liverpool',  country: 'England',  capacity: 53394, image_path: stadiumImgs[1], created_at: new Date(), updated_at: new Date() },
      { name: 'Stamford Bridge',    city: 'London',     country: 'England',  capacity: 40341, image_path: stadiumImgs[2], created_at: new Date(), updated_at: new Date() },
      { name: 'Allianz Arena',      city: 'Munich',     country: 'Germany',  capacity: 75024, image_path: stadiumImgs[0], created_at: new Date(), updated_at: new Date() },
      { name: 'Signal Iduna Park',  city: 'Dortmund',   country: 'Germany',  capacity: 81365, image_path: stadiumImgs[1], created_at: new Date(), updated_at: new Date() },
      { name: 'San Siro',           city: 'Milan',      country: 'Italy',    capacity: 80018, image_path: stadiumImgs[2], created_at: new Date(), updated_at: new Date() },
      { name: 'Allianz Stadium',    city: 'Turin',      country: 'Italy',    capacity: 41507, image_path: stadiumImgs[0], created_at: new Date(), updated_at: new Date() },
      { name: 'Parc des Princes',   city: 'Paris',      country: 'France',   capacity: 47929, image_path: stadiumImgs[1], created_at: new Date(), updated_at: new Date() },
      { name: 'El Campín',          city: 'Bogotá',     country: 'Colombia', capacity: 36343, image_path: stadiumImgs[2], created_at: new Date(), updated_at: new Date() },
    ])

    // ── EQUIPOS (IDs 1-13) ────────────────────────────────────────────────────
    const teams = [
      { name: 'FC Barcelona',        slug: 'barcelona',          league_id: 1, country: 'Spain',    logo_path: '/assets/EQUIPOS/Barcelona/logo.png',         background_path: '/assets/EQUIPOS/Barcelona/fondo.jpg' },
      { name: 'Real Madrid',         slug: 'real-madrid',        league_id: 1, country: 'Spain',    logo_path: '/assets/EQUIPOS/Real_Madrid/logo.png',       background_path: '/assets/EQUIPOS/Real_Madrid/fondo.jpg' },
      { name: 'Atlético Madrid',     slug: 'atletico-madrid',    league_id: 1, country: 'Spain',    logo_path: null,                                         background_path: '/assets/EQUIPOS/Atletico_Madrid/fondo.jpg' },
      { name: 'Manchester United',   slug: 'manchester-united',  league_id: 2, country: 'England',  logo_path: '/assets/EQUIPOS/Manchester_United/logo.webp',  background_path: '/assets/EQUIPOS/Manchester_United/fondo.jpg' },
      { name: 'Liverpool FC',        slug: 'liverpool',          league_id: 2, country: 'England',  logo_path: null,                                         background_path: '/assets/EQUIPOS/Liverpool/fondo.jpg' },
      { name: 'Chelsea',             slug: 'chelsea',            league_id: 2, country: 'England',  logo_path: null,                                         background_path: '/assets/EQUIPOS/Chelsea/fondo.jpg' },
      { name: 'Bayern Munich',       slug: 'bayern-munich',      league_id: 3, country: 'Germany',  logo_path: null,                                         background_path: '/assets/EQUIPOS/Bayern_Munich/fondo.jpg' },
      { name: 'Borussia Dortmund',   slug: 'borussia-dortmund',  league_id: 3, country: 'Germany',  logo_path: null,                                         background_path: '/assets/EQUIPOS/Borussia_Dortmund/fondo.jpg' },
      { name: 'Inter Milan',         slug: 'inter-milan',        league_id: 4, country: 'Italy',    logo_path: null,                                         background_path: '/assets/EQUIPOS/Inter_Milan/fondo.jpg' },
      { name: 'AC Milan',            slug: 'ac-milan',           league_id: 4, country: 'Italy',    logo_path: null,                                         background_path: '/assets/EQUIPOS/AC_Milan/fondo.jpg' },
      { name: 'Paris Saint-Germain', slug: 'paris-saint-germain',league_id: 5, country: 'France',   logo_path: null,                                         background_path: '/assets/EQUIPOS/PSG/fondo.jpg' },
      { name: 'Juventus',            slug: 'juventus',           league_id: 4, country: 'Italy',    logo_path: null,                                         background_path: '/assets/EQUIPOS/Juventus/fondo.jpg' },
      { name: 'Tigres FC',           slug: 'tigres-fc',          league_id: 6, country: 'Colombia', logo_path: null,                                         background_path: '/assets/EQUIPOS/Tigres_FC/fondo.jpg' },
    ]
    await queryInterface.bulkInsert('teams', teams.map(t => ({ ...t, created_at: new Date(), updated_at: new Date() })))

    // ── JUGADORES (IDs 1-140) ─────────────────────────────────────────────────
    // team_id=1: FC Barcelona (IDs 1-11)
    // team_id=2: Real Madrid  (IDs 12-22)
    // team_id=3: Atlético     (IDs 23-33)
    // team_id=4: Man United   (IDs 34-43)
    // team_id=5: Liverpool    (IDs 44-53)
    // team_id=6: Chelsea      (IDs 54-63)
    // team_id=7: Bayern       (IDs 64-74)
    // team_id=8: Dortmund     (IDs 75-85)
    // team_id=9: Inter        (IDs 86-96)
    // team_id=10: AC Milan    (IDs 97-107)
    // team_id=11: PSG         (IDs 108-118)
    // team_id=12: Juventus    (IDs 119-129)
    // team_id=13: Tigres FC   (IDs 130-140)
    const players = [
      // ─ FC Barcelona ─
      { team_id: 1, name: 'Marc-André ter Stegen', position: 'Portero',        number: 1,  nationality: 'Alemán',       height: 187, weight: 85 },
      { team_id: 1, name: 'João Cancelo',           position: 'Defensa',        number: 2,  nationality: 'Portugués',    height: 182, weight: 74 },
      { team_id: 1, name: 'Ronald Araújo',          position: 'Defensa',        number: 4,  nationality: 'Uruguayo',     height: 188, weight: 83 },
      { team_id: 1, name: 'Íñigo Martínez',         position: 'Defensa',        number: 5,  nationality: 'Español',      height: 186, weight: 77 },
      { team_id: 1, name: 'Alejandro Balde',        position: 'Defensa',        number: 3,  nationality: 'Español',      height: 180, weight: 69 },
      { team_id: 1, name: 'Gavi',                   position: 'Centrocampista', number: 6,  nationality: 'Español',      height: 173, weight: 64 },
      { team_id: 1, name: 'Pedri',                  position: 'Centrocampista', number: 8,  nationality: 'Español',      height: 174, weight: 63 },
      { team_id: 1, name: 'Frenkie de Jong',        position: 'Centrocampista', number: 21, nationality: 'Holandés',     height: 181, weight: 74 },
      { team_id: 1, name: 'Fermín López',           position: 'Centrocampista', number: 16, nationality: 'Español',      height: 176, weight: 68 },
      { team_id: 1, name: 'Robert Lewandowski',     position: 'Delantero',      number: 9,  nationality: 'Polaco',       height: 185, weight: 81 },
      { team_id: 1, name: 'Raphinha',               position: 'Delantero',      number: 11, nationality: 'Brasileño',    height: 176, weight: 68 },
      // ─ Real Madrid ─
      { team_id: 2, name: 'Thibaut Courtois',       position: 'Portero',        number: 1,  nationality: 'Belga',        height: 199, weight: 96 },
      { team_id: 2, name: 'Dani Carvajal',          position: 'Defensa',        number: 2,  nationality: 'Español',      height: 173, weight: 73 },
      { team_id: 2, name: 'Éder Militão',           position: 'Defensa',        number: 3,  nationality: 'Brasileño',    height: 186, weight: 77 },
      { team_id: 2, name: 'Antonio Rüdiger',        position: 'Defensa',        number: 22, nationality: 'Alemán',       height: 190, weight: 85 },
      { team_id: 2, name: 'Ferland Mendy',          position: 'Defensa',        number: 23, nationality: 'Francés',      height: 180, weight: 74 },
      { team_id: 2, name: 'Luka Modrić',            position: 'Centrocampista', number: 10, nationality: 'Croata',       height: 172, weight: 66 },
      { team_id: 2, name: 'Aurélien Tchouaméni',    position: 'Centrocampista', number: 14, nationality: 'Francés',      height: 188, weight: 79 },
      { team_id: 2, name: 'Jude Bellingham',        position: 'Centrocampista', number: 5,  nationality: 'Inglés',       height: 186, weight: 75 },
      { team_id: 2, name: 'Federico Valverde',      position: 'Centrocampista', number: 15, nationality: 'Uruguayo',     height: 182, weight: 78 },
      { team_id: 2, name: 'Vinicius Jr.',           position: 'Delantero',      number: 7,  nationality: 'Brasileño',    height: 176, weight: 73 },
      { team_id: 2, name: 'Rodrygo',                position: 'Delantero',      number: 11, nationality: 'Brasileño',    height: 174, weight: 64 },
      // ─ Atlético Madrid ─
      { team_id: 3, name: 'Jan Oblak',              position: 'Portero',        number: 13, nationality: 'Esloveno',     height: 188, weight: 87 },
      { team_id: 3, name: 'Marcos Llorente',        position: 'Defensa',        number: 14, nationality: 'Español',      height: 184, weight: 77 },
      { team_id: 3, name: 'José María Giménez',     position: 'Defensa',        number: 2,  nationality: 'Uruguayo',     height: 187, weight: 87 },
      { team_id: 3, name: 'Reinildo Mandava',       position: 'Defensa',        number: 23, nationality: 'Mozambiqueño', height: 180, weight: 75 },
      { team_id: 3, name: 'Nahuel Molina',          position: 'Defensa',        number: 16, nationality: 'Argentino',    height: 176, weight: 73 },
      { team_id: 3, name: 'Koke',                   position: 'Centrocampista', number: 6,  nationality: 'Español',      height: 176, weight: 73 },
      { team_id: 3, name: 'Rodrigo De Paul',        position: 'Centrocampista', number: 5,  nationality: 'Argentino',    height: 183, weight: 75 },
      { team_id: 3, name: 'Pablo Barrios',          position: 'Centrocampista', number: 30, nationality: 'Español',      height: 181, weight: 73 },
      { team_id: 3, name: 'Ángel Correa',           position: 'Centrocampista', number: 10, nationality: 'Argentino',    height: 170, weight: 63 },
      { team_id: 3, name: 'Antoine Griezmann',      position: 'Delantero',      number: 7,  nationality: 'Francés',      height: 176, weight: 73 },
      { team_id: 3, name: 'Álvaro Morata',          position: 'Delantero',      number: 21, nationality: 'Español',      height: 191, weight: 79 },
      // ─ Manchester United ─
      { team_id: 4, name: 'André Onana',            position: 'Portero',        number: 24, nationality: 'Camerunés',    height: 190, weight: 89 },
      { team_id: 4, name: 'Aaron Wan-Bissaka',      position: 'Defensa',        number: 29, nationality: 'Inglés',       height: 183, weight: 71 },
      { team_id: 4, name: 'Harry Maguire',          position: 'Defensa',        number: 5,  nationality: 'Inglés',       height: 194, weight: 100 },
      { team_id: 4, name: 'Raphaël Varane',         position: 'Defensa',        number: 19, nationality: 'Francés',      height: 191, weight: 81 },
      { team_id: 4, name: 'Luke Shaw',              position: 'Defensa',        number: 23, nationality: 'Inglés',       height: 185, weight: 75 },
      { team_id: 4, name: 'Bruno Fernandes',        position: 'Centrocampista', number: 8,  nationality: 'Portugués',    height: 179, weight: 69 },
      { team_id: 4, name: 'Casemiro',               position: 'Centrocampista', number: 18, nationality: 'Brasileño',    height: 185, weight: 84 },
      { team_id: 4, name: 'Mason Mount',            position: 'Centrocampista', number: 7,  nationality: 'Inglés',       height: 178, weight: 70 },
      { team_id: 4, name: 'Marcus Rashford',        position: 'Delantero',      number: 10, nationality: 'Inglés',       height: 180, weight: 70 },
      { team_id: 4, name: 'Rasmus Højlund',         position: 'Delantero',      number: 11, nationality: 'Danés',        height: 191, weight: 75 },
      // ─ Liverpool ─
      { team_id: 5, name: 'Alisson Becker',         position: 'Portero',        number: 1,  nationality: 'Brasileño',    height: 191, weight: 91 },
      { team_id: 5, name: 'Trent Alexander-Arnold', position: 'Defensa',        number: 66, nationality: 'Inglés',       height: 175, weight: 69 },
      { team_id: 5, name: 'Virgil van Dijk',        position: 'Defensa',        number: 4,  nationality: 'Holandés',     height: 193, weight: 92 },
      { team_id: 5, name: 'Ibrahima Konaté',        position: 'Defensa',        number: 5,  nationality: 'Francés',      height: 194, weight: 95 },
      { team_id: 5, name: 'Andrew Robertson',       position: 'Defensa',        number: 26, nationality: 'Escocés',      height: 178, weight: 64 },
      { team_id: 5, name: 'Alexis Mac Allister',    position: 'Centrocampista', number: 10, nationality: 'Argentino',    height: 177, weight: 72 },
      { team_id: 5, name: 'Dominik Szoboszlai',     position: 'Centrocampista', number: 8,  nationality: 'Húngaro',      height: 186, weight: 78 },
      { team_id: 5, name: 'Ryan Gravenberch',       position: 'Centrocampista', number: 38, nationality: 'Holandés',     height: 190, weight: 75 },
      { team_id: 5, name: 'Mohamed Salah',          position: 'Delantero',      number: 11, nationality: 'Egipcio',      height: 175, weight: 71 },
      { team_id: 5, name: 'Darwin Núñez',           position: 'Delantero',      number: 9,  nationality: 'Uruguayo',     height: 187, weight: 78 },
      // ─ Chelsea ─
      { team_id: 6, name: 'Robert Sánchez',         position: 'Portero',        number: 1,  nationality: 'Español',      height: 197, weight: 87 },
      { team_id: 6, name: 'Reece James',            position: 'Defensa',        number: 24, nationality: 'Inglés',       height: 180, weight: 76 },
      { team_id: 6, name: 'Thiago Silva',           position: 'Defensa',        number: 6,  nationality: 'Brasileño',    height: 182, weight: 79 },
      { team_id: 6, name: 'Levi Colwill',           position: 'Defensa',        number: 26, nationality: 'Inglés',       height: 188, weight: 75 },
      { team_id: 6, name: 'Ben Chilwell',           position: 'Defensa',        number: 21, nationality: 'Inglés',       height: 178, weight: 77 },
      { team_id: 6, name: 'Moisés Caicedo',         position: 'Centrocampista', number: 25, nationality: 'Ecuatoriano',  height: 183, weight: 78 },
      { team_id: 6, name: 'Enzo Fernández',         position: 'Centrocampista', number: 8,  nationality: 'Argentino',    height: 178, weight: 72 },
      { team_id: 6, name: 'Cole Palmer',            position: 'Centrocampista', number: 20, nationality: 'Inglés',       height: 185, weight: 73 },
      { team_id: 6, name: 'Nicolas Jackson',        position: 'Delantero',      number: 15, nationality: 'Senegalés',    height: 183, weight: 71 },
      { team_id: 6, name: 'Raheem Sterling',        position: 'Delantero',      number: 17, nationality: 'Inglés',       height: 170, weight: 69 },
      // ─ Bayern Munich ─
      { team_id: 7, name: 'Manuel Neuer',           position: 'Portero',        number: 1,  nationality: 'Alemán',       height: 193, weight: 92 },
      { team_id: 7, name: 'Joshua Kimmich',         position: 'Defensa',        number: 6,  nationality: 'Alemán',       height: 176, weight: 73 },
      { team_id: 7, name: 'Dayot Upamecano',        position: 'Defensa',        number: 2,  nationality: 'Francés',      height: 186, weight: 83 },
      { team_id: 7, name: 'Matthijs de Ligt',       position: 'Defensa',        number: 4,  nationality: 'Holandés',     height: 189, weight: 85 },
      { team_id: 7, name: 'Alphonso Davies',        position: 'Defensa',        number: 19, nationality: 'Canadiense',   height: 180, weight: 71 },
      { team_id: 7, name: 'Leon Goretzka',          position: 'Centrocampista', number: 8,  nationality: 'Alemán',       height: 189, weight: 85 },
      { team_id: 7, name: 'Jamal Musiala',          position: 'Centrocampista', number: 42, nationality: 'Alemán',       height: 183, weight: 75 },
      { team_id: 7, name: 'Thomas Müller',          position: 'Centrocampista', number: 25, nationality: 'Alemán',       height: 186, weight: 75 },
      { team_id: 7, name: 'Leroy Sané',             position: 'Delantero',      number: 10, nationality: 'Alemán',       height: 183, weight: 75 },
      { team_id: 7, name: 'Harry Kane',             position: 'Delantero',      number: 9,  nationality: 'Inglés',       height: 188, weight: 86 },
      { team_id: 7, name: 'Serge Gnabry',           position: 'Delantero',      number: 7,  nationality: 'Alemán',       height: 175, weight: 76 },
      // ─ Borussia Dortmund ─
      { team_id: 8, name: 'Gregor Kobel',           position: 'Portero',        number: 1,  nationality: 'Suizo',        height: 194, weight: 90 },
      { team_id: 8, name: 'Julian Ryerson',         position: 'Defensa',        number: 26, nationality: 'Noruego',      height: 175, weight: 72 },
      { team_id: 8, name: 'Niklas Süle',            position: 'Defensa',        number: 25, nationality: 'Alemán',       height: 195, weight: 100 },
      { team_id: 8, name: 'Mats Hummels',           position: 'Defensa',        number: 15, nationality: 'Alemán',       height: 191, weight: 92 },
      { team_id: 8, name: 'Ian Maatsen',            position: 'Defensa',        number: 7,  nationality: 'Holandés',     height: 177, weight: 72 },
      { team_id: 8, name: 'Emre Can',               position: 'Centrocampista', number: 23, nationality: 'Alemán',       height: 184, weight: 80 },
      { team_id: 8, name: 'Marcel Sabitzer',        position: 'Centrocampista', number: 20, nationality: 'Austriaco',    height: 179, weight: 74 },
      { team_id: 8, name: 'Julian Brandt',          position: 'Centrocampista', number: 19, nationality: 'Alemán',       height: 185, weight: 74 },
      { team_id: 8, name: 'Karim Adeyemi',          position: 'Delantero',      number: 27, nationality: 'Alemán',       height: 180, weight: 72 },
      { team_id: 8, name: 'Sébastien Haller',       position: 'Delantero',      number: 9,  nationality: 'Marfileño',    height: 190, weight: 86 },
      { team_id: 8, name: 'Donyell Malen',          position: 'Delantero',      number: 16, nationality: 'Holandés',     height: 176, weight: 68 },
      // ─ Inter Milan ─
      { team_id: 9, name: 'Yann Sommer',            position: 'Portero',        number: 1,  nationality: 'Suizo',        height: 183, weight: 75 },
      { team_id: 9, name: 'Matteo Darmian',         position: 'Defensa',        number: 36, nationality: 'Italiano',     height: 181, weight: 74 },
      { team_id: 9, name: 'Francesco Acerbi',       position: 'Defensa',        number: 15, nationality: 'Italiano',     height: 192, weight: 89 },
      { team_id: 9, name: 'Alessandro Bastoni',     position: 'Defensa',        number: 95, nationality: 'Italiano',     height: 190, weight: 75 },
      { team_id: 9, name: 'Federico Dimarco',       position: 'Defensa',        number: 32, nationality: 'Italiano',     height: 180, weight: 72 },
      { team_id: 9, name: 'Nicolò Barella',         position: 'Centrocampista', number: 23, nationality: 'Italiano',     height: 177, weight: 68 },
      { team_id: 9, name: 'Hakan Çalhanoğlu',       position: 'Centrocampista', number: 20, nationality: 'Turco',        height: 177, weight: 70 },
      { team_id: 9, name: 'Henrikh Mkhitaryan',     position: 'Centrocampista', number: 22, nationality: 'Armenio',      height: 177, weight: 73 },
      { team_id: 9, name: 'Marcus Thuram',          position: 'Delantero',      number: 9,  nationality: 'Francés',      height: 189, weight: 82 },
      { team_id: 9, name: 'Lautaro Martínez',       position: 'Delantero',      number: 10, nationality: 'Argentino',    height: 174, weight: 72 },
      { team_id: 9, name: 'Alexis Sánchez',         position: 'Delantero',      number: 70, nationality: 'Chileno',      height: 169, weight: 62 },
      // ─ AC Milan ─
      { team_id: 10, name: 'Mike Maignan',          position: 'Portero',        number: 16, nationality: 'Francés',      height: 191, weight: 90 },
      { team_id: 10, name: 'Davide Calabria',       position: 'Defensa',        number: 2,  nationality: 'Italiano',     height: 174, weight: 72 },
      { team_id: 10, name: 'Simon Kjær',            position: 'Defensa',        number: 24, nationality: 'Danés',        height: 190, weight: 90 },
      { team_id: 10, name: 'Malick Thiaw',          position: 'Defensa',        number: 28, nationality: 'Alemán',       height: 194, weight: 83 },
      { team_id: 10, name: 'Theo Hernández',        position: 'Defensa',        number: 19, nationality: 'Francés',      height: 184, weight: 82 },
      { team_id: 10, name: 'Tijjani Reijnders',     position: 'Centrocampista', number: 14, nationality: 'Holandés',     height: 185, weight: 75 },
      { team_id: 10, name: 'Ismaël Bennacer',       position: 'Centrocampista', number: 4,  nationality: 'Argelino',     height: 175, weight: 69 },
      { team_id: 10, name: 'Ruben Loftus-Cheek',    position: 'Centrocampista', number: 8,  nationality: 'Inglés',       height: 191, weight: 88 },
      { team_id: 10, name: 'Rafael Leão',           position: 'Delantero',      number: 10, nationality: 'Portugués',    height: 188, weight: 77 },
      { team_id: 10, name: 'Olivier Giroud',        position: 'Delantero',      number: 9,  nationality: 'Francés',      height: 193, weight: 91 },
      { team_id: 10, name: 'Christian Pulisic',     position: 'Delantero',      number: 11, nationality: 'Estadounidense',height: 177, weight: 71 },
      // ─ Paris Saint-Germain ─
      { team_id: 11, name: 'Gianluigi Donnarumma',  position: 'Portero',        number: 99, nationality: 'Italiano',     height: 196, weight: 90 },
      { team_id: 11, name: 'Achraf Hakimi',         position: 'Defensa',        number: 2,  nationality: 'Marroquí',     height: 181, weight: 73 },
      { team_id: 11, name: 'Marquinhos',            position: 'Defensa',        number: 5,  nationality: 'Brasileño',    height: 183, weight: 75 },
      { team_id: 11, name: 'Lucas Beraldo',         position: 'Defensa',        number: 35, nationality: 'Brasileño',    height: 186, weight: 79 },
      { team_id: 11, name: 'Nuno Mendes',           position: 'Defensa',        number: 25, nationality: 'Portugués',    height: 180, weight: 70 },
      { team_id: 11, name: 'Vitinha',               position: 'Centrocampista', number: 17, nationality: 'Portugués',    height: 173, weight: 61 },
      { team_id: 11, name: 'Warren Zaïre-Emery',    position: 'Centrocampista', number: 33, nationality: 'Francés',      height: 181, weight: 72 },
      { team_id: 11, name: 'Marco Asensio',         position: 'Centrocampista', number: 11, nationality: 'Español',      height: 182, weight: 72 },
      { team_id: 11, name: 'Ousmane Dembélé',       position: 'Delantero',      number: 10, nationality: 'Francés',      height: 178, weight: 68 },
      { team_id: 11, name: 'Kylian Mbappé',         position: 'Delantero',      number: 7,  nationality: 'Francés',      height: 178, weight: 73 },
      { team_id: 11, name: 'Gonçalo Ramos',         position: 'Delantero',      number: 9,  nationality: 'Portugués',    height: 186, weight: 77 },
      // ─ Juventus ─
      { team_id: 12, name: 'Wojciech Szczęsny',     position: 'Portero',        number: 1,  nationality: 'Polaco',       height: 196, weight: 84 },
      { team_id: 12, name: 'Andrea Cambiaso',       position: 'Defensa',        number: 27, nationality: 'Italiano',     height: 180, weight: 74 },
      { team_id: 12, name: 'Gleison Bremer',        position: 'Defensa',        number: 3,  nationality: 'Brasileño',    height: 188, weight: 89 },
      { team_id: 12, name: 'Federico Gatti',        position: 'Defensa',        number: 4,  nationality: 'Italiano',     height: 191, weight: 84 },
      { team_id: 12, name: 'Alex Sandro',           position: 'Defensa',        number: 12, nationality: 'Brasileño',    height: 182, weight: 80 },
      { team_id: 12, name: 'Manuel Locatelli',      position: 'Centrocampista', number: 5,  nationality: 'Italiano',     height: 185, weight: 81 },
      { team_id: 12, name: 'Adrien Rabiot',         position: 'Centrocampista', number: 25, nationality: 'Francés',      height: 188, weight: 77 },
      { team_id: 12, name: 'Nicolás González',      position: 'Centrocampista', number: 11, nationality: 'Argentino',    height: 183, weight: 79 },
      { team_id: 12, name: 'Federico Chiesa',       position: 'Delantero',      number: 7,  nationality: 'Italiano',     height: 175, weight: 69 },
      { team_id: 12, name: 'Dušan Vlahović',        position: 'Delantero',      number: 9,  nationality: 'Serbio',       height: 190, weight: 83 },
      { team_id: 12, name: 'Kenan Yıldız',          position: 'Delantero',      number: 10, nationality: 'Turco',        height: 183, weight: 74 },
      // ─ Tigres FC ─
      { team_id: 13, name: 'Carlos Varela',         position: 'Portero',        number: 1,  nationality: 'Colombiano',   height: 189, weight: 83 },
      { team_id: 13, name: 'Sebastián Torres',      position: 'Defensa',        number: 2,  nationality: 'Colombiano',   height: 179, weight: 75 },
      { team_id: 13, name: 'Miguel Parra',          position: 'Defensa',        number: 4,  nationality: 'Colombiano',   height: 183, weight: 78 },
      { team_id: 13, name: 'Andrés Mosquera',       position: 'Defensa',        number: 5,  nationality: 'Colombiano',   height: 185, weight: 80 },
      { team_id: 13, name: 'Juan Camilo Reyes',     position: 'Defensa',        number: 3,  nationality: 'Colombiano',   height: 177, weight: 73 },
      { team_id: 13, name: 'Felipe Rodríguez',      position: 'Centrocampista', number: 8,  nationality: 'Colombiano',   height: 178, weight: 72 },
      { team_id: 13, name: 'Mateo Gaviria',         position: 'Centrocampista', number: 10, nationality: 'Colombiano',   height: 175, weight: 68 },
      { team_id: 13, name: 'Diego Herrera',         position: 'Centrocampista', number: 6,  nationality: 'Colombiano',   height: 180, weight: 74 },
      { team_id: 13, name: 'Cristian López',        position: 'Delantero',      number: 9,  nationality: 'Colombiano',   height: 181, weight: 75 },
      { team_id: 13, name: 'Andrés Cardona',        position: 'Delantero',      number: 11, nationality: 'Colombiano',   height: 176, weight: 71 },
      { team_id: 13, name: 'Santiago Díaz',         position: 'Delantero',      number: 7,  nationality: 'Colombiano',   height: 182, weight: 74 },
    ]
    await queryInterface.bulkInsert('players', players.map(p => ({
      ...p, photo_path: null, created_at: new Date(), updated_at: new Date(),
    })))

    // ── PARTIDOS (IDs 1-20) ───────────────────────────────────────────────────
    const d = (daysAgo) => new Date(Date.now() - daysAgo * 86400000)
    const f = (daysAhead) => new Date(Date.now() + daysAhead * 86400000)
    const matches = [
      // Terminados
      { home_team_id: 2,  away_team_id: 1,  league_id: 1,    stadium_id: 1,  match_date: d(30), status: 'finished',  home_score: 2, away_score: 1 }, // 1  RM vs BCN
      { home_team_id: 1,  away_team_id: 3,  league_id: 1,    stadium_id: 2,  match_date: d(24), status: 'finished',  home_score: 3, away_score: 1 }, // 2  BCN vs ATM
      { home_team_id: 3,  away_team_id: 2,  league_id: 1,    stadium_id: 3,  match_date: d(18), status: 'finished',  home_score: 1, away_score: 1 }, // 3  ATM vs RM
      { home_team_id: 4,  away_team_id: 5,  league_id: 2,    stadium_id: 4,  match_date: d(28), status: 'finished',  home_score: 1, away_score: 2 }, // 4  MU vs LIV
      { home_team_id: 5,  away_team_id: 6,  league_id: 2,    stadium_id: 5,  match_date: d(21), status: 'finished',  home_score: 3, away_score: 1 }, // 5  LIV vs CHE
      { home_team_id: 6,  away_team_id: 4,  league_id: 2,    stadium_id: 6,  match_date: d(14), status: 'finished',  home_score: 0, away_score: 1 }, // 6  CHE vs MU
      { home_team_id: 7,  away_team_id: 8,  league_id: 3,    stadium_id: 7,  match_date: d(25), status: 'finished',  home_score: 3, away_score: 2 }, // 7  BAY vs DOR
      { home_team_id: 8,  away_team_id: 7,  league_id: 3,    stadium_id: 8,  match_date: d(12), status: 'finished',  home_score: 1, away_score: 3 }, // 8  DOR vs BAY
      { home_team_id: 9,  away_team_id: 10, league_id: 4,    stadium_id: 9,  match_date: d(20), status: 'finished',  home_score: 2, away_score: 0 }, // 9  INT vs MIL
      { home_team_id: 12, away_team_id: 9,  league_id: 4,    stadium_id: 10, match_date: d(15), status: 'finished',  home_score: 1, away_score: 2 }, // 10 JUV vs INT
      { home_team_id: 10, away_team_id: 12, league_id: 4,    stadium_id: 9,  match_date: d(10), status: 'finished',  home_score: 2, away_score: 1 }, // 11 MIL vs JUV
      { home_team_id: 11, away_team_id: 6,  league_id: null, stadium_id: 11, match_date: d(22), status: 'finished',  home_score: 2, away_score: 1 }, // 12 PSG vs CHE (CL)
      { home_team_id: 2,  away_team_id: 7,  league_id: null, stadium_id: 1,  match_date: d(16), status: 'finished',  home_score: 1, away_score: 0 }, // 13 RM vs BAY (CL)
      { home_team_id: 1,  away_team_id: 11, league_id: null, stadium_id: 2,  match_date: d(8),  status: 'finished',  home_score: 3, away_score: 2 }, // 14 BCN vs PSG (CL)
      { home_team_id: 13, away_team_id: 9,  league_id: 6,    stadium_id: 12, match_date: d(5),  status: 'finished',  home_score: 0, away_score: 2 }, // 15 TIG vs INT
      // Programados
      { home_team_id: 1,  away_team_id: 2,  league_id: 1,    stadium_id: 2,  match_date: f(7),  status: 'scheduled', home_score: 0, away_score: 0 }, // 16 BCN vs RM
      { home_team_id: 5,  away_team_id: 4,  league_id: 2,    stadium_id: 5,  match_date: f(10), status: 'scheduled', home_score: 0, away_score: 0 }, // 17 LIV vs MU
      { home_team_id: 7,  away_team_id: 9,  league_id: null, stadium_id: 7,  match_date: f(14), status: 'scheduled', home_score: 0, away_score: 0 }, // 18 BAY vs INT
      { home_team_id: 11, away_team_id: 2,  league_id: null, stadium_id: 11, match_date: f(18), status: 'scheduled', home_score: 0, away_score: 0 }, // 19 PSG vs RM
      { home_team_id: 13, away_team_id: 1,  league_id: 6,    stadium_id: 12, match_date: f(21), status: 'scheduled', home_score: 0, away_score: 0 }, // 20 TIG vs BCN
    ]
    await queryInterface.bulkInsert('matches', matches.map(m => ({ ...m, created_at: new Date(), updated_at: new Date() })))

    // ── EVENTOS DE PARTIDO (69 eventos) ─────────────────────────────────────────
    // Referencia de player_ids por nombre:
    //  Lewandowski=10, Araújo=3, Gavi=6, Pedri=7, Raphinha=11 (BCN)
    //  Vinicius=21, Bellingham=19, Modrić=17, Carvajal=13, Tchouaméni=18, Militão=14 (RM)
    //  Griezmann=32, Koke=28, Giménez=25, Morata=33 (ATM)
    //  Rashford=42, Fernandes=39, Casemiro=40, Maguire=36 (MU)
    //  Salah=52, Núñez=53, Van Dijk=46, Mac Allister=49 (LIV)
    //  Palmer=61, Caicedo=59, James=55, Fernández(E)=60 (CHE)
    //  Kane=73, Musiala=70, Sané=72, Kimmich=65, Upamecano=66 (BAY)
    //  Adeyemi=83, Haller=84, Süle=77, Can=80, Brandt=82 (DOR)
    //  Thuram=94, Lautaro=95, Barella=91, Çalhanoğlu=92 (INT)
    //  Leão=105, Giroud=106, Loftus-Cheek=104, Bennacer=103, Calabria=98, Gatti=122... wait
    //  Maignan=97, Calabria=98, Bennacer=103, Loftus-Cheek=104, Leão=105, Giroud=106 (MIL)
    //  Donnarumma=108, Hakimi=109, Marquinhos=110, Vitinha=113, Dembélé=116, Mbappé=117 (PSG)
    //  Szczęsny=119, Locatelli=124, Gatti=122, Vlahović=128, Yıldız=129 (JUV)
    //  Varela=130, Gaviria=136, Herrera=137, Mosquera=133 (TIG)

    const events = [
      // Match 1: Real Madrid 2-1 Barcelona
      { match_id: 1,  event_type: 'goal',        player_id: 21,  team_id: 2,  minute: 23, description: 'Vinicius Jr. anota tras un contragolpe' },
      { match_id: 1,  event_type: 'yellow_card', player_id: 3,   team_id: 1,  minute: 45, description: 'Tarjeta amarilla a Araújo' },
      { match_id: 1,  event_type: 'goal',        player_id: 19,  team_id: 2,  minute: 67, description: 'Bellingham de cabeza' },
      { match_id: 1,  event_type: 'yellow_card', player_id: 17,  team_id: 2,  minute: 72, description: 'Tarjeta amarilla a Modrić' },
      { match_id: 1,  event_type: 'goal',        player_id: 10,  team_id: 1,  minute: 89, description: 'Lewandowski desde el punto penal' },
      // Match 2: Barcelona 3-1 Atlético Madrid
      { match_id: 2,  event_type: 'goal',        player_id: 10,  team_id: 1,  minute: 8,  description: 'Lewandowski de volea' },
      { match_id: 2,  event_type: 'goal',        player_id: 10,  team_id: 1,  minute: 45, description: 'Lewandowski doblete antes del descanso' },
      { match_id: 2,  event_type: 'yellow_card', player_id: 28,  team_id: 3,  minute: 55, description: 'Tarjeta amarilla a Koke' },
      { match_id: 2,  event_type: 'goal',        player_id: 11,  team_id: 1,  minute: 67, description: 'Raphinha de zurda' },
      { match_id: 2,  event_type: 'goal',        player_id: 32,  team_id: 3,  minute: 78, description: 'Griezmann descuenta para el Atlético' },
      // Match 3: Atlético Madrid 1-1 Real Madrid
      { match_id: 3,  event_type: 'goal',        player_id: 32,  team_id: 3,  minute: 34, description: 'Griezmann aprovecha un error defensivo' },
      { match_id: 3,  event_type: 'yellow_card', player_id: 25,  team_id: 3,  minute: 40, description: 'Tarjeta amarilla a Giménez' },
      { match_id: 3,  event_type: 'goal',        player_id: 21,  team_id: 2,  minute: 82, description: 'Vinicius Jr. iguala el marcador' },
      { match_id: 3,  event_type: 'yellow_card', player_id: 13,  team_id: 2,  minute: 90, description: 'Tarjeta amarilla a Carvajal' },
      // Match 4: Manchester United 1-2 Liverpool
      { match_id: 4,  event_type: 'goal',        player_id: 52,  team_id: 5,  minute: 12, description: 'Salah abre el marcador con un golazo' },
      { match_id: 4,  event_type: 'goal',        player_id: 42,  team_id: 4,  minute: 56, description: 'Rashford empata para el United' },
      { match_id: 4,  event_type: 'yellow_card', player_id: 40,  team_id: 4,  minute: 67, description: 'Tarjeta amarilla a Casemiro' },
      { match_id: 4,  event_type: 'goal',        player_id: 53,  team_id: 5,  minute: 73, description: 'Darwin Núñez da la victoria al Liverpool' },
      // Match 5: Liverpool 3-1 Chelsea
      { match_id: 5,  event_type: 'goal',        player_id: 52,  team_id: 5,  minute: 9,  description: 'Salah tempranero' },
      { match_id: 5,  event_type: 'goal',        player_id: 52,  team_id: 5,  minute: 45, description: 'Salah doblete' },
      { match_id: 5,  event_type: 'yellow_card', player_id: 59,  team_id: 6,  minute: 55, description: 'Tarjeta amarilla a Caicedo' },
      { match_id: 5,  event_type: 'goal',        player_id: 53,  team_id: 5,  minute: 77, description: 'Núñez sentencia en Anfield' },
      { match_id: 5,  event_type: 'goal',        player_id: 61,  team_id: 6,  minute: 82, description: 'Palmer descontó para el Chelsea' },
      // Match 6: Chelsea 0-1 Manchester United
      { match_id: 6,  event_type: 'yellow_card', player_id: 60,  team_id: 6,  minute: 38, description: 'Tarjeta amarilla a Enzo Fernández' },
      { match_id: 6,  event_type: 'goal',        player_id: 42,  team_id: 4,  minute: 61, description: 'Rashford de contraataque' },
      { match_id: 6,  event_type: 'yellow_card', player_id: 39,  team_id: 4,  minute: 90, description: 'Tarjeta amarilla a Bruno Fernandes' },
      // Match 7: Bayern Munich 3-2 Borussia Dortmund
      { match_id: 7,  event_type: 'goal',        player_id: 73,  team_id: 7,  minute: 15, description: 'Kane remata a la media vuelta' },
      { match_id: 7,  event_type: 'goal',        player_id: 73,  team_id: 7,  minute: 34, description: 'Kane doblete' },
      { match_id: 7,  event_type: 'yellow_card', player_id: 77,  team_id: 8,  minute: 45, description: 'Tarjeta amarilla a Süle' },
      { match_id: 7,  event_type: 'goal',        player_id: 84,  team_id: 8,  minute: 56, description: 'Haller acorta distancias' },
      { match_id: 7,  event_type: 'goal',        player_id: 70,  team_id: 7,  minute: 78, description: 'Musiala sentencia con un golazo' },
      { match_id: 7,  event_type: 'goal',        player_id: 83,  team_id: 8,  minute: 88, description: 'Adeyemi recorta al final' },
      // Match 8: Borussia Dortmund 1-3 Bayern Munich
      { match_id: 8,  event_type: 'goal',        player_id: 73,  team_id: 7,  minute: 22, description: 'Kane anota en Signal Iduna Park' },
      { match_id: 8,  event_type: 'goal',        player_id: 72,  team_id: 7,  minute: 49, description: 'Sané amplia ventaja' },
      { match_id: 8,  event_type: 'goal',        player_id: 83,  team_id: 8,  minute: 61, description: 'Adeyemi da esperanzas al Dortmund' },
      { match_id: 8,  event_type: 'yellow_card', player_id: 80,  team_id: 8,  minute: 70, description: 'Tarjeta amarilla a Emre Can' },
      { match_id: 8,  event_type: 'goal',        player_id: 73,  team_id: 7,  minute: 83, description: 'Kane sella su hat-trick' },
      { match_id: 8,  event_type: 'yellow_card', player_id: 65,  team_id: 7,  minute: 85, description: 'Tarjeta amarilla a Kimmich' },
      // Match 9: Inter Milan 2-0 AC Milan
      { match_id: 9,  event_type: 'goal',        player_id: 94,  team_id: 9,  minute: 31, description: 'Thuram anota en el Derby della Madonnina' },
      { match_id: 9,  event_type: 'yellow_card', player_id: 103, team_id: 10, minute: 45, description: 'Tarjeta amarilla a Bennacer' },
      { match_id: 9,  event_type: 'goal',        player_id: 95,  team_id: 9,  minute: 67, description: 'Lautaro sentencia el derby' },
      { match_id: 9,  event_type: 'yellow_card', player_id: 98,  team_id: 10, minute: 78, description: 'Tarjeta amarilla a Calabria' },
      // Match 10: Juventus 1-2 Inter Milan
      { match_id: 10, event_type: 'goal',        player_id: 128, team_id: 12, minute: 8,  description: 'Vlahović abre el marcador en la Juventus' },
      { match_id: 10, event_type: 'yellow_card', player_id: 124, team_id: 12, minute: 40, description: 'Tarjeta amarilla a Locatelli' },
      { match_id: 10, event_type: 'goal',        player_id: 94,  team_id: 9,  minute: 55, description: 'Thuram empata para el Inter' },
      { match_id: 10, event_type: 'yellow_card', player_id: 92,  team_id: 9,  minute: 77, description: 'Tarjeta amarilla a Çalhanoğlu' },
      { match_id: 10, event_type: 'goal',        player_id: 91,  team_id: 9,  minute: 89, description: 'Barella da la victoria al Inter en el final' },
      // Match 11: AC Milan 2-1 Juventus
      { match_id: 11, event_type: 'goal',        player_id: 105, team_id: 10, minute: 23, description: 'Rafael Leão abre el marcador' },
      { match_id: 11, event_type: 'goal',        player_id: 128, team_id: 12, minute: 45, description: 'Vlahović iguala antes del descanso' },
      { match_id: 11, event_type: 'yellow_card', player_id: 104, team_id: 10, minute: 55, description: 'Tarjeta amarilla a Loftus-Cheek' },
      { match_id: 11, event_type: 'red_card',    player_id: 122, team_id: 12, minute: 68, description: 'Expulsión de Gatti por doble amarilla' },
      { match_id: 11, event_type: 'goal',        player_id: 106, team_id: 10, minute: 71, description: 'Giroud aprovecha la superioridad numérica' },
      // Match 12: PSG 2-1 Chelsea
      { match_id: 12, event_type: 'goal',        player_id: 117, team_id: 11, minute: 34, description: 'Mbappé con un derechazo imparable' },
      { match_id: 12, event_type: 'goal',        player_id: 61,  team_id: 6,  minute: 56, description: 'Palmer empata de media distancia' },
      { match_id: 12, event_type: 'yellow_card', player_id: 55,  team_id: 6,  minute: 67, description: 'Tarjeta amarilla a Reece James' },
      { match_id: 12, event_type: 'goal',        player_id: 116, team_id: 11, minute: 82, description: 'Dembélé define con clase' },
      // Match 13: Real Madrid 1-0 Bayern Munich
      { match_id: 13, event_type: 'yellow_card', player_id: 66,  team_id: 7,  minute: 45, description: 'Tarjeta amarilla a Upamecano' },
      { match_id: 13, event_type: 'goal',        player_id: 19,  team_id: 2,  minute: 77, description: 'Bellingham decide en el Bernabéu' },
      { match_id: 13, event_type: 'yellow_card', player_id: 18,  team_id: 2,  minute: 89, description: 'Tarjeta amarilla a Tchouaméni' },
      // Match 14: Barcelona 3-2 PSG
      { match_id: 14, event_type: 'goal',        player_id: 10,  team_id: 1,  minute: 12, description: 'Lewandowski abre el marcador' },
      { match_id: 14, event_type: 'goal',        player_id: 117, team_id: 11, minute: 34, description: 'Mbappé empata para el PSG' },
      { match_id: 14, event_type: 'yellow_card', player_id: 110, team_id: 11, minute: 55, description: 'Tarjeta amarilla a Marquinhos' },
      { match_id: 14, event_type: 'goal',        player_id: 7,   team_id: 1,  minute: 56, description: 'Pedri pone el 2-1' },
      { match_id: 14, event_type: 'goal',        player_id: 116, team_id: 11, minute: 67, description: 'Dembélé empata de nuevo' },
      { match_id: 14, event_type: 'goal',        player_id: 11,  team_id: 1,  minute: 90, description: 'Raphinha hace el 3-2 en tiempo de descuento' },
      // Match 15: Tigres FC 0-2 Inter Milan
      { match_id: 15, event_type: 'goal',        player_id: 95,  team_id: 9,  minute: 38, description: 'Lautaro anota en El Campín' },
      { match_id: 15, event_type: 'yellow_card', player_id: 136, team_id: 13, minute: 55, description: 'Tarjeta amarilla a Gaviria' },
      { match_id: 15, event_type: 'goal',        player_id: 94,  team_id: 9,  minute: 71, description: 'Thuram sella la victoria del Inter' },
      { match_id: 15, event_type: 'yellow_card', player_id: 91,  team_id: 9,  minute: 78, description: 'Tarjeta amarilla a Barella' },
    ]
    await queryInterface.bulkInsert('match_events', events.map(e => ({ ...e, created_at: new Date(), updated_at: new Date() })))

    console.info(`[Seeder] ✓ ${players.length} jugadores, ${matches.length} partidos, ${events.length} eventos`)
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    await queryInterface.sequelize.query('TRUNCATE TABLE match_events')
    await queryInterface.sequelize.query('TRUNCATE TABLE matches')
    await queryInterface.sequelize.query('TRUNCATE TABLE players')
    await queryInterface.sequelize.query('TRUNCATE TABLE teams')
    await queryInterface.sequelize.query('TRUNCATE TABLE stadiums')
    await queryInterface.sequelize.query('TRUNCATE TABLE leagues')
    await queryInterface.sequelize.query('TRUNCATE TABLE users')
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  },
}
