import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import api from '@services/api'

const GROUP_ORDER = ['team', 'league', 'player', 'coach', 'stadium']
const GROUP_LABELS = {
  team: 'Equipos',
  league: 'Competiciones',
  player: 'Jugadores',
  coach: 'Entrenadores',
  stadium: 'Estadios',
}
function TypeIcon({ type }) {
  const base = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'team':
      return <svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    case 'league':
      return <svg {...base}><path d="M8 21h8M12 17v4"/><path d="M7 4H4a1 1 0 0 0-1 1v2c0 3.3 2.7 6 6 6h6c3.3 0 6-2.7 6-6V5a1 1 0 0 0-1-1h-3"/><path d="M7 4V2h10v2"/></svg>
    case 'player':
      return <svg {...base}><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
    case 'coach':
      return <svg {...base}><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/><path d="M19 16l2 2-2 2"/></svg>
    case 'stadium':
      return <svg {...base}><rect x="2" y="10" width="20" height="11" rx="2"/><path d="M12 10V4"/><path d="M2 14h20"/><path d="M8 10V7M16 10V7"/></svg>
    default:
      return null
  }
}

export default function SearchBar({ className = '', onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ teams: [], leagues: [], players: [], coaches: [], stadiums: [] })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const ref = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const flatResults = useCallback(() => {
    const flat = []
    GROUP_ORDER.forEach(group => {
      const items = results[group] || []
      if (items.length > 0) {
        items.forEach(item => flat.push({ ...item, _group: group }))
      }
    })
    return flat
  }, [results])

  useEffect(() => {
    if (!query.trim()) {
      setResults({ teams: [], leagues: [], players: [], coaches: [], stadiums: [] })
      return
    }

    setSelectedIndex(-1)
    const q = query.trim()

    const search = async () => {
      try {
        setLoading(true)
        const [teams, leagues, players, coaches, stadiums] = await Promise.all([
          api.get(`/teams?search=${encodeURIComponent(q)}`).catch(() => ({ data: { data: { teams: [] } } })),
          api.get(`/leagues?search=${encodeURIComponent(q)}`).catch(() => ({ data: { data: { leagues: [] } } })),
          api.get(`/players?search=${encodeURIComponent(q)}`).catch(() => ({ data: { data: { players: [] } } })),
          api.get(`/coaches?search=${encodeURIComponent(q)}`).catch(() => ({ data: { data: { coaches: [] } } })),
          api.get('/stadiums').catch(() => ({ data: { data: { stadiums: [] } } })),
        ])

        const allStadiums = stadiums.data.data?.stadiums || stadiums.data.stadiums || []
        const filteredStadiums = allStadiums.filter(s =>
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          (s.city && s.city.toLowerCase().includes(q.toLowerCase()))
        )

        const extract = (res, key, type) => {
          const data = res.data.data?.[key] || res.data[key] || []
          return data.slice(0, 3).map(item => ({
            id: item.id,
            name: item.name,
            type,
            subtitle: type === 'team' ? item.League?.name : type === 'player' ? item.position : type === 'stadium' ? item.city : '',
          }))
        }

        setResults({
          teams: extract(teams, 'teams', 'team'),
          leagues: extract(leagues, 'leagues', 'league'),
          players: extract(players, 'players', 'player'),
          coaches: extract(coaches, 'coaches', 'coach'),
          stadiums: filteredStadiums.slice(0, 3).map(s => ({
            id: s.id,
            name: s.name,
            type: 'stadium',
            subtitle: s.city,
          })),
        })
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(search, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (item) => {
    const path = item.type === 'team' ? `/equipos/${item.id}`
      : item.type === 'league' ? `/competiciones/${item.id}`
      : item.type === 'player' ? `/jugadores/${item.id}`
      : item.type === 'coach' ? `/tecnicos/${item.id}`
      : item.type === 'stadium' ? `/estadios/${item.id}`
      : '#'
    navigate(path)
    setQuery('')
    setOpen(false)
    if (onSelect) onSelect(item)
  }

  const handleKeyDown = (e) => {
    const flat = flatResults()
    if (!open || flat.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < flat.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : flat.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < flat.length) {
          handleSelect(flat[selectedIndex])
        }
        break
      case 'Escape':
        setOpen(false)
        break
    }
  }

  const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar equipos, jugadores, ligas..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={handleKeyDown}
          className="input-base pl-9 pr-8 w-full"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-label="Buscar"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults({ teams: [], leagues: [], players: [], coaches: [], stadiums: [] }); inputRef.current?.focus() }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && query && (
        <div className="absolute top-full mt-2 w-full bg-bg-secondary border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {loading && (
            <div className="p-4 text-2xs text-text-muted text-center">Buscando...</div>
          )}

          {!loading && totalResults > 0 ? (
            <div className="py-2 max-h-80 overflow-y-auto" role="listbox">
              {GROUP_ORDER.map(group => {
                const items = results[group] || []
                if (items.length === 0) return null
                return (
                  <div key={group}>
                    <div className="px-4 py-1.5 text-2xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                      <TypeIcon type={group} />
                      {GROUP_LABELS[group]}
                    </div>
                    {items.map((item, i) => {
                      const flatIdx = flatResults().indexOf({ ...item, _group: group })
                      return (
                        <button
                          key={`${item.type}-${item.id}`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          role="option"
                          aria-selected={selectedIndex === flatIdx}
                          className={`w-full px-4 py-2 text-left text-sm transition flex items-center gap-3 ${
                            selectedIndex === flatIdx ? 'bg-accent-green/10 text-accent-green' : 'hover:bg-bg-tertiary text-text-primary'
                          }`}
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded bg-bg-tertiary flex items-center justify-center text-text-muted">
                            <TypeIcon type={item.type} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{item.name}</div>
                            {item.subtitle && (
                              <div className="text-2xs text-text-muted truncate">{item.subtitle}</div>
                            )}
                          </div>
                          <span className="text-2xs text-text-muted capitalize">{item.type}</span>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ) : !loading && (
            <div className="p-4 text-2xs text-text-muted text-center">
              No hay resultados para "<strong>{query}</strong>"
            </div>
          )}

          {!loading && totalResults > 0 && (
            <div className="px-4 py-2 border-t border-border text-2xs text-text-muted flex items-center justify-between">
              <span>{totalResults} resultado(s)</span>
              <span>↑↓ navegar · ↵ seleccionar</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
