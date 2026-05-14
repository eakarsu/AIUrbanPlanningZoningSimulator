const express = require('express');
const { analyzeWithAI, parseAIJson } = require('../utils/aiAnalyzer');

const router = express.Router();

async function callOpenRouter(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-5-sonnet-20241022';
  if (!apiKey) {
    const err = new Error('AI service not configured (OPENROUTER_API_KEY missing)');
    err.statusCode = 503;
    throw err;
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'http://localhost:4000',
      'X-Title': 'AI Urban Planning & Zoning Simulator'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.5
    })
  });
  if (!response.ok) throw new Error(`AI API error: ${response.status} - ${await response.text()}`);
  const result = await response.json();
  return result.choices[0].message.content;
}

router.post('/analyze', async (req, res) => {
  try {
    const { feature, data } = req.body;

    if (!feature || !data) {
      return res.status(400).json({ error: 'Feature type and data are required.' });
    }

    const validFeatures = ['traffic', 'population', 'infrastructure', 'zoning', 'environmental', 'noise', 'greenspace'];
    if (!validFeatures.includes(feature)) {
      return res.status(400).json({ error: `Invalid feature type. Must be one of: ${validFeatures.join(', ')}` });
    }

    const analysis = await analyzeWithAI(feature, data);
    res.json({ analysis });
  } catch (err) {
    console.error('AI analysis error:', err);
    res.status(500).json({ error: 'Failed to perform AI analysis.', details: err.message });
  }
});

// Scenario comparison — compare zoning/development scenarios
router.post('/scenario-compare', async (req, res) => {
  try {
    const { scenarios, criteria } = req.body;
    if (!Array.isArray(scenarios) || scenarios.length < 2) {
      return res.status(400).json({ error: 'Provide at least two scenarios.' });
    }
    const systemPrompt = 'You are an urban planning scenario analyst. Always respond with valid JSON only.';
    const userPrompt = `Compare these zoning/development scenarios across the requested criteria.
Scenarios: ${JSON.stringify(scenarios)}
Criteria: ${JSON.stringify(criteria || ['affordable_housing', 'commercial_activity', 'green_space', 'traffic_impact', 'environmental_impact'])}

Return JSON:
{
  "scored_scenarios": [{"name": "...", "scores": {"<criterion>": <0-100>}, "total_score": <0-100>, "strengths": ["..."], "weaknesses": ["..."]}],
  "winner": "...",
  "tradeoffs": ["..."],
  "stakeholder_concerns": [{"group": "residents|businesses|environment|city", "concern": "..."}],
  "summary": "..."
}`;
    const raw = await callOpenRouter(systemPrompt, userPrompt);
    const parsed = parseAIJson(raw);
    res.json({ analysis: parsed || { raw } });
  } catch (err) {
    console.error('Scenario compare error:', err);
    res.status(err.statusCode || 500).json({ error: 'Failed to compare scenarios.', details: err.message });
  }
});

// Impact assessment — comprehensive impact across infrastructure, environment, community
router.post('/impact-assessment', async (req, res) => {
  try {
    const { project, location, parameters } = req.body;
    if (!project) return res.status(400).json({ error: 'project is required' });
    const systemPrompt = 'You are an urban impact assessment expert. Always respond with valid JSON only.';
    const userPrompt = `Assess comprehensive impact of a proposed development.
Project: ${JSON.stringify(project)}
Location: ${location || 'unspecified'}
Parameters: ${JSON.stringify(parameters || {})}

Return JSON:
{
  "infrastructure": {"schools_pressure": "low|medium|high", "utilities_pressure": "low|medium|high", "transit_pressure": "low|medium|high", "estimated_cost_usd": <number>},
  "environmental": {"air_quality_impact": "low|medium|high", "water_impact": "low|medium|high", "habitat_impact": "low|medium|high", "carbon_estimate_tons_yr": <number>},
  "community": {"jobs_created": <number>, "displacement_risk": "low|medium|high", "tax_revenue_usd_yr": <number>, "housing_units_added": <number>},
  "compliance_flags": [{"regulation": "...", "status": "compliant|review_needed|likely_violation"}],
  "overall_assessment": "favorable|conditional|unfavorable",
  "mitigations": ["..."],
  "summary": "..."
}`;
    const raw = await callOpenRouter(systemPrompt, userPrompt);
    const parsed = parseAIJson(raw);
    res.json({ analysis: parsed || { raw } });
  } catch (err) {
    console.error('Impact assessment error:', err);
    res.status(err.statusCode || 500).json({ error: 'Failed to assess impact.', details: err.message });
  }
});

