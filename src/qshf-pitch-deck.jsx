import { useState, useEffect } from 'react'
import calendarImg from './assets/calendar.png'
import solutionDemoImg from './assets/solution-demo.png'

const C = {
  parchment: '#F4F0ED',
  obsidian: '#22190C',
  clay: '#834A33',
  red: '#FF4832',
  lightClay: '#C9A494',
  mid: '#EAE4DE',
  white: '#FFFFFF',
}
const F = { main: "'Thorndale AMT Regular', 'Thorndale AMT', 'Times New Roman', serif" }
const TOTAL = 14

const DEFAULT_CALC = {
  annualSalary: 80000,
  hoursPerWeek: 37.5,
  superRate: 12,
  payrollTaxRate: 4.75,
  overheadRate: 30,
  drawingsPerWeek: 50,
  checkingHoursPerWeek: 37.5,
  draftingTimeNew: 10,
  draftingTimeCopy: 5,
  currentMatchRate: 20,
  sources: {
    annualSalary: 'Process Observation Workshop',
    hoursPerWeek: 'Process Observation Workshop',
    superRate: 'Process Observation Workshop',
    payrollTaxRate: 'Process Observation Workshop',
    overheadRate: 'Process Observation Workshop',
    drawingsPerWeek: 'Process Observation Workshop',
    checkingHoursPerWeek: 'Process Observation Workshop',
    draftingTimeNew: 'Process Observation Workshop',
    draftingTimeCopy: 'Process Observation Workshop',
    currentMatchRate: 'Process Observation Workshop',
  },
}

function derive(c) {
  const baseHourlyRate = c.annualSalary / 52 / c.hoursPerWeek
  const loadedRate = baseHourlyRate * (1 + c.superRate / 100) * (1 + c.payrollTaxRate / 100) * (1 + c.overheadRate / 100)
  const annualCheckingCost = c.checkingHoursPerWeek * 52 * loadedRate
  const devCost = 93750
  const apiCost = 1339.17
  const maintenanceCost = 3000
  const totalYear1 = devCost + apiCost + maintenanceCost
  const totalYear2Plus = apiCost + maintenanceCost
  const names = ['Conservative', 'Base Case', 'Optimistic']
  const scenarios = [5, 10, 20].map((matchImp, idx) => {
    const checkingHoursSavedPerWeek = c.checkingHoursPerWeek
    const copyHoursSavedPerWeek = (c.drawingsPerWeek * matchImp / 100) * (c.draftingTimeNew - c.draftingTimeCopy)
    const qaHoursSavedPerWeek = copyHoursSavedPerWeek * 0.2
    const totalWeeklyHoursSaved = checkingHoursSavedPerWeek + copyHoursSavedPerWeek + qaHoursSavedPerWeek
    const annualSaving = totalWeeklyHoursSaved * 52 * loadedRate
    const paybackMonths = (totalYear1 / annualSaving) * 12
    const roi1yr = ((annualSaving - totalYear1) / totalYear1) * 100
    const isBase = matchImp === 10
    return {
      matchImp,
      name: names[idx],
      checkingHoursSavedPerWeek,
      copyHoursSavedPerWeek,
      qaHoursSavedPerWeek,
      totalWeeklyHoursSaved,
      annualSaving,
      paybackMonths,
      roi1yr,
      isBase,
    }
  })
  return { baseHourlyRate, loadedRate, annualCheckingCost, devCost, apiCost, maintenanceCost, totalYear1, totalYear2Plus, scenarios }
}

/* ── Shared components ── */
function Rule({ color = C.clay, op = 0.3, my = 28 }) {
  return <div style={{ height: '1px', background: color, opacity: op, margin: `${my}px 0` }} />
}

function Wrap({ children, justify = 'center' }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: justify, padding: '56px 80px', boxSizing: 'border-box' }}>
      {children}
    </div>
  )
}

/* 6-circle brand icon used on cover */
function DotIcon({ size = 13, gap = 5, color = C.red }) {
  const cols = 3, rows = 2
  const w = cols * size + (cols - 1) * gap
  const h = rows * size + (rows - 1) * gap
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <circle key={`${r}-${c}`}
            cx={c * (size + gap) + size / 2}
            cy={r * (size + gap) + size / 2}
            r={size / 2}
            fill={color}
          />
        ))
      )}
    </svg>
  )
}

/* Footer used on white slides (2–5) */
function SlideFooter({ section }) {
  return (
    <div style={{
      height: '40px', borderTop: '1px solid rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 56px', flexShrink: 0, background: C.white,
    }}>
      <div style={{ fontFamily: F.main, fontSize: '13px', color: '#000', display: 'flex', alignItems: 'baseline', gap: '1px' }}>
        Clear<span style={{ fontStyle: 'italic' }}>AI</span>
      </div>
      <div style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>
        Queensland Steel House Frames &nbsp;&nbsp;&nbsp; Proposal 18-03-2026
      </div>
      <div style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>
        {section}
      </div>
    </div>
  )
}

/* White slide wrapper */
function WhiteSlide({ children, section }) {
  return (
    <div style={{ width: '100%', height: '100%', background: C.white, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <SlideFooter section={section} />
    </div>
  )
}

/* ── SLIDE 0: COVER (exact replica of PDF slide 1) ── */
function S00() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.obsidian,
      display: 'flex', flexDirection: 'column',
      padding: '40px 56px',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: F.main, fontSize: '10px', letterSpacing: '3.5px', color: 'rgba(244,240,237,0.7)', textTransform: 'uppercase' }}>
          Queensland Steel House Frames
        </div>
        <div style={{ fontFamily: F.main, fontSize: '15px', color: 'rgba(244,240,237,0.85)', display: 'flex', alignItems: 'baseline', gap: '1px' }}>
          Clear<span style={{ fontStyle: 'italic' }}>AI</span>
        </div>
      </div>

      {/* Main title — vertically centered in remaining space */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{
          fontFamily: F.main,
          fontSize: 'clamp(56px, 7.2vw, 120px)',
          lineHeight: 1.08,
          color: '#F4F0ED',
          fontWeight: 400,
          width: '100%',
        }}>
          AI Drafting Copy Agent
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: F.main, fontSize: '10px', letterSpacing: '3.5px', color: 'rgba(244,240,237,0.55)', textTransform: 'uppercase' }}>
          Proposal 18-03-2026
        </div>
        <DotIcon size={13} gap={5} color={C.red} />
      </div>
    </div>
  )
}

