const SOUNDS = {
  whistle: '/sounds/whistle.wav',
  goal: '/sounds/goal-cheer.wav',
  stadium: '/sounds/stadium-ambient.wav',
  kick: '/sounds/kick.wav',
}

const audioCache = {}

function getAudio(name) {
  if (!audioCache[name]) {
    const path = SOUNDS[name]
    if (!path) return null
    audioCache[name] = new Audio(path)
    audioCache[name].preload = 'auto'
  }
  return audioCache[name]
}

export function playSound(name, options = {}) {
  const { volume = 0.5, loop = false } = options
  try {
    const audio = getAudio(name)
    if (!audio) return
    const clone = audio.cloneNode()
    clone.volume = volume
    clone.loop = loop
    clone.play().catch(() => {})
    return clone
  } catch {}
}

export function playWhistle() {
  playSound('whistle', { volume: 0.3 })
}

export function playGoal() {
  playSound('goal', { volume: 0.5 })
}

export function playKick() {
  playSound('kick', { volume: 0.2 })
}

let ambientPlayer = null

export function startAmbient() {
  try {
    if (ambientPlayer) return
    const audio = new Audio(SOUNDS.stadium)
    audio.volume = 0.08
    audio.loop = true
    audio.play().catch(() => {})
    ambientPlayer = audio
  } catch {}
}

export function stopAmbient() {
  if (ambientPlayer) {
    ambientPlayer.pause()
    ambientPlayer.currentTime = 0
    ambientPlayer = null
  }
}
