import React, { useState } from 'react';

const COLORS = {
  parchment: '#F4F0ED',
  obsidian: '#22190C',
  clay: '#834A33',
  red: '#FF4832',
  lightBrown: '#B8917E',
};

const FONTS = {
  primary: 'Georgia, serif',
  mono: "'Space Mono', monospace",
};

const RINGS = ['Now', 'Soon', 'Later'];
const RING_RADII = [130, 230, 310];

const QUADRANTS = [
  { name: 'Platforms &\nInfrastructure', startAngle: -90, endAngle: 0 },
  { name: 'AI Models &\nReasoning', startAngle: 0, endAngle: 90 },
  { name: 'Agent Frameworks\n& Automation', startAngle: 90, endAngle: 180 },
  { name: 'Applications &\nInterfaces', startAngle: 180, endAngle: 270 },
];

// Framing: "When should Yajilarra deploy this?" — not global availability, but client readiness.
// Now = Wave 1 (Apr-Jun 2026), Soon = Wave 2 (Jul 2026-Jun 2027), Later = Wave 3 (Jul 2027+)
// confidence: 'high' = Obsidian, 'medium' = Clay, 'low' = lightBrown
const technologies = [
  // Platforms & Infrastructure — quadrant 0 (top-right, -90 to 0)
  { name: 'Google Workspace', ring: 'Now', quadrant: 0, confidence: 'high', note: 'Already deployed. Gmail, Drive, Docs, Sheets, Meet, Calendar.' },
  { name: 'Airtable', ring: 'Now', quadrant: 0, confidence: 'high', note: '4 portfolio databases in production. Core operational platform.' },
  { name: 'GivingData', ring: 'Now', quadrant: 0, confidence: 'high', note: 'Grant management. API unlocking in progress. Sync build starts April.' },
  { name: 'Workspace CLI', ring: 'Now', quadrant: 0, confidence: 'high', note: 'Agent access to Workspace data. Enables .md knowledge base builds.' },
  { name: 'Knowledge API', ring: 'Later', quadrant: 0, confidence: 'low', note: 'Sector-shareable knowledge infrastructure. Board approval needed. 2028+.' },

  // AI Models & Reasoning — quadrant 1 (bottom-right, 0 to 90)
  { name: 'Gemini 3.1 Pro', ring: 'Now', quadrant: 1, confidence: 'high', note: 'Primary model. Deep Workspace integration. Free nonprofit tier.' },
  { name: 'Claude Opus/Sonnet', ring: 'Now', quadrant: 1, confidence: 'high', note: 'Trial starts April. Best for DD, board notes, impact analysis.' },
  { name: 'NotebookLM', ring: 'Now', quadrant: 1, confidence: 'high', note: 'Portfolio knowledge. JC proved it — 95% accuracy on partner history.' },
  { name: 'Perplexity', ring: 'Now', quadrant: 1, confidence: 'high', note: 'Research with citations. Already used for partner discovery.' },
  { name: 'Domain-Specific Agents', ring: 'Soon', quadrant: 1, confidence: 'medium', note: 'Specialised DD, stewardship, and impact agents. After Wave 1 proves the pattern.' },
  { name: 'Digital Twins', ring: 'Later', quadrant: 1, confidence: 'low', note: 'Portfolio simulation and scenario modelling. Requires mature data layer.' },

  // Agent Frameworks & Automation — quadrant 2 (bottom-left, 90 to 180)
  { name: 'N8N', ring: 'Now', quadrant: 2, confidence: 'high', note: 'Automation backbone. 500+ integrations. JC-approved. Deploy April.' },
  { name: 'Claude Code', ring: 'Now', quadrant: 2, confidence: 'high', note: 'Agent development platform. This roadmap is proof of concept.' },
  { name: 'MCP', ring: 'Now', quadrant: 2, confidence: 'high', note: 'Universal AI-to-tool connector. 97M+ monthly SDK downloads.' },
  { name: 'Claude Cowork', ring: 'Now', quadrant: 2, confidence: 'high', note: 'Scheduled persistent agents within Claude. Deploy with trial.' },
  { name: 'Multi-Agent Systems', ring: 'Soon', quadrant: 2, confidence: 'medium', note: 'Orchestrated agent teams. Prove singles first, orchestrate in Wave 2.' },
  { name: 'Autonomous Agents', ring: 'Later', quadrant: 2, confidence: 'low', note: 'Multi-day autonomous work. METR data says 12-18 months from reliable.' },

  // Applications & Interfaces — quadrant 3 (top-left, 180 to 270)
  { name: 'Workspace Flows', ring: 'Now', quadrant: 3, confidence: 'high', note: 'Email summaries, calendar scanning. Already deployed for Meg.' },
  { name: 'Gemini Gems', ring: 'Now', quadrant: 3, confidence: 'high', note: '3+ Gems live. Board Notes, Impact Flashcards, Financial Analysis.' },
  { name: 'Slack Bot', ring: 'Now', quadrant: 3, confidence: 'high', note: 'Talk to Yaj Data — queries across 4 Airtable portfolio databases.' },
  { name: 'Workspace Studio', ring: 'Now', quadrant: 3, confidence: 'medium', note: 'No-code agents. GA March 2026. Mediocre but usable where it fits.' },
  { name: 'Looker Studio', ring: 'Now', quadrant: 3, confidence: 'medium', note: 'Free dashboards. Deploy once data integration is connected.' },
  { name: 'YajiBot', ring: 'Later', quadrant: 3, confidence: 'low', note: 'Full institutional knowledge system. Requires curated corpus. 2027+.' },
];

