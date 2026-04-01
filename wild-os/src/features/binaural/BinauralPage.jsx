import React, { useState, useEffect, useRef } from 'react'
import { Headphones, Zap } from 'lucide-react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import { Slider } from '@shared/ui/Slider'
import { InfoTooltip } from '@shared/ui/InfoTooltip'
import { WaveformCanvas } from './components/WaveformCanvas'
import { useAudio } from '@hooks/useAudio'

const BANDS = [
  { id: 'delta', label: 'Delta', hz: '0.5–4 Hz', desc: 'Deep dreamless sleep', color: '#a855f7', beatFreq: 2,
    tooltip: 'Delta waves (0.5–4 Hz) dominate in deep, dreamless sleep. Entraining to delta can deepen sleep stages and promote physical restoration.' },
  { id: 'theta', label: 'Theta', hz: '4–8 Hz', desc: 'REM / hypnagogic state', color: '#3b82f6', beatFreq: 6,
    tooltip: 'Theta waves (4–8 Hz) appear during REM sleep, the hypnagogic state, and deep meditation. Optimal for WILD entry and vivid dreaming.' },
  { id: 'alpha', label: 'Alpha', hz: '8–12 Hz', desc: 'Relaxed awareness', color: '#22c55e', beatFreq: 10,
    tooltip: 'Alpha waves (8–12 Hz) appear in relaxed, eyes-closed waking. Good for relaxation before sleep or light meditation.' },
  { id: 'beta', label: 'Beta', hz: '14–30 Hz', desc: 'Active cognition, alertness, focus', color: '#f59e0b', beatFreq: 18,
    tooltip: 'Beta waves (14–30 Hz) are present during active thinking, focus, and alertness. Use pre-session to sharpen awareness before a WILD attempt.' },
  { id: 'gamma', label: 'Gamma', hz: '30–100 Hz', desc: 'Peak awareness, insight, advanced states', color: '#ef4444', beatFreq: 40,
    tooltip: 'Gamma waves (30–100 Hz) are associated with peak cognitive performance, insight, and advanced meditative states. 40 Hz gamma is studied in consciousness research.' },
]

const ZHAARIC_LAYERS = [
  { label: 'Induction',     detail: '110 / 114 Hz',    beat: '4 Hz',    desc: 'Theta–delta boundary — lowest frequency that preserves consciousness', color: '#a855f7' },
  { label: 'Stabilization', detail: '220 / 227.83 Hz', beat: '7.83 Hz', desc: 'Schumann coherence anchor — prevents cognitive collapse', color: '#3b82f6' },
  { label: 'Awareness',     detail: '880 / 894 Hz',    beat: '14 Hz',   desc: 'Low-beta thread — minimum viable conscious signal', color: '#22c55e' },
  { label: 'Gamma Trigger', detail: '500 / 540 Hz',    beat: '40 Hz',   desc: 'Exit-event burst every 45s — simulates separation ignition', color: '#ef4444' },
  { label: 'AM Modulation', detail: '0.15 Hz LFO',     beat: '—',       desc: 'Breath-rate volume oscillation — recreates vibrational pre-exit signature', color: '#f59e0b' },
]

const MODE_TABS = [
  { id: 'bands',    label: 'Bands'    },
  { id: 'protocol', label: 'Protocol' },
]