/* ── PROCESS FLOW DIAGRAM ── */
function ProcessDiagram() {
  const nodeStyle = (bg, color = '#fff', border = 'none') => ({
    background: bg, color, border,
    padding: '10px 16px', borderRadius: '4px',
    fontFamily: F.main, fontSize: '13px', lineHeight: 1.4,
    textAlign: 'center', boxSizing: 'border-box',
  })
  const Arrow = () => (
    <div style={{ textAlign: 'center', color: '#888', fontSize: '18px', lineHeight: 1, padding: '1px 0' }}>↓</div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '100%', maxWidth: '660px' }}>
      <div style={{ ...nodeStyle('#111'), width: '260px' }}>A new job comes in</div>
      <Arrow />
      <div style={{ ...nodeStyle(C.clay), width: '420px' }}>
        Drafter prints the job and searches the MS Access Database for potential copies
      </div>
      <Arrow />
      {/* Loop */}
      <div style={{
        border: '1.5px dashed rgba(131,74,51,0.5)', borderRadius: '6px',
        padding: '12px 16px', width: '620px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
      }}>
        <div style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '2px', color: C.clay, textTransform: 'uppercase', marginBottom: '6px' }}>
          For each potential copy in MS Access
        </div>
        <div style={{ ...nodeStyle('#5a3525'), width: '360px' }}>
          Manually evaluate drawing against many different factors
        </div>
        <Arrow />
        <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', maxWidth: '220px' }}>
            <div style={{ fontFamily: F.main, fontSize: '10px', color: C.red, letterSpacing: '1px', padding: '1px 0' }}>Bad copy</div>
            <div style={{ ...nodeStyle('#f0e8e5', '#555'), border: '1px solid #ddd', width: '100%' }}>
              Skip — look for another candidate
            </div>
          </div>
          <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)', margin: '8px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', maxWidth: '220px' }}>
            <div style={{ fontFamily: F.main, fontSize: '10px', color: C.clay, letterSpacing: '1px', padding: '1px 0' }}>Good copy</div>
            <div style={{ ...nodeStyle('#a06045'), width: '100%' }}>
              Write down differences and email details to another drafter
            </div>
          </div>
        </div>
        <div style={{ marginTop: '8px', fontFamily: F.main, fontSize: '10px', color: C.clay, letterSpacing: '1px', textTransform: 'uppercase' }}>
          ↻ Continue to next candidate
        </div>
      </div>
      <Arrow />
      <div style={{ ...nodeStyle('#111'), width: '380px' }}>
        Repeat until a few decent candidates are found
      </div>
    </div>
  )
}