export default function TechRadar() {
  const [hovered, setHovered] = useState(null);

  const cx = 400;
  const cy = 370;
  const outerR = RING_RADII[2] + 20;

  const colorFor = (conf) => {
    if (conf === 'high') return COLORS.obsidian;
    if (conf === 'medium') return COLORS.clay;
    return COLORS.lightBrown;
  };

  // Place dots within their quadrant and ring
  const getDotPosition = (tech, index, quadrantTechs) => {
    const q = QUADRANTS[tech.quadrant];
    const ringIdx = RINGS.indexOf(tech.ring);
    const innerR = ringIdx === 0 ? 30 : RING_RADII[ringIdx - 1] + 8;
    const outerRing = RING_RADII[ringIdx] - 8;
    const midR = (innerR + outerRing) / 2;

    // Spread dots within the quadrant angle range
    const startDeg = q.startAngle;
    const endDeg = q.endAngle;
    const sameRingInQuadrant = quadrantTechs.filter((t) => t.ring === tech.ring);
    const idxInRing = sameRingInQuadrant.indexOf(tech);
    const count = sameRingInQuadrant.length;
    const padding = 12;
    const spread = endDeg - startDeg - padding * 2;
    const step = count > 1 ? spread / (count - 1) : 0;
    const angleDeg = startDeg + padding + step * idxInRing + (count === 1 ? spread / 2 : 0);

    // Vary radius slightly to avoid overlaps
    const rJitter = (idxInRing % 2 === 0 ? -1 : 1) * (ringIdx === 0 ? 12 : 18) * (idxInRing % 3 === 0 ? 0.5 : 0.3);
    const r = midR + rJitter;

    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  // Group techs by quadrant for positioning
  const quadrantTechs = QUADRANTS.map((_, qi) => technologies.filter((t) => t.quadrant === qi));
  const techPositions = technologies.map((tech) => {
    const qTechs = quadrantTechs[tech.quadrant];
    const pos = getDotPosition(tech, 0, qTechs);
    return { ...tech, ...pos };
  });

  return (
    <div style={{
      background: COLORS.parchment,
      padding: '40px',
      fontFamily: FONTS.primary,
      maxWidth: 880,
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
        Technology Radar
      </h2>
      <p style={{
        fontFamily: FONTS.mono,
        color: COLORS.clay,
        fontSize: 13,
        margin: '0 0 20px 0',
        textAlign: 'center',
        letterSpacing: '0.5px',
      }}>
        When should Yajilarra deploy? — {technologies.length} technologies assessed
      </p>

      <svg viewBox="0 0 900 760" style={{ width: '100%', height: 'auto' }}>
        {/* Ring circles */}
        {RING_RADII.map((r, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={COLORS.obsidian}
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        ))}

        {/* Ring fill for Now */}
        <circle cx={cx} cy={cy} r={RING_RADII[0]} fill={COLORS.clay} fillOpacity={0.04} />

        {/* Ring labels */}
        {RINGS.map((label, i) => {
          const r = i === 0 ? RING_RADII[0] / 2 : (RING_RADII[i - 1] + RING_RADII[i]) / 2;
          return (
            <text
              key={label}
              x={cx}
              y={cy - r}
              textAnchor="middle"
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                fill: COLORS.obsidian,
                opacity: 0.2,
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              {label}
            </text>
          );
        })}

        {/* Quadrant dividers */}
        {QUADRANTS.map((q, i) => {
          const angleDeg = q.startAngle;
          const angleRad = (angleDeg * Math.PI) / 180;
          const r = RING_RADII[2] + 5;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + r * Math.cos(angleRad)}
              y2={cy + r * Math.sin(angleRad)}
              stroke={COLORS.obsidian}
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          );
        })}

        {/* Quadrant labels */}
        {QUADRANTS.map((q, i) => {
          const midAngle = ((q.startAngle + q.endAngle) / 2) * Math.PI / 180;
          const labelR = RING_RADII[2] + 48;
          const lx = cx + labelR * Math.cos(midAngle);
          const ly = cy + labelR * Math.sin(midAngle);
          const lines = q.name.split('\n');
          return (
            <g key={`qlabel-${i}`}>
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={lx}
                  y={ly + (li - (lines.length - 1) / 2) * 14}
                  textAnchor="middle"
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    fill: COLORS.obsidian,
                    opacity: 0.45,
                    letterSpacing: '0.5px',
                  }}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* Technology dots */}
        {techPositions.map((tech, i) => {
          const isHovered = hovered === i;
          return (
            <g
              key={tech.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={tech.x}
                cy={tech.y}
                r={isHovered ? 8 : 6}
                fill={colorFor(tech.confidence)}
                fillOpacity={isHovered ? 1 : 0.8}
                stroke={COLORS.parchment}
                strokeWidth={1.5}
              />
              {/* Label next to dot — full name, no truncation */}
              {!isHovered && (
                <text
                  x={tech.x + 9}
                  y={tech.y + 3}
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 7,
                    fill: COLORS.obsidian,
                    opacity: 0.6,
                  }}
                >
                  {tech.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {hovered !== null && (() => {
          const tech = techPositions[hovered];
          const tooltipW = 300;
          const tooltipH = 64;
          let tx = tech.x + 16;
          let ty = tech.y - tooltipH / 2;
          if (tx + tooltipW > 890) tx = tech.x - tooltipW - 16;
          if (ty < 5) ty = 5;
          if (ty + tooltipH > 755) ty = 755 - tooltipH;
          return (
            <g>
              <rect x={tx} y={ty} width={tooltipW} height={tooltipH} rx={3} fill={COLORS.obsidian} fillOpacity={0.95} />
              <text x={tx + 10} y={ty + 17} style={{ fontFamily: FONTS.mono, fontSize: 11, fill: COLORS.parchment, fontWeight: 'bold' }}>
                {tech.name}
              </text>
              <text x={tx + 10} y={ty + 32} style={{ fontFamily: FONTS.mono, fontSize: 9, fill: colorFor(tech.confidence) === COLORS.obsidian ? COLORS.clay : colorFor(tech.confidence) }}>
                {tech.ring.toUpperCase()} · {tech.confidence} confidence
              </text>
              {(() => {
                const maxChars = 50;
                const words = tech.note.split(' ');
                const lines = [];
                let line = '';
                words.forEach((w) => {
                  if ((line + ' ' + w).trim().length > maxChars) { lines.push(line.trim()); line = w; } else { line = (line + ' ' + w).trim(); }
                });
                if (line) lines.push(line.trim());
                return lines.slice(0, 2).map((l, li) => (
                  <text key={li} x={tx + 10} y={ty + 47 + li * 11} style={{ fontFamily: FONTS.primary, fontSize: 9, fill: COLORS.parchment, opacity: 0.75 }}>
                    {l}{li === 1 && lines.length > 2 ? '...' : ''}
                  </text>
                ));
              })()}
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        marginTop: 4,
        flexWrap: 'wrap',
      }}>
        {[
          { color: COLORS.obsidian, label: 'High confidence' },
          { color: COLORS.clay, label: 'Medium confidence' },
          { color: COLORS.lightBrown, label: 'Lower confidence' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12">
              <circle cx="6" cy="6" r="5" fill={item.color} fillOpacity={0.8} />
            </svg>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.obsidian }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
