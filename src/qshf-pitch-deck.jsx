import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import html2canvas from 'html2canvas'
import calendarImg from './assets/calendar.png'

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
const TOTAL = 15

const DEFAULT_CALC = {
  hourlyWage: 41.03,
  overheadRate: 30,
  drawingsPerWeek: 50,
  checkingHoursPerWeek: 37.5,
  draftingTimeNew: 10,
  draftingTimeCopy: 5,
  currentMatchRate: 20,
  sources: {
    hourlyWage: 'ClearAI Internal Research',
    overheadRate: 'ClearAI Internal Research',
    drawingsPerWeek: 'Process observation workshop at QSHF',
    checkingHoursPerWeek: 'Process observation workshop at QSHF',
    draftingTimeNew: 'Process observation workshop at QSHF',
    draftingTimeCopy: 'Process observation workshop at QSHF',
    currentMatchRate: 'Process observation workshop at QSHF',
  },
}

function derive(c) {
  const loadedRate = c.hourlyWage * (1 + c.overheadRate / 100)
  const annualCheckingCost = c.checkingHoursPerWeek * 52 * loadedRate
  const devCost = 62000
  const apiCost = 1339
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
  return { loadedRate, annualCheckingCost, devCost, apiCost, maintenanceCost, totalYear1, totalYear2Plus, scenarios }
}

/* ── Shared components ── */
function Rule({ color = C.clay, op = 0.3, my = 28 }) {
  return <div style={{ height: '1px', background: color, opacity: op, margin: `${my}px 0` }} />
}

function Wrap({ children, justify = 'flex-start', section = '' }) {
  return (
    <div style={{ width: '100%', height: '100%', background: C.white, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: justify, padding: '32px 48px', boxSizing: 'border-box', overflow: 'hidden' }}>
        {children}
      </div>
      <SlideFooter section={section} />
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
  const footerTextStyle = { fontSize: '9px', textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)' }
  return (
    <div className="space-mono" style={{
      height: '40px', borderTop: '1px solid rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 56px', flexShrink: 0, background: C.white,
    }}>
      <img src={`${import.meta.env.BASE_URL}clearai-logo-dark.png`} alt="ClearAI" style={{ height: '16px' }} />
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        <span style={footerTextStyle}>Queensland Steel House Frames</span>
        <span style={footerTextStyle}>Proposal 09-04-2026</span>
      </div>
      <div style={footerTextStyle}>{section}</div>
    </div>
  )
}

/* White slide wrapper */
function WhiteSlide({ children, section }) {
  return (
    <div style={{ width: '100%', height: '100%', background: C.white, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
        <div style={{ fontFamily: F.main, fontSize: '14px', color: 'rgba(244,240,237,0.7)' }}>
          Queensland Steel House Frames
        </div>
        <img src={`${import.meta.env.BASE_URL}clearai-logo.png`} alt="ClearAI" style={{ height: '22px' }} />
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
        <div style={{ fontFamily: F.main, fontSize: '14px', color: 'rgba(244,240,237,0.55)' }}>
          Proposal 09-04-2026
        </div>
        <DotIcon size={13} gap={0} color={C.red} />
      </div>
    </div>
  )
}

/* ── PROCESS FLOW DIAGRAM ── */
function ProcessDiagram() {
  const BOX_W = 240
  const BOX_H = 58
  const nodeStyle = (bg, color = '#fff', border = 'none') => ({
    background: bg, color, border,
    width: `${BOX_W}px`, height: `${BOX_H}px`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '4px',
    fontFamily: F.main, fontSize: '12px', lineHeight: 1.35,
    textAlign: 'center', boxSizing: 'border-box', padding: '8px 12px',
  })
  const Arrow = () => (
    <div style={{ textAlign: 'center', color: '#888', fontSize: '16px', lineHeight: 1, padding: '1px 0' }}>↓</div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '100%' }}>
      <div style={nodeStyle('#111')}>A new job comes in</div>
      <Arrow />
      <div style={nodeStyle(C.clay)}>
        Drafter prints the job and searches the MS Access Database for potential copies
      </div>
      <Arrow />
      {/* Loop */}
      <div style={{
        border: '1.5px dashed rgba(131,74,51,0.5)', borderRadius: '6px',
        padding: '10px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
      }}>
        <div style={{ fontFamily: F.main, fontSize: '9px', color: C.clay, marginBottom: '4px' }}>
          For each potential copy in MS Access
        </div>
        <div style={nodeStyle('#5a3525')}>
          Manually evaluate drawing against many different factors
        </div>
        <Arrow />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ fontFamily: F.main, fontSize: '10px', color: C.red, padding: '1px 0' }}>Bad copy</div>
            <div style={{ ...nodeStyle('#f0e8e5', '#555'), border: '1px solid #ddd' }}>
              Skip — look for another candidate
            </div>
          </div>
          <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)', margin: '8px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ fontFamily: F.main, fontSize: '10px', color: C.clay, padding: '1px 0' }}>Good copy</div>
            <div style={nodeStyle('#a06045')}>
              Write down differences and email details to another drafter
            </div>
          </div>
        </div>
        <div style={{ marginTop: '4px', fontFamily: F.main, fontSize: '10px', color: C.clay }}>
          ↻ Continue to next candidate
        </div>
      </div>
      <Arrow />
      <div style={nodeStyle('#111')}>
        Repeat until a few decent candidates are found
      </div>
    </div>
  )
}

