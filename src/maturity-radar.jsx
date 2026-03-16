import React, { useState } from 'react';

const COLORS = {
  parchment: '#F4F0ED',
  obsidian: '#22190C',
  clay: '#834A33',
  red: '#FF4832',
};

const FONTS = {
  primary: 'Georgia, serif',
  mono: "'Space Mono', monospace",
};

const dimensions = [
  { label: 'Data & Information\nManagement', current: 2.5, target: 3.5, justification: 'Multiple disconnected systems. Manual double-entry is the norm. GivingData API partially unlocked.', goalState: 'Single source of truth across GivingData, Airtable, and Drive. Automated sync. Data quality monitoring in place.' },
  { label: 'Technology\nInfrastructure', current: 3.0, target: 4.0, justification: 'Defined stack with Google Workspace. N8N in pilot across 2 use cases (Airtable chat, GivingData sync). Multi-model architecture planned but not yet operational.', goalState: 'Multi-model AI architecture operational. N8N in production. MCP connecting all systems. Cross-platform orchestration reliable.' },
  { label: 'AI Adoption\n& Usage', current: 3.0, target: 4.0, justification: 'No formal AI strategy yet (this roadmap will feed it). Active power users (~10), but bimodal adoption pattern persists across ~30 staff.', goalState: 'AI strategy endorsed by board. Majority of staff using AI tools weekly. Named agents embedded in core workflows.' },
  { label: 'People\n& Skills', current: 3.0, target: 3.5, justification: 'Comprehensive training delivered. Builder capacity thin (3-4 people). Key person risks are severe.', goalState: 'AI champions in every portfolio. Knowledge captured before departures. Builder capacity no longer dependent on one person.' },
  { label: 'Governance\n& Ethics', current: 3.5, target: 4.0, justification: 'Strongest dimension. Signed AI Guidelines. AI champions and power users driving adoption (9 identified). Data sovereignty identified but not resolved.', goalState: 'Data sovereignty protocols implemented. AI ethics review process operational. Stage-gate governance for each wave.' },
  { label: 'Process\n& Automation', current: 2.5, target: 3.5, justification: 'Second-weakest dimension. N8N in pilot but not yet in production. Most workflows remain manual.', goalState: 'Core workflows automated (DD, board packs, data sync). Manual processes documented and queued for automation.' },
];

const MAX_SCORE = 5;
const RINGS = [1, 2, 3, 4, 5];

