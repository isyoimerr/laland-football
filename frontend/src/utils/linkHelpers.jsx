/**
 * Helper para generar links a páginas de detalle
 * Centralizado para evitar duplicación
 */

export const getDetailLink = (type, item) => {
  switch (type) {
    case 'team':
      return `/equipos/${item.id}`
    case 'league':
      return `/competiciones/${item.id}`
    case 'player':
      return `/jugadores/${item.id}`
    case 'match':
      return `/partidos/${item.id}`
    case 'stadium':
      return `/estadios/${item.id}`
    case 'coach':
      return `/entrenadores/${item.id}`
    default:
      return '#'
  }
}

export const renderNameAsLink = (item, type, navigate) => (
  <button
    onClick={() => navigate(getDetailLink(type, item))}
    className="text-accent-teal hover:text-accent-teal-light hover:underline transition font-semibold cursor-pointer"
  >
    {item.name}
  </button>
)
