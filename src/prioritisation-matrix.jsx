import React, { useState } from 'react';

const COLORS = {
  parchment: '#F4F0ED',
  obsidian: '#22190C',
  clay: '#834A33',
  red: '#FF4832',
  lightClay: '#B8826E',
};

const FONTS = {
  primary: 'Georgia, serif',
  mono: "'Space Mono', monospace",
};

// category: 'agentic' for Signal Red, 'operations' for Clay Brown, 'knowledge' for Obsidian
// quadrant: explicit assignment from scoring file
// horizon: 'Now' | 'Soon' | 'Later'
// investment: 1 (Low) | 2 (Medium) | 3 (High)
const useCases = [
  // === Quick Wins (28) ===
  { id: 'UC-009', name: 'Board Preparation Conductor', value: 4.8, feasibility: 4.8, category: 'agentic', quadrant: 'Quick Wins', horizon: 'Now', investment: 3, description: 'Full orchestration system for end-to-end board pack production. Multi-agent pipeline with Drive context, evolving beyond the current Gemini gem. Reduces 40+ hours of senior portfolio lead time per cycle to approximately 4 hours of human review.' },
  { id: 'UC-008', name: 'Impact Flashcards from Partner Reports', value: 4.5, feasibility: 4.5, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 1, description: 'AI-powered extraction and summary of impact data from partner reports into structured flashcard summaries. Reduces 90-120 page evaluation reports to actionable summaries aligned to Theories of Change.' },
  { id: 'UC-021', name: 'Portfolio Knowledge LM (Updated Weekly)', value: 4.5, feasibility: 4.0, category: 'knowledge', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'Conversational AI access to each portfolio\'s full institutional knowledge. Maturity curve from dedicated NotebookLM per portfolio (v1) to agent-built .md knowledge base (v2) to full GivingData/email integration (v3). JC proved 95% accuracy on partner history.' },
  { id: 'UC-024', name: 'AI-Generated Infographics (Google Slides + Gemini)', value: 4.3, feasibility: 3.8, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 1, description: 'AI-assisted creation of visual communication assets for funding flows, impact pathways, and portfolio progress via Google Slides. The #1 staff request across the organisation. Gemini Canvas generates fully editable slides.' },
  { id: 'UC-042', name: 'Credible Thought Partner for Impact Pathways', value: 4.0, feasibility: 4.0, category: 'agentic', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'AI that serves as an intellectual sparring partner for impact pathway design. Challenges assumptions, identifies gaps in logic, stress-tests theories of change. DG specifically asked for an AI that pushes back rather than agrees.' },
  { id: 'UC-040', name: 'Real-Time Meeting Notes Bot', value: 3.8, feasibility: 4.3, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 1, description: 'AI transcription and structured note-taking during meetings, with action items, decisions, and key discussion points pushed to Google Docs in real time. Integrates with Google Meet\'s meeting intelligence.' },
  { id: 'UC-043', name: 'Shenanigans/Accountability Bot', value: 3.8, feasibility: 3.5, category: 'agentic', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'AI bot that pushes the team to map proposals to strategic plans, critiques ideas for strategic fit, and calls out when initiatives don\'t connect to the Top Goal or relevant Theory of Change. DG\'s "ankle height broomstick of reality" made digital.' },
  { id: 'UC-048', name: 'AI Flex Yaj Dossier', value: 3.8, feasibility: 4.3, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 1, description: 'On-demand AI-generated briefing for staff flexing between portfolios. Catches them up on context, current partners, recent developments, Theory of Change status, and key contacts. Supports the "flex capability" pillar.' },
  { id: 'UC-034', name: 'Automated Email Summaries (Scale-out)', value: 3.8, feasibility: 5.0, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 1, description: 'Daily automated email digest with key messages, action items, and decisions needed. Already operational for Meg via Workspace Flows. A capability enablement play, teaching staff to build their own, with near-zero effort per person.' },
  { id: 'UC-025', name: 'Gemini Canvas for Editable Slides', value: 3.8, feasibility: 5.0, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 1, description: 'Using Gemini Canvas to create fully editable Google Slides presentations. Susan\'s discovery that Canvas outputs are fully editable was a breakthrough. Scale this pattern across the organisation for board decks and partner updates.' },
  { id: 'UC-074', name: 'Climate Policy Cascade Tracker', value: 3.8, feasibility: 4.3, category: 'agentic', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'Continuous monitoring of Australian climate policy from Hansard, AEMO, CER, and state EPAs. Translates policy changes into partner-specific implications and identifies funding gaps created by policy shifts. Fortnightly briefings.' },
  { id: 'UC-075', name: 'NDIS Regulatory Intelligence Agent', value: 3.8, feasibility: 4.3, category: 'agentic', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'Monitors NDIS Review implementation, NDIA guidelines, tribunal decisions, and state disability legislation. Translates regulatory changes into plain English partner-specific alerts. Positions Yajilarra as a proactive intelligence partner.' },
  { id: 'UC-004', name: 'Weekly Missing-Documentation Alerts', value: 3.8, feasibility: 3.5, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'Automated weekly report identifying grants with missing or overdue documentation. Flags gaps per portfolio and sends summary to grant managers via Slack. Shifts from reactive to proactive grant management.' },
  { id: 'UC-029', name: 'Board Diversity Tracker (Disability Portfolio)', value: 3.3, feasibility: 4.0, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'AI-powered tracking of board composition for top 100 disability service providers. Automated scraping of director information every 6 months. Identifies directors with disabilities and tracks progress toward governance goals.' },
  { id: 'UC-037', name: 'Budget vs Actual Analysis', value: 3.5, feasibility: 4.8, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 1, description: 'AI-assisted comparison of budget allocations against actual expenditure. Identifies variances, trends, and anomalies. Erin\'s gem already built; ready to scale across the finance function for continuous variance analysis.' },
  { id: 'UC-053', name: 'Data Sovereignty Verification Dashboard', value: 3.5, feasibility: 4.8, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 1, description: 'Dashboard showing data residency status for every platform in the technology stack. Tracks where data is stored, compliance status, and risk level. Includes First Nations data sovereignty assessment per system.' },
  { id: 'UC-015', name: 'AI Org Risk Scanner', value: 3.5, feasibility: 3.3, category: 'agentic', quadrant: 'Quick Wins', horizon: 'Soon', investment: 3, description: 'Continuous AI monitoring of partner organisations for risk signals, including media mentions, financial distress, leadership changes, and regulatory actions. Generates risk scores and alerts. Critical during the farming phase.' },
  { id: 'UC-038', name: 'Colour-Coded Email/Slack Triage', value: 3.5, feasibility: 4.0, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'AI-powered triage of incoming emails and Slack messages, colour-coded by urgency and type. Surfaces what actually needs attention with a "decisions to be made" framing. Requested by DG and Sinclaire.' },
  { id: 'UC-057', name: 'Real-Time System Change Signal Scanner', value: 3.5, feasibility: 4.0, category: 'agentic', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'AI monitoring of system-level changes relevant to each portfolio, including policy announcements, regulatory shifts, market movements, and research publications. Sends weekly digest of signals that could affect portfolio strategies.' },
  { id: 'UC-051', name: 'Grantee Perception Report Automation', value: 3.5, feasibility: 4.0, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'AI-assisted analysis of grantee perception survey data, with sentiment analysis, thematic coding, and trend identification across survey cycles. Generates structured reports comparing current perceptions against historical baseline.' },
  { id: 'UC-047', name: 'Write Like Yaj Assistant', value: 3.5, feasibility: 4.0, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 1, description: 'AI writing assistant trained on Yajilarra\'s tone, style, and language patterns. Ensures all external communications maintain consistent voice. Especially important as staff transition and new people join who don\'t yet "sound like Yaj."' },
  { id: 'UC-031', name: 'Partner Discovery and Market Scanning', value: 3.5, feasibility: 4.0, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'AI-powered scanning for potential new partner organisations, matching profiles against portfolio Theories of Change. Primarily for Disability and First Nations portfolios which are still in "hunting" mode.' },
  { id: 'UC-054', name: 'Indigenous Data Sovereignty Protocol', value: 3.5, feasibility: 3.5, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'Formal protocol for handling First Nations data in AI systems, covering what data can be processed, by which tools, with what consent and safeguards. Informed by Joel\'s concerns and Indigenous data sovereignty frameworks.' },
  { id: 'UC-045', name: 'Post-Meeting Summary with Action Item Tracking', value: 3.5, feasibility: 3.8, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'Automated post-meeting Slack summary with structured action items, each with an owner and due date. Follow-up notifications for incomplete items. Ensures commitments from meetings are honoured.' },
  { id: 'UC-046', name: 'Auto-Created Dossier for New Starters', value: 3.5, feasibility: 3.8, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'AI auto-generates a personalised onboarding dossier covering the portfolio\'s Theory of Change, key partners, current grant status, relevant policies, and team structure. Compresses 3-6 month onboarding to weeks.' },
  { id: 'UC-012', name: 'Financial Analysis & Normalised Earnings', value: 3.5, feasibility: 4.3, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'AI-assisted financial analysis of partner organisations, normalising earnings across accounting standards, identifying risk indicators, and benchmarking against sector peers. Scales Erin\'s budget analysis gem to portfolio level.' },
  { id: 'UC-002', name: 'Grant Record Auto-Creation with Slack Notification', value: 3.5, feasibility: 3.3, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'When a grant record is marked "approved active" in GivingData, automatically creates an Airtable record and sends a Slack notification. A virtual bell rings for impact capture moments, creating shared awareness.' },
  { id: 'UC-026', name: 'Dynamic Charts and Data Visualisation', value: 3.5, feasibility: 3.3, category: 'operations', quadrant: 'Quick Wins', horizon: 'Now', investment: 2, description: 'AI-generated dynamic charts from Airtable/Sheets data, including trend lines, portfolio comparisons, and KPI trackers. Charts update automatically as underlying data changes. Exportable to Slides and PPT.' },
  // === Strategic Bets (26) ===
  { id: 'UC-076', name: 'Knowledge Keeper', value: 4.8, feasibility: 3.5, category: 'agentic', quadrant: 'Strategic Bets', horizon: 'Now', investment: 2, description: 'Regular structured voice conversations with key knowledge holders using Claude voice mode. Fortnightly 30-minute sessions with role-specific question frameworks. Extracts tacit knowledge that would otherwise be permanently lost at departure.' },
  { id: 'UC-073', name: 'Living Impact Tapestry', value: 4.5, feasibility: 3.3, category: 'agentic', quadrant: 'Strategic Bets', horizon: 'Now', investment: 3, description: 'Persistent agent network that continuously monitors Drive, GivingData, and Airtable, cross-references against 10 Theories of Change, and produces weekly "Impact Pulse" narrative briefs. Replaces UC-014 and UC-016 with one coherent system.' },
  { id: 'UC-001', name: 'GivingData-Airtable Automated Sync', value: 4.5, feasibility: 3.0, category: 'operations', quadrant: 'Strategic Bets', horizon: 'Now', investment: 2, description: 'Automated sync between GivingData and Airtable via N8N, eliminating manual double-entry. Triggers on grant status changes. The single biggest operational pain point, affecting every staff member touching grant data.' },
  { id: 'UC-023', name: 'Agent-Built .md Knowledge Base', value: 4.3, feasibility: 3.5, category: 'knowledge', quadrant: 'Strategic Bets', horizon: 'Now', investment: 2, description: 'Agents crawl the entire portfolio of documentation in Google Drive and build a structured, text-only knowledge base in .md files. Other agents read from this instead of hitting Drive directly, making them faster, cheaper, and more reliable.' },
  { id: 'UC-018', name: 'Exit Interview AI', value: 4.3, feasibility: 3.5, category: 'knowledge', quadrant: 'Strategic Bets', horizon: 'Now', investment: 2, description: 'AI-facilitated exit interviews with departing staff, with questions categorised by role. Captures tacit knowledge that formal documentation misses, including relationships, judgment calls, and lessons learned. Feeds into YajiBot.' },
  { id: 'UC-050', name: 'Impact Finish Line Tracker', value: 4.3, feasibility: 3.3, category: 'operations', quadrant: 'Strategic Bets', horizon: 'Now', investment: 2, description: 'Visual tracker showing progressive completion toward each Theory of Change\'s targets. Celebrates milestones as they are achieved. Reframes the remaining years as a race toward impact completion, not a countdown to closure.' },
  { id: 'UC-017', name: 'YajiBot — Institutional Knowledge Preservation', value: 4.3, feasibility: 2.8, category: 'knowledge', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 3, description: 'A fine-tuned AI trained on Yajilarra\'s complete institutional knowledge. Serves as a "living memory" accessible to staff during wind-down and potentially to the sector post-sunset. For a sunset organisation, knowledge preservation IS the mission.' },
  { id: 'UC-061', name: 'Theory of Change Stress-Testing Agent', value: 4.0, feasibility: 3.5, category: 'agentic', quadrant: 'Strategic Bets', horizon: 'Now', investment: 2, description: 'AI agent that periodically stress-tests each Theory of Change against real-world evidence, including new research, partner outcomes, and policy shifts. Generates a quarterly "ToC Health Report" per portfolio.' },
  { id: 'UC-064', name: 'Staff Transition Knowledge Capture System', value: 4.0, feasibility: 3.5, category: 'knowledge', quadrant: 'Strategic Bets', horizon: 'Now', investment: 2, description: 'Systematic knowledge capture triggered by staff transition milestones. AI-facilitated sessions extract tacit knowledge about partner relationships, unwritten processes, and judgment frameworks. Different from exit interviews, this is ongoing.' },
  { id: 'UC-077', name: 'Partner Sustainability Assessment', value: 4.0, feasibility: 3.3, category: 'agentic', quadrant: 'Strategic Bets', horizon: 'Now', investment: 2, description: 'Models financial sustainability for each partner post-Yajilarra exit. Calculates dependency percentage, runs exit scenarios, and identifies alternative funders. Ensures the ecosystem survives without Yajilarra\'s funding.' },
  { id: 'UC-072', name: 'Intelligent Handover System for Sunset', value: 4.0, feasibility: 2.8, category: 'operations', quadrant: 'Strategic Bets', horizon: 'Later', investment: 3, description: 'Comprehensive AI-managed system for the Return phase (2029). Tracks every open commitment, relationship, asset, and knowledge item that needs to be closed, transferred, or preserved. The "nothing gets forgotten" system for organisational closure.' },
  { id: 'UC-070', name: 'Sector Publication Engine', value: 4.0, feasibility: 2.8, category: 'knowledge', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 2, description: 'AI system that progressively generates publishable content for the sector, including case studies, methodology guides, and lessons-learned papers. By sunset, a library of philanthropic wisdom exists in accessible, publishable form for the sector.' },
  { id: 'UC-010', name: 'DD Liberation Engine', value: 4.0, feasibility: 2.8, category: 'agentic', quadrant: 'Strategic Bets', horizon: 'Now', investment: 3, description: 'Full-pipeline due diligence automation. Automated checks run in parallel (ACNC, ORIC, ABN/GST, financials, media, portfolio cross-reference). Reclaims approximately 25 hours/week of Joel\'s time, shifting him from document processor to decision-maker.' },
  { id: 'UC-078', name: 'Grant Renewal Intelligence Pack', value: 4.0, feasibility: 2.8, category: 'agentic', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 3, description: 'When a grant approaches renewal, agents produce a complete analytical package with 4 options (renew same / increase / decrease + transition / don\'t renew). Includes a Counter-Argument agent that deliberately argues against its own recommendation.' },
  { id: 'UC-020', name: 'Knowledge API — Sector-Shareable Knowledge Base', value: 4.0, feasibility: 2.0, category: 'knowledge', quadrant: 'Strategic Bets', horizon: 'Later', investment: 3, description: 'A contained LLM with Yajilarra\'s complete knowledge, accessible via API and shareable with the philanthropic sector. Other funders and researchers could query 7 years of strategic grantmaking wisdom. Potentially the most enduring contribution to the sector.' },
  { id: 'UC-013', name: 'Portfolio Progress Console (Cross-ToC Dashboard)', value: 4.0, feasibility: 2.5, category: 'operations', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 3, description: 'Unified dashboard showing progress across all 10 Theories of Change. Leading indicators, funding committed vs remaining, risk status, and relative ROI. Transforms board discussions from narrative-based to evidence-based.' },
  { id: 'UC-007', name: 'Conversational Data Access (Extended Slack Bot)', value: 3.8, feasibility: 3.0, category: 'operations', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 3, description: 'Extend the "Talk to Yaj Data" Slack bot beyond Airtable to include GivingData, Drive, and finance data. Staff no longer need to know which system holds which data. Democratises data access across the organisation.' },
  { id: 'UC-058', name: 'Grant Stewardship Intelligence Layer', value: 3.8, feasibility: 2.8, category: 'agentic', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 3, description: 'Transforms grant management from transactional (approve/track/acquit) to relational (nurture/adapt/deepen). Analyses full partner relationship history and generates proactive stewardship recommendations. The AI capability that serves the farming pivot best.' },
  { id: 'UC-063', name: 'Proactive Partner Health Check Agent', value: 3.8, feasibility: 3.3, category: 'agentic', quadrant: 'Strategic Bets', horizon: 'Now', investment: 2, description: 'Scheduled weekly partner health checks reviewing communications, reporting timeliness, financial indicators, and engagement patterns. Generates a "partner weather report" (green/amber/red) for each portfolio lead.' },
  { id: 'UC-011', name: 'SPARK Outcome Report Analysis', value: 3.5, feasibility: 3.3, category: 'operations', quadrant: 'Strategic Bets', horizon: 'Now', investment: 2, description: 'AI analysis of 300+ SPARK grants in the faith portfolio. Sentiment analysis, outcome tracking, and trend identification from 6-monthly reporting data. Surfaces patterns across the full dataset that no human could identify manually.' },
  { id: 'UC-016', name: 'Impact Reporting Pipeline (End-to-End)', value: 3.5, feasibility: 2.8, category: 'operations', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 3, description: 'Automated pipeline from raw data to finished impact report: Airtable to analysis to dashboards to narrative synthesis to visual presentation. Transforms a weeks-long reporting cycle into days.' },
  { id: 'UC-022', name: 'AI Bot with Wisdom from Past Employees', value: 3.5, feasibility: 2.5, category: 'knowledge', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 3, description: 'AI system trained on accumulated wisdom from current and former employees plus best-in-class strategic philanthropy knowledge. New staff can ask how former colleagues approached specific challenges. Combined with exit interview AI, creates a virtuous cycle.' },
  { id: 'UC-059', name: 'Cross-Portfolio Pattern Recognition Engine', value: 3.5, feasibility: 2.8, category: 'knowledge', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 3, description: 'AI that identifies patterns, parallels, and transferable insights across the four portfolios. Surfaces non-obvious connections like structural similarities between governance models across domains. Requires comparing hundreds of partner relationships simultaneously.' },
  { id: 'UC-060', name: 'Sunset Countdown Intelligence', value: 3.5, feasibility: 2.8, category: 'agentic', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 3, description: 'Continuously models the wind-down trajectory, mapping remaining commitments against timeline, identifying critical path dependencies, and modelling "what if" scenarios. The strategic planning tool every spend-down trust needs.' },
  { id: 'UC-068', name: 'Automated Board Briefing Packs', value: 3.5, feasibility: 2.8, category: 'operations', quadrant: 'Strategic Bets', horizon: 'Soon', investment: 3, description: 'End-to-end automation of board briefing pack assembly. AI collects updates from each portfolio lead, generates summaries, and assembles the complete pack. Board members receive personalised pre-reads tuned to their interests.' },
  { id: 'UC-065', name: 'Philanthropic Impact Attribution Model', value: 3.5, feasibility: 2.5, category: 'operations', quadrant: 'Strategic Bets', horizon: 'Later', investment: 3, description: 'AI model that attempts to attribute system-level changes back to Yajilarra\'s funding. Analyses causal chains from grant to partner activities to outcomes. The difference between demonstrable contribution and coincidence.' },
  // === Low-Hanging Fruit (6) ===
  { id: 'UC-035', name: 'Performance Review Planning Assistant', value: 3.3, feasibility: 4.8, category: 'operations', quadrant: 'Low-Hanging Fruit', horizon: 'Now', investment: 1, description: 'AI assistant for structuring and preparing performance reviews. Aggregates relevant data on project contributions, meeting participation, and peer feedback. Ensures reviews are based on data, not recency bias.' },
  { id: 'UC-052', name: 'AI Tool Vetting Automation (Enhanced)', value: 3.3, feasibility: 5.0, category: 'operations', quadrant: 'Low-Hanging Fruit', horizon: 'Now', investment: 1, description: 'Enhance the existing AI Product Vetter gem with automated T&C monitoring. Flags when a vetted tool changes its terms of service and adds data sovereignty checks. Low effort to add to an existing, working system.' },
  { id: 'UC-036', name: 'Contract Review Automation', value: 3.0, feasibility: 4.0, category: 'operations', quadrant: 'Low-Hanging Fruit', horizon: 'Now', investment: 2, description: 'AI-assisted review of contracts, NDAs, and agreements. Identifies key terms, obligations, risks, and non-standard clauses. Means only genuinely unusual clauses reach human reviewers, accelerating approval.' },
  { id: 'UC-039', name: 'Pre-Meeting AI Agent', value: 3.0, feasibility: 3.3, category: 'operations', quadrant: 'Low-Hanging Fruit', horizon: 'Soon', investment: 2, description: 'AI agent that prepares for upcoming meetings by scanning relevant documents, previous notes, and email threads. Generates context docs, asks attendees for their goals, and follows up on action items from previous meetings.' },
  { id: 'UC-032', name: 'Partner Financial Risk Assessment', value: 3.3, feasibility: 3.5, category: 'operations', quadrant: 'Low-Hanging Fruit', horizon: 'Soon', investment: 2, description: 'Continuous AI monitoring of partner organisation financial health. Flags declining revenue, governance changes, and signs of financial distress using ACNC data, annual reports, and media. Proactive protection of Yajilarra\'s investments.' },
  { id: 'UC-056', name: 'Charity Financial Benchmarking', value: 3.3, feasibility: 3.5, category: 'operations', quadrant: 'Low-Hanging Fruit', horizon: 'Now', investment: 2, description: 'AI analysis of a decade of charity financials. Identifies long-term trends, benchmarks partners against sector peers, and reveals which types of organisations grow sustainably. Transforms historical data into forward-looking intelligence.' },
  // === Horizon Plays (14) ===
  { id: 'UC-030', name: 'First Nations DD with Cultural Sensitivity Layer', value: 3.3, feasibility: 2.0, category: 'knowledge', quadrant: 'Horizon Plays', horizon: 'Now', investment: 3, description: 'Specialised due diligence for Aboriginal and Torres Strait Islander organisations. Bridges western DD requirements with Indigenous organisational contexts. An AI cultural translation layer that reframes western DD categories in meaningful terms.' },
  { id: 'UC-003', name: 'Cross-System Data Inconsistency Scanner', value: 3.3, feasibility: 3.0, category: 'operations', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 3, description: 'AI-powered scan across GivingData, Airtable, and Google Drive to identify data inconsistencies, including mismatched partner names, conflicting financial figures, and orphaned records. Generates weekly reconciliation reports.' },
  { id: 'UC-005', name: '4-Step AI Document Workflow', value: 3.3, feasibility: 2.8, category: 'operations', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 3, description: 'Standardised pipeline: partner document arrives, Gemini extracts key data, formatted into Yajilarra template, pushed to Airtable with metadata tags. Handles the inconsistent formats partners submit.' },
  { id: 'UC-006', name: 'Auto-Import Drive Data into Airtable', value: 3.3, feasibility: 2.8, category: 'operations', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 3, description: 'Automated extraction of key impact data from documents in Google Drive and population into Airtable records. Closes the loop between document storage and structured data where hours are currently lost.' },
  { id: 'UC-027', name: 'Strategic Board Visual Reporting', value: 3.3, feasibility: 2.5, category: 'operations', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 3, description: 'AI-assisted visual reporting for board meetings, combining data visualisation, narrative synthesis, and branded presentation. Board packs assemble themselves from underlying data with AI handling narrative bridges.' },
  { id: 'UC-069', name: 'AI Adoption Companion (Aha Moment Generator)', value: 3.3, feasibility: 2.8, category: 'operations', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 2, description: 'Personalised AI adoption tool that monitors each staff member\'s work patterns and proactively suggests AI use cases specific to their role. Designed to convert the ~20 occasional users into daily users by surfacing personal "aha moments."' },
  { id: 'UC-071', name: 'Climate Portfolio Carbon Impact Calculator', value: 3.3, feasibility: 2.5, category: 'operations', quadrant: 'Horizon Plays', horizon: 'Later', investment: 3, description: 'Estimates the carbon reduction attributable to Yajilarra\'s Climate portfolio investments, connecting grant funding to partner activities to estimated emissions reductions toward the 3.25 GtCO2 target.' },
  { id: 'UC-062', name: 'Partner Ecosystem Network Map', value: 3.0, feasibility: 2.5, category: 'operations', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 3, description: 'AI-generated visualisation of connections between funded partners, including shared board members, geographic overlap, and co-funding. Reveals ecosystem dynamics that individual partner relationships don\'t show.' },
  { id: 'UC-066', name: 'AI-Powered Grantee Learning Circles', value: 3.0, feasibility: 2.5, category: 'knowledge', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 2, description: 'AI-facilitated peer learning sessions between partner organisations. Groups partners with complementary challenges and generates pre-reads that protect confidentiality. Transforms Yajilarra from funder to ecosystem convener.' },
  { id: 'UC-067', name: 'Digital Twin of Yajilarra\'s Grant Portfolio', value: 3.0, feasibility: 2.3, category: 'operations', quadrant: 'Horizon Plays', horizon: 'Later', investment: 3, description: 'Simulation model of the entire grant portfolio. Models effects of different allocation decisions, timing changes, and partner exits. For a sunset organisation, the cost of getting allocation wrong is higher because there is no "next cycle."' },
  { id: 'UC-041', name: 'Conceptual Discussion Tracker', value: 2.8, feasibility: 3.3, category: 'agentic', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 3, description: 'AI that tracks key open debates and strategic discussions across meetings, emails, and Slack over time. Builds a shared vision map and surfaces when a long-running discussion has reached sufficient alignment for decision.' },
  { id: 'UC-044', name: 'Consensus Gauge', value: 2.8, feasibility: 3.0, category: 'agentic', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 3, description: 'AI that analyses meeting notes, emails, and Slack to measure stakeholder alignment on key decisions. Visualises where consensus exists and where positions differ. Helps leaders know when a decision is ready to be made.' },
  { id: 'UC-055', name: 'AI-Assisted Reconciliation', value: 2.5, feasibility: 2.8, category: 'operations', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 3, description: 'AI-powered reconciliation across Xero, GivingData, and Sift. Handles the routine 90% of $100M+ transactions automatically, focusing human attention on the 10% that actually need investigation.' },
  { id: 'UC-049', name: 'Partner Engagement Agents', value: 2.5, feasibility: 2.3, category: 'agentic', quadrant: 'Horizon Plays', horizon: 'Soon', investment: 3, description: 'AI agents that interact with partner organisations on operational data, requesting financials, skills inventories, and documentation. Automates back-and-forth communication while maintaining partnership quality.' },
];