// Compliance analysis — check a project against environmental and regulatory frameworks
router.post('/compliance-analysis', async (req, res) => {
  try {
    const { project, jurisdiction, frameworks, parameters } = req.body || {};
    if (!project) return res.status(400).json({ error: 'project is required' });
    const systemPrompt = 'You are a regulatory and environmental compliance analyst for urban development. Always respond with valid JSON only.';
    const userPrompt = `Perform a compliance analysis for this project.
Project: ${JSON.stringify(project)}
Jurisdiction: ${jurisdiction || 'unspecified'}
Frameworks to consider: ${JSON.stringify(frameworks || ['NEPA', 'CEQA', 'Clean Water Act', 'Clean Air Act', 'wetlands', 'endangered species', 'local zoning code'])}
Parameters: ${JSON.stringify(parameters || {})}

Return JSON:
{
  "framework_checks": [{"framework": "...", "status": "compliant|review_needed|likely_violation", "rationale": "...", "required_studies": ["..."]}],
  "permit_requirements": [{"permit": "...", "agency": "...", "estimated_timeline_days": <number>}],
  "high_risk_issues": ["..."],
  "documentation_needed": ["..."],
  "overall_compliance_outlook": "low|medium|high",
  "next_steps": ["..."],
  "summary": "..."
}`;
    const raw = await callOpenRouter(systemPrompt, userPrompt);
    const parsed = parseAIJson(raw);
    res.json({ analysis: parsed || { raw } });
  } catch (err) {
    console.error('Compliance analysis error:', err);
    res.status(err.statusCode || 500).json({ error: 'Failed to perform compliance analysis.', details: err.message });
  }
});

// Historic preservation advisor — guidance for projects affecting historic resources
router.post('/historic-preservation-advisor', async (req, res) => {
  try {
    const { project, site, historic_resources, jurisdiction } = req.body || {};
    if (!project) return res.status(400).json({ error: 'project is required' });
    const systemPrompt = 'You are a historic preservation advisor versed in Section 106, SHPO procedures, and the Secretary of the Interior\'s Standards. Always respond with valid JSON only.';
    const userPrompt = `Provide a historic preservation advisory for this project.
Project: ${JSON.stringify(project)}
Site: ${JSON.stringify(site || {})}
Identified historic resources: ${JSON.stringify(historic_resources || [])}
Jurisdiction: ${jurisdiction || 'unspecified'}

Return JSON:
{
  "designations_to_check": ["NRHP", "local landmark", "..."],
  "applicable_standards": ["..."],
  "section_106_path": {"applies": true|false, "consulting_parties": ["..."], "key_steps": ["..."]},
  "rehabilitation_recommendations": ["..."],
  "incompatible_alterations": ["..."],
  "tax_credit_eligibility": {"eligible": true|false|"unknown", "program": "...", "notes": "..."},
  "community_engagement": ["..."],
  "summary": "..."
}`;
    const raw = await callOpenRouter(systemPrompt, userPrompt);
    const parsed = parseAIJson(raw);
    res.json({ analysis: parsed || { raw } });
  } catch (err) {
    console.error('Historic preservation advisor error:', err);
    res.status(err.statusCode || 500).json({ error: 'Failed to generate historic preservation advisory.', details: err.message });
  }
});

// Apply pass 5: additional MECHANICAL backlog items.

