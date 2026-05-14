const getPromptForFeature = (feature, data) => {
  const prompts = {
    traffic: `As a senior urban traffic engineer, analyze the following traffic flow data and provide a professional assessment.

Location: ${data.location || 'N/A'}
Vehicle Count: ${data.vehicleCount || 'N/A'}
Peak Hour: ${data.peakHour || 'N/A'}
Average Speed: ${data.avgSpeed || 'N/A'} mph
Congestion Level: ${data.congestionLevel || 'N/A'}
Road Type: ${data.roadType || 'N/A'}
${data._districtZone ? `District Zone Context: ${data._districtZone}` : ''}

Return ONLY valid JSON in this exact structure:
{
  "level_of_service": "A/B/C/D/E/F",
  "congestion_score": 72,
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "peak_hours": ["07:00-09:00", "17:00-19:00"],
  "summary": "two sentence professional assessment",
  "risk_factors": ["risk1", "risk2"],
  "estimated_delay_minutes": 15
}`,

    population: `As an urban demographics specialist, analyze the following population density data.

District: ${data.district || 'N/A'}
Current Population: ${data.currentPopulation || 'N/A'}
Area: ${data.area || 'N/A'} sq km
Current Density: ${data.density || 'N/A'} per sq km
Growth Rate: ${data.growthRate || 'N/A'}%
Projected Population: ${data.projectedPopulation || 'N/A'}
Projection Year: ${data.yearProjected || 'N/A'}

Return ONLY valid JSON:
{
  "density_classification": "low/medium/high/very-high",
  "sustainability_score": 75,
  "growth_trend": "stable/growing/declining/rapid-growth",
  "recommendations": ["rec1", "rec2", "rec3"],
  "housing_demand_units": 1200,
  "infrastructure_pressure": "low/moderate/high/critical",
  "summary": "two sentence assessment",
  "key_risks": ["risk1", "risk2"]
}`,

    infrastructure: `As an infrastructure planning consultant, assess the following project impact.

Project Type: ${data.projectType || 'N/A'}
Location: ${data.location || 'N/A'}
Estimated Cost: $${data.estimatedCost || 'N/A'}
Impact Radius: ${data.impactRadius || 'N/A'} km
Affected Population: ${data.affectedPopulation || 'N/A'}
Duration: ${data.duration || 'N/A'}
Severity: ${data.severity || 'N/A'}

Return ONLY valid JSON:
{
  "cost_benefit_ratio": 2.4,
  "community_impact_score": 65,
  "disruption_level": "low/moderate/high/severe",
  "roi_estimate_years": 8,
  "recommendations": ["rec1", "rec2", "rec3"],
  "risk_factors": ["risk1", "risk2"],
  "alternative_approaches": ["alternative1", "alternative2"],
  "summary": "two sentence assessment"
}`,

    zoning: `As a zoning compliance officer, review the following zoning application.

Parcel ID: ${data.parcelId || 'N/A'}
Zone Type: ${data.zoneType || 'N/A'}
Current Use: ${data.currentUse || 'N/A'}
Proposed Use: ${data.proposedUse || 'N/A'}
Building Height: ${data.buildingHeight || 'N/A'} ft
Lot Coverage: ${data.lotCoverage || 'N/A'}%
Setback: ${data.setback || 'N/A'} ft
${data._districtZone ? `District Zone Rules: Allowed Uses: ${data._districtZone.allowedUses || 'N/A'}, Max Height: ${data._districtZone.maxHeight || 'N/A'} ft, Max Density: ${data._districtZone.maxDensity || 'N/A'}, Restrictions: ${data._districtZone.restrictions || 'N/A'}` : ''}
${data._environmentalAssessment ? `Nearby Environmental Assessment: Risk Level: ${data._environmentalAssessment.riskLevel || 'N/A'}, Air Quality: ${data._environmentalAssessment.airQualityIndex || 'N/A'}` : ''}

Return ONLY valid JSON:
{
  "compliant": true,
  "violations": ["violation1"],
  "required_variances": ["variance1"],
  "risk_level": "low/medium/high",
  "neighborhood_compatibility": "compatible/conditional/incompatible",
  "conditional_requirements": ["requirement1"],
  "summary": "two sentence compliance assessment",
  "narrative": "detailed narrative explanation for the applicant"
}`,

    environmental: `As an environmental impact assessment specialist, evaluate the following.

Project: ${data.projectName || 'N/A'}
Location: ${data.location || 'N/A'}
Assessment Type: ${data.assessmentType || 'N/A'}
Air Quality Index: ${data.airQualityIndex || 'N/A'}
Water Quality Score: ${data.waterQualityScore || 'N/A'}
Soil Condition: ${data.soilCondition || 'N/A'}
Biodiversity Impact: ${data.biodiversityImpact || 'N/A'}
${data._nearbyGreenSpaces ? `Nearby Green Spaces: ${data._nearbyGreenSpaces.map(g => `${g.name} (${g.area} acres, biodiversity: ${g.biodiversityScore}/10)`).join('; ')}` : ''}

Return ONLY valid JSON:
{
  "eia_score": 72,
  "risks": ["risk1", "risk2", "risk3"],
  "mitigation_measures": ["measure1", "measure2", "measure3"],
  "approval_likelihood": "likely/conditional/unlikely",
  "air_quality_assessment": "good/moderate/poor",
  "biodiversity_impact_level": "low/moderate/high",
  "monitoring_requirements": ["requirement1", "requirement2"],
  "summary": "two sentence assessment"
}`,

    noise: `As an acoustical engineer and noise pollution specialist, analyze the following.

Location: ${data.location || 'N/A'}
Decibel Level: ${data.decibelLevel || 'N/A'} dB
Noise Source: ${data.source || 'N/A'}
Time of Day: ${data.timeOfDay || 'N/A'}
Affected Area: ${data.affectedArea || 'N/A'} sq km
Residential Proximity: ${data.residentialProximity || 'N/A'} m

Return ONLY valid JSON:
{
  "noise_classification": "acceptable/moderate/excessive/harmful",
  "health_impact_level": "low/moderate/high",
  "ordinance_compliant": true,
  "affected_residents_estimate": 2400,
  "mitigation_recommendations": ["recommendation1", "recommendation2"],
  "barrier_type_recommended": "vegetation/wall/berm/none",
  "monitoring_frequency": "daily/weekly/monthly",
  "summary": "two sentence noise assessment"
}`,

    greenspace: `As an urban ecology and green space planning specialist, analyze the following.

Name: ${data.name || 'N/A'}
Type: ${data.type || 'N/A'}
Location: ${data.location || 'N/A'}
Area: ${data.area || 'N/A'} acres
Tree Count: ${data.treeCount || 'N/A'}
Biodiversity Score: ${data.biodiversityScore || 'N/A'}/10
Maintenance Cost: $${data.maintenanceCost || 'N/A'}/year
Accessibility: ${data.accessibility || 'N/A'}

Return ONLY valid JSON:
{
  "adequacy_rating": "insufficient/adequate/excellent",
  "ecological_value": "low/medium/high",
  "carbon_sequestration_tons_per_year": 12.5,
  "accessibility_score": 75,
  "maintenance_efficiency_score": 68,
  "enhancement_recommendations": ["recommendation1", "recommendation2"],
  "heat_island_mitigation_potential": "low/moderate/high",
  "estimated_tree_planting_needed": 45,
  "summary": "two sentence ecological assessment"
}`,

    landuse: `As an urban land use planning expert, analyze the following parcel data.

Parcel Number: ${data.parcelNumber || 'N/A'}
Category: ${data.category || 'N/A'}
Current Use: ${data.currentUse || 'N/A'}
Owner: ${data.owner || 'N/A'}
Area: ${data.area || 'N/A'} sq ft
Zone District: ${data.zoneDistrict || 'N/A'}
Assessed Value: $${data.assessedValue || 'N/A'}

Return ONLY valid JSON:
{
  "land_use_efficiency": "underutilized/optimal/overdeveloped",
  "value_to_area_ratio": 45.2,
  "rezoning_opportunity": true,
  "recommended_use": "residential/commercial/mixed-use/industrial/open-space",
  "development_potential_score": 72,
  "compliance_issues": ["issue1"],
  "recommendations": ["recommendation1", "recommendation2"],
  "summary": "two sentence land use assessment"
}`,

    buildingpermit: `As a building permit review specialist, analyze the following permit application.

Permit Number: ${data.permitNumber || 'N/A'}
Applicant: ${data.applicant || 'N/A'}
Project Address: ${data.projectAddress || 'N/A'}
Permit Type: ${data.permitType || 'N/A'}
Description: ${data.description || 'N/A'}
Estimated Cost: $${data.estimatedCost || 'N/A'}
Square Footage: ${data.sqFootage || 'N/A'}
Stories: ${data.stories || 'N/A'}

Return ONLY valid JSON:
{
  "approval_recommendation": "approve/conditional-approve/deny",
  "risk_level": "low/medium/high",
  "compliance_issues": ["issue1"],
  "required_inspections": ["inspection1", "inspection2"],
  "estimated_review_days": 15,
  "conditions": ["condition1"],
  "code_references": ["code1"],
  "summary": "two sentence permit assessment"
}`,

    districtzone: `As an urban zoning district planning expert, analyze the following district zone.

Name: ${data.name || 'N/A'}
Code: ${data.code || 'N/A'}
Category: ${data.category || 'N/A'}
Max Height: ${data.maxHeight || 'N/A'} ft
Max Density: ${data.maxDensity || 'N/A'}
Min Lot Size: ${data.minLotSize || 'N/A'} sq ft
Allowed Uses: ${data.allowedUses || 'N/A'}
Restrictions: ${data.restrictions || 'N/A'}

Return ONLY valid JSON:
{
  "zone_health_score": 78,
  "development_capacity": "low/medium/high",
  "mixed_use_potential": true,
  "density_appropriateness": "under-dense/appropriate/over-dense",
  "recommended_amendments": ["amendment1", "amendment2"],
  "compatibility_with_neighbors": "compatible/review-needed/incompatible",
  "future_land_value_trend": "declining/stable/increasing",
  "summary": "two sentence zone assessment"
}`,

    transportationroute: `As an urban transportation planning expert, analyze the following route.

Name: ${data.name || 'N/A'}
Route Number: ${data.routeNumber || 'N/A'}
Type: ${data.type || 'N/A'}
Start Point: ${data.startPoint || 'N/A'}
End Point: ${data.endPoint || 'N/A'}
Distance: ${data.distance || 'N/A'} miles
Avg Daily Traffic: ${data.avgDailyTraffic || 'N/A'}
Condition: ${data.condition || 'N/A'}

Return ONLY valid JSON:
{
  "service_level": "excellent/good/fair/poor",
  "capacity_utilization_percent": 72,
  "maintenance_priority": "low/medium/high/urgent",
  "estimated_daily_riders": 4500,
  "improvement_recommendations": ["recommendation1", "recommendation2"],
  "safety_rating": "good/fair/poor",
  "estimated_maintenance_cost": 250000,
  "summary": "two sentence route assessment"
}`,

    publicfacility: `As an urban public facility planning expert, analyze the following facility.

Name: ${data.name || 'N/A'}
Type: ${data.type || 'N/A'}
Address: ${data.address || 'N/A'}
Capacity: ${data.capacity || 'N/A'}
Year Built: ${data.yearBuilt || 'N/A'}
Condition: ${data.condition || 'N/A'}
Operating Budget: $${data.operatingBudget || 'N/A'}
Serving Population: ${data.servingPopulation || 'N/A'}

Return ONLY valid JSON:
{
  "facility_score": 74,
  "capacity_utilization": "underutilized/adequate/at-capacity/overcrowded",
  "renovation_priority": "none/low/medium/high/urgent",
  "estimated_renovation_cost": 1200000,
  "service_coverage_adequacy": "insufficient/adequate/excellent",
  "recommendations": ["recommendation1", "recommendation2"],
  "lifespan_remaining_years": 15,
  "summary": "two sentence facility assessment"
}`
  };

  return prompts[feature] || `Analyze the following urban planning data and provide professional recommendations: ${JSON.stringify(data)}`;
};

// Parse structured JSON from AI response
const parseAIJson = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {}
  try {
    const stripped = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
    return JSON.parse(stripped);
  } catch {}
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return null;
};

const analyzeWithAI = async (feature, data) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-5-sonnet-20241022';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const prompt = getPromptForFeature(feature, data);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'http://localhost:4000',
      'X-Title': 'AI Urban Planning & Zoning Simulator'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert urban planner, civil engineer, and city development consultant with decades of experience in municipal planning, zoning regulations, environmental compliance, and infrastructure development. Provide detailed, professional, and actionable analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`AI API error: ${response.status} - ${errorData}`);
  }

  const result = await response.json();
  const rawText = result.choices[0].message.content;

  // Try to return structured JSON; fall back to raw text
  const parsed = parseAIJson(rawText);
  return parsed ? JSON.stringify(parsed) : rawText;
};

module.exports = { analyzeWithAI, getPromptForFeature, parseAIJson };
