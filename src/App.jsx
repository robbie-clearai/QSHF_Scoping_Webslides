import { useState, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import MaturityRadar from './maturity-radar'
import PrioritisationMatrix from './prioritisation-matrix'
import TechRadar from './tech-radar'
import SwimLaneRoadmap from './swim-lane-roadmap'

const visuals = [
  { id: 'radar', name: 'Maturity Radar', component: MaturityRadar },
  { id: 'matrix', name: '2x2 Prioritisation', component: PrioritisationMatrix },
  { id: 'tech', name: 'Technology Radar', component: TechRadar },
  { id: 'roadmap', name: 'Swim-Lane Roadmap', component: SwimLaneRoadmap },
]

export default function App() {
  const [active, setActive] = useState('radar')
  const [exporting, setExporting] = useState(false)
  const contentRef = useRef(null)
  const ActiveComponent = visuals.find(v => v.id === active)?.component
  const activeName = visuals.find(v => v.id === active)?.name || 'visual'

  const handleExport = useCallback(async () => {
    if (!contentRef.current || exporting) return
    setExporting(true)
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#F4F0ED',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `yajilarra-${active}-${new Date().toISOString().slice(0, 10)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }, [active, exporting])

  const handleExportSVG = useCallback(() => {
    if (!contentRef.current) return
    const svgEl = contentRef.current.querySelector('svg')
    if (!svgEl) return

    // Clone the SVG so we don't mutate the DOM
    const clone = svgEl.cloneNode(true)
    const viewBox = clone.getAttribute('viewBox')
    const [, , vbW, vbH] = (viewBox || '0 0 800 700').split(' ').map(Number)

    // Set explicit dimensions for Figma
    clone.setAttribute('width', vbW)
    clone.setAttribute('height', vbH)
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    // Add parchment background as first child
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bg.setAttribute('width', '100%')
    bg.setAttribute('height', '100%')
    bg.setAttribute('fill', '#F4F0ED')
    clone.insertBefore(bg, clone.firstChild)

    // Add font definitions so text renders correctly
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style')
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
    `
    defs.appendChild(styleEl)
    clone.insertBefore(defs, clone.firstChild)

    // Remove any interactive elements (hover zones, tooltips with pointerEvents)
    clone.querySelectorAll('[style*="pointer-events: none"]').forEach(el => el.remove())
    // Remove invisible hover zones
    clone.querySelectorAll('path[fill="transparent"]').forEach(el => el.remove())

    // Serialize
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(clone)
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.download = `yajilarra-${active}-${new Date().toISOString().slice(0, 10)}.svg`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }, [active])

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#F4F0ED', minHeight: '100vh' }}>
      <div style={{
        display: 'flex',
        gap: '2px',
        padding: '16px 24px',
        background: '#22190C',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        alignItems: 'center',
      }}>
        <div style={{ color: '#F4F0ED', fontWeight: 700, fontSize: '14px', marginRight: '24px', display: 'flex', alignItems: 'center' }}>
          Yajilarra AI Roadmap — Visuals
        </div>
        {visuals.map(v => (
          <button
            key={v.id}
            onClick={() => setActive(v.id)}
            style={{
              background: active === v.id ? '#834A33' : 'transparent',
              color: '#F4F0ED',
              border: active === v.id ? '1px solid #834A33' : '1px solid rgba(244,240,237,0.3)',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
              fontWeight: active === v.id ? 700 : 400,
              transition: 'all 0.2s',
            }}
          >
            {v.name}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <button
            onClick={handleExportSVG}
            style={{
              background: 'transparent',
              color: '#F4F0ED',
              border: '1px solid rgba(244,240,237,0.4)',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
              fontWeight: 700,
              transition: 'all 0.2s',
              letterSpacing: '0.5px',
            }}
          >
            Export SVG
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              background: exporting ? '#666' : '#FF4832',
              color: '#F4F0ED',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: exporting ? 'wait' : 'pointer',
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
              fontWeight: 700,
              transition: 'all 0.2s',
              letterSpacing: '0.5px',
            }}
          >
            {exporting ? 'Exporting...' : 'Export PNG'}
          </button>
        </div>
      </div>
      <div ref={contentRef} style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}
