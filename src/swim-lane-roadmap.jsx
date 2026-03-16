import React, { useState } from 'react';

const COLORS = {
  parchment: '#F4F0ED',
  obsidian: '#22190C',
  clay: '#834A33',
  red: '#FF4832',
  lightClay: '#C9A494',
};

const FONTS = {
  primary: 'Georgia, serif',
  mono: "'Space Mono', monospace",
};

// Timeline: Apr 2026 = 0, Dec 2029 = 45 months
const START_DATE = new Date(2026, 3, 1); // Apr 2026
const END_DATE = new Date(2029, 11, 31); // Dec 2029
const TOTAL_MONTHS = 45;

const toMonth = (year, month) => (year - 2026) * 12 + (month - 4); // Apr 2026 = 0

const waves = [
  { name: 'Wave 1: Prove & Build', start: toMonth(2026, 4), end: toMonth(2026, 6), color: COLORS.clay, opacity: 0.08 },
  { name: 'Wave 2: Scale & Integrate', start: toMonth(2026, 7), end: toMonth(2027, 6), color: COLORS.clay, opacity: 0.04 },
  { name: 'Wave 3: Preserve & Transfer', start: toMonth(2027, 7), end: toMonth(2029, 12), color: COLORS.obsidian, opacity: 0.03 },
];

const lanes = [
  'Quick Wins & Adoption',
  'Data Integration',
  'Agent Deployment',
  'Knowledge Preservation',
];