const QUADRANT_LABELS = [
  { label: 'Quick Wins', x: 0.82, y: 0.15, sub: 'High Value, High Feasibility' },
  { label: 'Strategic Bets', x: 0.82, y: 0.88, sub: 'High Value, Lower Feasibility' },
  { label: 'Low-Hanging Fruit', x: 0.18, y: 0.15, sub: 'Lower Value, High Feasibility' },
  { label: 'Horizon Plays', x: 0.18, y: 0.88, sub: 'Lower Value, Lower Feasibility' },
];

// Group use cases by quadrant for sidebar (uses explicit quadrant from scoring file)
const getQuadrant = (uc) => uc.quadrant;

const QUADRANT_ORDER = ['Quick Wins', 'Strategic Bets', 'Low-Hanging Fruit', 'Horizon Plays'];

export default function PrioritisationMatrix() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const margin = { top: 60, right: 40, bottom: 60, left: 60 };
  const width = 800;
  const height = 700;
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  const scaleX = (v) => margin.left + ((v - 1) / 4) * plotW;
  const scaleY = (f) => margin.top + plotH - ((f - 1) / 4) * plotH;

  const dividerX = scaleX(3.5);
  const dividerY = scaleY(3.5);

  const bubbleR = 11;

  const colorFor = (cat) => {
    if (cat === 'agentic') return COLORS.red;
    if (cat === 'knowledge') return COLORS.obsidian;
    return COLORS.clay;
  };

  // Simple collision nudging: offset overlapping bubbles slightly
  const positions = useCases.map((uc) => ({
    ...uc,
    px: scaleX(uc.value),
    py: scaleY(uc.feasibility),
  }));

  // Nudge overlapping points
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = positions[i].px - positions[j].px;
      const dy = positions[i].py - positions[j].py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < bubbleR * 2.2) {
        const angle = Math.atan2(dy, dx) || Math.PI / 4;
        const push = (bubbleR * 2.2 - dist) / 2 + 1;
        positions[i].px += Math.cos(angle) * push;
        positions[i].py += Math.sin(angle) * push;
        positions[j].px -= Math.cos(angle) * push;
        positions[j].py -= Math.sin(angle) * push;
      }
    }
  }

  // Group for sidebar
  const grouped = {};
  QUADRANT_ORDER.forEach((q) => { grouped[q] = []; });
  useCases.forEach((uc) => { grouped[getQuadrant(uc)].push(uc); });

  return (
    <div style={{
      background: COLORS.parchment,
      padding: '40px',
      fontFamily: FONTS.primary,
      maxWidth: 1300,
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
        Use Case Prioritisation Matrix
      </h2>
      <p style={{
        fontFamily: FONTS.mono,
        color: COLORS.clay,
        fontSize: 13,
        margin: '0 0 20px 0',
        textAlign: 'center',
        letterSpacing: '0.5px',
      }}>
        {useCases.length} use cases scored on Value (x) vs Feasibility (y)
      </p>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ flex: '1 1 auto', minWidth: 0, height: 'auto' }}>
        {/* Quadrant backgrounds */}
        {/* Quick Wins - top right */}
        <rect x={dividerX} y={margin.top} width={margin.left + plotW - dividerX + margin.right} height={dividerY - margin.top} fill={COLORS.clay} fillOpacity={0.04} />
        {/* Strategic Bets - bottom right */}
        <rect x={dividerX} y={dividerY} width={margin.left + plotW - dividerX + margin.right} height={margin.top + plotH - dividerY} fill={COLORS.red} fillOpacity={0.03} />

        {/* Quadrant dividers */}
        <line x1={dividerX} y1={margin.top} x2={dividerX} y2={margin.top + plotH} stroke={COLORS.obsidian} strokeOpacity={0.15} strokeWidth={1} strokeDasharray="6 4" />
        <line x1={margin.left} y1={dividerY} x2={margin.left + plotW} y2={dividerY} stroke={COLORS.obsidian} strokeOpacity={0.15} strokeWidth={1} strokeDasharray="6 4" />

        {/* Quadrant labels */}
        {QUADRANT_LABELS.map((q, i) => (
          <g key={i}>
            <text
              x={margin.left + q.x * plotW}
              y={margin.top + q.y * plotH}
              textAnchor="middle"
              style={{
                fontFamily: FONTS.primary,
                fontSize: 16,
                fill: COLORS.obsidian,
                opacity: 0.18,
                fontStyle: 'italic',
              }}
            >
              {q.label}
            </text>
            <text
              x={margin.left + q.x * plotW}
              y={margin.top + q.y * plotH + 16}
              textAnchor="middle"
              style={{
                fontFamily: FONTS.mono,
                fontSize: 8,
                fill: COLORS.obsidian,
                opacity: 0.12,
              }}
            >
              {q.sub}
            </text>
          </g>
        ))}

        {/* Grid lines */}
        {[1, 2, 3, 4, 5].map((v) => (
          <g key={`grid-${v}`}>
            <line x1={scaleX(v)} y1={margin.top} x2={scaleX(v)} y2={margin.top + plotH} stroke={COLORS.obsidian} strokeOpacity={0.06} strokeWidth={1} />
            <line x1={margin.left} y1={scaleY(v)} x2={margin.left + plotW} y2={scaleY(v)} stroke={COLORS.obsidian} strokeOpacity={0.06} strokeWidth={1} />
            {/* X-axis labels */}
            <text x={scaleX(v)} y={margin.top + plotH + 20} textAnchor="middle" style={{ fontFamily: FONTS.mono, fontSize: 11, fill: COLORS.obsidian, opacity: 0.5 }}>{v}</text>
            {/* Y-axis labels */}
            <text x={margin.left - 12} y={scaleY(v) + 4} textAnchor="end" style={{ fontFamily: FONTS.mono, fontSize: 11, fill: COLORS.obsidian, opacity: 0.5 }}>{v}</text>
          </g>
        ))}

        {/* Axis titles */}
        <text x={margin.left + plotW / 2} y={height - 8} textAnchor="middle" style={{ fontFamily: FONTS.mono, fontSize: 12, fill: COLORS.obsidian, letterSpacing: '1px' }}>
          VALUE
        </text>
        <text
          x={14}
          y={margin.top + plotH / 2}
          textAnchor="middle"
          style={{ fontFamily: FONTS.mono, fontSize: 12, fill: COLORS.obsidian, letterSpacing: '1px' }}
          transform={`rotate(-90, 14, ${margin.top + plotH / 2})`}
        >
          FEASIBILITY
        </text>

        {/* Bubbles */}
        {positions.map((uc, i) => {
          const isHovered = hovered === i;
          const isSelected = selected === i;
          return (
            <g
              key={uc.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(selected === i ? null : i)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={uc.px}
                cy={uc.py}
                r={isSelected ? bubbleR + 4 : isHovered ? bubbleR + 3 : bubbleR}
                fill={colorFor(uc.category)}
                fillOpacity={isHovered || isSelected ? 0.95 : 0.75}
                stroke={isSelected ? COLORS.red : COLORS.parchment}
                strokeWidth={isSelected ? 3 : 2}
              />
              <text
                x={uc.px}
                y={uc.py + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 6,
                  fill: uc.category === 'operations' ? COLORS.parchment : COLORS.parchment,
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                }}
              >
                {uc.id.replace('UC-0', '').replace('UC-', '')}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {hovered !== null && (() => {
          const uc = positions[hovered];
          const tooltipW = 280;
          const tooltipH = 56;
          let tx = uc.px + 22;
          let ty = uc.py - tooltipH / 2;
          if (tx + tooltipW > width - 10) tx = uc.px - tooltipW - 22;
          if (ty < 10) ty = 10;
          if (ty + tooltipH > height - 10) ty = height - tooltipH - 10;
          return (
            <g>
              <rect x={tx} y={ty} width={tooltipW} height={tooltipH} rx={3} fill={COLORS.obsidian} fillOpacity={0.95} />
              <text x={tx + 10} y={ty + 17} style={{ fontFamily: FONTS.mono, fontSize: 11, fill: COLORS.parchment, fontWeight: 'bold' }}>
                {uc.id}: {uc.name.length > 32 ? uc.name.slice(0, 30) + '...' : uc.name}
              </text>
              <text x={tx + 10} y={ty + 36} style={{ fontFamily: FONTS.mono, fontSize: 10, fill: COLORS.parchment, opacity: 0.8 }}>
                Value: {uc.value.toFixed(1)}  |  Feasibility: {uc.feasibility.toFixed(1)}
              </text>
              <text x={tx + 10} y={ty + 49} style={{ fontFamily: FONTS.mono, fontSize: 9, fill: colorFor(uc.category) }}>
                {uc.category === 'agentic' ? 'Agentic / Agent-driven' : uc.category === 'knowledge' ? 'Knowledge / Preservation' : 'Operations / Data'}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Use Case Sidebar */}
      <div style={{
        flex: '0 0 320px',
        maxHeight: 700,
        overflowY: 'auto',
        borderLeft: `2px solid ${COLORS.obsidian}`,
        borderLeftOpacity: 0.1,
        paddingLeft: 20,
      }}>
        <div style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: COLORS.obsidian,
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: 12,
          paddingBottom: 6,
          borderBottom: `1px solid ${COLORS.obsidian}20`,
        }}>
          All Use Cases ({useCases.length})
        </div>
        {QUADRANT_ORDER.map((quadrant) => {
          const items = grouped[quadrant];
          if (!items.length) return null;
          const quadrantColor = quadrant === 'Quick Wins' ? COLORS.clay
            : quadrant === 'Strategic Bets' ? COLORS.red
            : quadrant === 'Low-Hanging Fruit' ? COLORS.lightClay
            : COLORS.obsidian;
          return (
            <div key={quadrant} style={{ marginBottom: 16 }}>
              <div style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                color: quadrantColor,
                fontWeight: 700,
                letterSpacing: '0.5px',
                marginBottom: 4,
                textTransform: 'uppercase',
              }}>
                {quadrant} ({items.length})
              </div>
              {items.map((uc) => {
                const idx = useCases.indexOf(uc);
                const isActive = hovered === idx || selected === idx;
                const isSelectedItem = selected === idx;
                return (
                  <div key={uc.id}>
                    <div
                      onMouseEnter={() => setHovered(idx)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(selected === idx ? null : idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 6px',
                        borderRadius: 3,
                        cursor: 'pointer',
                        background: isSelectedItem ? `${colorFor(uc.category)}20` : isActive ? `${colorFor(uc.category)}15` : 'transparent',
                        borderLeft: isSelectedItem ? `3px solid ${colorFor(uc.category)}` : '3px solid transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      <svg width="10" height="10" style={{ flexShrink: 0 }}>
                        <circle cx="5" cy="5" r="4" fill={colorFor(uc.category)} fillOpacity={0.8} />
                      </svg>
                      <span style={{
                        fontFamily: FONTS.mono,
                        fontSize: 9,
                        color: COLORS.obsidian,
                        opacity: isActive ? 1 : 0.7,
                        fontWeight: isActive ? 700 : 400,
                      }}>
                        {uc.id.replace('UC-0', '').replace('UC-', '')}
                      </span>
                      <span style={{
                        fontFamily: FONTS.primary,
                        fontSize: 11,
                        color: COLORS.obsidian,
                        opacity: isActive ? 1 : 0.75,
                        fontWeight: isActive ? 600 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {uc.name}
                      </span>
                    </div>
                    {isSelectedItem && uc.description && (
                      <div style={{
                        padding: '6px 6px 8px 22px',
                        fontFamily: FONTS.primary,
                        fontSize: 11,
                        color: COLORS.obsidian,
                        opacity: 0.8,
                        lineHeight: 1.5,
                        borderLeft: `3px solid ${colorFor(uc.category)}40`,
                        background: `${colorFor(uc.category)}08`,
                        borderRadius: '0 3px 3px 0',
                      }}>
                        {uc.description}
                        <div style={{
                          marginTop: 4,
                          fontFamily: FONTS.mono,
                          fontSize: 9,
                          color: COLORS.clay,
                          opacity: 0.8,
                        }}>
                          V: {uc.value.toFixed(1)} | F: {uc.feasibility.toFixed(1)} | {uc.horizon} | {uc.category === 'agentic' ? 'Agentic' : uc.category === 'knowledge' ? 'Knowledge' : 'Operations'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      </div>

      {/* Selected Use Case Detail */}
      {selected !== null && (() => {
        const uc = useCases[selected];
        return (
          <div style={{
            background: COLORS.obsidian,
            borderRadius: 6,
            padding: '16px 20px',
            marginTop: 16,
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{
                  fontFamily: FONTS.mono,
                  fontSize: 12,
                  color: colorFor(uc.category),
                  fontWeight: 700,
                }}>
                  {uc.id}
                </span>
                <span style={{
                  fontFamily: FONTS.primary,
                  fontSize: 16,
                  color: COLORS.parchment,
                  fontWeight: 600,
                }}>
                  {uc.name}
                </span>
                <span style={{
                  fontFamily: FONTS.mono,
                  fontSize: 9,
                  color: COLORS.parchment,
                  opacity: 0.5,
                  marginLeft: 'auto',
                  cursor: 'pointer',
                }}
                onClick={() => setSelected(null)}
                >
                  ESC to close
                </span>
              </div>
              <p style={{
                fontFamily: FONTS.primary,
                fontSize: 13,
                color: COLORS.parchment,
                opacity: 0.85,
                lineHeight: 1.6,
                margin: 0,
              }}>
                {uc.description}
              </p>
              <div style={{
                display: 'flex',
                gap: 16,
                marginTop: 10,
                fontFamily: FONTS.mono,
                fontSize: 10,
              }}>
                <span style={{ color: COLORS.clay }}>Value: {uc.value.toFixed(1)}</span>
                <span style={{ color: COLORS.clay }}>Feasibility: {uc.feasibility.toFixed(1)}</span>
                <span style={{ color: COLORS.parchment, opacity: 0.5 }}>{uc.quadrant}</span>
                <span style={{ color: COLORS.parchment, opacity: 0.5 }}>{uc.horizon}</span>
                <span style={{ color: colorFor(uc.category) }}>
                  {uc.category === 'agentic' ? 'Agentic' : uc.category === 'knowledge' ? 'Knowledge & Preservation' : 'Operations & Data'}
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 28,
        marginTop: 8,
        flexWrap: 'wrap',
      }}>
        {[
          { color: COLORS.clay, label: 'Operations & Data' },
          { color: COLORS.red, label: 'Agentic Use Cases' },
          { color: COLORS.obsidian, label: 'Knowledge & Preservation' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14">
              <circle cx="7" cy="7" r="6" fill={item.color} fillOpacity={0.8} />
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
