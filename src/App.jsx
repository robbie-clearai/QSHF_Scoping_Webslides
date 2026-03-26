import { useRef } from 'react'
import QSHFPitchDeck from './qshf-pitch-deck'

export default function App() {
  const pitchDeckRef = useRef(null)

  return (
    <div style={{ fontFamily: "'Thorndale AMT Regular', 'Thorndale AMT', 'Times New Roman', serif", background: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        height: '52px',
        background: '#22190C',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ color: '#F4F0ED', fontSize: '14px', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Proposal by <img src={`${import.meta.env.BASE_URL}clearai-logo.png`} alt="ClearAI" style={{ height: '14px', verticalAlign: 'middle' }} />
        </div>
      </div>
      <QSHFPitchDeck ref={pitchDeckRef} />
    </div>
  )
}
