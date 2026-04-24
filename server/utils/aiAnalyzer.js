const getPromptForFeature = (feature, data) => {
  const prompts = {
    traffic: `As a senior urban traffic engineer, analyze the following traffic flow data and provide a professional assessment:

Location: ${data.location || 'N/A'}
Vehicle Count: ${data.vehicleCount || 'N/A'}
Peak Hour: ${data.peakHour || 'N/A'}
Average Speed: ${data.avgSpeed || 'N/A'} mph
Congestion Level: ${data.congestionLevel || 'N/A'}
Road Type: ${data.roadType || 'N/A'}

Provide analysis covering:
1. Traffic flow pattern assessment
2. Congestion causes and bottleneck identification
3. Level of Service (LOS) rating
4. Short-term mitigation recommendations
5. Long-term infrastructure improvement suggestions
6. Impact on surrounding neighborhoods`,

    population: `As an urban demographics specialist, analyze the following population density data:

District: ${data.district || 'N/A'}
Current Population: ${data.currentPopulation || 'N/A'}
Area: ${data.area || 'N/A'} sq km
Current Density: ${data.density || 'N/A'} per sq km
Growth Rate: ${data.growthRate || 'N/A'}%
Projected Population: ${data.projectedPopulation || 'N/A'}
Projection Year: ${data.yearProjected || 'N/A'}

Provide analysis covering:
1. Current density classification and sustainability assessment
2. Growth trend analysis and demographic projections
3. Infrastructure capacity implications
4. Housing demand forecasts
5. Service delivery impact (schools, healthcare, utilities)
6. Recommendations for managed growth`,

    infrastructure: `As an infrastructure planning consultant, assess the following project impact:

Project Type: ${data.projectType || 'N/A'}
Location: ${data.location || 'N/A'}
Estimated Cost: $${data.estimatedCost || 'N/A'}
Impact Radius: ${data.impactRadius || 'N/A'} km
Affected Population: ${data.affectedPopulation || 'N/A'}
Duration: ${data.duration || 'N/A'}
Severity: ${data.severity || 'N/A'}

Provide analysis covering:
1. Cost-benefit analysis summary
2. Community impact assessment
3. Construction phase disruption analysis
4. Long-term benefits and ROI projection
5. Risk factors and mitigation strategies
6. Alternative approaches consideration`,

    zoning: `As a zoning compliance officer, review the following zoning application:

Parcel ID: ${data.parcelId || 'N/A'}
Zone Type: ${data.zoneType || 'N/A'}
Current Use: ${data.currentUse || 'N/A'}
Proposed Use: ${data.proposedUse || 'N/A'}
Building Height: ${data.buildingHeight || 'N/A'} ft
Lot Coverage: ${data.lotCoverage || 'N/A'}%
Setback: ${data.setback || 'N/A'} ft

Provide analysis covering:
1. Zoning compliance determination
2. Identified violations or concerns
3. Variance requirements if applicable
4. Neighborhood compatibility assessment
5. Conditional approval recommendations
6. Required modifications for compliance`,

    environmental: `As an environmental impact assessment specialist, evaluate the following:

Project: ${data.projectName || 'N/A'}
Location: ${data.location || 'N/A'}
Assessment Type: ${data.assessmentType || 'N/A'}
Air Quality Index: ${data.airQualityIndex || 'N/A'}
Water Quality Score: ${data.waterQualityScore || 'N/A'}
Soil Condition: ${data.soilCondition || 'N/A'}
Biodiversity Impact: ${data.biodiversityImpact || 'N/A'}

Provide analysis covering:
1. Overall environmental risk rating
2. Air quality impact and mitigation measures
3. Water resource protection recommendations
4. Soil contamination assessment
5. Ecological and biodiversity preservation strategies
6. Regulatory compliance requirements
7. Recommended environmental monitoring plan`,

    noise: `As an acoustical engineer and noise pollution specialist, analyze the following:

Location: ${data.location || 'N/A'}
Decibel Level: ${data.decibelLevel || 'N/A'} dB
Noise Source: ${data.source || 'N/A'}
Time of Day: ${data.timeOfDay || 'N/A'}
Affected Area: ${data.affectedArea || 'N/A'} sq km
Residential Proximity: ${data.residentialProximity || 'N/A'} m

Provide analysis covering:
1. Noise level classification and health impact assessment
2. Compliance with local noise ordinances
3. Impact on residential quality of life
4. Sound barrier and mitigation recommendations
5. Time-based noise management strategies
6. Monitoring and enforcement recommendations`,

    greenspace: `As an urban ecology and green space planning specialist, analyze the following:

Name: ${data.name || 'N/A'}
Type: ${data.type || 'N/A'}
Location: ${data.location || 'N/A'}
Area: ${data.area || 'N/A'} acres
Tree Count: ${data.treeCount || 'N/A'}
Biodiversity Score: ${data.biodiversityScore || 'N/A'}/10
Maintenance Cost: $${data.maintenanceCost || 'N/A'}/year
Accessibility: ${data.accessibility || 'N/A'}

Provide analysis covering:
1. Green space adequacy assessment
2. Ecological value and biodiversity recommendations
3. Community accessibility and equity analysis
4. Carbon sequestration potential
5. Maintenance optimization strategies
6. Enhancement and expansion recommendations
7. Integration with urban heat island mitigation`
  };

  return prompts[feature] || `Analyze the following urban planning data and provide professional recommendations: ${JSON.stringify(data)}`;
};

const analyzeWithAI = async (feature, data) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';

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
  return result.choices[0].message.content;
};

module.exports = { analyzeWithAI, getPromptForFeature };
