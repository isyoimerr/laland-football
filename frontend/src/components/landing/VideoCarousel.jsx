import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const VIDEOS = [
  {
    src: '/assets/VIDEOS/Clasicos/Barcelona_vs_Real_Madrid_2020.mp4',
    title: 'Barcelona vs Real Madrid',
    subtitle: 'LaLiga · 2020',
    category: 'Clásico',
    color: '#3b82f6',
  },
  {
    src: '/assets/VIDEOS/Highlights/Bayern_vs_Dortmund_Bundesliga.mp4',
    title: 'Bayern vs Dortmund',
    subtitle: 'Bundesliga · Temporada',
    category: 'Highlights',
    color: '#f59e0b',
  },
  {
    src: '/assets/VIDEOS/Highlights/Tottenham_vs_Liverpool_UCL_Final.mp4',
    title: 'Tottenham vs Liverpool',
    subtitle: 'UCL Final',
    category: 'Highlights',
    color: '#ef4444',
  },
  {
    src: '/assets/VIDEOS/Goles/Cristiano_Ronaldo_Goals_2020-2021.mp4',
    title: 'Cristiano Ronaldo',
    subtitle: 'Goles 2020/21',
    category: 'Goles',
    color: '#00d4a1',
  },
  {
    src: '/assets/VIDEOS/Goles/Mohamed_Salah_UCL_Goals.mp4',
    title: 'Mohamed Salah',
    subtitle: 'UCL Goals',
    category: 'Goles',
    color: '#a855f7',
  },
  {
    src: '/assets/VIDEOS/Skills/Messi_Dribbling_Skills.mp4',
    title: 'Messi',
    subtitle: 'Dribbling Skills',
    category: 'Skills',
    color: '#f97316',
  },
  {
    src: '/assets/VIDEOS/Skills/Neymar_Dribbling_Skills.mp4',
    title: 'Neymar Jr',
    subtitle: 'Dribbling Skills',
    category: 'Skills',
    color: '#06b6d4',
  },
  {
    src: '/assets/VIDEOS/Skills/Lamine_Yamal_Clips.mp4',
    title: 'Lamine Yamal',
    subtitle: 'Clips',
    category: 'Skills',
    color: '#ec4899',
  },
]

function VideoCard({ video, index, isActive, onClick }) {
  const videoRef = useRef(null)
  const [hovering, setHovering] = useState(false)

  const handleMouseEnter = () => {
    setHovering(true)
    videoRef.current?.play().catch(() => {})
  }

  const handleMouseLeave = () => {
    setHovering(false)
    videoRef.current?.pause()
    if (videoRef.current) videoRef.current.currentTime = 0
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex-shrink-0 w-[280px] sm:w-[320px] aspect-video rounded-2xl overflow-hidden border border-border-light group cursor-pointer text-left"
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      >
        <source src={video.src} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-transform duration-300 group-hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-0.5">
            <polygon points="8,5 19,12 8,19" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span
          className="inline-block text-2xs font-bold tracking-widest uppercase mb-1.5 px-2 py-0.5 rounded"
          style={{ background: `${video.color}20`, color: video.color }}
        >
          {video.category}
        </span>
        <h3 className="text-sm font-bold text-white leading-tight">{video.title}</h3>
        <p className="text-2xs text-white/60 mt-0.5">{video.subtitle}</p>
      </div>
    </motion.button>
  )
}

export default function VideoCarousel() {
  const scrollRef = useRef(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  const scroll = (dir) => {
    if (!scrollRef.current) return
    const amount = 340
    scrollRef.current.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    dragStart.current = {
      x: e.pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - dragStart.current.x) * 1.5
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - walk
  }

  const handleMouseUp = () => setIsDragging(false)

  return (
    <section className="py-24 px-4 bg-bg-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-end justify-between mb-10 px-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-accent-green text-xs font-bold tracking-widest uppercase mb-2">
              Videos destacados
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary">
              Momentos que <span className="text-accent-green">importan</span>
            </h2>
            <p className="text-text-secondary text-sm mt-1.5 max-w-md">
              Deslizá para explorar los mejores momentos del fútbol mundial
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-border-light hover:bg-bg-tertiary flex items-center justify-center transition-colors text-text-secondary hover:text-text-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-border-light hover:bg-bg-tertiary flex items-center justify-center transition-colors text-text-secondary hover:text-text-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        </motion.div>

        <div className="relative">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {VIDEOS.map((v, i) => (
              <VideoCard
                key={v.title}
                video={v}
                index={i}
                isActive={selectedVideo === v.src}
                onClick={() => setSelectedVideo(v.src === selectedVideo ? null : v.src)}
              />
            ))}
          </div>

          <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none" />
        </div>

        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl overflow-hidden border border-border bg-bg-secondary"
          >
            <div className="relative">
              <video
                className="w-full aspect-video max-h-[500px] object-contain bg-black"
                controls
                autoPlay
                muted
                playsInline
              >
                <source src={selectedVideo} type="video/mp4" />
              </video>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