export default function MaturityRadar() {
  const [hovered, setHovered] = useState(null);

  const cx = 400;
  const cy = 320;
  const radius = 220;
  const n = dimensions.length;

  const angleFor = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const pointAt = (i, value) => {
    const angle = angleFor(i);
    const r = (value / MAX_SCORE) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const polygonPoints = (key) =>
    dimensions.map((d, i) => {
      const p = pointAt(i, d[key]);
      return `${p.x},${p.y}`;
    }).join(' ');

  const renderMultilineText = (text, x, y, anchor, fontSize) => {
    const lines = text.split('\n');
    return lines.map((line, i) => (
      <text
        key={i}
        x={x}
        y={y + i * (fontSize + 2)}
        textAnchor={anchor}
        style={{
          fontFamily: FONTS.mono,
          fontSize,
          fill: COLORS.obsidian,
          dominantBaseline: 'middle',
        }}
      >
        {line}
      </text>
    ));
  };

  return (
    <div style={{
      background: COLORS.parchment,
      padding: '40px',
      fontFamily: FONTS.primary,
      maxWidth: 860,
      margin: '0 auto',
    }}>
      <h2 style={{
        fontFamily: FONTS.primary,
        color: COLORS.obsidian,
        fontSize: 28,
        fontWeight: 'normal',
        margin: '0 0 4px 0',
        textAlign: 'center',
      }}>
        AI Maturity Assessment
      </h2>
      <p style={{
        fontFamily: FONTS.mono,
        color: COLORS.clay,
        fontSize: 13,
        margin: '0 0 8px 0',
        textAlign: 'center',
        letterSpacing: '0.5px',
      }}>
        Yajilarra Trust — March 2026
      </p>
      <div style={{
        textAlign: 'center',
        marginBottom: 24,
      }}>
        <span style={{
          fontFamily: FONTS.primary,
          fontSize: 48,
          color: COLORS.obsidian,
          fontWeight: 'normal',
        }}>2.9</span>
        <span style={{
          fontFamily: FONTS.mono,
          fontSize: 18,
          color: COLORS.clay,
          marginLeft: 4,
        }}> / 5.0</span>
        <p style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: COLORS.clay,
          margin: '2px 0 0 0',
          letterSpacing: '0.5px',
        }}>OVERALL MATURITY SCORE</p>
      </div>

      <svg viewBox="0 0 800 660" style={{ width: '100%', height: 'auto' }}>
        {/* Grid rings */}
        {RINGS.map((ring) => {
          const r = (ring / MAX_SCORE) * radius;
          const pts = Array.from({ length: n }, (_, i) => {
            const angle = angleFor(i);
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          }).join(' ');
          return (
            <polygon
              key={ring}
              points={pts}
              fill="none"
              stroke={COLORS.obsidian}
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          );
        })}

        {/* Ring labels */}
        {RINGS.map((ring) => {
          const r = (ring / MAX_SCORE) * radius;
          return (
            <text
              key={ring}
              x={cx + 6}
              y={cy - r + 4}
              style={{
                fontFamily: FONTS.mono,
                fontSize: 9,
                fill: COLORS.obsidian,
                opacity: 0.35,
              }}
            >
              {ring}
            </text>
          );
        })}

        {/* Axis lines */}
        {dimensions.map((_, i) => {
          const outer = pointAt(i, MAX_SCORE);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke={COLORS.obsidian}
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          );
        })}

        {/* Target polygon (dashed, red) */}
        <polygon
          points={polygonPoints('target')}
          fill={COLORS.red}
          fillOpacity={0.06}
          stroke={COLORS.red}
          strokeWidth={2}
          strokeDasharray="8 4"
        />

        {/* Current polygon (clay, filled) */}
        <polygon
          points={polygonPoints('current')}
          fill={COLORS.clay}
          fillOpacity={0.15}
          stroke={COLORS.clay}
          strokeWidth={2.5}
        />

        {/* Data points - current */}
        {dimensions.map((d, i) => {
          const p = pointAt(i, d.current);
          return (
            <circle
              key={`current-${i}`}
              cx={p.x}
              cy={p.y}
              r={5}
              fill={COLORS.clay}
              stroke={COLORS.parchment}
              strokeWidth={2}
            />
          );
        })}

        {/* Data points - target */}
        {dimensions.map((d, i) => {
          const p = pointAt(i, d.target);
          return (
            <circle
              key={`target-${i}`}
              cx={p.x}
              cy={p.y}
              r={4}
              fill="none"
              stroke={COLORS.red}
              strokeWidth={2}
            />
          );
        })}

        {/* Axis labels */}
        {dimensions.map((d, i) => {
          const angle = angleFor(i);
          const labelR = radius + 40;
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy + labelR * Math.sin(angle);
          const anchor =
            Math.abs(Math.cos(angle)) < 0.1
              ? 'middle'
              : Math.cos(angle) > 0
              ? 'start'
              : 'end';
          const lines = d.label.split('\n');
          const offsetY = -(lines.length - 1) * 7;
          return (
            <g key={`label-${i}`}>
              {renderMultilineText(d.label, lx, ly + offsetY, anchor, 11)}
            </g>
          );
        })}

        {/* Hover zones — pie-slice wedges for reliable hit areas */}
        {dimensions.map((d, i) => {
          const sliceAngle = (Math.PI * 2) / n;
          const startAngle = angleFor(i) - sliceAngle / 2;
          const endAngle = angleFor(i) + sliceAngle / 2;
          const zoneR = radius + 35;
          const x1 = cx + zoneR * Math.cos(startAngle);
          const y1 = cy + zoneR * Math.sin(startAngle);
          const x2 = cx + zoneR * Math.cos(endAngle);
          const y2 = cy + zoneR * Math.sin(endAngle);
          const largeArc = sliceAngle > Math.PI ? 1 : 0;
          const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${zoneR} ${zoneR} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          return (
            <path
              key={`zone-${i}`}
              d={pathD}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}

        {/* Tooltip */}
        {hovered !== null && (() => {
          const d = dimensions[hovered];
          const tp = pointAt(hovered, (d.current + d.target) / 2);
          const tooltipW = 320;
          const maxChars = 50;

          const wrapText = (text) => {
            const words = text.split(' ');
            const lines = [];
            let line = '';
            words.forEach((w) => {
              if ((line + ' ' + w).trim().length > maxChars) {
                lines.push(line.trim());
                line = w;
              } else {
                line = (line + ' ' + w).trim();
              }
            });
            if (line) lines.push(line.trim());
            return lines;
          };

          const justLines = wrapText(d.justification);
          const goalLines = wrapText(d.goalState);
          const tooltipH = 52 + justLines.length * 13 + goalLines.length * 13;

          let tx = tp.x + 15;
          let ty = tp.y - tooltipH / 2;
          if (tx + tooltipW > 790) tx = tp.x - tooltipW - 15;
          if (ty < 5) ty = 5;
          if (ty + tooltipH > 655) ty = 655 - tooltipH;

          const goalStartY = 40 + justLines.length * 13;

          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect
                x={tx}
                y={ty}
                width={tooltipW}
                height={tooltipH}
                rx={3}
                fill={COLORS.obsidian}
                fillOpacity={0.95}
              />
              <text
                x={tx + 12}
                y={ty + 18}
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  fill: COLORS.parchment,
                  fontWeight: 'bold',
                }}
              >
                Current: {d.current.toFixed(1)}  |  Target: {d.target.toFixed(1)}  |  Gap: {(d.target - d.current).toFixed(1)}
              </text>
              {justLines.map((l, li) => (
                <text
                  key={`j-${li}`}
                  x={tx + 12}
                  y={ty + 36 + li * 13}
                  style={{
                    fontFamily: FONTS.primary,
                    fontSize: 10,
                    fill: COLORS.parchment,
                    opacity: 0.8,
                  }}
                >
                  {l}
                </text>
              ))}
              <text
                x={tx + 12}
                y={ty + goalStartY}
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 9,
                  fill: COLORS.red,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Goal State
              </text>
              {goalLines.map((l, li) => (
                <text
                  key={`g-${li}`}
                  x={tx + 12}
                  y={ty + goalStartY + 14 + li * 13}
                  style={{
                    fontFamily: FONTS.primary,
                    fontSize: 10,
                    fill: COLORS.parchment,
                    opacity: 0.7,
                  }}
                >
                  {l}
                </text>
              ))}
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
        marginTop: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="24" height="12">
            <line x1="0" y1="6" x2="24" y2="6" stroke={COLORS.clay} strokeWidth={2.5} />
            <circle cx="12" cy="6" r="4" fill={COLORS.clay} />
          </svg>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.obsidian }}>
            Current State (Mar 2026)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="24" height="12">
            <line x1="0" y1="6" x2="24" y2="6" stroke={COLORS.red} strokeWidth={2} strokeDasharray="4 2" />
            <circle cx="12" cy="6" r="3.5" fill="none" stroke={COLORS.red} strokeWidth={2} />
          </svg>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.obsidian }}>
            Target State (Jun 2027)
          </span>
        </div>
      </div>
    </div>
  );
}