const useCaseBlocks = [
  // Quick Wins & Adoption (lane 0)
  { lane: 0, start: toMonth(2026, 4), end: toMonth(2026, 4), name: 'Board Note Assistant v3', desc: 'Claude upgrade with portfolio YAMLs' },
  { lane: 0, start: toMonth(2026, 4), end: toMonth(2026, 4), name: 'Email Summaries Scale-out', desc: 'Replicate Meg\'s Workspace Flow to all staff' },
  { lane: 0, start: toMonth(2026, 4), end: toMonth(2026, 4), name: 'Impact Flashcards v2', desc: 'Claude-enhanced for messy partner reports' },
  { lane: 0, start: toMonth(2026, 4), end: toMonth(2026, 5), name: 'Financial Analysis Gem', desc: 'Scale Erin\'s proven gem to all portfolio leads' },
  { lane: 0, start: toMonth(2026, 5), end: toMonth(2026, 5), name: 'Partner Discovery Workflow', desc: 'Claude + Perplexity prompt templates' },
  { lane: 0, start: toMonth(2026, 5), end: toMonth(2026, 5), name: 'Contract Review (Claude)', desc: 'Claude Project with Yajilarra contract standards' },
  { lane: 0, start: toMonth(2026, 6), end: toMonth(2026, 6), name: 'Infographic Hybrid Workflow', desc: 'Google Slides + Gemini + Canva/Venngage' },
  { lane: 0, start: toMonth(2026, 6), end: toMonth(2026, 6), name: 'Performance Review Asst.', desc: 'Finish what Christy started in 1:1' },
  { lane: 0, start: toMonth(2026, 7), end: toMonth(2026, 9), name: 'Workspace Studio Email Agent', desc: 'Simple email triage/summary agent' },
  { lane: 0, start: toMonth(2026, 10), end: toMonth(2027, 3), name: 'Dynamic Charts (Looker)', desc: 'Replaces Power BI with accessible dashboards' },
  { lane: 0, start: toMonth(2027, 1), end: toMonth(2027, 6), name: 'AI Champion Playbooks', desc: 'Formalised champion model per team' },

  // Data Integration (lane 1)
  { lane: 1, start: toMonth(2026, 5), end: toMonth(2026, 6), name: 'GD-Airtable Common Link Design', desc: 'ClearAI + Sinclaire pairing. Design the data bridge.' },
  { lane: 1, start: toMonth(2026, 5), end: toMonth(2026, 6), name: 'N8N: Documentation Alerts', desc: 'First production workflow: missing-doc Slack alerts' },
  { lane: 1, start: toMonth(2026, 6), end: toMonth(2026, 6), name: 'GivingData API Full Config', desc: 'Published grants endpoint. All endpoints tested.' },
  { lane: 1, start: toMonth(2026, 6), end: toMonth(2026, 7), name: 'GD-Airtable Sync Prototype', desc: 'First data sync running in test mode' },
  { lane: 1, start: toMonth(2026, 7), end: toMonth(2026, 9), name: 'GD-Airtable Sync Production', desc: 'Full sync eliminating manual double-entry' },
  { lane: 1, start: toMonth(2026, 9), end: toMonth(2026, 10), name: 'Grant Auto-Creation + Slack', desc: 'Auto-create grant records with Slack notification' },
  { lane: 1, start: toMonth(2026, 10), end: toMonth(2027, 3), name: 'Portfolio Console v1', desc: 'Cross-portfolio visibility across 10 Theories of Change' },
  { lane: 1, start: toMonth(2027, 1), end: toMonth(2027, 3), name: 'Finance Reconciliation', desc: 'N8N + Xero + GivingData automation' },
  { lane: 1, start: toMonth(2027, 4), end: toMonth(2027, 6), name: 'Portfolio Console v2', desc: 'AI narrative synthesis for board reporting' },
  { lane: 1, start: toMonth(2027, 7), end: toMonth(2028, 6), name: 'Portfolio Console v3', desc: 'Full intelligence with live data + predictive analytics' },

  // Agent Deployment (lane 2)
  { lane: 2, start: toMonth(2026, 5), end: toMonth(2026, 6), name: 'Grant Stewardship Agent v1', desc: 'Monitors renewals from Airtable, flags risks in Slack' },
  { lane: 2, start: toMonth(2026, 4), end: toMonth(2026, 5), name: 'DD Liberation Engine v1', desc: 'Claude Project for First Nations DD research' },
  { lane: 2, start: toMonth(2026, 6), end: toMonth(2026, 7), name: 'DD Liberation Engine v2', desc: 'Agentic: web research, financial summary, governance check' },
  { lane: 2, start: toMonth(2026, 6), end: toMonth(2026, 7), name: 'Board Prep Conductor v1', desc: 'Assembles board note drafts from data + notes + financials' },
  { lane: 2, start: toMonth(2026, 6), end: toMonth(2026, 7), name: 'Climate Policy Cascade', desc: 'Monitors climate policy developments for portfolio leads' },
  { lane: 2, start: toMonth(2026, 7), end: toMonth(2026, 9), name: 'DD Engine v3 (Multi-Portfolio)', desc: 'Expanded to all portfolio leads' },
  { lane: 2, start: toMonth(2026, 7), end: toMonth(2026, 9), name: 'NDIS Regulatory Intelligence', desc: 'Replicates climate policy pattern for disability portfolio' },
  { lane: 2, start: toMonth(2026, 10), end: toMonth(2026, 12), name: 'Grant Stewardship Agent v2', desc: 'Full production with renewals, risk flags, draft reviews' },
  { lane: 2, start: toMonth(2026, 10), end: toMonth(2027, 3), name: 'Board Prep Conductor v2', desc: 'Production grade. Human review and refinement.' },
  { lane: 2, start: toMonth(2027, 1), end: toMonth(2027, 3), name: 'Portfolio Intelligence Agent', desc: 'Cross-portfolio trend analysis and anomaly detection' },
  { lane: 2, start: toMonth(2027, 1), end: toMonth(2027, 3), name: 'Partner Sustainability Asst.', desc: 'AI-assisted financial health, governance, strategic fit assessment' },
  { lane: 2, start: toMonth(2027, 4), end: toMonth(2027, 6), name: 'Grant Renewal Intel Pack', desc: 'Renewal probability, performance history, draft narrative' },
  { lane: 2, start: toMonth(2027, 4), end: toMonth(2027, 6), name: 'Impact Reporting Pipeline v2', desc: 'End-to-end automated impact reporting' },

  // Knowledge Preservation (lane 3)
  { lane: 3, start: toMonth(2026, 4), end: toMonth(2029, 12), name: 'Knowledge Keeper (UC-076)', desc: 'Continuous passive capture — runs from day one, forever' },
  { lane: 3, start: toMonth(2026, 5), end: toMonth(2026, 8), name: 'Sinclaire System Documentation', desc: 'ClearAI pairs with Sinclaire. Document everything before Sep leave.' },
  { lane: 3, start: toMonth(2026, 5), end: toMonth(2026, 7), name: 'Portfolio Knowledge LM x4', desc: 'NotebookLM instance per portfolio with curated docs' },
  { lane: 3, start: toMonth(2026, 5), end: toMonth(2026, 6), name: 'Exit Interview Framework', desc: 'Claude conversation framework, role-specific questions' },
  { lane: 3, start: toMonth(2026, 6), end: toMonth(2026, 7), name: 'Knowledge Capture Agent v1', desc: 'Automated meeting insight extraction to .md files in Drive' },
  { lane: 3, start: toMonth(2026, 5), end: toMonth(2026, 7), name: 'Living Impact Tapestry v1', desc: 'First Nations impact visualisation with cultural review layer' },
  { lane: 3, start: toMonth(2026, 10), end: toMonth(2027, 3), name: 'Knowledge Capture Agent v2', desc: 'Automated decision logging from meeting transcripts' },
  { lane: 3, start: toMonth(2027, 1), end: toMonth(2027, 6), name: 'YajiBot Prototype → Full', desc: 'Institutional knowledge Q&A across 2-4 portfolios' },
  { lane: 3, start: toMonth(2027, 7), end: toMonth(2028, 6), name: 'YajiBot Comprehensive', desc: 'All 4 portfolios. Full institutional memory system.' },
  { lane: 3, start: toMonth(2028, 1), end: toMonth(2028, 12), name: 'Knowledge API (if approved)', desc: 'Sector-shareable Yajilarra wisdom' },
  { lane: 3, start: toMonth(2027, 7), end: toMonth(2028, 12), name: 'Sector Knowledge Documentation', desc: 'Transferable playbooks for how Yajilarra used AI' },
];