/* ── SLIDE 1B: THE BUSINESS VALUE CHAIN ── */
function SVC() {
  const BW = 78, BH = 52
  const STEP = 108
  const BY = 74
  const xs = Array.from({ length: 9 }, (_, i) => 14 + i * STEP)
  const CY = BY + BH / 2
  const VBW = xs[8] + BW + 14
  const VBH = 192

  // Drafting category bracket (items 1,2,3)
  const bx1 = xs[1] - 8, bx2 = xs[3] + BW + 8
  const by1 = BY - 28, by2 = BY + BH + 32

  const ic = C.clay
  const sw = { stroke: ic, strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }

  const SalesIcon = () => (
    <g {...sw}>
      <rect x="-9" y="-5" width="18" height="13" rx="2" />
      <path d="M-4,-5 L-4,-9 Q0,-12 4,-9 L4,-5" />
      <line x1="-9" y1="1" x2="9" y2="1" />
      <rect x="-1.5" y="-1" width="3" height="4" />
    </g>
  )

  const CopyCheckIcon = () => (
    <g strokeLinecap="round" strokeLinejoin="round">
      <rect x="-3" y="-12" width="13" height="17" rx="1.5" fill={C.mid} stroke={ic} strokeWidth={1.5} />
      <rect x="-10" y="-8" width="13" height="17" rx="1.5" fill={C.white} stroke={ic} strokeWidth={1.5} />
      <line x1="-7" y1="-3" x2="0" y2="-3" stroke={ic} strokeWidth={1.2} />
      <line x1="-7" y1="0" x2="0" y2="0" stroke={ic} strokeWidth={1.2} />
      <line x1="-7" y1="3" x2="0" y2="3" stroke={ic} strokeWidth={1.2} />
    </g>
  )

  const DraftingIcon = () => (
    <g {...sw}>
      <polygon points="-3.5,-12 3.5,-12 5,7 0,12 -5,7" />
      <line x1="-3.5" y1="-7" x2="3.5" y2="-7" />
      <line x1="0" y1="-7" x2="0" y2="7" strokeWidth={0.8} strokeDasharray="2 2" />
    </g>
  )

  const QAIcon = () => (
    <g {...sw}>
      <circle cx="-1" cy="-2" r="9" />
      <line x1="6" y1="5" x2="11" y2="10" strokeWidth={2.5} />
      <polyline points="-5,-2 -2,2 5,-5" />
    </g>
  )

  const EngineerIcon = () => (
    <g {...sw}>
      <path d="M-12,4 Q-11,-9 0,-12 Q11,-9 12,4 Z" />
      <rect x="-13" y="4" width="26" height="5" rx="1" />
      <line x1="-4" y1="-12" x2="-4" y2="-4" strokeWidth={0.8} />
      <line x1="4" y1="-12" x2="4" y2="-4" strokeWidth={0.8} />
    </g>
  )

  const SigningIcon = () => (
    <g {...sw}>
      <g transform="rotate(-40)">
        <rect x="-2" y="-12" width="4" height="15" rx="1" />
        <polygon points="-2.5,3 2.5,3 0,9" fill={ic} stroke="none" />
      </g>
      <path d="M-11,9 C-7,3 -3,14 0,9 C3,4 7,13 11,9" fill="none" />
    </g>
  )

  const SendIcon = () => (
    <g {...sw}>
      <polygon points="-12,5 12,0 -12,-5 -7,0" fill={C.mid} />
      <line x1="-7" y1="0" x2="-12" y2="5" />
    </g>
  )

  const ManufactureIcon = () => (
    <g {...sw}>
      <rect x="-10" y="-3" width="20" height="12" rx="1" />
      <rect x="-8" y="-11" width="4" height="8" rx="1" />
      <rect x="4" y="-8" width="4" height="5" rx="1" />
      <rect x="-3" y="3" width="6" height="6" />
    </g>
  )

  const ShipIcon = () => (
    <g {...sw}>
      <rect x="-12" y="-7" width="14" height="13" rx="1" />
      <path d="M2,-7 L2,6 L13,6 L13,-1 L8,-7 Z" />
      <rect x="4" y="-5" width="5" height="4" rx="0.5" fill={C.mid} />
      <circle cx="-5" cy="8" r="3" fill={C.mid} />
      <circle cx="9" cy="8" r="3" fill={C.mid} />
    </g>
  )

  const icons = [SalesIcon, CopyCheckIcon, DraftingIcon, QAIcon, EngineerIcon, SigningIcon, SendIcon, ManufactureIcon, ShipIcon]
  const labels = ['Sales', 'Copy\nChecking', 'Drafting', 'Quality\nAssurance', 'Engineer', 'Signing', 'Send', 'Manufacture', 'Ship to\nCustomer']

  return (
    <WhiteSlide section="The Business Value Chain">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 44px 16px', boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ fontFamily: F.main, fontSize: '42px', lineHeight: 1.05, color: '#000', marginBottom: '12px' }}>
          The Business Value Chain
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox={`0 0 ${VBW} ${VBH}`} width="100%" style={{ overflow: 'visible' }}>

            {/* Drafting category bracket */}
            <rect x={bx1} y={by1} width={bx2 - bx1} height={by2 - by1}
              rx={5} fill={C.parchment} fillOpacity={0.6}
              stroke={C.clay} strokeWidth={1} strokeDasharray="5 3"
            />
            <rect x={(bx1 + bx2) / 2 - 30} y={by1 - 9} width={60} height={17} rx={3} fill={C.white} />
            <text x={(bx1 + bx2) / 2} y={by1 + 4}
              textAnchor="middle" fontFamily={F.main} fontSize={10} fill={C.clay}
            >Drafting</text>

            {/* Arrows */}
            {Array.from({ length: 8 }, (_, i) => {
              const x1 = xs[i] + BW + 2
              const x2 = xs[i + 1] - 2
              return (
                <g key={i}>
                  <line x1={x1} y1={CY} x2={x2 - 7} y2={CY}
                    stroke={C.clay} strokeWidth={1.5} opacity={0.65}
                  />
                  <polygon
                    points={`${x2},${CY} ${x2 - 7},${CY - 3.5} ${x2 - 7},${CY + 3.5}`}
                    fill={C.clay} opacity={0.65}
                  />
                </g>
              )
            })}

            {/* Boxes + icons */}
            {icons.map((Icon, i) => {
              const x = xs[i]
              const isCopyCheck = i === 1
              return (
                <g key={i}>
                  <rect
                    x={x} y={BY} width={BW} height={BH} rx={5}
                    fill={C.white}
                    stroke={isCopyCheck ? C.red : C.clay}
                    strokeWidth={isCopyCheck ? 2.5 : 1}
                    opacity={isCopyCheck ? 1 : 0.75}
                  />
                  <g transform={`translate(${x + BW / 2}, ${BY + BH / 2 - 2})`}>
                    <Icon />
                  </g>
                </g>
              )
            })}

            {/* Labels below boxes */}
            {labels.map((label, i) => {
              const lines = label.split('\n')
              const x = xs[i] + BW / 2
              return lines.map((line, j) => (
                <text key={`${i}-${j}`}
                  x={x} y={BY + BH + 15 + j * 13}
                  textAnchor="middle"
                  fontFamily={F.main} fontSize={11}
                  fill={C.obsidian}
                >
                  {line}
                </text>
              ))
            })}

            {/* Green tick badges on Signing (index 5) and Send (index 6) */}
            {[5, 6].map(i => (
              <g key={i} transform={`translate(${xs[i] + BW - 4}, ${BY - 4})`}>
                <circle cx={0} cy={0} r={9} fill="#27ae60" />
                <polyline points="-4,0 -1,4 5,-4"
                  stroke="white" strokeWidth={2} fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </g>
            ))}

          </svg>
        </div>
      </div>
    </WhiteSlide>
  )
}

