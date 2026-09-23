import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export function AudioExperience() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const toggleSound = () => {
    if (!isPlaying) {
      // Initialize Web Audio API
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        audioCtxRef.current = new AudioContextClass()

        // Create warm pink noise generator (simulating cozy café air & gentle steam hum)
        const bufferSize = audioCtxRef.current.sampleRate * 2
        const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate)
        const output = buffer.getChannelData(0)
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          b0 = 0.99886 * b0 + white * 0.0555179
          b1 = 0.99332 * b1 + white * 0.0750759
          b2 = 0.96900 * b2 + white * 0.1538520
          b3 = 0.86650 * b3 + white * 0.3104856
          b4 = 0.55000 * b4 + white * 0.5329522
          b5 = -0.7616 * b5 - white * 0.0168980
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
          output[i] *= 0.015 // Very soft
          b6 = white * 0.115926
        }

        const whiteNoise = audioCtxRef.current.createBufferSource()
        whiteNoise.buffer = buffer
        whiteNoise.loop = true

        // Lowpass filter for deep warm acoustic atmosphere
        const filter = audioCtxRef.current.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 320

        const gainNode = audioCtxRef.current.createGain()
        gainNode.gain.setValueAtTime(0.001, audioCtxRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtxRef.current.currentTime + 1.5)

        whiteNoise.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(audioCtxRef.current.destination)

        gainNodeRef.current = gainNode
        whiteNoise.start(0)
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }

      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime)
        gainNodeRef.current.gain.linearRampToValueAtTime(0.2, audioCtxRef.current.currentTime + 1)
      }
      setIsPlaying(true)
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime)
        gainNodeRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.6)
      }
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  return (
    <button
      onClick={toggleSound}
      className="group flex items-center gap-2 rounded-full border border-[#f4ece1]/20 bg-[#160e0a]/80 px-3.5 py-1.5 backdrop-blur-md transition-all hover:border-[#c67d3b] hover:bg-[#20140e] text-[#f4ece1]/80 hover:text-[#f4ece1]"
      title={isPlaying ? 'Mute ambience' : 'Play slow brew atmosphere'}
      aria-label="Toggle ambient brew sound"
    >
      {isPlaying ? (
        <Volume2 className="h-3.5 w-3.5 text-[#c67d3b] animate-pulse" />
      ) : (
        <VolumeX className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
      )}
      <span className="font-mono text-[11px] uppercase tracking-widest hidden sm:inline">
        {isPlaying ? 'SOUND ON' : 'ATMOSPHERE'}
      </span>
    </button>
  )
}
