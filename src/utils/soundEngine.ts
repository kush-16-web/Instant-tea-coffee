// Web Audio API Synthesizer - Sensory sound engine for premium tactile feedback

class SoundEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = false

  constructor() {
    // Retain initial preference if stored, default to false (respect user browser conventions)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gomzi_sound_enabled')
      this.enabled = saved === 'true'
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public toggle(): boolean {
    this.enabled = !this.enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('gomzi_sound_enabled', String(this.enabled))
    }
    if (this.enabled) {
      this.initCtx()
      this.playChime(520, 0.12)
    }
    return this.enabled
  }

  public setEnabled(val: boolean) {
    this.enabled = val
    if (typeof window !== 'undefined') {
      localStorage.setItem('gomzi_sound_enabled', String(this.enabled))
    }
    if (this.enabled) {
      this.initCtx()
    }
  }

  // Soft tactile click
  public playClick(freq = 600, duration = 0.04) {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + duration)

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + duration)
  }

  // Harmonic bell chime on chapter enter / bundle reveal
  public playChime(freq = 440, duration = 0.6) {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(freq, now)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(freq * 1.5, now)

    gain.gain.setValueAtTime(0.07, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + duration)
    osc2.stop(now + duration)
  }

  // Metallic foil crinkle sound when rotating or hovering 3D pouch
  public playFoilCrinkle() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const bufferSize = this.ctx.sampleRate * 0.08
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35))
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(2400 + Math.random() * 800, now)
    filter.Q.setValueAtTime(3.5, now)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
  }

  // Hot water pour / steam hiss
  public playSteamHiss(duration = 0.5) {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const bufferSize = Math.floor(this.ctx.sampleRate * duration)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1800, now)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
  }
}

export const sound = new SoundEngine()
