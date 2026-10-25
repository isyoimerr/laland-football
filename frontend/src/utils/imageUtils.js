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

export const getTeamBackgroundPath = () => {
  return null;
};

export const getTeamInitials = (teamName) => {
  if (!teamName) return '';
  const words = teamName.split(' ').filter(w => /^[A-Z]/.test(w));
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return teamName.slice(0, 2).toUpperCase();
};

export const getPlayerPhotoPath = () => {
  return null;
};

export const getStadiumPhotoPath = () => {
  return null;
};

export const getLeagueLogoPath = () => {
  return null;
};

export const getMatchStadiumImage = () => {
  return null;
};