/* ── SLIDE 1: THE PROBLEM ── */
function S01() {
  return (
    <WhiteSlide section="The Problem">
      <div style={{ padding: '44px 56px 20px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>
          The Problem
        </div>
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', marginBottom: '20px' }} />
        <div style={{ fontFamily: F.main, fontSize: '16px', color: '#555', lineHeight: 1.6, marginBottom: '20px', maxWidth: '600px' }}>
          The drafting copy check process is very time consuming, repetitive, and takes up a lot of employee time.
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ProcessDiagram />
        </div>
      </div>
    </WhiteSlide>
  )
}

/* ── WEEK CALENDAR COMPONENT ── */
function WeekCalendar() {
  const days = [
    { num: '23', name: 'Monday' },
    { num: '24', name: 'Tuesday' },
    { num: '25', name: 'Wednesday' },
    { num: '26', name: 'Thursday' },
    { num: '27', name: 'Friday' },
  ]
  const hours = [9, 10, 11, 12, 13, 14, 15, 16]
  const rowH = 36

  return (
    <div style={{
      border: '1px solid #dadce0', borderRadius: '4px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', background: '#fff',
      height: '100%', fontFamily: F.main,
    }}>
      {/* Day headers */}
      <div style={{ display: 'flex', borderBottom: '1px solid #dadce0', flexShrink: 0 }}>
        <div style={{ width: '28px', flexShrink: 0, borderRight: '1px solid #dadce0' }} />
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, padding: '5px 6px', borderLeft: i > 0 ? '1px solid #dadce0' : 'none', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#1a73e8', lineHeight: 1 }}>{d.num}</div>
            <div style={{ fontSize: '9px', color: '#70757a', letterSpacing: '0.3px', marginTop: '1px' }}>{d.name}</div>
          </div>
        ))}
      </div>
      {/* Time rows */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Hour labels */}
        <div style={{ width: '28px', flexShrink: 0, borderRight: '1px solid #dadce0' }}>
          {hours.map(h => (
            <div key={h} style={{ height: `${rowH}px`, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: '3px', paddingTop: '2px' }}>
              <span style={{ fontSize: '9px', color: '#70757a' }}>{h}</span>
            </div>
          ))}
        </div>
        {/* Day columns with events */}
        {days.map((d, di) => (
          <div key={di} style={{ flex: 1, borderLeft: '1px solid #dadce0', position: 'relative' }}>
            {hours.map((h, hi) => (
              <div key={h} style={{ height: `${rowH}px`, borderTop: hi > 0 ? '1px solid #f1f3f4' : 'none' }} />
            ))}
            {/* Full-day event block */}
            <div style={{
              position: 'absolute', top: '2px', bottom: '2px', left: '2px', right: '2px',
              background: '#c2d7f0', border: '2px solid #4285f4', borderRadius: '4px',
              padding: '4px 5px', display: 'flex', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '8px', color: '#1a55a8', fontWeight: 700, letterSpacing: '0.2px', lineHeight: 1.3 }}>
                DRAFTING COPY CHECK!
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── SLIDE 2: THE NUMBERS ── */
function S02() {
  return (
    <WhiteSlide section="The Problem">
      <div style={{ flex: 1, display: 'flex', gap: '0', padding: '0 0 0 56px', overflow: 'hidden' }}>
        {/* Left: text */}
        <div style={{ flex: '0 0 42%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '48px', gap: '0' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: F.main, fontSize: '22px', lineHeight: 1.45, color: '#000' }}>
              Your drafters spend{' '}
              <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>37.5 hours</span>
              {' '}every week on manual copy checking.
            </div>
          </div>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: F.main, fontSize: '16px', lineHeight: 1.55, color: '#000' }}>
              That is equivalent to{' '}
              <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>one full time role!</span>
            </div>
          </div>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: F.main, fontSize: '22px', lineHeight: 1.45, color: '#000' }}>
              The current process only finds a usable match{' '}
              <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>20% of the time.</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: F.main, fontSize: '16px', lineHeight: 1.55, color: '#000' }}>
              So 80% of the copy check time is often wasted!
            </div>
          </div>
        </div>
        {/* Right: calendar image */}
        <div style={{ flex: 1, padding: '28px 40px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={calendarImg}
            alt="Drafting copy check calendar"
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
          />
        </div>
      </div>
    </WhiteSlide>
  )
}

/* ── SCALING LINE CHART ── */
function ScalingChart() {
  const W = 480, H = 290
  const padL = 48, padR = 52, padT = 48, padB = 44
  const iW = W - padL - padR
  const iH = H - padT - padB

  const maxX = 500, maxY = 375, maxCost = 21000

  const tx = x => padL + (x / maxX) * iW
  const ty = y => padT + iH - (y / maxY) * iH

  // y = 0.66 * x (total FTE hours)
  const fteData = [[0, 0], [50, 33], [100, 66], [200, 132], [300, 198], [400, 264], [500, 330]]
  // y = 0.52 * x (wasted hours, 80% friction)
  const wasteData = [[0, 0], [50, 26], [100, 52], [200, 104], [300, 156], [400, 208], [500, 260]]

  const pts = (data) => data.map(([x, y]) => `${tx(x)},${ty(y)}`).join(' ')
  const shadePts = [
    ...fteData.map(([x, y]) => `${tx(x)},${ty(y)}`),
    ...[...wasteData].reverse().map(([x, y]) => `${tx(x)},${ty(y)}`),
  ].join(' ')

  const yTicks = [0, 50, 100, 150, 200, 250, 300, 350]
  const xTicks = [0, 100, 200, 300, 400, 500]
  const costTicks = [0, 5000, 10000, 15000, 20000]

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {/* Title */}
      <text x={padL + iW / 2} y={18} textAnchor="middle" fontFamily={F.main} fontSize={10.5} fill="#222" fontWeight="bold">
        Scaling Inefficiency: Operational Cost vs. Output
      </text>

      {/* Grid lines + Y labels left */}
      {yTicks.map(v => {
        const y = ty(v)
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={padL + iW} y2={y} stroke="#e8e8e8" strokeWidth={0.8} />
            <text x={padL - 4} y={y + 3.5} textAnchor="end" fontFamily={F.main} fontSize={8} fill="#888">{v}</text>
          </g>
        )
      })}

      {/* X axis ticks + labels */}
      {xTicks.map(v => (
        <g key={v}>
          <line x1={tx(v)} y1={padT + iH} x2={tx(v)} y2={padT + iH + 4} stroke="#aaa" strokeWidth={0.8} />
          <text x={tx(v)} y={padT + iH + 14} textAnchor="middle" fontFamily={F.main} fontSize={8} fill="#888">{v}</text>
        </g>
      ))}

      {/* Y axis right labels (cost) */}
      {costTicks.map(v => {
        const y = ty((v / maxCost) * maxY)
        return (
          <text key={v} x={padL + iW + 4} y={y + 3.5} textAnchor="start" fontFamily={F.main} fontSize={8} fill="#888">
            {v === 0 ? '0' : `${v / 1000}k`}
          </text>
        )
      })}

      {/* Axis borders */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + iH} stroke="#aaa" strokeWidth={0.8} />
      <line x1={padL} y1={padT + iH} x2={padL + iW} y2={padT + iH} stroke="#aaa" strokeWidth={0.8} />
      <line x1={padL + iW} y1={padT} x2={padL + iW} y2={padT + iH} stroke="#aaa" strokeWidth={0.8} />

      {/* Shaded area */}
      <polygon points={shadePts} fill="#FF4832" opacity={0.1} />

      {/* FTE line (orange/red) */}
      <polyline points={pts(fteData)} fill="none" stroke="#FF4832" strokeWidth={2} />
      {fteData.map(([x, y], i) => i % 2 === 0 && i > 0 && (
        <circle key={i} cx={tx(x)} cy={ty(y)} r={3} fill="#FF4832" />
      ))}

      {/* Waste line (black dashed) */}
      <polyline points={pts(wasteData)} fill="none" stroke="#333" strokeWidth={1.5} strokeDasharray="5 4" />
      {wasteData.map(([x, y], i) => i % 2 === 0 && i > 0 && (
        <circle key={i} cx={tx(x)} cy={ty(y)} r={2.5} fill="#333" />
      ))}

      {/* Axis titles */}
      <text x={14} y={padT + iH / 2} textAnchor="middle" fontFamily={F.main} fontSize={9} fill="#555"
        transform={`rotate(-90 14 ${padT + iH / 2})`}>Weekly Hours</text>
      <text x={padL + iW / 2} y={H - 4} textAnchor="middle" fontFamily={F.main} fontSize={9} fill="#555">
        Drafting Jobs Per Week
      </text>
      <text x={W - 6} y={padT + iH / 2} textAnchor="middle" fontFamily={F.main} fontSize={9} fill="#555"
        transform={`rotate(90 ${W - 6} ${padT + iH / 2})`}>Total Weekly Cost ($)</text>

      {/* Legend */}
      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={5} x2={18} y2={5} stroke="#FF4832" strokeWidth={2} />
        <circle cx={9} cy={5} r={2.5} fill="#FF4832" />
        <text x={22} y={8.5} fontFamily={F.main} fontSize={8} fill="#333">Total FTE Hours Required</text>
        <line x1={0} y1={18} x2={18} y2={18} stroke="#333" strokeWidth={1.5} strokeDasharray="4 3" />
        <circle cx={9} cy={18} r={2} fill="#333" />
        <text x={22} y={21.5} fontFamily={F.main} fontSize={8} fill="#333">Hours Wasted (80% friction)</text>
      </g>
    </svg>
  )
}

