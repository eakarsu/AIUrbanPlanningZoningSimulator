# Audit Note — AIUrbanPlanningZoningSimulator

Source: `/Users/erolakarsu/projects/_AUDIT/reports/batch_08.md` (section 22).

## Original Recommendations

### Missing AI Counterparts (critical)
- Scenario comparison
- Compliance analysis
- Impact assessment

### Missing Non-AI Features
- Real-time GIS integration (ArcGIS, QGIS)
- Public comment / stakeholder feedback
- Multi-year zoning amendment tracking
- Density / FAR calculations

### Custom Feature Suggestions
- Zoning scenario optimizer
- Infrastructure impact predictor
- Environmental compliance checker
- Community benefit analyzer
- Historic preservation advisor

## Implemented (this round)
1. `POST /api/ai/scenario-compare` — score and rank zoning scenarios.
2. `POST /api/ai/impact-assessment` — multi-domain impact analysis.

Pattern: added local `callOpenRouter` (mirrors `aiAnalyzer.js`) + reused exported `parseAIJson`. Syntax-checked.

## Backlog (prioritized)
1. **MECHANICAL** Compliance analysis endpoint (NEPA/wetlands/etc).
2. **MECHANICAL** Historic preservation advisor endpoint.
3. **NEEDS-CREDS** ArcGIS / QGIS / public-data integrations.
4. **NEEDS-PRODUCT-DECISION** Public comment workflow, multi-year amendment tracking.

## Apply pass 3 (frontend)

Previously the React client only called `/ai/analyze`; the two endpoints added in pass 2 (`/ai/scenario-compare`, `/ai/impact-assessment`) were unreachable from the UI.

- Added `client/src/pages/AIAdvisor.js` — single page with tab toggle between the two new tools, JSON inputs with sensible defaults, JWT auth via existing `utils/api.js` axios client, visible "AI not configured" message when the server returns 503/missing key.
- Wired the route `/ai-advisor` in `client/src/App.js`.
- Added an `ai-advisor` card to the `advancedFeatures` list in `client/src/pages/Dashboard.js` so it's discoverable.

No new dependencies. Server already registers `routes/ai.js` at `/api/ai` (verified). Both new endpoints are reachable from the new UI.

## Apply pass 4 (mechanical backlog)

Implemented the two MECHANICAL backlog items:

- `POST /api/ai/compliance-analysis` (in `server/routes/ai.js`): runs framework checks (NEPA, CEQA, wetlands, Clean Water Act, etc.), enumerates permit requirements, high-risk issues, documentation needs, and an overall compliance outlook. Strict JSON via `parseAIJson`.
- `POST /api/ai/historic-preservation-advisor` (in `server/routes/ai.js`): provides Section 106 path, applicable preservation standards, rehabilitation recommendations, incompatible alterations, and tax-credit eligibility. Strict JSON.

The shared `callOpenRouter` helper in this file now sets `err.statusCode = 503` when `OPENROUTER_API_KEY` is missing, and all four AI catch handlers (`scenario-compare`, `impact-assessment`, `compliance-analysis`, `historic-preservation-advisor`) honor it via `res.status(err.statusCode || 500)`.

FE: `client/src/pages/AIAdvisor.js` gains two additional tools with default-populated JSON form fields. The existing 503/`OPENROUTER_API_KEY` detection in the `run` handler surfaces "AI not configured" for the new tools as well.

No new dependencies, no schema changes.

## Apply pass 5 (all backlog)

Three additional features (two AI MECHANICAL, one deterministic non-AI), plus a server-boot fix.

- `POST /api/ai/scenario-optimizer` (`server/routes/ai.js`) — proposes an OPTIMIZED zoning scenario given hard constraints + prioritized objectives. Strict JSON. 503 when `OPENROUTER_API_KEY` missing.
- `POST /api/ai/community-benefit-analyzer` (`server/routes/ai.js`) — equity, displacement risk, and recommended community-benefit-agreement terms. Strict JSON. 503 when key missing.
- `POST /api/ai/density-far-calc` (`server/routes/ai.js`) — DETERMINISTIC by-right density / FAR / parking calculator. No AI, always 200. Documented `// PRODUCT-DECISION:` to omit jurisdiction-specific bonuses (TDR, inclusionary).
- `client/src/pages/AIAdvisor.js` — three new tools wired up; the deterministic tool uses a "Calculate" button (vs. "Run AI Analysis"), and the existing 503/`OPENROUTER_API_KEY` detection in the `run` handler covers the new AI tools.
- `server/routes/scenarios.js` (new) — minimal in-memory CRUD stub. `server/index.js` already required `./routes/scenarios` from an earlier pass, but the file was never created, so server boot was failing with `MODULE_NOT_FOUND`. Adding this stub restores boot. Replace with a real DB-backed CRUD when a `Scenario` model is introduced.

Smoke-tested: BE booted on alt port 4012, login OK with `admin@urbanplanning.com / admin123`, `POST /api/ai/density-far-calc` returned a full deterministic result on a 25,000 sqft / FAR 3 / 75 ft test (75 max units, 5 limiting floors, 75 parking stalls, 26,250 sqft parking area).

Remaining backlog (unchanged tags): NEEDS-CREDS ArcGIS/QGIS/public-data integrations; NEEDS-PRODUCT-DECISION public-comment workflow and multi-year amendment tracking.