/* ── SLIDE 1: THE PROBLEM ── */
function S01() {
  return (
    <WhiteSlide section="The Problem">
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: heading + text, centred vertically */}
        <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '36px 40px 36px 56px' }}>
          <div style={{ fontFamily: F.main, fontSize: '46px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>
            The Problem
          </div>
          <div style={{ fontFamily: F.main, fontSize: '17px', color: '#444', lineHeight: 1.7 }}>
            The drafting copy check process is very time consuming, repetitive, and takes up a lot of employee time.
          </div>
        </div>
        {/* Right: workflow diagram, centred */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 40px' }}>
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
            <div style={{ fontSize: '9px', color: '#70757a', marginTop: '1px' }}>{d.name}</div>
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
              <span style={{ fontSize: '8px', color: '#1a55a8', fontWeight: 700, lineHeight: 1.3 }}>
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
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: two equal paragraphs, centred vertically */}
        <div style={{ flex: '0 0 44%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '36px 48px 36px 56px' }}>
          <div style={{ fontFamily: F.main, fontSize: '20px', lineHeight: 1.6, color: '#000', marginBottom: '44px' }}>
            Your drafters spend{' '}
            <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>37.5 hours</span>
            {' '}every week on manual copy checking. That is equivalent to{' '}
            <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>one full time role!</span>
          </div>
          <div style={{ fontFamily: F.main, fontSize: '20px', lineHeight: 1.6, color: '#000' }}>
            The current process only finds a usable match{' '}
            <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>20% of the time.</span>
            {' '}So 80% of the copy check time is often wasted!
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

/* ── COST CHART (single Y axis, cost only, x 0-200) ── */
// loadedRate derived from DEFAULT_CALC: $80k/52wks/37.5hrs * 1.12 * 1.0475 * 1.30 ≈ $62.59/hr
const LOADED_RATE = 62.59
const BASE_WEEKLY_COST = 37.5 * LOADED_RATE // ≈ $2347 — cost of 37.5 hrs at x=0

function CostChart() {
  const W = 480, H = 290
  const padL = 62, padR = 20, padT = 44, padB = 44
  const iW = W - padL - padR
  const iH = H - padT - padB
  const maxX = 200, maxCost = 12000

  const tx = x => padL + (x / maxX) * iW
  const ty = y => padT + iH - (y / maxCost) * iH

  // cost(x) = BASE_WEEKLY_COST + 0.66 * x * LOADED_RATE
  const costData = [0, 50, 100, 150, 200].map(x => [x, BASE_WEEKLY_COST + 0.66 * x * LOADED_RATE])
  const pts = data => data.map(([x, y]) => `${tx(x)},${ty(y)}`).join(' ')
  const yTicks = [0, 2000, 4000, 6000, 8000, 10000, 12000]
  const xTicks = [0, 50, 100, 150, 200]

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <text x={padL + iW / 2} y={16} textAnchor="middle" fontFamily={F.main} fontSize={10.5} fill="#222" fontWeight="bold">
        Scaling Inefficiency: Weekly Cost vs. Output
      </text>

      {yTicks.map(v => {
        const y = ty(v)
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={padL + iW} y2={y} stroke="#e8e8e8" strokeWidth={0.8} />
            <text x={padL - 6} y={y + 3.5} textAnchor="end" fontFamily={F.main} fontSize={8} fill="#888">
              {v === 0 ? '$0' : `$${v / 1000}k`}
            </text>
          </g>
        )
      })}

      {xTicks.map(v => (
        <g key={v}>
          <line x1={tx(v)} y1={padT + iH} x2={tx(v)} y2={padT + iH + 4} stroke="#aaa" strokeWidth={0.8} />
          <text x={tx(v)} y={padT + iH + 14} textAnchor="middle" fontFamily={F.main} fontSize={8} fill="#888">{v}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + iH} stroke="#aaa" strokeWidth={0.8} />
      <line x1={padL} y1={padT + iH} x2={padL + iW} y2={padT + iH} stroke="#aaa" strokeWidth={0.8} />

      {/* Shaded area */}
      <polygon
        points={[`${tx(0)},${ty(0)}`, ...costData.map(([x, y]) => `${tx(x)},${ty(y)}`), `${tx(200)},${ty(0)}`].join(' ')}
        fill="#FF4832" opacity={0.08}
      />

      {/* Cost line */}
      <polyline points={pts(costData)} fill="none" stroke="#FF4832" strokeWidth={2} />
      {costData.map(([x, y], i) => (
        <circle key={i} cx={tx(x)} cy={ty(y)} r={3} fill="#FF4832" />
      ))}

      <text x={16} y={padT + iH / 2} textAnchor="middle" fontFamily={F.main} fontSize={9} fill="#555"
        transform={`rotate(-90 16 ${padT + iH / 2})`}>Total Weekly Cost ($)</text>
      <text x={padL + iW / 2} y={H - 4} textAnchor="middle" fontFamily={F.main} fontSize={9} fill="#555">
        Drafting Jobs Per Week
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={5} x2={18} y2={5} stroke="#FF4832" strokeWidth={2} />
        <circle cx={9} cy={5} r={2.5} fill="#FF4832" />
        <text x={22} y={8.5} fontFamily={F.main} fontSize={8} fill="#333">Current Process Cost ($/week)</text>
      </g>
    </svg>
  )
}

/* ── COMPARISON CHART (for Slide 6) ── */
function ComparisonChart() {
  const W = 540, H = 300
  const padL = 62, padR = 20, padT = 48, padB = 44
  const iW = W - padL - padR
  const iH = H - padT - padB
  const maxX = 200, maxCost = 12000

  const tx = x => padL + (x / maxX) * iW
  const ty = y => padT + iH - (y / maxCost) * iH

  const currentData = [0, 50, 100, 150, 200].map(x => [x, BASE_WEEKLY_COST + 0.66 * x * LOADED_RATE])
  // AI solution: flat — API ($1,339/yr) + maintenance ($3,000/yr) = $4,339/yr ÷ 52 ≈ $83/week
  const AI_WEEKLY = Math.round((1339 + 3000) / 52)
  const aiData = [[0, AI_WEEKLY], [200, AI_WEEKLY]]
  const pts = data => data.map(([x, y]) => `${tx(x)},${ty(y)}`).join(' ')
  const yTicks = [0, 2000, 4000, 6000, 8000, 10000, 12000]
  const xTicks = [0, 50, 100, 150, 200]

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ overflow: 'hidden' }}>
      <text x={padL + iW / 2} y={18} textAnchor="middle" fontFamily={F.main} fontSize={10.5} fill="#222" fontWeight="bold">
        Weekly Cost vs. Output: Current Process vs. AI Solution
      </text>

      {yTicks.map(v => {
        const y = ty(v)
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={padL + iW} y2={y} stroke="#e8e8e8" strokeWidth={0.8} />
            <text x={padL - 6} y={y + 3.5} textAnchor="end" fontFamily={F.main} fontSize={8} fill="#888">
              {v === 0 ? '$0' : `$${v / 1000}k`}
            </text>
          </g>
        )
      })}

      {xTicks.map(v => (
        <g key={v}>
          <line x1={tx(v)} y1={padT + iH} x2={tx(v)} y2={padT + iH + 4} stroke="#aaa" strokeWidth={0.8} />
          <text x={tx(v)} y={padT + iH + 14} textAnchor="middle" fontFamily={F.main} fontSize={8} fill="#888">{v}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + iH} stroke="#aaa" strokeWidth={0.8} />
      <line x1={padL} y1={padT + iH} x2={padL + iW} y2={padT + iH} stroke="#aaa" strokeWidth={0.8} />

      {/* Shaded gap between lines */}
      <polygon
        points={[...currentData.map(([x, y]) => `${tx(x)},${ty(y)}`), `${tx(200)},${ty(AI_WEEKLY)}`, `${tx(0)},${ty(AI_WEEKLY)}`].join(' ')}
        fill="#FF4832" opacity={0.07}
      />

      {/* Current process line */}
      <polyline points={pts(currentData)} fill="none" stroke="#FF4832" strokeWidth={2} />
      {currentData.map(([x, y], i) => (
        <circle key={i} cx={tx(x)} cy={ty(y)} r={3} fill="#FF4832" />
      ))}

      {/* AI solution flat line */}
      <polyline points={pts(aiData)} fill="none" stroke="#27ae60" strokeWidth={2.5} strokeDasharray="7 3" />
      <circle cx={tx(0)} cy={ty(AI_WEEKLY)} r={3} fill="#27ae60" />
      <circle cx={tx(200)} cy={ty(AI_WEEKLY)} r={3} fill="#27ae60" />
      <text x={tx(200) - 4} y={ty(AI_WEEKLY) - 6} textAnchor="end" fontFamily={F.main} fontSize={8} fill="#27ae60">
        ~${AI_WEEKLY}/wk (API + support)
      </text>

      <text x={16} y={padT + iH / 2} textAnchor="middle" fontFamily={F.main} fontSize={9} fill="#555"
        transform={`rotate(-90 16 ${padT + iH / 2})`}>Total Weekly Cost ($)</text>
      <text x={padL + iW / 2} y={H - 4} textAnchor="middle" fontFamily={F.main} fontSize={9} fill="#555">
        Drafting Jobs Per Week
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={5} x2={18} y2={5} stroke="#FF4832" strokeWidth={2} />
        <circle cx={9} cy={5} r={2.5} fill="#FF4832" />
        <text x={22} y={8.5} fontFamily={F.main} fontSize={8} fill="#333">Current Process</text>
        <line x1={0} y1={18} x2={18} y2={18} stroke="#27ae60" strokeWidth={2.5} strokeDasharray="6 2.5" />
        <circle cx={9} cy={18} r={2.5} fill="#27ae60" />
        <text x={22} y={21.5} fontFamily={F.main} fontSize={8} fill="#333">With AI Solution (flat)</text>
      </g>
    </svg>
  )
}

/* ── SLIDE 3: SCALE + CHART ── */
function S03() {
  return (
    <WhiteSlide section="The Problem">
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: two problem paragraphs, centred vertically */}
        <div style={{ flex: '0 0 38%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '36px 44px 36px 56px' }}>
          <div style={{ marginBottom: '36px' }}>
            <div style={{ fontFamily: F.main, fontSize: '11px', color: C.clay, marginBottom: '10px' }}>The Volume Problem</div>
            <div style={{ fontFamily: F.main, fontSize: '17px', lineHeight: 1.6, color: '#000' }}>
              Your database grows every week. Manual searching <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>cannot keep up.</span> More jobs means more searching. Copy check costs grow with every drawing added.
            </div>
          </div>
          <div>
            <div style={{ fontFamily: F.main, fontSize: '11px', color: C.clay, marginBottom: '10px' }}>The Inconsistency Problem</div>
            <div style={{ fontFamily: F.main, fontSize: '17px', lineHeight: 1.6, color: '#000' }}>
              Drafters search differently. Good copies get missed. Worse ones get used instead.
            </div>
          </div>
        </div>
        {/* Right: cost chart */}
        <div style={{ flex: 1, padding: '36px 40px 36px 0', display: 'flex', alignItems: 'center' }}>
          <CostChart />
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '36px 56px', boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ fontFamily: F.main, fontSize: '46px', lineHeight: 1.05, color: '#000', marginBottom: '12px' }}>
          The Solution
        </div>
        <div style={{ fontFamily: F.main, fontSize: '18px', color: C.obsidian, marginBottom: '8px' }}>
          Costs flatten as your database grows
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
          <ComparisonChart />
        </div>
      </div>
    </WhiteSlide>
  )
}

/* ── SLIDE 6: CALCULATOR — BASE ASSUMPTIONS ── */
function S06({ calc, setCalc }) {
  const d = derive(calc)

  const inputStyle = {
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
    { label: 'Hourly Wage', field: 'hourlyWage', unit: '$/hr' },
    { label: 'Overhead Rate', field: 'overheadRate', unit: '%' },
    { label: 'Drawings per Week', field: 'drawingsPerWeek', unit: 'jobs' },
    { label: 'Manual Checking Time', field: 'checkingHoursPerWeek', unit: 'hrs/week' },
    { label: 'Drafting Time — New Job', field: 'draftingTimeNew', unit: 'hrs/job' },
    { label: 'Drafting Time — Copy Job', field: 'draftingTimeCopy', unit: 'hrs/job' },
    { label: 'Current Match Rate', field: 'currentMatchRate', unit: '%' },
  ]

  return (
    <Wrap justify="flex-start" section="The Solution">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>The Solution</div>
      <div style={{ fontFamily: F.main, fontSize: '22px', color: C.obsidian, marginBottom: '20px' }}>Calculator — Base Assumptions</div>

      <div className="space-mono" style={{ display: 'flex', gap: '32px', flex: 1, minHeight: 0 }}>
        {/* Left: editable table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Parameter', 'Value', 'Source'].map((h, i) => (
                  <th key={i} style={{ padding: '7px 10px', fontSize: '9px', color: C.clay, textTransform: 'uppercase', textAlign: i === 0 ? 'left' : i === 1 ? 'right' : 'left', borderBottom: '1px solid rgba(34,25,12,0.15)', fontWeight: 400 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ label, field, unit }) => (
                <tr key={field} style={{ borderBottom: '1px solid rgba(34,25,12,0.06)' }}>
                  <td style={{ padding: '7px 10px 7px 0', fontSize: '13px', color: C.obsidian, whiteSpace: 'nowrap' }}>
                    {label}
                  </td>
                  <td style={{ padding: '7px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <input
                        type="number"
                        style={inputStyle}
                        value={calc[field]}
                        onChange={e => setCalc(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }))}
                      />
                      <span style={{ fontSize: '10px', color: C.lightClay, minWidth: '52px' }}>{unit}</span>
                    </div>
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
              {/* Derived row */}
              <tr style={{ background: 'rgba(34,25,12,0.03)' }}>
                <td style={{ padding: '7px 10px 7px 0', fontSize: '13px', color: C.obsidian, fontStyle: 'italic' }}>
                  Fully Loaded Rate <span style={{ fontSize: '10px', color: C.lightClay }}>(derived)</span>
                </td>
                <td style={{ padding: '7px 10px', textAlign: 'right', fontSize: '13px', color: C.obsidian }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <span>${d.loadedRate.toFixed(2)}</span>
                    <span style={{ fontSize: '10px', color: C.lightClay, minWidth: '52px' }}>/hr</span>
                  </div>
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: annual checking cost */}
        <div style={{ flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: C.mid, borderRadius: '6px', padding: '16px 18px' }}>
            <div style={{ fontSize: '9px', color: C.clay, textTransform: 'uppercase', marginBottom: '6px' }}>
              Annual Checking Cost (Current)
            </div>
            <div style={{ fontSize: '28px', color: C.red, lineHeight: 1 }}>
              ${Math.round(d.annualCheckingCost).toLocaleString()}
            </div>
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
    <Wrap justify="flex-start" section="The Solution">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>The Solution</div>
      <div style={{ fontFamily: F.main, fontSize: '24px', color: C.obsidian, marginBottom: '28px' }}>
        Based on current parameters, payback from <span style={{ color: C.red }}>{d.scenarios[1].paybackMonths.toFixed(1)} months</span> (base case)
      </div>
      <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
        {d.scenarios.map((s) => (
          <div key={s.name} style={{ flex: 1, background: s.isBase ? C.clay : C.mid, borderRadius: '6px', padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: F.main, fontSize: '10px', color: s.isBase ? 'rgba(244,240,237,0.6)' : C.lightClay, marginBottom: '3px' }}>{s.name}</div>
            <div style={{ fontFamily: F.main, fontSize: '12px', color: s.isBase ? C.parchment : C.clay, marginBottom: '16px' }}>+{s.matchImp}% match rate</div>
            <div style={{ height: '1px', background: s.isBase ? 'rgba(244,240,237,0.2)' : 'rgba(34,25,12,0.1)', margin: '0 0 18px' }} />
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontFamily: F.main, fontSize: '34px', lineHeight: 1, color: s.isBase ? C.parchment : C.obsidian }}>${Math.round(s.annualSaving).toLocaleString()}</div>
              <div style={{ fontFamily: F.main, fontSize: '9px', color: s.isBase ? 'rgba(244,240,237,0.55)' : C.lightClay, marginTop: '4px' }}>Annual Labour Saving</div>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontFamily: F.main, fontSize: '26px', lineHeight: 1, color: s.isBase ? C.parchment : C.obsidian }}>{s.paybackMonths.toFixed(1)} mo</div>
              <div style={{ fontFamily: F.main, fontSize: '9px', color: s.isBase ? 'rgba(244,240,237,0.55)' : C.lightClay, marginTop: '4px' }}>Simple Payback</div>
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
      name: 'Basic',
      tag: 'Core functionality',
      devCost: 38000,
      apiCost: 1339,
      maintCost: 2000,
      features: [
        'MS Access database integration',
        'Full 15-factor weighted AI scoring',
        'Top 1 match result with change summary',
        'Basic PDF upload web interface',
        'Weekly scheduled database sync',
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
        'Email delivery of match results',
        'Drafter training & onboarding',
      ],
    },
    {
      num: 'Proposal 3',
      name: 'Enterprise',
      tag: 'Full feature set',
      devCost: 95000,
      apiCost: 1339,
      maintCost: 4000,
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
    <Wrap justify="flex-start" section="The Solution">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>The Solution</div>
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
                <div style={{ position: 'absolute', top: '-11px', left: '18px', background: C.red, borderRadius: '3px', padding: '2px 10px', fontFamily: F.main, fontSize: '9px', color: C.parchment }}>
                  Recommended
                </div>
              )}
              <div style={{ fontFamily: F.main, fontSize: '9px', color: isRec ? 'rgba(244,240,237,0.55)' : C.lightClay, marginBottom: '2px' }}>{p.num}</div>
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
                  <span style={{ fontFamily: F.main, fontSize: '9px', color: isRec ? 'rgba(244,240,237,0.55)' : C.lightClay }}>Year 1 Total</span>
                  <span style={{ fontFamily: F.main, fontSize: '18px', color: isRec ? C.parchment : C.obsidian }}>${totalY1.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <span style={{ fontFamily: F.main, fontSize: '9px', color: isRec ? 'rgba(244,240,237,0.55)' : C.lightClay }}>Year 2+</span>
                  <span style={{ fontFamily: F.main, fontSize: '13px', color: isRec ? 'rgba(244,240,237,0.75)' : C.clay }}>${totalY2.toLocaleString()} / yr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: F.main, fontSize: '9px', color: isRec ? 'rgba(244,240,237,0.55)' : C.lightClay }}>Base Payback</span>
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
      period: 'Weeks 1–3',
      title: 'Foundation & Core Build',
      items: [
        'Requirements gathering and technical scoping',
        'MS Access database integration and indexing',
        'Core AI comparison engine development',
        'PDF upload pipeline and initial UI',
        'Internal testing with sample jobs',
      ],
    },
    {
      period: 'Weeks 4–6',
      title: 'Refinement & Deployment',
      items: [
        'AI model tuning based on drafter feedback',
        'Result scoring and ranking refinement',
        'Full production deployment to live environment',
        'QSHF drafter training and onboarding',
        '50+ live jobs validated in production',
      ],
    },
    {
      period: 'Week 7+',
      title: 'Live & Maintained',
      items: [
        'Ongoing performance monitoring',
        'Continuous improvement from drafter feedback',
        'Bug resolution and version updates',
        'Quarterly review of match accuracy',
      ],
    },
  ]
  return (
    <Wrap justify="flex-start" section="The Solution">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '32px' }}>Timeline</div>

      {/* Period labels */}
      <div style={{ display: 'flex', marginBottom: '24px' }}>
        {phases.map((p, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ fontFamily: F.main, fontSize: '22px', color: C.obsidian }}>{p.period}</div>
          </div>
        ))}
      </div>

      {/* Horizontal timeline line + dots */}
      <div style={{ position: 'relative', marginBottom: '28px', height: '12px' }}>
        {/* Line */}
        <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'rgba(0,0,0,0.18)', transform: 'translateY(-50%)' }} />
        {/* Dots */}
        <div style={{ display: 'flex', position: 'relative' }}>
          {phases.map((_, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: C.red }} />
            </div>
          ))}
        </div>
      </div>

      {/* Content below timeline */}
      <div style={{ display: 'flex', flex: 1, marginBottom: '24px' }}>
        {phases.map((p, i) => (
          <div key={i} style={{ flex: 1, paddingRight: '32px' }}>
            <div style={{ fontFamily: F.main, fontSize: '18px', color: C.obsidian, marginBottom: '12px', lineHeight: 1.3 }}>{p.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {p.items.map((item, j) => (
                <div key={j} style={{ fontFamily: F.main, fontSize: '12px', color: C.obsidian, opacity: 0.65, lineHeight: 1.5 }}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: C.white, border: '1.5px solid #000', borderRadius: '4px', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontFamily: F.main, fontSize: '10px', color: '#000' }}>Next step</div>
        <div style={{ width: '1px', height: '18px', background: 'rgba(0,0,0,0.25)' }} />
        <div style={{ fontFamily: F.main, fontSize: '17px', color: '#000' }}>Begin development of solution when letter of engagement signed</div>
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
        <div style={{ fontFamily: F.main, fontSize: '10px', color: 'rgba(244,240,237,0.7)' }}>
          Queensland Steel House Frames
        </div>
        <img src={`${import.meta.env.BASE_URL}clearai-logo.png`} alt="ClearAI" style={{ height: '22px' }} />
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
        <div style={{ fontFamily: F.main, fontSize: '10px', color: 'rgba(244,240,237,0.55)' }}>
          AI Drafting Copy Agent — Proposal 09-04-2026
        </div>
        <DotIcon size={13} gap={0} color={C.red} />
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
    <Wrap justify="flex-start" section="Appendix">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>Appendix</div>
      <div style={{ fontFamily: F.main, fontSize: '24px', color: C.obsidian, marginBottom: '36px' }}>Workflow of the Solution</div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {i < steps.length - 1 && (
              <div style={{ position: 'absolute', top: '20px', left: '50%', right: '-50%', height: '1px', background: C.lightClay }} />
            )}
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: C.clay, color: C.parchment, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.main, fontSize: '11px', fontWeight: 700, position: 'relative', zIndex: 1, marginBottom: '14px' }}>{s.num}</div>
            <div style={{ padding: '0 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: F.main, fontSize: '10px', color: C.clay, marginBottom: '7px' }}>{s.title}</div>
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
            <th key={i} style={{ padding: '9px 12px', background: C.obsidian, fontFamily: F.main, fontSize: '9px', color: C.parchment, textAlign: i === 0 ? 'left' : 'center' }}>{h}</th>
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
    <Wrap justify="flex-start" section="Appendix">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>Appendix</div>
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
    <Wrap justify="flex-start" section="Appendix">
      <div style={{ fontFamily: F.main, fontSize: '52px', lineHeight: 1.05, color: '#000', marginBottom: '16px' }}>Appendix</div>
      <div style={{ fontFamily: F.main, fontSize: '24px', color: C.obsidian, marginBottom: '24px' }}>Further Assumptions — AI Search Costs</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr>
            {['Cost Component', 'Pricing Tier', 'Annual Total (AUD)', 'Purpose'].map((h, i) => (
              <th key={i} style={{ padding: '10px 16px', background: C.obsidian, fontFamily: F.main, fontSize: '10px', color: C.parchment, textAlign: i === 0 ? 'left' : 'center' }}>{h}</th>
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
        <div style={{ fontFamily: F.main, fontSize: '10px', color: C.clay }}>Total annual API cost</div>
        <div style={{ fontFamily: F.main, fontSize: '24px', color: C.clay, fontWeight: 700 }}>$1,333.50 / year</div>
      </div>
    </Wrap>
  )
}

/* ── SLIDE 14: EXPORT PDF ── */
function S14({ exportPDF }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: C.obsidian,
      display: 'flex', flexDirection: 'column',
      padding: '40px 56px',
      boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: F.main, fontSize: '10px', color: 'rgba(244,240,237,0.7)' }}>
          Queensland Steel House Frames
        </div>
        <img src={`${import.meta.env.BASE_URL}clearai-logo.png`} alt="ClearAI" style={{ height: '22px' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '28px' }}>
        <div style={{ fontFamily: F.main, fontSize: 'clamp(32px, 4vw, 56px)', color: '#F4F0ED', lineHeight: 1.1, textAlign: 'center' }}>
          Export this Presentation
        </div>
        <button
          onClick={exportPDF}
          style={{
            fontFamily: F.main, fontSize: '15px',
            background: C.red, color: C.parchment,
            border: 'none', borderRadius: '4px',
            padding: '14px 40px', cursor: 'pointer',
          }}
        >
          Export PDF
        </button>
        <div style={{ fontFamily: F.main, fontSize: '12px', color: 'rgba(244,240,237,0.35)' }}>
          Generates a PDF of all slides
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: F.main, fontSize: '10px', color: 'rgba(244,240,237,0.55)' }}>
          AI Drafting Copy Agent — Proposal 09-04-2026
        </div>
        <DotIcon size={13} gap={0} color={C.red} />
      </div>
    </div>
  )
}

/* ── MAIN COMPONENT ── */
const SLIDES = [S00, SVC, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13]

const QSHFPitchDeck = forwardRef(function QSHFPitchDeck(_props, ref) {
  const [slide, setSlide] = useState(0)
  const [animDir, setAnimDir] = useState('right')
  const [animKey, setAnimKey] = useState(0)
  const [calc, setCalc] = useState(DEFAULT_CALC)
  const [isExporting, setIsExporting] = useState(false)
  const captureRef = useRef(null)
  const isExportingRef = useRef(false)
  const slideValueRef = useRef(0)
  useEffect(() => { slideValueRef.current = slide }, [slide])

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

  const exportPDF = useCallback(async () => {
    if (isExportingRef.current) return
    isExportingRef.current = true
    setIsExporting(true)
    const originalSlide = slideValueRef.current
    try {
      const { jsPDF } = await import('jspdf')
      const el = captureRef.current
      const w = el.offsetWidth
      const h = el.offsetHeight
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [w, h], hotfixes: ['px_scaling'] })
      for (let i = 0; i < TOTAL; i++) {
        setSlide(i)
        await new Promise(r => setTimeout(r, 300))
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false, backgroundColor: (i === 0 || i === 10) ? '#22190C' : '#ffffff' })
        if (i > 0) pdf.addPage([w, h], 'landscape')
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h)
      }
      pdf.save(`QSHF-pitch-deck-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setSlide(originalSlide)
      isExportingRef.current = false
      setIsExporting(false)
    }
  }, [])

  useImperativeHandle(ref, () => ({ exportPDF }), [exportPDF])

  const SlideContent = SLIDES[slide]

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 52px)', background: C.white, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`
        @keyframes slideInR { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInL { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: translateX(0); } }
        .sir { animation: slideInR 0.32s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
        .sil { animation: slideInL 0.32s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
      `}</style>

      <div ref={captureRef} style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div key={isExporting ? 'export' : animKey} className={isExporting ? '' : (animDir === 'right' ? 'sir' : 'sil')} style={{ width: '100%', height: '100%' }}>
          <SlideContent calc={calc} setCalc={setCalc} exportPDF={exportPDF} />
        </div>
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

        <div style={{ fontFamily: F.main, fontSize: '10px', color: 'rgba(244,240,237,0.4)' }}>
          {String(slide + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </div>

        <button
          onClick={exportPDF}
          disabled={isExporting}
          title="Export PDF"
          style={{ background: 'transparent', border: '1px solid rgba(244,240,237,0.25)', color: isExporting ? 'rgba(244,240,237,0.2)' : C.parchment, width: '30px', height: '30px', borderRadius: '4px', cursor: isExporting ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 1v7M3.5 5.5l3 3 3-3M2 10.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={next}
          disabled={slide === TOTAL - 1}
          style={{ background: 'transparent', border: '1px solid rgba(244,240,237,0.25)', color: slide === TOTAL - 1 ? 'rgba(244,240,237,0.2)' : C.parchment, width: '30px', height: '30px', borderRadius: '4px', cursor: slide === TOTAL - 1 ? 'default' : 'pointer', fontFamily: F.main, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >&#8594;</button>
      </div>
    </div>
  )
})

export default QSHFPitchDeck