const milestones = [
  { month: toMonth(2026, 6), name: 'Claude Trial Decision', desc: 'Hard deadline — scale, drop, or expand Claude seats' },
  { month: toMonth(2026, 8), name: 'Sinclaire Handover', desc: 'Knowledge transfer complete before maternity leave' },
  { month: toMonth(2026, 8), name: 'GD-Airtable Sync Live', desc: 'Production sync eliminating manual double-entry' },
  { month: toMonth(2026, 12), name: 'Portfolio Console Live', desc: 'Cross-portfolio visibility for leadership' },
  { month: toMonth(2027, 3), name: 'YajiBot Prototype', desc: 'Answering questions about 2+ portfolios' },
];

export default function SwimLaneRoadmap() {
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [hoveredMilestone, setHoveredMilestone] = useState(null);

  const margin = { top: 90, right: 30, bottom: 50, left: 180 };
  const width = 1400;
  const laneHeight = 180;
  const laneGap = 2;
  const totalLaneHeight = lanes.length * (laneHeight + laneGap);
  const height = margin.top + totalLaneHeight + margin.bottom;
  const plotW = width - margin.left - margin.right;

  const monthToX = (m) => margin.left + (m / TOTAL_MONTHS) * plotW;
  const laneY = (l) => margin.top + l * (laneHeight + laneGap);

  // Generate month ticks
  const monthTicks = [];
  for (let y = 2026; y <= 2029; y++) {
    const startM = y === 2026 ? 4 : 1;
    const endM = 12;
    for (let m = startM; m <= endM; m += 3) {
      const monthIdx = toMonth(y, m);
      if (monthIdx >= 0 && monthIdx <= TOTAL_MONTHS) {
        const labels = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthTicks.push({ x: monthToX(monthIdx), label: labels[m], year: y, isJan: m === 1 || (y === 2026 && m === 4) });
      }
    }
  }

  // Stack blocks within each lane to avoid overlaps
  const blockPositions = useCaseBlocks.map((block) => {
    const x1 = monthToX(block.start);
    const x2 = monthToX(Math.max(block.end, block.start + 0.8));
    const w = Math.max(x2 - x1, 30);
    return { ...block, x: x1, w };
  });

  // Simple row assignment per lane
  const laneRows = {};
  lanes.forEach((_, li) => { laneRows[li] = []; });

  const blockHeight = 22;
  const blockGap = 3;

  const assignedBlocks = blockPositions.map((block) => {
    const rows = laneRows[block.lane];
    let row = 0;
    for (row = 0; row < 20; row++) {
      const occupied = rows.filter((r) => r.row === row);
      const conflict = occupied.some((r) => !(block.x + block.w < r.x || block.x > r.x + r.w));
      if (!conflict) break;
    }
    const assigned = { ...block, row };
    rows.push(assigned);
    return assigned;
  });

  return (
    <div style={{
      background: COLORS.parchment,
      padding: '32px 20px',
      fontFamily: FONTS.primary,
      overflowX: 'auto',
    }}>
      <h2 style={{
        fontFamily: FONTS.primary,
        color: COLORS.obsidian,
        fontSize: 28,
        fontWeight: 'normal',
        margin: '0 0 4px 0',
        textAlign: 'center',
      }}>
        AI Technology Roadmap
      </h2>
      <p style={{
        fontFamily: FONTS.mono,
        color: COLORS.clay,
        fontSize: 13,
        margin: '0 0 20px 0',
        textAlign: 'center',
        letterSpacing: '0.5px',
      }}>
        April 2026 — December 2029 | 3 Waves | {useCaseBlocks.length} deliverables | {milestones.length} milestones
      </p>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', minWidth: 1100, height: 'auto' }}
      >
        {/* Wave background bands */}
        {waves.map((w, i) => (
          <rect
            key={i}
            x={monthToX(w.start)}
            y={margin.top - 20}
            width={monthToX(w.end) - monthToX(w.start)}
            height={totalLaneHeight + 20}
            fill={w.color}
            fillOpacity={w.opacity}
          />
        ))}

        {/* Wave labels at top */}
        {waves.map((w, i) => {
          const midX = (monthToX(w.start) + monthToX(w.end)) / 2;
          return (
            <g key={`wlabel-${i}`}>
              <text
                x={midX}
                y={margin.top - 30}
                textAnchor="middle"
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  fill: COLORS.obsidian,
                  opacity: 0.5,
                  letterSpacing: '0.5px',
                }}
              >
                {w.name}
              </text>
              {/* Wave boundary lines */}
              <line
                x1={monthToX(w.start)}
                y1={margin.top - 20}
                x2={monthToX(w.start)}
                y2={margin.top + totalLaneHeight}
                stroke={COLORS.obsidian}
                strokeOpacity={0.12}
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            </g>
          );
        })}
        {/* End boundary */}
        <line
          x1={monthToX(waves[2].end)}
          y1={margin.top - 20}
          x2={monthToX(waves[2].end)}
          y2={margin.top + totalLaneHeight}
          stroke={COLORS.obsidian}
          strokeOpacity={0.12}
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Stage gate markers at wave boundaries */}
        {[toMonth(2026, 6), toMonth(2027, 6)].map((m, i) => {
          const x = monthToX(m);
          return (
            <g key={`gate-${i}`}>
              <line
                x1={x}
                y1={margin.top - 20}
                x2={x}
                y2={margin.top + totalLaneHeight}
                stroke={COLORS.red}
                strokeOpacity={0.25}
                strokeWidth={2}
              />
              <text
                x={x}
                y={margin.top - 42}
                textAnchor="middle"
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 8,
                  fill: COLORS.red,
                  letterSpacing: '1px',
                }}
              >
                STAGE GATE
              </text>
            </g>
          );
        })}

        {/* Month ticks */}
        {monthTicks.map((t, i) => (
          <g key={`tick-${i}`}>
            <line x1={t.x} y1={margin.top + totalLaneHeight} x2={t.x} y2={margin.top + totalLaneHeight + 6} stroke={COLORS.obsidian} strokeOpacity={0.2} />
            <text
              x={t.x}
              y={margin.top + totalLaneHeight + 18}
              textAnchor="middle"
              style={{ fontFamily: FONTS.mono, fontSize: 8, fill: COLORS.obsidian, opacity: 0.4 }}
            >
              {t.label}
            </text>
            {t.isJan && (
              <text
                x={t.x}
                y={margin.top + totalLaneHeight + 32}
                textAnchor="middle"
                style={{ fontFamily: FONTS.mono, fontSize: 10, fill: COLORS.obsidian, opacity: 0.6, fontWeight: 'bold' }}
              >
                {t.year}
              </text>
            )}
            {/* Vertical gridline */}
            <line x1={t.x} y1={margin.top} x2={t.x} y2={margin.top + totalLaneHeight} stroke={COLORS.obsidian} strokeOpacity={0.04} />
          </g>
        ))}

        {/* Swim lane backgrounds and labels */}
        {lanes.map((lane, li) => {
          const y = laneY(li);
          return (
            <g key={`lane-${li}`}>
              <rect
                x={margin.left}
                y={y}
                width={plotW}
                height={laneHeight}
                fill={li % 2 === 0 ? COLORS.obsidian : 'transparent'}
                fillOpacity={0.02}
              />
              <line
                x1={margin.left}
                y1={y}
                x2={margin.left + plotW}
                y2={y}
                stroke={COLORS.obsidian}
                strokeOpacity={0.06}
              />
              {/* Lane label */}
              <text
                x={margin.left - 12}
                y={y + laneHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  fill: COLORS.obsidian,
                  opacity: 0.7,
                }}
              >
                {lane}
              </text>
            </g>
          );
        })}
        {/* Bottom lane line */}
        <line
          x1={margin.left}
          y1={laneY(lanes.length - 1) + laneHeight}
          x2={margin.left + plotW}
          y2={laneY(lanes.length - 1) + laneHeight}
          stroke={COLORS.obsidian}
          strokeOpacity={0.06}
        />

        {/* Use case blocks */}
        {assignedBlocks.map((block, i) => {
          const y = laneY(block.lane) + 8 + block.row * (blockHeight + blockGap);
          const isHovered = hoveredBlock === i;
          return (
            <g
              key={`block-${i}`}
              onMouseEnter={() => setHoveredBlock(i)}
              onMouseLeave={() => setHoveredBlock(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={block.x}
                y={y}
                width={block.w}
                height={blockHeight}
                rx={3}
                fill={COLORS.clay}
                fillOpacity={isHovered ? 0.95 : 0.7}
                stroke={isHovered ? COLORS.obsidian : 'none'}
                strokeWidth={isHovered ? 1 : 0}
              />
              <text
                x={block.x + 5}
                y={y + blockHeight / 2 + 1}
                dominantBaseline="middle"
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 7,
                  fill: COLORS.parchment,
                  pointerEvents: 'none',
                }}
              >
                {block.name.length > block.w / 5 ? block.name.slice(0, Math.floor(block.w / 5.5)) + '..' : block.name}
              </text>
            </g>
          );
        })}

        {/* Milestones as diamonds */}
        {milestones.map((ms, i) => {
          const x = monthToX(ms.month);
          // Place milestones at bottom of their relevant lane area, or across lanes
          const y = margin.top - 8;
          const isHovered = hoveredMilestone === i;
          const size = isHovered ? 9 : 7;
          return (
            <g
              key={`ms-${i}`}
              onMouseEnter={() => setHoveredMilestone(i)}
              onMouseLeave={() => setHoveredMilestone(null)}
              style={{ cursor: 'pointer' }}
            >
              <polygon
                points={`${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`}
                fill={COLORS.red}
                fillOpacity={isHovered ? 1 : 0.85}
                stroke={COLORS.parchment}
                strokeWidth={1}
              />
              {/* Milestone vertical line through all lanes */}
              <line
                x1={x}
                y1={y + size}
                x2={x}
                y2={margin.top + totalLaneHeight}
                stroke={COLORS.red}
                strokeOpacity={0.15}
                strokeWidth={1}
                strokeDasharray="2 4"
              />
            </g>
          );
        })}

        {/* Block tooltip */}
        {hoveredBlock !== null && (() => {
          const block = assignedBlocks[hoveredBlock];
          const y = laneY(block.lane) + 8 + block.row * (blockHeight + blockGap);
          const tooltipW = 280;
          const tooltipH = 44;
          let tx = block.x + block.w + 8;
          let ty = y - 6;
          if (tx + tooltipW > width - 10) tx = block.x - tooltipW - 8;
          if (ty + tooltipH > height - 10) ty = height - tooltipH - 10;
          if (ty < 5) ty = 5;
          return (
            <g>
              <rect x={tx} y={ty} width={tooltipW} height={tooltipH} rx={3} fill={COLORS.obsidian} fillOpacity={0.95} />
              <text x={tx + 10} y={ty + 16} style={{ fontFamily: FONTS.mono, fontSize: 10, fill: COLORS.parchment, fontWeight: 'bold' }}>
                {block.name}
              </text>
              <text x={tx + 10} y={ty + 32} style={{ fontFamily: FONTS.primary, fontSize: 9, fill: COLORS.parchment, opacity: 0.8 }}>
                {block.desc.length > 48 ? block.desc.slice(0, 46) + '...' : block.desc}
              </text>
            </g>
          );
        })()}

        {/* Milestone tooltip */}
        {hoveredMilestone !== null && (() => {
          const ms = milestones[hoveredMilestone];
          const x = monthToX(ms.month);
          const tooltipW = 260;
          const tooltipH = 44;
          let tx = x + 14;
          let ty = margin.top - 50;
          if (tx + tooltipW > width - 10) tx = x - tooltipW - 14;
          if (ty < 5) ty = 20;
          return (
            <g>
              <rect x={tx} y={ty} width={tooltipW} height={tooltipH} rx={3} fill={COLORS.obsidian} fillOpacity={0.95} />
              <text x={tx + 10} y={ty + 16} style={{ fontFamily: FONTS.mono, fontSize: 10, fill: COLORS.red, fontWeight: 'bold' }}>
                {ms.name}
              </text>
              <text x={tx + 10} y={ty + 32} style={{ fontFamily: FONTS.primary, fontSize: 9, fill: COLORS.parchment, opacity: 0.8 }}>
                {ms.desc}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 28,
        marginTop: 12,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="20" height="14">
            <rect x="1" y="2" width="18" height="10" rx="2" fill={COLORS.clay} fillOpacity={0.7} />
          </svg>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.obsidian }}>Use Case / Deliverable</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14">
            <polygon points="7,1 13,7 7,13 1,7" fill={COLORS.red} fillOpacity={0.85} />
          </svg>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.obsidian }}>Key Milestone</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="20" height="14">
            <line x1="0" y1="7" x2="20" y2="7" stroke={COLORS.red} strokeWidth={2} strokeOpacity={0.25} />
          </svg>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.obsidian }}>Stage Gate</span>
        </div>
      </div>
    </div>
  );
}