export function BinauralContent() {
  const [mode, setMode] = useState('bands')
  const [selectedBand, setSelectedBand] = useState('theta')
  const [carrier, setCarrier] = useState(200)
  const [volume, setVolume] = useState(0.5)
  const [running, setRunning] = useState(false)
  const [zhaaricRunning, setZhaaricRunning] = useState(false)
  const [gammaBursts, setGammaBursts] = useState(0)
  const [gammaFlash, setGammaFlash] = useState(false)
  const flashTimer = useRef(null)
  const audio = useAudio()

  const currentBand = BANDS.find(b => b.id === selectedBand)

  // Gamma burst flash effect
  useEffect(() => {
    if (gammaBursts === 0) return
    setGammaFlash(true)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setGammaFlash(false), 1600)
  }, [gammaBursts])

  const handleBandToggle = async () => {
    if (!audio.ready) await audio.init()
    if (running) {
      audio.stopBinaural()
      setRunning(false)
    } else {
      if (zhaaricRunning) { audio.stopZhaaric(); setZhaaricRunning(false) }
      await audio.startBinaural(selectedBand, volume, carrier)
      setRunning(true)
    }
  }

  const handleBandVolumeChange = (v) => {
    setVolume(v)
    if (running) audio.setBinauralVolume(v)
    if (zhaaricRunning) audio.setZhaaricVolume(v)
  }

  const handleZhaaricToggle = async () => {
    if (!audio.ready) await audio.init()
    if (zhaaricRunning) {
      audio.stopZhaaric()
      setZhaaricRunning(false)
      setGammaBursts(0)
    } else {
      if (running) { audio.stopBinaural(); setRunning(false) }
      audio.onZhaaricGammaBurst((count) => setGammaBursts(count))
      await audio.startZhaaric(volume)
      setZhaaricRunning(true)
    }
  }

  const headphoneNotice = (
    <div className="flex items-center gap-2 bg-amber-900/20 border border-accent-amber/30 rounded-xl p-3 mb-6">
      <Headphones className="w-5 h-5 text-accent-amber shrink-0" />
      <p className="text-accent-amber text-xs">Headphones required — stereo separation is essential for binaural effect</p>
    </div>
  )

  return (
    <PageWrapper>
      <TierGate feature="binaural">
        {headphoneNotice}

        {/* Mode tabs */}
        <div className="flex gap-2 mb-6">
          {MODE_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${
                mode === t.id
                  ? 'bg-accent-gold/15 border-accent-gold/50 text-accent-gold'
                  : 'bg-bg-surface border-border text-text-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── BANDS MODE ─────────────────────────────────────────── */}
        {mode === 'bands' && (
          <>
            <h2 className="text-text-faint text-xs uppercase tracking-wider font-semibold mb-3">Brainwave Band</h2>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {BANDS.map(band => (
                <Card
                  key={band.id}
                  as="button"
                  onClick={() => {
                    setSelectedBand(band.id)
                    if (running) { audio.stopBinaural(); setRunning(false) }
                  }}
                  className={`p-4 text-left transition-all ${selectedBand === band.id ? 'border-border-subtle' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedBand === band.id ? band.color : '#525770' }} />
                      <div>
                        <p className="text-text-primary font-medium text-sm flex items-center">
                          {band.label}
                          <InfoTooltip text={band.tooltip} title={`${band.label} · ${band.hz}`} />
                        </p>
                        <p className="text-text-faint text-xs">{band.hz} · {band.desc}</p>
                      </div>
                    </div>
                    {selectedBand === band.id && <div className="w-2 h-2 rounded-full bg-accent-gold" />}
                  </div>
                </Card>
              ))}
            </div>

            <div className="mb-6">
              <WaveformCanvas isRunning={running} frequency={carrier} beatFreq={currentBand?.beatFreq || 6} />
            </div>

            <div className="flex flex-col gap-5 mb-6">
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-text-muted text-sm font-medium">Carrier Frequency</span>
                  <InfoTooltip
                    title="Carrier Frequency"
                    text="The carrier is the base pitch in each ear. The beat frequency is the difference between left and right ears."
                  />
                </div>
                <Slider value={carrier} min={100} max={400} step={5} onChange={(v) => {
                  setCarrier(v)
                  if (running) audio.setBinauralCarrier(v, selectedBand)
                }} />
                <p className="text-text-faint text-xs mt-1">{carrier} Hz base · {currentBand?.beatFreq} Hz beat</p>
              </div>
              <Slider label="Volume" value={volume} min={0} max={1} step={0.05} onChange={handleBandVolumeChange} />
            </div>

            <Button variant={running ? 'danger' : 'gold'} size="lg" fullWidth onClick={handleBandToggle} loading={audio.loading}>
              {running ? 'Stop' : 'Start Binaural'}
            </Button>

            {running && (
              <p className="text-accent-green text-xs text-center mt-3 animate-fade-in">
                ● Playing {currentBand?.label} — {carrier} Hz carrier · {currentBand?.beatFreq} Hz beat
              </p>
            )}
          </>
        )}

        {/* ── PROTOCOL MODE ──────────────────────────────────────── */}
        {mode === 'protocol' && (
          <>
            {/* Protocol header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display font-semibold text-text-primary">Zha'aric Lucidic Protocol v2</p>
              </div>
              <p className="text-text-muted text-xs leading-relaxed">
                Proven 5-layer frequency stack engineered to induce the theta–delta boundary state.
                Body enters sleep paralysis while awareness remains phase-coherent.
              </p>
            </div>

            {/* Layer breakdown */}
            <div className="flex flex-col gap-2 mb-5">
              {ZHAARIC_LAYERS.map((layer, i) => {
                const isGamma = i === 3
                const isActive = zhaaricRunning
                const isFlashing = isGamma && gammaFlash

                return (
                  <Card
                    key={layer.label}
                    className={`p-3 transition-all ${isFlashing ? 'border-red-500/60' : ''}`}
                    style={isFlashing ? { boxShadow: '0 0 16px rgba(239,68,68,0.35)' } : undefined}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status dot */}
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isActive ? 'animate-pulse' : ''}`}
                        style={{ backgroundColor: isActive ? layer.color : '#525770' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-text-primary text-sm font-medium">{layer.label}</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-text-faint text-xs font-mono">{layer.detail}</span>
                            {layer.beat !== '—' && (
                              <span
                                className="px-1.5 py-0.5 rounded text-xs font-mono font-semibold"
                                style={{ background: layer.color + '22', color: layer.color }}
                              >
                                {layer.beat}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-text-faint text-xs mt-0.5 leading-snug">{layer.desc}</p>
                        {isGamma && zhaaricRunning && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Zap
                              className="w-3 h-3"
                              style={{ color: gammaFlash ? '#ef4444' : '#525770' }}
                            />
                            <span className="text-text-faint text-xs">
                              {gammaBursts === 0 ? 'First burst at 10s' : `${gammaBursts} burst${gammaBursts > 1 ? 's' : ''} fired · next in ~${45 - ((Date.now() / 1000) % 45 | 0)}s`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <Slider label="Volume" value={volume} min={0} max={1} step={0.05} onChange={handleBandVolumeChange} className="mb-6" />

            <Button
              variant={zhaaricRunning ? 'danger' : 'gold'}
              size="lg"
              fullWidth
              onClick={handleZhaaricToggle}
              loading={audio.loading}
            >
              {zhaaricRunning ? 'Stop Protocol' : 'Initiate Zha\'aric Protocol'}
            </Button>

            {zhaaricRunning && (
              <p className="text-accent-green text-xs text-center mt-3 animate-fade-in">
                ● All 5 layers active — 0.15 Hz AM modulation · gamma bursts every 45s
              </p>
            )}
          </>
        )}
      </TierGate>
    </PageWrapper>
  )
}

export function BinauralPage() {
  return <AppShell title="Binaural Tones"><BinauralContent /></AppShell>
}
