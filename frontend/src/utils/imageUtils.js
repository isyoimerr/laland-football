const ASSETS_BASE = '/assets';

export const resolveAssetPath = (path) => {
  if (!path) return null;
  if (path.startsWith('/assets/')) return path;
  if (path.startsWith('assets/')) return `/${path}`;
  if (path.startsWith('/LALAND_FOOTBALL_ASSETS/')) {
    return path.replace('/LALAND_FOOTBALL_ASSETS/', '/assets/');
  }
  if (!path.startsWith('/')) return `/assets/${path}`;
  return path;
};

export const getTeamLogoPath = (teamName) => {
  if (!teamName) return null;
  return null;
};

export const getTeamBackgroundPath = (teamName) => {
  if (!teamName) return null;
  const normalized = teamName.replace(/\s+/g, '_');
  return `${ASSETS_BASE}/EQUIPOS/${normalized}/fondo.jpg`;
};

export const getTeamInitials = (teamName) => {
  if (!teamName) return '';
  const words = teamName.split(' ').filter(w => /^[A-Z]/.test(w));
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return teamName.slice(0, 2).toUpperCase();
};

const PLAYER_FALLBACKS = [
  '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Jugador_01_accion.webp',
  '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Jugador_02_perfil.png',
  '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Jugador_03_celebracion.png',
  '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Jugador_04_tiro.png',
];

export const getPlayerPhotoPath = (name) => {
  if (!name) return PLAYER_FALLBACKS[0];
  const index = Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % PLAYER_FALLBACKS.length;
  return PLAYER_FALLBACKS[index];
};

const STADIUM_FALLBACKS = [
  '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Estadio_01_panoramica.webp',
  '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Estadio_02_interior.webp',
  '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Estadio_03_nocturno.webp',
];

export const getStadiumPhotoPath = (name) => {
  if (!name) return STADIUM_FALLBACKS[0];
  const index = Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % STADIUM_FALLBACKS.length;
  return STADIUM_FALLBACKS[index];
};

export const getLeagueLogoPath = () => {
  return null;
};

export const getMatchStadiumImage = (stadiumName) => {
  if (!stadiumName) return null;
  return `${ASSETS_BASE}/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Estadio_01_panoramica.webp`;
};