/* ── SLIDE 3: SCALE + CHART ── */
function S03() {
  return (
    <WhiteSlide section="The Problem">
      <div style={{ flex: 1, display: 'flex', gap: '0', padding: '0 0 0 56px', overflow: 'hidden' }}>
        {/* Left: text */}
        <div style={{ flex: '0 0 38%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '44px', gap: '0' }}>
          <div style={{ marginBottom: '36px' }}>
            <div style={{ fontFamily: F.main, fontSize: '20px', lineHeight: 1.5, color: '#000' }}>
              Your database grows every week. Manual searching <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>cannot keep up.</span>
            </div>
          </div>
          <div style={{ marginBottom: '36px' }}>
            <div style={{ fontFamily: F.main, fontSize: '20px', lineHeight: 1.5, color: '#000' }}>
              More jobs means more searching. Copy check costs grow with every drawing added.
            </div>
          </div>
          <div>
            <div style={{ fontFamily: F.main, fontSize: '20px', lineHeight: 1.5, color: '#000' }}>
              Drafters search differently. Good copies get missed. Worse ones get used instead.
            </div>
          </div>
        </div>
        {/* Right: chart */}
        <div style={{ flex: 1, padding: '36px 40px 36px 0', display: 'flex', alignItems: 'center' }}>
          <ScalingChart />
        </div>
      </div>
    </WhiteSlide>
  )
}

/* ── SLIDE 4: SOLUTION STATEMENT ── */
function S04() {
  return (
    <WhiteSlide section="The Solution">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '44px 56px', boxSizing: 'border-box' }}>
        {/* Top-left heading */}
        <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>
          The Solution
        </div>
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', marginBottom: '0' }} />
        {/* Centred subtitle */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: F.main, fontSize: '36px', lineHeight: 1.2, color: '#000', fontWeight: 400, whiteSpace: 'nowrap' }}>
            Make the whole process automated
          </div>
        </div>
      </div>
    </WhiteSlide>
  )
}

/* ── SLIDE 5: SOLUTION DEMO ── */
function S05() {
  return (
    <WhiteSlide section="The Solution">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '44px 56px', boxSizing: 'border-box' }}>
        <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>
          The Solution
        </div>
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', marginBottom: '0' }} />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0' }}>
          <img
            src={solutionDemoImg}
            alt="ClearAI copy check tool"
            style={{ width: 'auto', height: 'auto', maxWidth: '84%', maxHeight: '52vh', borderRadius: '6px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
          />
        </div>
      </div>
    </WhiteSlide>
  )
}

