import { useState, useRef, useEffect } from 'react'

export default function VideoPlayer({ src, poster, title, onEnded }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => { setCurrentTime(video.currentTime); setShowControls(true); clearTimeout(hideTimer.current); hideTimer.current = setTimeout(() => setShowControls(false), 3000) }
    const onLoadedMeta = () => setDuration(video.duration)
    const onEnd = () => { setPlaying(false); onEnded?.() }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onLoadedMeta)
    video.addEventListener('ended', onEnd)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', onLoadedMeta)
      video.removeEventListener('ended', onEnd)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [onEnded])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) { video.play() } else { video.pause() }
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (!video) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    video.currentTime = pct * duration
  }

  const toggleFullscreen = async () => {
    const el = videoRef.current?.parentElement
    if (!el) return
    if (!document.fullscreenElement) {
      await el.requestFullscreen()
      setFullscreen(true)
    } else {
      await document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div
      className="relative group bg-black rounded-xl overflow-hidden"
      onMouseEnter={() => { clearTimeout(hideTimer.current); setShowControls(true) }}
      onMouseLeave={() => { if (playing) hideTimer.current = setTimeout(() => setShowControls(false), 2000) }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          <div className="w-16 h-16 rounded-full bg-accent-green/90 flex items-center justify-center hover:bg-accent-green transition shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19" /></svg>
          </div>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-3 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {title && <p className="text-white text-xs font-semibold mb-2 truncate">{title}</p>}

        <div className="flex items-center gap-3">
          <div className="flex-1 relative h-1.5 bg-white/20 rounded-full cursor-pointer group/bar" onClick={handleSeek}>
            <div className="absolute left-0 top-0 h-full bg-accent-green rounded-full transition-all" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-green scale-0 group-hover/bar:scale-100 transition-transform" style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white hover:text-accent-green transition">
              {playing ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="8,5 19,12 8,19" /></svg>
              )}
            </button>

            <button onClick={() => { setMuted(!muted); if (videoRef.current) videoRef.current.muted = !muted }} className="text-white/80 hover:text-white transition">
              {muted || volume === 0 ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" /><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
              )}
            </button>

            <span className="text-white/70 text-2xs font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>

          <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
