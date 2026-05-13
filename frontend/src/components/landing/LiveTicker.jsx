import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { connectSocket } from '@services/socket'

const TICKER_MATCHES = [
  { home: 'Real Madrid', away: 'Man City', score: '2–1', live: true, min: "73'" },
  { home: 'Barcelona', away: 'PSG', score: '1–1', live: true, min: "58'" },
  { home: 'Bayern', away: 'Dortmund', score: '3–0', live: true, min: "88'" },
  { home: 'Arsenal', away: 'Chelsea', score: '0–0', live: true, min: "22'" },
  { home: 'Liverpool', away: 'Atlético', score: '2–2', live: true, min: "67'" },
  { home: 'Juventus', away: 'Inter', score: '1–0', live: false, time: '20:45' },
  { home: 'Milan', away: 'Roma', score: '–', live: false, time: '22:00' },
  { home: 'Napoli', away: 'Lazio', score: '–', live: false, time: '19:30' },
]

function TickerItem({ match }) {
  return (
    <div className="flex items-center gap-3 px-4 py-1.5 border-r border-border shrink-0">
      {match.live ? (
        <span className="flex items-center gap-1 text-accent-red text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
          {match.min}
        </span>
      ) : (
        <span className="text-text-muted text-xs">{match.time}</span>
      )}
      <span className="text-text-secondary text-xs whitespace-nowrap">{match.home}</span>
      <span
        className="text-xs font-bold px-2 py-0.5 rounded"
        style={
          match.live
            ? { background: 'rgba(0,212,161,0.1)', color: '#00d4a1' }
            : { color: '#9ca3af' }
        }
      >
        {match.score}
      </span>
      <span className="text-text-secondary text-xs whitespace-nowrap">{match.away}</span>
    </div>
  )
}

export default function LiveTicker() {
  const [liveUpdates, setLiveUpdates] = useState([])

  useEffect(() => {
    const socket = connectSocket()
    if (socket) {
      socket.on('ticker:update', (data) => {
        setLiveUpdates(prev => {
          const next = [{ ...data, id: Date.now() }, ...prev]
          return next.slice(0, 5)
        })
        setTimeout(() => {
          setLiveUpdates(prev => prev.filter(u => u.id !== Date.now()))
        }, 6000)
      })
    }
    return () => {
      if (socket) socket.off('ticker:update')
    }
  }, [])

  const doubled = [...TICKER_MATCHES, ...TICKER_MATCHES]

  return (
    <div className="relative bg-bg-secondary border-y border-border overflow-hidden py-2">
      <div
        className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-3 gap-2"
        style={{ background: 'linear-gradient(to right, #111827 60%, transparent)' }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
          <span className="text-xs font-bold text-accent-red tracking-widest uppercase">EN VIVO</span>
        </span>
      </div>

      {liveUpdates.length > 0 && (
        <div className="absolute top-0 left-24 right-4 z-20 flex gap-2 overflow-x-auto">
          {liveUpdates.map(update => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-2xs bg-accent-green/10 border border-accent-green/30 px-2 py-1 rounded whitespace-nowrap text-accent-green"
            >
              {update.description}
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex" style={{ paddingLeft: '90px' }}>
        <motion.div
          className="flex"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {doubled.map((match, i) => (
            <TickerItem key={i} match={match} />
          ))}
        </motion.div>
      </div>

      <div
        className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #111827, transparent)' }}
      />
    </div>
  )
}