/* ── SLIDE 6: CALCULATOR — BASE ASSUMPTIONS ── */
function S06({ calc, setCalc }) {
  const d = derive(calc)

  const inputStyle = {
    fontFamily: F.main,
    fontSize: '13px',
    background: '#fff',
    border: '1.5px solid rgba(34,25,12,0.3)',
    borderRadius: '3px',
    padding: '4px 8px',
    width: '80px',
    textAlign: 'right',
    outline: 'none',
    color: C.obsidian,
  }
  const sourceInputStyle = {
    fontFamily: F.main,
    fontSize: '11px',
    color: C.clay,
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(131,74,51,0.2)',
    padding: '2px 4px',
    width: '100%',
    outline: 'none',
  }

  const rows = [
    { label: 'Annual Salary', field: 'annualSalary', unit: '$/year' },
    { label: 'Working Hours', field: 'hoursPerWeek', unit: 'hrs/week' },
    { label: 'Super Rate', field: 'superRate', unit: '%' },
    { label: 'Payroll Tax Rate', field: 'payrollTaxRate', unit: '%' },
    { label: 'Overhead Rate', field: 'overheadRate', unit: '%' },
    { label: 'Drawings per Week', field: 'drawingsPerWeek', unit: 'jobs' },
    { label: 'Manual Checking Time', field: 'checkingHoursPerWeek', unit: 'hrs/week' },
    { label: 'Drafting Time — New Job', field: 'draftingTimeNew', unit: 'hrs/job' },
    { label: 'Drafting Time — Copy Job', field: 'draftingTimeCopy', unit: 'hrs/job' },
    { label: 'Current Match Rate', field: 'currentMatchRate', unit: '%' },
  ]

  const maxSaving = Math.max(...d.scenarios.map(s => s.annualSaving))

  return (
    <Wrap justify="flex-start">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>The Solution</div>
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', marginBottom: '20px' }} />
      <div style={{ fontFamily: F.main, fontSize: '22px', color: C.obsidian, marginBottom: '20px' }}>Calculator — Base Assumptions</div>

      <div style={{ display: 'flex', gap: '32px', flex: 1, minHeight: 0 }}>
        {/* Left: editable table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Parameter', 'Value', 'Source'].map((h, i) => (
                  <th key={i} style={{ padding: '7px 10px', fontFamily: F.main, fontSize: '9px', letterSpacing: '1.5px', color: C.clay, textTransform: 'uppercase', textAlign: i === 0 ? 'left' : i === 1 ? 'right' : 'left', borderBottom: '1px solid rgba(34,25,12,0.15)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ label, field, unit }) => (
                <tr key={field} style={{ borderBottom: '1px solid rgba(34,25,12,0.06)' }}>
                  <td style={{ padding: '7px 10px 7px 0', fontFamily: F.main, fontSize: '13px', color: C.obsidian, whiteSpace: 'nowrap' }}>
                    {label}
                    <span style={{ fontFamily: F.main, fontSize: '10px', color: C.lightClay, marginLeft: '5px' }}>{unit}</span>
                  </td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <input
                      type="number"
                      style={inputStyle}
                      value={calc[field]}
                      onChange={e => setCalc(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }))}
                    />
                  </td>
                  <td style={{ padding: '7px 0 7px 10px' }}>
                    <input
                      type="text"
                      style={sourceInputStyle}
                      value={calc.sources[field]}
                      onChange={e => setCalc(prev => ({ ...prev, sources: { ...prev.sources, [field]: e.target.value } }))}
                    />
                  </td>
                </tr>
              ))}
              {/* Derived rows */}
              <tr style={{ borderBottom: '1px solid rgba(34,25,12,0.06)', background: 'rgba(34,25,12,0.03)' }}>
                <td style={{ padding: '7px 10px 7px 0', fontFamily: F.main, fontSize: '13px', color: C.obsidian, fontStyle: 'italic' }}>
                  Base Hourly Rate <span style={{ fontSize: '10px', color: C.lightClay }}>(derived)</span>
                </td>
                <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: F.main, fontSize: '13px', color: C.obsidian }}>
                  ${d.baseHourlyRate.toFixed(2)}/hr
                </td>
                <td />
              </tr>
              <tr style={{ background: 'rgba(34,25,12,0.03)' }}>
                <td style={{ padding: '7px 10px 7px 0', fontFamily: F.main, fontSize: '13px', color: C.obsidian, fontStyle: 'italic' }}>
                  Fully Loaded Rate <span style={{ fontSize: '10px', color: C.lightClay }}>(derived)</span>
                </td>
                <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: F.main, fontSize: '13px', color: C.obsidian }}>
                  ${d.loadedRate.toFixed(2)}/hr
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: metrics + chart */}
        <div style={{ flex: '0 0 270px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Annual checking cost box */}
          <div style={{ background: C.mid, borderRadius: '6px', padding: '16px 18px' }}>
            <div style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '2px', color: C.clay, textTransform: 'uppercase', marginBottom: '6px' }}>
              Annual Checking Cost (Current)
            </div>
            <div style={{ fontFamily: F.main, fontSize: '28px', color: C.red, lineHeight: 1 }}>
              ${Math.round(d.annualCheckingCost).toLocaleString()}
            </div>
          </div>

          {/* Projected savings chart */}
          <div style={{ flex: 1, background: C.mid, borderRadius: '6px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '2px', color: C.clay, textTransform: 'uppercase', marginBottom: '4px' }}>
              Projected Annual Savings
            </div>
            {d.scenarios.map(s => (
              <div key={s.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontFamily: F.main, fontSize: '11px', color: C.obsidian }}>{s.name}</span>
                  <span style={{ fontFamily: F.main, fontSize: '11px', color: C.clay }}>${Math.round(s.annualSaving).toLocaleString()}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(34,25,12,0.1)', borderRadius: '3px', marginBottom: '3px' }}>
                  <div style={{ height: '100%', width: `${(s.annualSaving / maxSaving) * 100}%`, background: s.isBase ? C.clay : C.lightClay, borderRadius: '3px' }} />
                </div>
                <div style={{ fontFamily: F.main, fontSize: '10px', color: C.lightClay }}>
                  {s.totalWeeklyHoursSaved.toFixed(1)} hrs/wk saved
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Wrap>
  )
}

/* ── SLIDE 7: ROI (dynamic) ── */
function S07({ calc }) {
  const d = derive(calc)
  return (
    <Wrap justify="flex-start">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>The Solution</div>
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', marginBottom: '20px' }} />
      <div style={{ fontFamily: F.main, fontSize: '24px', color: C.obsidian, marginBottom: '28px' }}>
        Based on current parameters, payback from <span style={{ color: C.red }}>{d.scenarios[0].paybackMonths.toFixed(1)} months</span> (conservative)
      </div>
      <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
        {d.scenarios.map((s) => (
          <div key={s.name} style={{ flex: 1, background: s.isBase ? C.clay : C.mid, borderRadius: '6px', padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: F.main, fontSize: '10px', letterSpacing: '2px', color: s.isBase ? 'rgba(244,240,237,0.6)' : C.lightClay, textTransform: 'uppercase', marginBottom: '3px' }}>{s.name}</div>
            <div style={{ fontFamily: F.main, fontSize: '12px', color: s.isBase ? C.parchment : C.clay, marginBottom: '16px' }}>+{s.matchImp}% match rate</div>
            <div style={{ height: '1px', background: s.isBase ? 'rgba(244,240,237,0.2)' : 'rgba(34,25,12,0.1)', margin: '0 0 18px' }} />
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontFamily: F.main, fontSize: '34px', lineHeight: 1, color: s.isBase ? C.parchment : C.obsidian }}>${Math.round(s.annualSaving).toLocaleString()}</div>
              <div style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '1px', color: s.isBase ? 'rgba(244,240,237,0.55)' : C.lightClay, marginTop: '4px', textTransform: 'uppercase' }}>Annual Labour Saving</div>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontFamily: F.main, fontSize: '26px', lineHeight: 1, color: s.isBase ? C.parchment : C.obsidian }}>{s.paybackMonths.toFixed(1)} mo</div>
              <div style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '1px', color: s.isBase ? 'rgba(244,240,237,0.55)' : C.lightClay, marginTop: '4px', textTransform: 'uppercase' }}>Simple Payback</div>
            </div>
            <div style={{ height: '1px', background: s.isBase ? 'rgba(244,240,237,0.2)' : 'rgba(34,25,12,0.1)', margin: '0 0 14px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
              {[
                ['Copy Checking Hrs Saved', `${s.checkingHoursSavedPerWeek.toFixed(1)} hrs/wk`],
                ['Copy Drafting Hrs Saved', `${s.copyHoursSavedPerWeek.toFixed(1)} hrs/wk`],
                ['QA Hrs Saved', `${s.qaHoursSavedPerWeek.toFixed(1)} hrs/wk`],
              ].map(([label, val], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: F.main, fontSize: '10px', color: s.isBase ? 'rgba(244,240,237,0.55)' : 'rgba(34,25,12,0.5)' }}>{label}</span>
                  <span style={{ fontFamily: F.main, fontSize: '11px', color: s.isBase ? C.parchment : C.obsidian }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontFamily: F.main, fontSize: '10px', color: s.isBase ? 'rgba(244,240,237,0.45)' : 'rgba(34,25,12,0.4)' }}>
                {s.totalWeeklyHoursSaved.toFixed(1)} hrs/wk saved
              </div>
              <div style={{ fontFamily: F.main, fontSize: '10px', color: s.isBase ? 'rgba(244,240,237,0.45)' : 'rgba(34,25,12,0.4)' }}>
                Year 1 ROI: {s.roi1yr.toFixed(0)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Wrap>
  )
}

/* ── SLIDE 8: INVESTMENT — THREE PROPOSALS ── */
function S08({ calc }) {
  const d = derive(calc)
  const baseSaving = d.scenarios[1].annualSaving

  const proposals = [
    {
      num: 'Proposal 1',
      name: 'Essential',
      tag: 'Core functionality',
      devCost: 38000,
      apiCost: 450,
      maintCost: 1500,
      features: [
        'MS Access database integration',
        'Copy check across 8 key dimensions',
        'Top 1 match result with change summary',
        'Basic PDF upload web interface',
        'Weekly scheduled database sync',
        'Email delivery of match results',
      ],
    },
    {
      num: 'Proposal 2',
      name: 'Core',
      tag: 'Recommended',
      devCost: 62000,
      apiCost: 1339,
      maintCost: 3000,
      features: [
        'MS Access database integration',
        'Full 15-factor weighted AI scoring',
        'Top 3 match results with full change lists',
        'Real-time database sync',
        'Clean web dashboard with PDF upload',
        'Drafter training & onboarding',
      ],
    },
    {
      num: 'Proposal 3',
      name: 'Enterprise',
      tag: 'Full feature set',
      devCost: 95000,
      apiCost: 1800,
      maintCost: 5000,
      features: [
        'Everything in Proposal 2',
        'Automated new-job notifications',
        'Analytics dashboard & reporting',
        'Drafter feedback loop to improve accuracy',
        'Role-based access control',
        'Priority support & quarterly reviews',
      ],
    },
  ]

  return (
    <Wrap justify="flex-start">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>The Solution</div>
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', marginBottom: '20px' }} />
      <div style={{ fontFamily: F.main, fontSize: '22px', color: C.obsidian, marginBottom: '18px' }}>Investment Required</div>
      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
        {proposals.map((p) => {
          const isRec = p.num === 'Proposal 2'
          const totalY1 = p.devCost + p.apiCost + p.maintCost
          const totalY2 = p.apiCost + p.maintCost
          const payback = (totalY1 / baseSaving * 12).toFixed(1)
          return (
            <div key={p.num} style={{
              flex: 1,
              background: isRec ? C.clay : C.mid,
              borderRadius: '6px',
              padding: '20px 18px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}>
              {isRec && (
                <div style={{ position: 'absolute', top: '-11px', left: '18px', background: C.red, borderRadius: '3px', padding: '2px 10px', fontFamily: F.main, fontSize: '9px', letterSpacing: '2px', color: C.parchment, textTransform: 'uppercase' }}>
                  Recommended
                </div>
              )}
              <div style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '2px', color: isRec ? 'rgba(244,240,237,0.55)' : C.lightClay, textTransform: 'uppercase', marginBottom: '2px' }}>{p.num}</div>
              <div style={{ fontFamily: F.main, fontSize: '20px', color: isRec ? C.parchment : C.obsidian, marginBottom: '4px' }}>{p.name}</div>
              <div style={{ height: '1px', background: isRec ? 'rgba(244,240,237,0.2)' : 'rgba(34,25,12,0.12)', margin: '10px 0' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: isRec ? 'rgba(244,240,237,0.6)' : C.clay, marginTop: '6px', flexShrink: 0 }} />
                    <div style={{ fontFamily: F.main, fontSize: '11px', color: isRec ? 'rgba(244,240,237,0.85)' : C.obsidian, lineHeight: 1.4 }}>{f}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: '1px', background: isRec ? 'rgba(244,240,237,0.2)' : 'rgba(34,25,12,0.12)', marginBottom: '12px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                {[
                  ['Development', `$${p.devCost.toLocaleString()}`, 'Weeks 1–6'],
                  ['API & Hosting', `$${p.apiCost.toLocaleString()} / yr`, 'From go-live'],
                  ['Maintenance', `$${p.maintCost.toLocaleString()} / yr`, 'From go-live'],
                ].map(([label, val, timing], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: F.main, fontSize: '10px', color: isRec ? 'rgba(244,240,237,0.55)' : C.lightClay }}>{label}</span>
                    <span style={{ fontFamily: F.main, fontSize: '11px', color: isRec ? C.parchment : C.obsidian, fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: isRec ? 'rgba(244,240,237,0.15)' : 'rgba(34,25,12,0.08)', borderRadius: '4px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <span style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '1px', color: isRec ? 'rgba(244,240,237,0.55)' : C.lightClay, textTransform: 'uppercase' }}>Year 1 Total</span>
                  <span style={{ fontFamily: F.main, fontSize: '18px', color: isRec ? C.parchment : C.obsidian }}>${totalY1.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <span style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '1px', color: isRec ? 'rgba(244,240,237,0.55)' : C.lightClay, textTransform: 'uppercase' }}>Year 2+</span>
                  <span style={{ fontFamily: F.main, fontSize: '13px', color: isRec ? 'rgba(244,240,237,0.75)' : C.clay }}>${totalY2.toLocaleString()} / yr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: F.main, fontSize: '9px', letterSpacing: '1px', color: isRec ? 'rgba(244,240,237,0.55)' : C.lightClay, textTransform: 'uppercase' }}>Base Payback</span>
                  <span style={{ fontFamily: F.main, fontSize: '13px', color: isRec ? 'rgba(244,240,237,0.75)' : C.clay }}>{payback} mo</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Wrap>
  )
}

/* ── SLIDE 9: TIMELINE (6-week) ── */
function S09() {
  const phases = [
    {
      weeks: 'Weeks 1–3',
      title: 'Foundation & Core Build',
      color: C.clay,
      items: [
        'Requirements gathering and technical scoping',
        'MS Access database integration and indexing',
        'Core AI comparison engine development',
        'PDF upload pipeline and initial UI',
        'Internal testing with sample jobs',
      ],
    },
    {
      weeks: 'Weeks 4–6',
      title: 'Refinement & Deployment',
      color: C.obsidian,
      items: [
        'AI model tuning based on drafter feedback',
        'Result scoring and ranking refinement',
        'Full production deployment to live environment',
        'QSHF drafter training and onboarding',
        '50+ live jobs validated in production',
      ],
    },
    {
      weeks: 'Week 7+',
      title: 'Live & Maintained',
      color: C.lightClay,
      items: [
        'Ongoing performance monitoring',
        'Continuous improvement from drafter feedback',
        'Bug resolution and version updates',
        'Quarterly review of match accuracy',
      ],
    },
  ]
  return (
    <Wrap justify="flex-start">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>The Solution</div>
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', marginBottom: '20px' }} />
      <div style={{ fontFamily: F.main, fontSize: '26px', color: C.obsidian, marginBottom: '28px' }}>Timeline &amp; Next Steps</div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flex: 1 }}>
        {phases.map((p, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ height: '4px', background: p.color, borderRadius: '2px', marginBottom: '18px' }} />
            <div style={{ fontFamily: F.main, fontSize: '10px', letterSpacing: '2px', color: p.color, marginBottom: '8px' }}>{p.weeks}</div>
            <div style={{ fontFamily: F.main, fontSize: '17px', color: C.obsidian, marginBottom: '14px' }}>{p.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {p.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '5px', height: '5px', background: p.color, borderRadius: '50%', marginTop: '7px', flexShrink: 0 }} />
                  <div style={{ fontFamily: F.main, fontSize: '13px', color: C.obsidian, opacity: 0.78, lineHeight: 1.4 }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: C.red, borderRadius: '4px', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontFamily: F.main, fontSize: '10px', letterSpacing: '2px', color: C.parchment }}>NEXT STEP</div>
        <div style={{ width: '1px', height: '18px', background: 'rgba(244,240,237,0.35)' }} />
        <div style={{ fontFamily: F.main, fontSize: '17px', color: C.parchment }}>Begin development of solution when letter of engagement signed</div>
      </div>
    </Wrap>
  )
}

/* ── SLIDE 10: THANK YOU (dark) ── */
function S10() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.obsidian,
      display: 'flex', flexDirection: 'column',
      padding: '40px 56px',
      boxSizing: 'border-box',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: F.main, fontSize: '10px', letterSpacing: '3.5px', color: 'rgba(244,240,237,0.7)', textTransform: 'uppercase' }}>
          Queensland Steel House Frames
        </div>
        <div style={{ fontFamily: F.main, fontSize: '15px', color: 'rgba(244,240,237,0.85)', display: 'flex', alignItems: 'baseline', gap: '1px' }}>
          Clear<span style={{ fontStyle: 'italic' }}>AI</span>
        </div>
      </div>

      {/* Middle: Thank You */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', paddingTop: '48px' }}>
        <div style={{
          fontFamily: F.main,
          fontSize: 'clamp(56px, 7vw, 120px)',
          lineHeight: 1.08,
          color: '#F4F0ED',
          fontWeight: 400,
        }}>
          Thank You
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: F.main, fontSize: '10px', letterSpacing: '3.5px', color: 'rgba(244,240,237,0.55)', textTransform: 'uppercase' }}>
          AI Drafting Copy Agent — Proposal 18-03-2026
        </div>
        <DotIcon size={13} gap={5} color={C.red} />
      </div>
    </div>
  )
}