// POST /scenario-optimizer
// Asks the model to propose an OPTIMIZED scenario given hard constraints +
// prioritized objectives. Strict JSON. 503 if OPENROUTER_API_KEY missing.
router.post('/scenario-optimizer', async (req, res) => {
  try {
    const { site, constraints, objectives, baseline_scenario } = req.body || {};
    if (!site) return res.status(400).json({ error: 'site is required' });
    const systemPrompt = 'You are an urban planning scenario optimizer. Always respond with valid JSON only.';
    const userPrompt = `Propose an optimized zoning/development scenario.
Site: ${JSON.stringify(site)}
Hard constraints: ${JSON.stringify(constraints || {})}
Prioritized objectives (descending priority): ${JSON.stringify(objectives || ['affordable_housing', 'green_space', 'tax_revenue', 'traffic_minimization'])}
Baseline scenario (optional): ${JSON.stringify(baseline_scenario || null)}

Return JSON:
{
  "optimized_scenario": {"name": "...", "land_use_mix_percent": {"residential": <number>, "commercial": <number>, "industrial": <number>, "open_space": <number>, "civic": <number>}, "max_height_ft": <number>, "max_far": <number>, "parking_ratio": <number>, "affordable_units_percent": <number>, "notes": "..."},
  "objective_scores": [{"objective": "...", "score_0_100": <number>, "rationale": "..."}],
  "tradeoffs": ["..."],
  "constraints_met": [{"constraint": "...", "met": true|false, "notes": "..."}],
  "implementation_steps": ["..."],
  "summary": "..."
}`;
    const raw = await callOpenRouter(systemPrompt, userPrompt);
    const parsed = parseAIJson(raw);
    res.json({ analysis: parsed || { raw } });
  } catch (err) {
    console.error('Scenario optimizer error:', err);
    res.status(err.statusCode || 500).json({ error: 'Failed to optimize scenario.', details: err.message });
  }
});

// POST /community-benefit-analyzer
// Evaluates community benefit against displacement, gentrification, and equity criteria.
router.post('/community-benefit-analyzer', async (req, res) => {
  try {
    const { project, demographics, existing_amenities, equity_priorities } = req.body || {};
    if (!project) return res.status(400).json({ error: 'project is required' });
    const systemPrompt = 'You are an equitable-development and community-benefit analyst. Respond with valid JSON only.';
    const userPrompt = `Analyze the community benefit profile of this project.
Project: ${JSON.stringify(project)}
Existing demographics: ${JSON.stringify(demographics || {})}
Existing amenities: ${JSON.stringify(existing_amenities || {})}
Equity priorities: ${JSON.stringify(equity_priorities || ['affordability', 'cultural preservation', 'workforce inclusion', 'health access'])}

Return JSON:
{
  "community_benefit_score_0_100": <number>,
  "benefits": [{"category": "...", "description": "...", "magnitude": "low|medium|high"}],
  "displacement_risk": {"level": "low|medium|high", "drivers": ["..."], "mitigations": ["..."]},
  "equity_gaps": ["..."],
  "recommended_cba_terms": [{"term": "...", "rationale": "..."}],
  "engagement_plan": ["..."],
  "summary": "..."
}`;
    const raw = await callOpenRouter(systemPrompt, userPrompt);
    const parsed = parseAIJson(raw);
    res.json({ analysis: parsed || { raw } });
  } catch (err) {
    console.error('Community benefit analyzer error:', err);
    res.status(err.statusCode || 500).json({ error: 'Failed to analyze community benefit.', details: err.message });
  }
});

