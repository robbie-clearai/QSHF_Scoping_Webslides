import { useState, useRef, useCallback } from 'react'
import QSHFPitchDeck from './qshf-pitch-deck'

export default function App() {
  const [pdfExporting, setPdfExporting] = useState(false)
  const pitchDeckRef = useRef(null)

  const handleExportPDF = useCallback(async () => {
    if (!pitchDeckRef.current || pdfExporting) return
    setPdfExporting(true)
    try {
      await pitchDeckRef.current.exportPDF()
    } finally {
      setPdfExporting(false)
    }
  }, [pdfExporting])

  return (
    <div style={{ fontFamily: "'Thorndale AMT Regular', 'Thorndale AMT', 'Times New Roman', serif", background: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 24px',
        height: '52px',
        background: '#22190C',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ color: '#F4F0ED', fontWeight: 700, fontSize: '13px' }}>
          QSHF - Drafting Copy Agent
        </div>
        <div style={{ color: '#F4F0ED', fontSize: '14px', letterSpacing: '0.02em' }}>
          ClearAI Webslides
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleExportPDF}
            disabled={pdfExporting}
            style={{
              fontFamily: "'Thorndale AMT Regular', 'Thorndale AMT', 'Times New Roman', serif",
              fontSize: '13px',
              background: pdfExporting ? 'rgba(244,240,237,0.15)' : 'rgba(244,240,237,0.1)',
              color: '#F4F0ED',
              border: '1px solid rgba(244,240,237,0.35)',
              borderRadius: '4px',
              padding: '6px 16px',
              cursor: pdfExporting ? 'not-allowed' : 'pointer',
              opacity: pdfExporting ? 0.6 : 1,
            }}
          >
            {pdfExporting ? 'Exporting…' : 'Export PDF'}
          </button>
        </div>
      </div>
      <QSHFPitchDeck ref={pitchDeckRef} />
    </div>
  )
}