/* ── SLIDE 11: TECH WORKFLOW ── */
function S11() {
  const steps = [
    { num: '01', title: 'Upload', desc: 'User uploads a new copy job via the front end web application.' },
    { num: '02', title: 'Filter', desc: 'System filters the MS Access database: Design Name → Builder → Facade → Completed Jobs.' },
    { num: '03', title: 'Compare', desc: 'Each filtered result is compared against the new job across all weighted categories to produce a percentage score.' },
    { num: '04', title: 'Score', desc: 'A final match score is generated for each result, along with all associated changes required.' },
    { num: '05', title: 'Deliver', desc: 'Top 3 results and their required changes are presented to the user on the front end.' },
  ]
  return (
    <Wrap justify="flex-start">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>Appendix</div>
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', marginBottom: '20px' }} />
      <div style={{ fontFamily: F.main, fontSize: '24px', color: C.obsidian, marginBottom: '36px' }}>Workflow of the Solution</div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', top: '20px', left: '50%', right: '-50%', height: '1px', background: C.lightClay }} />
            )}
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: C.clay, color: C.parchment, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.main, fontSize: '11px', fontWeight: 700, position: 'relative', zIndex: 1, marginBottom: '14px' }}>{s.num}</div>
            <div style={{ padding: '0 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: F.main, fontSize: '10px', letterSpacing: '1px', color: C.clay, marginBottom: '7px', textTransform: 'uppercase' }}>{s.title}</div>
              <div style={{ fontFamily: F.main, fontSize: '12px', color: C.obsidian, lineHeight: 1.5, opacity: 0.78 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Wrap>
  )
}

/* ── SLIDE 12: WEIGHT TABLE (both halves, two columns) ── */
function S12() {
  const left = [
    ['Joint Direction (two-storey only)', '15%', 'Major'],
    ['External Dimensions', '15%', 'Major'],
    ['Roof Shape', '10%', 'Significant'],
    ['Roof Pitch (Angle)', '10%', 'Significant'],
    ['Roof Material', '10%', 'Significant'],
    ['Wind Speed Class', '5%', 'Moderate'],
    ['Interior Dimensions', '0.5% – 3%', 'Minor to Moderate'],
    ['Opening Sizes and Positions', '1%', 'Minor'],
  ]
  const right = [
    ['Building Mirroring', '0.5%', 'Minor'],
    ['Eave Width / Cutback', '0.5%', 'Minor'],
    ['Heavy Set Item (per item)', '0.2%', 'Minimal'],
    ['Flooring Material', '0.5%', 'Minor'],
    ['A/C Type (Ducted vs Units)', '0.3%', 'Minor'],
    ['NDIS Grab Rails', '0.2%', 'Minimal'],
    ['Wet Area Differences', '0.5%', 'Minor'],
  ]
  const Col = ({ rows }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['Category', 'Weight', 'Impact'].map((h, i) => (
            <th key={i} style={{ padding: '9px 12px', background: C.obsidian, fontFamily: F.main, fontSize: '9px', letterSpacing: '1.5px', color: C.parchment, textAlign: i === 0 ? 'left' : 'center', textTransform: 'uppercase' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([cat, weight, impact], i) => (
          <tr key={i} style={{ borderBottom: '1px solid rgba(34,25,12,0.08)', background: i % 2 === 0 ? C.parchment : C.mid }}>
            <td style={{ padding: '9px 12px', fontFamily: F.main, fontSize: '13px', color: C.obsidian }}>{cat}</td>
            <td style={{ padding: '9px 12px', fontFamily: F.main, fontSize: '12px', color: C.clay, textAlign: 'center', fontWeight: 700 }}>{weight}</td>
            <td style={{ padding: '9px 12px', fontFamily: F.main, fontSize: '12px', color: C.obsidian, textAlign: 'center', opacity: 0.65 }}>{impact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
  return (
    <Wrap justify="flex-start">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>Appendix</div>
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', marginBottom: '20px' }} />
      <div style={{ fontFamily: F.main, fontSize: '24px', color: C.obsidian, marginBottom: '18px' }}>Weighting of Building Categories</div>
      <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
        <div style={{ flex: 1 }}><Col rows={left} /></div>
        <div style={{ flex: 1 }}><Col rows={right} /></div>
      </div>
    </Wrap>
  )
}

/* ── SLIDE 13: AI COSTS ── */
function S13() {
  return (
    <Wrap justify="flex-start">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>Appendix</div>
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', marginBottom: '20px' }} />
      <div style={{ fontFamily: F.main, fontSize: '24px', color: C.obsidian, marginBottom: '24px' }}>Further Assumptions — AI Search Costs</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr>
            {['Cost Component', 'Pricing Tier', 'Annual Total (AUD)', 'Purpose'].map((h, i) => (
              <th key={i} style={{ padding: '10px 16px', background: C.obsidian, fontFamily: F.main, fontSize: '10px', letterSpacing: '1.5px', color: C.parchment, textAlign: i === 0 ? 'left' : 'center', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['Gemini Flash API', 'Pay-as-you-go', '$58.50', '36,000 calls/year (15 dimensions x 2,400 jobs)'],
            ['Vertex AI Search', 'Entry-tier (1 Unit)', '$1,275.00', 'Compute cost to keep the "Copy Job" index live'],
          ].map(([comp, tier, cost, purpose], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? C.parchment : C.mid }}>
              <td style={{ padding: '16px', fontFamily: F.main, fontSize: '15px', color: C.obsidian, fontWeight: 700 }}>{comp}</td>
              <td style={{ padding: '16px', fontFamily: F.main, fontSize: '12px', color: C.clay, textAlign: 'center' }}>{tier}</td>
              <td style={{ padding: '16px', fontFamily: F.main, fontSize: '20px', color: C.clay, textAlign: 'center', fontWeight: 700 }}>{cost}</td>
              <td style={{ padding: '16px', fontFamily: F.main, fontSize: '14px', color: C.obsidian, opacity: 0.72 }}>{purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ background: C.mid, borderRadius: '4px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: F.main, fontSize: '10px', letterSpacing: '1.5px', color: C.clay }}>TOTAL ANNUAL API COST</div>
        <div style={{ fontFamily: F.main, fontSize: '24px', color: C.clay, fontWeight: 700 }}>$1,333.50 / year</div>
      </div>
    </Wrap>
  )
}

/* ── MAIN COMPONENT ── */
const SLIDES = [S00, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13]

export default function QSHFPitchDeck() {
  const [slide, setSlide] = useState(0)
  const [animDir, setAnimDir] = useState('right')
  const [animKey, setAnimKey] = useState(0)
  const [calc, setCalc] = useState(DEFAULT_CALC)

  // Keyboard navigation — slide in deps so handler always sees current value
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (slide < TOTAL - 1) {
          setAnimDir('right')
          setAnimKey(k => k + 1)
          setSlide(s => s + 1)
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (slide > 0) {
          setAnimDir('left')
          setAnimKey(k => k + 1)
          setSlide(s => s - 1)
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [slide])

  const next = () => {
    if (slide < TOTAL - 1) { setAnimDir('right'); setAnimKey(k => k + 1); setSlide(s => s + 1) }
  }
  const prev = () => {
    if (slide > 0) { setAnimDir('left'); setAnimKey(k => k + 1); setSlide(s => s - 1) }
  }
  const goTo = (n) => {
    if (n !== slide) { setAnimDir(n > slide ? 'right' : 'left'); setAnimKey(k => k + 1); setSlide(n) }
  }

  const SlideContent = SLIDES[slide]
  // White-background slides (1–4) don't use the parchment bg
  const isWhiteSlide = slide >= 1 && slide <= 4

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 68px)', background: isWhiteSlide ? C.white : C.parchment, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`
        @keyframes slideInR { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInL { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: translateX(0); } }
        .sir { animation: slideInR 0.32s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
        .sil { animation: slideInL 0.32s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
      `}</style>

      <div key={animKey} className={animDir === 'right' ? 'sir' : 'sil'} style={{ flex: 1, overflow: 'hidden' }}>
        <SlideContent calc={calc} setCalc={setCalc} />
      </div>

      {/* Nav bar */}
      <div style={{ height: '52px', background: C.obsidian, display: 'flex', alignItems: 'center', padding: '0 28px', gap: '12px', flexShrink: 0 }}>
        <button
          onClick={prev}
          disabled={slide === 0}
          style={{ background: 'transparent', border: '1px solid rgba(244,240,237,0.25)', color: slide === 0 ? 'rgba(244,240,237,0.2)' : C.parchment, width: '30px', height: '30px', borderRadius: '4px', cursor: slide === 0 ? 'default' : 'pointer', fontFamily: F.main, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >&#8592;</button>

        <div style={{ display: 'flex', gap: '5px', flex: 1, justifyContent: 'center' }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ width: i === slide ? '22px' : '7px', height: '7px', borderRadius: '4px', background: i === slide ? C.clay : 'rgba(244,240,237,0.2)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }} />
          ))}
        </div>

        <div style={{ fontFamily: F.main, fontSize: '10px', color: 'rgba(244,240,237,0.4)', letterSpacing: '1px' }}>
          {String(slide + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </div>

        <button
          onClick={next}
          disabled={slide === TOTAL - 1}
          style={{ background: 'transparent', border: '1px solid rgba(244,240,237,0.25)', color: slide === TOTAL - 1 ? 'rgba(244,240,237,0.2)' : C.parchment, width: '30px', height: '30px', borderRadius: '4px', cursor: slide === TOTAL - 1 ? 'default' : 'pointer', fontFamily: F.main, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >&#8594;</button>
      </div>
    </div>
  )
}