// POST /density-far-calc
// Apply pass 5: deterministic (NON-AI) density / FAR calculator. No external API
// calls — pure math, always 200. Useful as a sanity check and feeds the AI tools.
// PRODUCT-DECISION: returns by-right max units and FAR-implied buildable area;
// jurisdiction-specific bonuses (TDR, inclusionary) deliberately not modeled here.
router.post('/density-far-calc', (req, res) => {
  try {
    const {
      lot_size_sqft,
      far,
      max_height_ft,
      floor_to_floor_ft,
      lot_coverage_percent,
      avg_unit_size_sqft,
      open_space_percent,
      parking_ratio_per_unit,
      parking_stall_sqft,
    } = req.body || {};

    const lot = Number(lot_size_sqft);
    const farNum = Number(far);
    if (!Number.isFinite(lot) || lot <= 0) return res.status(400).json({ error: 'lot_size_sqft must be > 0' });
    if (!Number.isFinite(farNum) || farNum <= 0) return res.status(400).json({ error: 'far must be > 0' });

    const cov = Number.isFinite(Number(lot_coverage_percent)) ? Number(lot_coverage_percent) / 100 : 0.7;
    const f2f = Number.isFinite(Number(floor_to_floor_ft)) && Number(floor_to_floor_ft) > 0 ? Number(floor_to_floor_ft) : 11;
    const heightFt = Number.isFinite(Number(max_height_ft)) && Number(max_height_ft) > 0 ? Number(max_height_ft) : null;
    const unitSize = Number.isFinite(Number(avg_unit_size_sqft)) && Number(avg_unit_size_sqft) > 0 ? Number(avg_unit_size_sqft) : 850;
    const openSpace = Number.isFinite(Number(open_space_percent)) ? Number(open_space_percent) / 100 : 0;
    const parkRatio = Number.isFinite(Number(parking_ratio_per_unit)) ? Number(parking_ratio_per_unit) : 1;
    const stallSqft = Number.isFinite(Number(parking_stall_sqft)) && Number(parking_stall_sqft) > 0 ? Number(parking_stall_sqft) : 350;

    const buildableArea = lot * farNum;
    const maxFootprint = lot * cov;
    const minFloorsByFar = maxFootprint > 0 ? Math.ceil(buildableArea / maxFootprint) : null;
    const maxFloorsByHeight = heightFt ? Math.floor(heightFt / f2f) : null;
    const limitingFloors = (minFloorsByFar != null && maxFloorsByHeight != null)
      ? Math.min(minFloorsByFar, maxFloorsByHeight)
      : (minFloorsByFar ?? maxFloorsByHeight ?? null);

    const maxBuildableByHeight = (maxFloorsByHeight != null) ? maxFootprint * maxFloorsByHeight : buildableArea;
    const effectiveBuildable = Math.min(buildableArea, maxBuildableByHeight);
    const usableResidentialArea = effectiveBuildable * 0.85; // 15% efficiency loss
    const maxUnitsByArea = Math.floor(usableResidentialArea / unitSize);

    const requiredOpenSpace = lot * openSpace;
    const parkingStalls = Math.ceil(maxUnitsByArea * parkRatio);
    const parkingArea = parkingStalls * stallSqft;

    res.json({
      inputs_resolved: { lot_size_sqft: lot, far: farNum, max_height_ft: heightFt, floor_to_floor_ft: f2f, lot_coverage_percent: cov * 100, avg_unit_size_sqft: unitSize, open_space_percent: openSpace * 100, parking_ratio_per_unit: parkRatio, parking_stall_sqft: stallSqft },
      results: {
        buildable_area_sqft: Math.round(buildableArea),
        max_footprint_sqft: Math.round(maxFootprint),
        min_floors_by_far: minFloorsByFar,
        max_floors_by_height: maxFloorsByHeight,
        limiting_floors: limitingFloors,
        effective_buildable_sqft: Math.round(effectiveBuildable),
        usable_residential_sqft: Math.round(usableResidentialArea),
        max_units_by_area: maxUnitsByArea,
        required_open_space_sqft: Math.round(requiredOpenSpace),
        parking_stalls_required: parkingStalls,
        parking_area_sqft: Math.round(parkingArea),
      },
      caveats: [
        'Assumes 85% net-to-gross floor area efficiency for residential.',
        'Does not include jurisdiction-specific density bonuses, inclusionary increments, or TDR.',
        'Use AI scenario tools for non-deterministic optimization or compliance review.'
      ]
    });
  } catch (err) {
    console.error('Density/FAR calc error:', err);
    res.status(500).json({ error: 'Failed to calculate density/FAR.', details: err.message });
  }
});

module.exports = router;
