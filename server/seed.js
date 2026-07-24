require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./db');
const {
  User, TrafficSimulation, PopulationDensity, InfrastructureImpact,
  ZoningCompliance, EnvironmentalAssessment, NoiseAnalysis, GreenSpace,
  LandUse, BuildingPermit, DistrictZone, TransportationRoute, PublicFacility
} = require('./models');

function requireDemoPassword() {
  const password = process.env.DEMO_PASSWORD || process.env.SEED_DEMO_PASSWORD || process.env.DEMO_SEED_PASSWORD || '';
  if (password.length < 12 || password.length > 1024) throw new Error('DEMO_PASSWORD must contain 12-1024 characters');
  return password;
}

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected.');

    console.log('Syncing models (force: true)...');
    await sequelize.sync({ force: true });
    console.log('Models synced.');

    // --- User ---
    console.log('Seeding Users...');
    const hashedPassword = await bcrypt.hash(requireDemoPassword(), 10);
    await User.create({ email: 'admin@urbanplanning.com', password: hashedPassword, name: 'Admin User' });
    console.log('  Created default admin user.');

    // --- Traffic Simulations ---
    console.log('Seeding Traffic Simulations...');
    await TrafficSimulation.bulkCreate([
      { name: 'I-405 Freeway Peak Analysis', location: 'Los Angeles, CA - I-405 Corridor', vehicleCount: 18500, peakHour: '8:00 AM', avgSpeed: 22.5, congestionLevel: 'severe', roadType: 'freeway', status: 'completed' },
      { name: 'Manhattan Midtown Grid Study', location: 'New York, NY - 42nd St & 5th Ave', vehicleCount: 12300, peakHour: '5:30 PM', avgSpeed: 8.2, congestionLevel: 'critical', roadType: 'urban-grid', status: 'completed' },
      { name: 'Lake Shore Drive Flow', location: 'Chicago, IL - Lake Shore Drive', vehicleCount: 9800, peakHour: '7:30 AM', avgSpeed: 35.0, congestionLevel: 'moderate', roadType: 'arterial', status: 'active' },
      { name: 'US-101 Silicon Valley Commute', location: 'San Jose, CA - US-101 North', vehicleCount: 15200, peakHour: '8:30 AM', avgSpeed: 18.7, congestionLevel: 'severe', roadType: 'highway', status: 'active' },
      { name: 'Peachtree Street Corridor', location: 'Atlanta, GA - Peachtree St NE', vehicleCount: 6700, peakHour: '5:00 PM', avgSpeed: 15.3, congestionLevel: 'moderate', roadType: 'arterial', status: 'pending' },
      { name: 'I-10 Katy Freeway Study', location: 'Houston, TX - I-10 West', vehicleCount: 21000, peakHour: '7:45 AM', avgSpeed: 28.4, congestionLevel: 'severe', roadType: 'freeway', status: 'completed' },
      { name: 'Capitol Hill Residential Traffic', location: 'Seattle, WA - Capitol Hill', vehicleCount: 3200, peakHour: '6:00 PM', avgSpeed: 18.0, congestionLevel: 'low', roadType: 'residential', status: 'active' },
      { name: 'I-95 Northeast Corridor', location: 'Washington, DC - I-95 South', vehicleCount: 16800, peakHour: '4:30 PM', avgSpeed: 25.1, congestionLevel: 'severe', roadType: 'interstate', status: 'pending' },
      { name: 'Market Street Transit Priority', location: 'San Francisco, CA - Market St', vehicleCount: 4500, peakHour: '9:00 AM', avgSpeed: 12.0, congestionLevel: 'moderate', roadType: 'transit-priority', status: 'active' },
      { name: 'I-75 Downtown Connector', location: 'Atlanta, GA - I-75/I-85', vehicleCount: 14600, peakHour: '8:15 AM', avgSpeed: 20.3, congestionLevel: 'severe', roadType: 'interstate', status: 'completed' },
      { name: 'Mass Pike Toll Analysis', location: 'Boston, MA - I-90', vehicleCount: 11200, peakHour: '7:00 AM', avgSpeed: 32.5, congestionLevel: 'moderate', roadType: 'toll-highway', status: 'active' },
      { name: 'Broadway Boulevard Study', location: 'Denver, CO - Broadway Blvd', vehicleCount: 5800, peakHour: '5:15 PM', avgSpeed: 20.0, congestionLevel: 'moderate', roadType: 'boulevard', status: 'pending' },
      { name: 'I-5 Portland Corridor', location: 'Portland, OR - I-5 through downtown', vehicleCount: 13400, peakHour: '8:00 AM', avgSpeed: 24.8, congestionLevel: 'severe', roadType: 'interstate', status: 'active' },
      { name: 'Woodward Avenue Historic Route', location: 'Detroit, MI - Woodward Ave', vehicleCount: 7200, peakHour: '4:45 PM', avgSpeed: 22.0, congestionLevel: 'moderate', roadType: 'arterial', status: 'completed' },
      { name: 'Loop 360 Scenic Drive', location: 'Austin, TX - Loop 360', vehicleCount: 8900, peakHour: '5:30 PM', avgSpeed: 30.2, congestionLevel: 'moderate', roadType: 'scenic-highway', status: 'active' },
    ]);
    console.log('  Created 15 traffic simulations.');

    // --- Population Density ---
    console.log('Seeding Population Density...');
    await PopulationDensity.bulkCreate([
      { name: 'Manhattan Core Density', district: 'Manhattan, New York', currentPopulation: 1694251, area: 59.1, density: 28667.5, growthRate: 0.8, projectedPopulation: 1750000, yearProjected: 2035, status: 'active' },
      { name: 'Downtown LA Analysis', district: 'Downtown Los Angeles', currentPopulation: 85000, area: 14.5, density: 5862.1, growthRate: 3.2, projectedPopulation: 115000, yearProjected: 2035, status: 'active' },
      { name: 'Chicago Loop Study', district: 'The Loop, Chicago', currentPopulation: 42000, area: 4.09, density: 10269.0, growthRate: 2.1, projectedPopulation: 52000, yearProjected: 2035, status: 'active' },
      { name: 'San Francisco Mission District', district: 'Mission District, SF', currentPopulation: 58000, area: 2.94, density: 19727.9, growthRate: 1.5, projectedPopulation: 66500, yearProjected: 2035, status: 'active' },
      { name: 'Houston Energy Corridor', district: 'Energy Corridor, Houston', currentPopulation: 45000, area: 18.5, density: 2432.4, growthRate: 4.1, projectedPopulation: 67000, yearProjected: 2035, status: 'active' },
      { name: 'Miami Beach Residential', district: 'South Beach, Miami', currentPopulation: 39000, area: 9.78, density: 3988.0, growthRate: 2.8, projectedPopulation: 50000, yearProjected: 2035, status: 'active' },
      { name: 'Seattle Capitol Hill Growth', district: 'Capitol Hill, Seattle', currentPopulation: 32000, area: 3.15, density: 10158.7, growthRate: 3.5, projectedPopulation: 45000, yearProjected: 2035, status: 'active' },
      { name: 'Boston Back Bay', district: 'Back Bay, Boston', currentPopulation: 28000, area: 1.41, density: 19858.2, growthRate: 1.2, projectedPopulation: 31500, yearProjected: 2035, status: 'active' },
      { name: 'Phoenix Suburban Expansion', district: 'Chandler, Phoenix Metro', currentPopulation: 275000, area: 165.0, density: 1666.7, growthRate: 5.2, projectedPopulation: 380000, yearProjected: 2035, status: 'active' },
      { name: 'Portland Pearl District', district: 'Pearl District, Portland', currentPopulation: 12000, area: 0.64, density: 18750.0, growthRate: 4.0, projectedPopulation: 18000, yearProjected: 2035, status: 'active' },
      { name: 'Denver Highland Neighborhood', district: 'Highland, Denver', currentPopulation: 18500, area: 2.3, density: 8043.5, growthRate: 3.8, projectedPopulation: 26000, yearProjected: 2035, status: 'active' },
      { name: 'Austin East Riverside', district: 'East Riverside, Austin', currentPopulation: 25000, area: 5.2, density: 4807.7, growthRate: 6.5, projectedPopulation: 42000, yearProjected: 2035, status: 'active' },
      { name: 'Nashville Germantown Growth', district: 'Germantown, Nashville', currentPopulation: 8500, area: 0.72, density: 11805.6, growthRate: 5.8, projectedPopulation: 14500, yearProjected: 2035, status: 'active' },
      { name: 'Minneapolis North Loop', district: 'North Loop, Minneapolis', currentPopulation: 9200, area: 0.85, density: 10823.5, growthRate: 4.5, projectedPopulation: 14000, yearProjected: 2035, status: 'active' },
      { name: 'Philadelphia Center City', district: 'Center City, Philadelphia', currentPopulation: 64000, area: 5.6, density: 11428.6, growthRate: 1.9, projectedPopulation: 76000, yearProjected: 2035, status: 'active' },
    ]);
    console.log('  Created 15 population density records.');

    // --- Infrastructure Impact ---
    console.log('Seeding Infrastructure Impact...');
    await InfrastructureImpact.bulkCreate([
      { name: 'Second Avenue Subway Extension', projectType: 'Transit Expansion', location: 'New York, NY', estimatedCost: 6300000000, impactRadius: 3.2, affectedPopulation: 250000, duration: '8 years', severity: 'high', status: 'in-progress' },
      { name: 'LAX People Mover', projectType: 'Airport Transit', location: 'Los Angeles, CA', estimatedCost: 4900000000, impactRadius: 5.0, affectedPopulation: 180000, duration: '5 years', severity: 'moderate', status: 'in-progress' },
      { name: 'Chicago Riverwalk Extension', projectType: 'Public Space', location: 'Chicago, IL', estimatedCost: 120000000, impactRadius: 1.5, affectedPopulation: 45000, duration: '3 years', severity: 'low', status: 'planning' },
      { name: 'Houston Flood Mitigation Project', projectType: 'Flood Control', location: 'Houston, TX', estimatedCost: 2800000000, impactRadius: 25.0, affectedPopulation: 1200000, duration: '10 years', severity: 'critical', status: 'assessment' },
      { name: 'Seattle Light Rail Expansion', projectType: 'Light Rail', location: 'Seattle, WA', estimatedCost: 3600000000, impactRadius: 15.0, affectedPopulation: 350000, duration: '7 years', severity: 'high', status: 'in-progress' },
      { name: 'SF Bay Bridge Retrofit', projectType: 'Bridge Rehabilitation', location: 'San Francisco, CA', estimatedCost: 850000000, impactRadius: 8.0, affectedPopulation: 280000, duration: '4 years', severity: 'high', status: 'planning' },
      { name: 'Atlanta BeltLine Trail Phase 4', projectType: 'Multi-use Trail', location: 'Atlanta, GA', estimatedCost: 450000000, impactRadius: 4.0, affectedPopulation: 95000, duration: '3 years', severity: 'low', status: 'assessment' },
      { name: 'Denver Water Main Replacement', projectType: 'Water Infrastructure', location: 'Denver, CO', estimatedCost: 320000000, impactRadius: 12.0, affectedPopulation: 420000, duration: '6 years', severity: 'moderate', status: 'in-progress' },
      { name: 'Boston Green Line Extension', projectType: 'Transit Expansion', location: 'Boston, MA', estimatedCost: 2300000000, impactRadius: 6.5, affectedPopulation: 160000, duration: '5 years', severity: 'moderate', status: 'completed' },
      { name: 'Phoenix Sky Harbor Terminal 5', projectType: 'Airport Expansion', location: 'Phoenix, AZ', estimatedCost: 1800000000, impactRadius: 7.0, affectedPopulation: 200000, duration: '6 years', severity: 'moderate', status: 'planning' },
      { name: 'Portland Burnside Bridge Replacement', projectType: 'Bridge Replacement', location: 'Portland, OR', estimatedCost: 895000000, impactRadius: 3.0, affectedPopulation: 75000, duration: '5 years', severity: 'high', status: 'assessment' },
      { name: 'Austin I-35 Cap and Stitch', projectType: 'Highway Reconstruction', location: 'Austin, TX', estimatedCost: 4500000000, impactRadius: 10.0, affectedPopulation: 500000, duration: '8 years', severity: 'critical', status: 'planning' },
      { name: 'Miami Stormwater Resilience Program', projectType: 'Stormwater Management', location: 'Miami, FL', estimatedCost: 750000000, impactRadius: 20.0, affectedPopulation: 650000, duration: '7 years', severity: 'high', status: 'in-progress' },
      { name: 'Nashville East Bank Development', projectType: 'Mixed-use Development', location: 'Nashville, TN', estimatedCost: 2100000000, impactRadius: 2.5, affectedPopulation: 55000, duration: '6 years', severity: 'moderate', status: 'planning' },
      { name: 'Minneapolis Nicollet Mall Redesign', projectType: 'Streetscape', location: 'Minneapolis, MN', estimatedCost: 75000000, impactRadius: 1.0, affectedPopulation: 30000, duration: '2 years', severity: 'low', status: 'completed' },
    ]);
    console.log('  Created 15 infrastructure impacts.');

    // --- Zoning Compliance ---
    console.log('Seeding Zoning Compliance...');
    await ZoningCompliance.bulkCreate([
      { name: 'Mixed-Use Tower Downtown Seattle', parcelId: 'SEA-2024-00145', zoneType: 'C2-65', currentUse: 'Parking Lot', proposedUse: 'Mixed-Use Residential/Commercial', buildingHeight: 240, lotCoverage: 85, setback: 5, complianceStatus: 'approved' },
      { name: 'Brooklyn Warehouse Conversion', parcelId: 'NYC-BK-2024-03892', zoneType: 'M1-2/R6A', currentUse: 'Industrial Warehouse', proposedUse: 'Residential Loft Apartments', buildingHeight: 75, lotCoverage: 70, setback: 10, complianceStatus: 'under-review' },
      { name: 'Austin ADU Construction', parcelId: 'ATX-2024-11203', zoneType: 'SF-3', currentUse: 'Single Family Residential', proposedUse: 'Single Family + ADU', buildingHeight: 30, lotCoverage: 45, setback: 15, complianceStatus: 'approved' },
      { name: 'Portland Food Cart Pod', parcelId: 'PDX-2024-08756', zoneType: 'CX', currentUse: 'Vacant Lot', proposedUse: 'Food Cart Pod with Seating', buildingHeight: 15, lotCoverage: 60, setback: 0, complianceStatus: 'approved' },
      { name: 'Denver RiNo Art District Gallery', parcelId: 'DEN-2024-04521', zoneType: 'C-MX-8', currentUse: 'Auto Repair Shop', proposedUse: 'Art Gallery and Studio Space', buildingHeight: 45, lotCoverage: 75, setback: 5, complianceStatus: 'pending' },
      { name: 'Chicago Wicker Park Retail', parcelId: 'CHI-2024-22341', zoneType: 'B3-2', currentUse: 'Retail', proposedUse: 'Retail with Rooftop Bar', buildingHeight: 50, lotCoverage: 100, setback: 0, complianceStatus: 'violation' },
      { name: 'LA Accessory Dwelling Unit', parcelId: 'LA-2024-67890', zoneType: 'R1', currentUse: 'Single Family Residential', proposedUse: 'SFR + 2 ADUs', buildingHeight: 25, lotCoverage: 55, setback: 4, complianceStatus: 'under-review' },
      { name: 'Miami Brickell Office Tower', parcelId: 'MIA-2024-15678', zoneType: 'T6-80', currentUse: 'Low-rise Office', proposedUse: 'High-rise Office Tower', buildingHeight: 650, lotCoverage: 80, setback: 20, complianceStatus: 'pending' },
      { name: 'Nashville Honky Tonk Row Expansion', parcelId: 'NSH-2024-09012', zoneType: 'DTC', currentUse: 'Entertainment Venue', proposedUse: 'Entertainment + Hotel', buildingHeight: 120, lotCoverage: 90, setback: 0, complianceStatus: 'under-review' },
      { name: 'SF Mission Housing Development', parcelId: 'SF-2024-34567', zoneType: 'RH-3', currentUse: 'Commercial Parking', proposedUse: 'Affordable Housing Complex', buildingHeight: 55, lotCoverage: 75, setback: 8, complianceStatus: 'approved' },
      { name: 'Houston Medical Center Expansion', parcelId: 'HOU-2024-78901', zoneType: 'HC', currentUse: 'Medical Office', proposedUse: 'Hospital Expansion Wing', buildingHeight: 180, lotCoverage: 65, setback: 25, complianceStatus: 'approved' },
      { name: 'Phoenix Solar Farm Installation', parcelId: 'PHX-2024-23456', zoneType: 'IND-1', currentUse: 'Undeveloped Land', proposedUse: 'Solar Energy Farm', buildingHeight: 12, lotCoverage: 40, setback: 50, complianceStatus: 'pending' },
      { name: 'Boston Seaport Hotel Project', parcelId: 'BOS-2024-56789', zoneType: 'WS-2', currentUse: 'Surface Parking', proposedUse: 'Boutique Hotel', buildingHeight: 95, lotCoverage: 80, setback: 10, complianceStatus: 'under-review' },
      { name: 'Minneapolis Uptown Micro-apartments', parcelId: 'MPLS-2024-01234', zoneType: 'C3A', currentUse: 'Retail Strip', proposedUse: 'Micro-apartment Building', buildingHeight: 65, lotCoverage: 85, setback: 5, complianceStatus: 'violation' },
      { name: 'Atlanta Ponce City Market Addition', parcelId: 'ATL-2024-45678', zoneType: 'MRC-3', currentUse: 'Mixed-Use Commercial', proposedUse: 'Mixed-Use + Event Space', buildingHeight: 90, lotCoverage: 88, setback: 8, complianceStatus: 'pending' },
    ]);
    console.log('  Created 15 zoning compliance records.');

    // --- Environmental Assessments ---
    console.log('Seeding Environmental Assessments...');
    await EnvironmentalAssessment.bulkCreate([
      { name: 'Hudson River Waterfront EIA', projectName: 'Hudson Yards Phase III', location: 'New York, NY', assessmentType: 'Full EIA', airQualityIndex: 72, waterQualityScore: 6.8, soilCondition: 'contaminated-remediated', biodiversityImpact: 'moderate', riskLevel: 'moderate' },
      { name: 'Bayou Greenway Restoration', projectName: 'Buffalo Bayou East Sector', location: 'Houston, TX', assessmentType: 'Ecological Assessment', airQualityIndex: 85, waterQualityScore: 5.2, soilCondition: 'flood-prone', biodiversityImpact: 'positive', riskLevel: 'low' },
      { name: 'LA River Revitalization EIS', projectName: 'LA River Master Plan Phase 2', location: 'Los Angeles, CA', assessmentType: 'Environmental Impact Statement', airQualityIndex: 58, waterQualityScore: 4.5, soilCondition: 'degraded', biodiversityImpact: 'significant-positive', riskLevel: 'moderate' },
      { name: 'Chicago Lakefront Erosion Study', projectName: 'South Lakefront Protection', location: 'Chicago, IL', assessmentType: 'Coastal Assessment', airQualityIndex: 68, waterQualityScore: 6.0, soilCondition: 'eroding', biodiversityImpact: 'moderate', riskLevel: 'high' },
      { name: 'Puget Sound Industrial Cleanup', projectName: 'Duwamish Waterway Remediation', location: 'Seattle, WA', assessmentType: 'Superfund Assessment', airQualityIndex: 62, waterQualityScore: 3.8, soilCondition: 'heavily-contaminated', biodiversityImpact: 'severe', riskLevel: 'critical' },
      { name: 'Everglades Buffer Zone Study', projectName: 'Western Suburbs Expansion EIA', location: 'Miami, FL', assessmentType: 'Wetland Assessment', airQualityIndex: 78, waterQualityScore: 7.2, soilCondition: 'marshy', biodiversityImpact: 'high-risk', riskLevel: 'high' },
      { name: 'Bay Area Brownfield Redevelopment', projectName: 'Hunters Point Shipyard Phase 3', location: 'San Francisco, CA', assessmentType: 'Brownfield Assessment', airQualityIndex: 65, waterQualityScore: 5.5, soilCondition: 'contaminated', biodiversityImpact: 'moderate', riskLevel: 'high' },
      { name: 'Denver Air Quality Monitoring', projectName: 'I-70 Viaduct Replacement', location: 'Denver, CO', assessmentType: 'Air Quality Study', airQualityIndex: 55, waterQualityScore: 7.0, soilCondition: 'stable', biodiversityImpact: 'low', riskLevel: 'moderate' },
      { name: 'Portland Urban Forest Assessment', projectName: 'Forest Park Edge Development', location: 'Portland, OR', assessmentType: 'Forest Impact Study', airQualityIndex: 42, waterQualityScore: 8.5, soilCondition: 'healthy', biodiversityImpact: 'moderate', riskLevel: 'moderate' },
      { name: 'Phoenix Heat Island Study', projectName: 'Downtown Cool Corridors Project', location: 'Phoenix, AZ', assessmentType: 'Climate Impact Assessment', airQualityIndex: 92, waterQualityScore: 6.0, soilCondition: 'arid-stable', biodiversityImpact: 'low', riskLevel: 'high' },
      { name: 'Boston Harbor Resilience', projectName: 'East Boston Waterfront Climate Plan', location: 'Boston, MA', assessmentType: 'Climate Resilience Assessment', airQualityIndex: 52, waterQualityScore: 6.5, soilCondition: 'fill-material', biodiversityImpact: 'moderate', riskLevel: 'high' },
      { name: 'Austin Creek Watershed Study', projectName: 'Shoal Creek Restoration', location: 'Austin, TX', assessmentType: 'Watershed Assessment', airQualityIndex: 48, waterQualityScore: 5.8, soilCondition: 'limestone-karst', biodiversityImpact: 'positive', riskLevel: 'moderate' },
      { name: 'Nashville Greenway Corridor', projectName: 'Mill Creek Greenway Extension', location: 'Nashville, TN', assessmentType: 'Riparian Assessment', airQualityIndex: 55, waterQualityScore: 6.2, soilCondition: 'alluvial', biodiversityImpact: 'positive', riskLevel: 'low' },
      { name: 'Atlanta Quarry Conversion', projectName: 'Westside Quarry Park', location: 'Atlanta, GA', assessmentType: 'Geological Assessment', airQualityIndex: 60, waterQualityScore: 4.8, soilCondition: 'exposed-rock', biodiversityImpact: 'moderate', riskLevel: 'moderate' },
      { name: 'Minneapolis Chain of Lakes', projectName: 'Lake Calhoun Water Quality Plan', location: 'Minneapolis, MN', assessmentType: 'Water Quality Assessment', airQualityIndex: 38, waterQualityScore: 7.8, soilCondition: 'glacial-till', biodiversityImpact: 'positive', riskLevel: 'low' },
    ]);
    console.log('  Created 15 environmental assessments.');

    // --- Noise Analysis ---
    console.log('Seeding Noise Analysis...');
    await NoiseAnalysis.bulkCreate([
      { name: 'JFK Airport Approach Path', location: 'Queens, NY - JFK Approach Zone', decibelLevel: 82, source: 'Aircraft', timeOfDay: 'All Day', affectedArea: 15.5, residentialProximity: 200, complianceStatus: 'exceeds-limits' },
      { name: 'I-405 Freeway Residential Buffer', location: 'Bellevue, WA - I-405 Adjacent', decibelLevel: 73, source: 'Highway Traffic', timeOfDay: 'Peak Hours', affectedArea: 4.2, residentialProximity: 50, complianceStatus: 'exceeds-limits' },
      { name: 'Downtown Construction Zone', location: 'San Francisco, CA - SoMa District', decibelLevel: 88, source: 'Construction Equipment', timeOfDay: 'Daytime', affectedArea: 2.0, residentialProximity: 100, complianceStatus: 'permitted' },
      { name: 'Music Row Entertainment District', location: 'Nashville, TN - Broadway', decibelLevel: 78, source: 'Entertainment Venues', timeOfDay: 'Evening/Night', affectedArea: 1.5, residentialProximity: 150, complianceStatus: 'within-limits' },
      { name: 'Port of Long Beach Operations', location: 'Long Beach, CA - Port Area', decibelLevel: 76, source: 'Industrial/Port', timeOfDay: '24 Hours', affectedArea: 8.0, residentialProximity: 400, complianceStatus: 'within-limits' },
      { name: 'Midway Airport Community Impact', location: 'Chicago, IL - Midway Vicinity', decibelLevel: 79, source: 'Aircraft', timeOfDay: 'All Day', affectedArea: 10.0, residentialProximity: 300, complianceStatus: 'exceeds-limits' },
      { name: 'Light Rail Transit Corridor', location: 'Portland, OR - MAX Blue Line', decibelLevel: 68, source: 'Light Rail', timeOfDay: 'Operating Hours', affectedArea: 3.0, residentialProximity: 30, complianceStatus: 'within-limits' },
      { name: 'Amazon Distribution Center', location: 'Dallas, TX - Industrial District', decibelLevel: 65, source: 'Logistics/Trucking', timeOfDay: '24 Hours', affectedArea: 5.0, residentialProximity: 500, complianceStatus: 'within-limits' },
      { name: 'Hospital Helicopter Pad', location: 'Houston, TX - Medical Center', decibelLevel: 85, source: 'Helicopter Operations', timeOfDay: 'Emergency Use', affectedArea: 1.8, residentialProximity: 250, complianceStatus: 'permitted' },
      { name: 'Sixth Street Bar District', location: 'Austin, TX - 6th Street', decibelLevel: 81, source: 'Entertainment/Music', timeOfDay: 'Night', affectedArea: 1.2, residentialProximity: 80, complianceStatus: 'exceeds-limits' },
      { name: 'Coors Field Event Noise', location: 'Denver, CO - LoDo District', decibelLevel: 72, source: 'Stadium Events', timeOfDay: 'Event Times', affectedArea: 2.5, residentialProximity: 200, complianceStatus: 'within-limits' },
      { name: 'MARTA Rail Yards', location: 'Atlanta, GA - Armour Yards', decibelLevel: 70, source: 'Rail Operations', timeOfDay: 'Early Morning', affectedArea: 3.5, residentialProximity: 150, complianceStatus: 'within-limits' },
      { name: 'Fenway Park Neighborhood Impact', location: 'Boston, MA - Fenway/Kenmore', decibelLevel: 75, source: 'Stadium/Entertainment', timeOfDay: 'Game Days', affectedArea: 1.8, residentialProximity: 50, complianceStatus: 'permitted' },
      { name: 'Phoenix Sky Harbor Flight Path', location: 'Phoenix, AZ - Approach Zone East', decibelLevel: 80, source: 'Aircraft', timeOfDay: 'All Day', affectedArea: 12.0, residentialProximity: 350, complianceStatus: 'exceeds-limits' },
      { name: 'Fremont Street Experience', location: 'Las Vegas, NV - Downtown', decibelLevel: 90, source: 'Entertainment/Amplified Music', timeOfDay: 'Evening/Night', affectedArea: 0.8, residentialProximity: 120, complianceStatus: 'permitted' },
    ]);
    console.log('  Created 15 noise analyses.');

    // --- Green Space ---
    console.log('Seeding Green Space...');
    await GreenSpace.bulkCreate([
      { name: 'Central Park', type: 'Urban Park', location: 'Manhattan, New York, NY', area: 843, treeCount: 18000, biodiversityScore: 8.5, maintenanceCost: 65000000, accessibility: 'excellent', status: 'active' },
      { name: 'Griffith Park', type: 'Regional Park', location: 'Los Angeles, CA', area: 4310, treeCount: 45000, biodiversityScore: 9.0, maintenanceCost: 12000000, accessibility: 'good', status: 'active' },
      { name: 'Millennium Park', type: 'Urban Plaza/Park', location: 'Chicago, IL', area: 24.5, treeCount: 300, biodiversityScore: 4.5, maintenanceCost: 8500000, accessibility: 'excellent', status: 'active' },
      { name: 'Discovery Green', type: 'Urban Park', location: 'Houston, TX', area: 12, treeCount: 350, biodiversityScore: 5.2, maintenanceCost: 3200000, accessibility: 'excellent', status: 'active' },
      { name: 'Piedmont Park', type: 'Urban Park', location: 'Atlanta, GA', area: 189, treeCount: 4500, biodiversityScore: 7.0, maintenanceCost: 5800000, accessibility: 'good', status: 'active' },
      { name: 'Forest Park', type: 'Urban Wilderness', location: 'Portland, OR', area: 5172, treeCount: 112000, biodiversityScore: 9.5, maintenanceCost: 4500000, accessibility: 'moderate', status: 'active' },
      { name: 'Zilker Park', type: 'Metropolitan Park', location: 'Austin, TX', area: 351, treeCount: 8000, biodiversityScore: 7.5, maintenanceCost: 6200000, accessibility: 'good', status: 'active' },
      { name: 'Washington Park Arboretum', type: 'Arboretum', location: 'Seattle, WA', area: 230, treeCount: 20000, biodiversityScore: 9.2, maintenanceCost: 3800000, accessibility: 'good', status: 'active' },
      { name: 'Boston Common', type: 'Historic Park', location: 'Boston, MA', area: 50, treeCount: 1200, biodiversityScore: 5.8, maintenanceCost: 4200000, accessibility: 'excellent', status: 'active' },
      { name: 'Papago Park', type: 'Desert Park', location: 'Phoenix, AZ', area: 1496, treeCount: 2500, biodiversityScore: 6.8, maintenanceCost: 2800000, accessibility: 'good', status: 'active' },
      { name: 'Shelby Farms Park', type: 'Urban Park', location: 'Memphis, TN', area: 4500, treeCount: 25000, biodiversityScore: 8.0, maintenanceCost: 5500000, accessibility: 'moderate', status: 'active' },
      { name: 'Balboa Park', type: 'Cultural Park', location: 'San Diego, CA', area: 1200, treeCount: 15000, biodiversityScore: 8.2, maintenanceCost: 9500000, accessibility: 'excellent', status: 'active' },
      { name: 'Chain of Lakes Greenway', type: 'Linear Park', location: 'Minneapolis, MN', area: 285, treeCount: 6500, biodiversityScore: 7.8, maintenanceCost: 4100000, accessibility: 'excellent', status: 'active' },
      { name: 'Fairmount Park', type: 'Urban Park System', location: 'Philadelphia, PA', area: 9200, treeCount: 95000, biodiversityScore: 8.8, maintenanceCost: 11000000, accessibility: 'good', status: 'active' },
      { name: 'Town Lake Trail', type: 'Urban Trail/Greenway', location: 'Austin, TX', area: 150, treeCount: 3200, biodiversityScore: 6.5, maintenanceCost: 2400000, accessibility: 'excellent', status: 'active' },
    ]);
    console.log('  Created 15 green spaces.');

    // --- Land Use ---
    console.log('Seeding Land Use...');
    await LandUse.bulkCreate([
      { name: 'Riverside Commercial Plaza', parcelNumber: 'APN-2024-001-234', category: 'Commercial', currentUse: 'Retail Shopping Center', owner: 'Riverside Development LLC', area: 12.5, zoneDistrict: 'C-2', assessedValue: 8500000, status: 'active' },
      { name: 'Oak Grove Residential Subdivision', parcelNumber: 'APN-2024-002-567', category: 'Residential', currentUse: 'Single Family Homes', owner: 'Oak Grove HOA', area: 45.0, zoneDistrict: 'R-1', assessedValue: 32000000, status: 'active' },
      { name: 'Harbor Point Industrial Complex', parcelNumber: 'APN-2024-003-890', category: 'Industrial', currentUse: 'Light Manufacturing', owner: 'Harbor Industries Inc', area: 28.0, zoneDistrict: 'M-1', assessedValue: 15000000, status: 'active' },
      { name: 'City Center Mixed Use', parcelNumber: 'APN-2024-004-123', category: 'Mixed-Use', currentUse: 'Retail/Office/Residential', owner: 'Metro Properties Group', area: 5.2, zoneDistrict: 'MU-3', assessedValue: 45000000, status: 'active' },
      { name: 'Greenfield Agricultural Reserve', parcelNumber: 'APN-2024-005-456', category: 'Agricultural', currentUse: 'Crop Farming', owner: 'Greenfield Family Trust', area: 320.0, zoneDistrict: 'AG-20', assessedValue: 4800000, status: 'active' },
      { name: 'Lakewood Office Park', parcelNumber: 'APN-2024-006-789', category: 'Office', currentUse: 'Class A Office Space', owner: 'Lakewood Capital Partners', area: 18.0, zoneDistrict: 'O-2', assessedValue: 52000000, status: 'active' },
      { name: 'Sunset Hills Conservation Area', parcelNumber: 'APN-2024-007-012', category: 'Conservation', currentUse: 'Protected Natural Area', owner: 'City of Portland', area: 150.0, zoneDistrict: 'OS-1', assessedValue: 2000000, status: 'active' },
      { name: 'University District Student Housing', parcelNumber: 'APN-2024-008-345', category: 'Residential', currentUse: 'Multi-family Housing', owner: 'University Housing Corp', area: 8.0, zoneDistrict: 'R-4', assessedValue: 28000000, status: 'active' },
      { name: 'Airport Business Center', parcelNumber: 'APN-2024-009-678', category: 'Commercial', currentUse: 'Hotels and Conference', owner: 'Airport Authority', area: 22.0, zoneDistrict: 'C-3', assessedValue: 38000000, status: 'active' },
      { name: 'Riverfront Vacant Redevelopment', parcelNumber: 'APN-2024-010-901', category: 'Vacant', currentUse: 'Undeveloped', owner: 'City Redevelopment Agency', area: 15.0, zoneDistrict: 'PD-5', assessedValue: 12000000, status: 'pending-development' },
      { name: 'Westside Medical Campus', parcelNumber: 'APN-2024-011-234', category: 'Institutional', currentUse: 'Hospital Complex', owner: 'Regional Health System', area: 35.0, zoneDistrict: 'I-1', assessedValue: 125000000, status: 'active' },
      { name: 'Downtown Parking Structure', parcelNumber: 'APN-2024-012-567', category: 'Transportation', currentUse: 'Parking Garage', owner: 'City Parking Authority', area: 2.5, zoneDistrict: 'CBD', assessedValue: 18000000, status: 'active' },
      { name: 'Northgate Shopping Mall', parcelNumber: 'APN-2024-013-890', category: 'Commercial', currentUse: 'Regional Shopping Mall', owner: 'Northgate Retail Holdings', area: 55.0, zoneDistrict: 'C-4', assessedValue: 72000000, status: 'redevelopment' },
      { name: 'Eastside Community Garden', parcelNumber: 'APN-2024-014-123', category: 'Recreation', currentUse: 'Community Gardens', owner: 'Parks Department', area: 3.0, zoneDistrict: 'OS-2', assessedValue: 450000, status: 'active' },
      { name: 'Tech Corridor Innovation Hub', parcelNumber: 'APN-2024-015-456', category: 'Mixed-Use', currentUse: 'Tech Offices/R&D Labs', owner: 'Innovation District Authority', area: 40.0, zoneDistrict: 'MU-5', assessedValue: 95000000, status: 'active' },
    ]);
    console.log('  Created 15 land use records.');

    // --- Building Permits ---
    console.log('Seeding Building Permits...');
    await BuildingPermit.bulkCreate([
      { permitNumber: 'BP-2024-00001', applicant: 'Hines Development', projectAddress: '1200 Main St, Houston, TX', permitType: 'New Construction', description: '45-story mixed-use tower with ground floor retail', estimatedCost: 285000000, sqFootage: 850000, stories: 45, status: 'approved' },
      { permitNumber: 'BP-2024-00002', applicant: 'Toll Brothers Inc', projectAddress: '455 Oak Lane, Scottsdale, AZ', permitType: 'New Construction', description: 'Luxury residential subdivision - 32 custom homes', estimatedCost: 48000000, sqFootage: 128000, stories: 2, status: 'approved' },
      { permitNumber: 'BP-2024-00003', applicant: 'Amazon Web Services', projectAddress: '2100 Innovation Dr, Ashburn, VA', permitType: 'New Construction', description: 'Data center facility with backup power systems', estimatedCost: 120000000, sqFootage: 350000, stories: 2, status: 'under-review' },
      { permitNumber: 'BP-2024-00004', applicant: 'Smith & Associates Architecture', projectAddress: '789 Pine St, San Francisco, CA', permitType: 'Major Renovation', description: 'Historic building seismic retrofit and adaptive reuse', estimatedCost: 18500000, sqFootage: 45000, stories: 6, status: 'approved' },
      { permitNumber: 'BP-2024-00005', applicant: 'Related Companies', projectAddress: '500 W 30th St, New York, NY', permitType: 'New Construction', description: 'Mixed-income residential tower with affordable units', estimatedCost: 450000000, sqFootage: 1200000, stories: 62, status: 'submitted' },
      { permitNumber: 'BP-2024-00006', applicant: 'Prologis Inc', projectAddress: '8800 Logistics Blvd, Dallas, TX', permitType: 'New Construction', description: 'Class A industrial warehouse and distribution center', estimatedCost: 35000000, sqFootage: 500000, stories: 1, status: 'approved' },
      { permitNumber: 'BP-2024-00007', applicant: 'HomeOwner J. Martinez', projectAddress: '2234 Maple Ave, Portland, OR', permitType: 'Residential Addition', description: 'Detached ADU with sustainable design features', estimatedCost: 185000, sqFootage: 800, stories: 1, status: 'approved' },
      { permitNumber: 'BP-2024-00008', applicant: 'Greystar Development', projectAddress: '900 S Lamar Blvd, Austin, TX', permitType: 'New Construction', description: 'Luxury apartment complex with amenity deck', estimatedCost: 95000000, sqFootage: 425000, stories: 28, status: 'under-review' },
      { permitNumber: 'BP-2024-00009', applicant: 'Denver Public Schools', projectAddress: '3100 Downing St, Denver, CO', permitType: 'Institutional', description: 'New elementary school with community center', estimatedCost: 42000000, sqFootage: 85000, stories: 3, status: 'approved' },
      { permitNumber: 'BP-2024-00010', applicant: 'Marriott International', projectAddress: '150 Peachtree St, Atlanta, GA', permitType: 'New Construction', description: 'Full-service convention hotel', estimatedCost: 175000000, sqFootage: 550000, stories: 34, status: 'submitted' },
      { permitNumber: 'BP-2024-00011', applicant: 'Target Corporation', projectAddress: '6200 University Ave, Minneapolis, MN', permitType: 'Commercial Renovation', description: 'Store modernization and expansion', estimatedCost: 8500000, sqFootage: 135000, stories: 1, status: 'approved' },
      { permitNumber: 'BP-2024-00012', applicant: 'Boston Properties', projectAddress: '200 Clarendon St, Boston, MA', permitType: 'Major Renovation', description: 'Office tower lobby renovation and HVAC upgrade', estimatedCost: 32000000, sqFootage: 750000, stories: 52, status: 'under-review' },
      { permitNumber: 'BP-2024-00013', applicant: 'Whole Foods Market', projectAddress: '1420 N Lake Shore Dr, Chicago, IL', permitType: 'Tenant Improvement', description: 'Ground floor retail buildout for grocery store', estimatedCost: 4200000, sqFootage: 40000, stories: 1, status: 'approved' },
      { permitNumber: 'BP-2024-00014', applicant: 'AvalonBay Communities', projectAddress: '3500 S Las Vegas Blvd, Las Vegas, NV', permitType: 'New Construction', description: 'Multi-family apartment community with pool complex', estimatedCost: 78000000, sqFootage: 380000, stories: 5, status: 'submitted' },
      { permitNumber: 'BP-2024-00015', applicant: 'Tesla Inc', projectAddress: '4500 Industrial Pkwy, Austin, TX', permitType: 'New Construction', description: 'Manufacturing facility expansion wing', estimatedCost: 250000000, sqFootage: 1500000, stories: 2, status: 'under-review' },
    ]);
    console.log('  Created 15 building permits.');

    // --- District Zones ---
    console.log('Seeding District Zones...');
    await DistrictZone.bulkCreate([
      { name: 'Single Family Residential Low Density', code: 'R-1', category: 'Residential', maxHeight: 35, maxDensity: 8, minLotSize: 6000, allowedUses: 'Single-family homes, home offices, accessory dwelling units', restrictions: 'No commercial activity, max 2 stories, 40% lot coverage', status: 'active' },
      { name: 'Multi-Family Residential High Density', code: 'R-4', category: 'Residential', maxHeight: 75, maxDensity: 65, minLotSize: 2500, allowedUses: 'Apartments, condos, townhouses, senior living', restrictions: 'Min 1 parking space per unit, 15% open space required', status: 'active' },
      { name: 'Neighborhood Commercial', code: 'C-1', category: 'Commercial', maxHeight: 45, maxDensity: 30, minLotSize: 3000, allowedUses: 'Retail, restaurants, personal services, small offices', restrictions: 'No drive-through, max 10,000 sqft per tenant, hours limited to 7am-10pm', status: 'active' },
      { name: 'General Commercial', code: 'C-2', category: 'Commercial', maxHeight: 65, maxDensity: 45, minLotSize: 5000, allowedUses: 'All C-1 uses plus auto services, entertainment, large retail', restrictions: 'Buffer required adjacent to residential zones', status: 'active' },
      { name: 'Central Business District', code: 'CBD', category: 'Commercial', maxHeight: 500, maxDensity: 200, minLotSize: 0, allowedUses: 'Office towers, hotels, retail, entertainment, residential above ground floor', restrictions: 'Ground floor retail activation required, LEED certification encouraged', status: 'active' },
      { name: 'Light Industrial', code: 'M-1', category: 'Industrial', maxHeight: 50, maxDensity: 15, minLotSize: 10000, allowedUses: 'Light manufacturing, warehousing, tech/R&D, brewing', restrictions: 'No hazardous materials, noise limits enforced, landscaping buffer required', status: 'active' },
      { name: 'Heavy Industrial', code: 'M-2', category: 'Industrial', maxHeight: 80, maxDensity: 10, minLotSize: 20000, allowedUses: 'Heavy manufacturing, chemical processing, resource extraction', restrictions: 'Environmental impact assessment required, 500ft residential buffer', status: 'active' },
      { name: 'Mixed-Use Urban', code: 'MU-3', category: 'Mixed-Use', maxHeight: 120, maxDensity: 80, minLotSize: 3000, allowedUses: 'Residential, commercial, office, cultural, live-work units', restrictions: 'Ground floor commercial required, min 20% affordable housing', status: 'active' },
      { name: 'Transit-Oriented Development', code: 'TOD-1', category: 'Mixed-Use', maxHeight: 150, maxDensity: 100, minLotSize: 2000, allowedUses: 'High-density residential, retail, office, transit facilities', restrictions: 'Max 0.5 parking spaces per unit, bike storage required, within 0.5mi of transit', status: 'active' },
      { name: 'Open Space/Parks', code: 'OS-1', category: 'Open Space', maxHeight: 25, maxDensity: 0, minLotSize: 0, allowedUses: 'Parks, recreation, trails, conservation, community gardens', restrictions: 'No permanent commercial structures, impervious surface max 10%', status: 'active' },
      { name: 'Agricultural Preservation', code: 'AG-20', category: 'Agricultural', maxHeight: 40, maxDensity: 1, minLotSize: 870000, allowedUses: 'Farming, ranching, farmers markets, agritourism, one dwelling per 20 acres', restrictions: 'No subdivision below 20 acres, right to farm protections', status: 'active' },
      { name: 'Historic Preservation Overlay', code: 'HP-O', category: 'Overlay', maxHeight: 45, maxDensity: 25, minLotSize: 0, allowedUses: 'Per underlying zone with historic compatibility review', restrictions: 'Facade preservation required, materials review board approval, no demolition without permit', status: 'active' },
      { name: 'Waterfront Development', code: 'WF-2', category: 'Special Purpose', maxHeight: 85, maxDensity: 50, minLotSize: 5000, allowedUses: 'Marina, waterfront dining, residential, public access, tourism', restrictions: 'Public waterfront access required, setback from water 50ft, flood-resistant construction', status: 'active' },
      { name: 'Institutional/Civic', code: 'I-1', category: 'Institutional', maxHeight: 100, maxDensity: 40, minLotSize: 10000, allowedUses: 'Schools, hospitals, government buildings, religious institutions, museums', restrictions: 'Traffic impact study required, adequate parking, ADA full compliance', status: 'active' },
      { name: 'Planned Development District', code: 'PD-5', category: 'Planned Development', maxHeight: 200, maxDensity: 120, minLotSize: 0, allowedUses: 'Master-planned community with mixed uses per approved plan', restrictions: 'Requires specific plan approval, community benefit agreement, phased development schedule', status: 'active' },
    ]);
    console.log('  Created 15 district zones.');

    // --- Transportation Routes ---
    console.log('Seeding Transportation Routes...');
    await TransportationRoute.bulkCreate([
      { name: 'Interstate 405 Corridor', routeNumber: 'I-405', type: 'Interstate Highway', startPoint: 'Irvine, CA', endPoint: 'San Fernando Valley, CA', distance: 72.4, avgDailyTraffic: 379000, condition: 'fair', status: 'active' },
      { name: 'Metro Red Line', routeNumber: 'RL-001', type: 'Heavy Rail Subway', startPoint: 'North Hollywood Station', endPoint: 'Union Station', distance: 16.4, avgDailyTraffic: 145000, condition: 'good', status: 'active' },
      { name: 'Brooklyn Bridge Crossing', routeNumber: 'BB-001', type: 'Bridge', startPoint: 'Manhattan, NY', endPoint: 'Brooklyn, NY', distance: 1.1, avgDailyTraffic: 120000, condition: 'fair', status: 'active' },
      { name: 'Chicago Blue Line', routeNumber: 'CTA-BL', type: 'Elevated Rail', startPoint: "O'Hare Airport", endPoint: 'Forest Park', distance: 33.5, avgDailyTraffic: 68000, condition: 'good', status: 'active' },
      { name: 'US Route 1 Pacific Coast Highway', routeNumber: 'US-1/PCH', type: 'State Highway', startPoint: 'Dana Point, CA', endPoint: 'Oxnard, CA', distance: 123.0, avgDailyTraffic: 45000, condition: 'good', status: 'active' },
      { name: 'MARTA Gold Line', routeNumber: 'MARTA-GL', type: 'Heavy Rail', startPoint: 'Doraville Station', endPoint: 'Airport Station', distance: 24.2, avgDailyTraffic: 52000, condition: 'fair', status: 'active' },
      { name: 'Boston Green Line Extension', routeNumber: 'MBTA-GLE', type: 'Light Rail', startPoint: 'Medford/Tufts', endPoint: 'Union Square', distance: 7.6, avgDailyTraffic: 25000, condition: 'excellent', status: 'active' },
      { name: 'I-10 Katy Freeway', routeNumber: 'I-10W', type: 'Interstate Highway', startPoint: 'Downtown Houston, TX', endPoint: 'Katy, TX', distance: 32.0, avgDailyTraffic: 350000, condition: 'good', status: 'active' },
      { name: 'Portland Streetcar Loop', routeNumber: 'PSC-NS', type: 'Streetcar', startPoint: 'NW 23rd Ave', endPoint: 'OMSI', distance: 8.3, avgDailyTraffic: 12000, condition: 'good', status: 'active' },
      { name: 'Burke-Gilman Trail', routeNumber: 'BGT-001', type: 'Multi-use Trail', startPoint: 'Shilshole Bay', endPoint: 'Bothell, WA', distance: 27.0, avgDailyTraffic: 8000, condition: 'excellent', status: 'active' },
      { name: 'Denver RTD W Line', routeNumber: 'RTD-W', type: 'Light Rail', startPoint: 'Union Station Denver', endPoint: 'Jefferson County', distance: 19.5, avgDailyTraffic: 22000, condition: 'excellent', status: 'active' },
      { name: 'I-35 Austin Corridor', routeNumber: 'I-35', type: 'Interstate Highway', startPoint: 'Round Rock, TX', endPoint: 'San Marcos, TX', distance: 55.0, avgDailyTraffic: 215000, condition: 'poor', status: 'under-construction' },
      { name: 'San Francisco Bay Ferry', routeNumber: 'WETA-SF', type: 'Ferry Route', startPoint: 'San Francisco Ferry Building', endPoint: 'Vallejo, CA', distance: 24.0, avgDailyTraffic: 4500, condition: 'good', status: 'active' },
      { name: 'Minneapolis Greenway', routeNumber: 'MG-001', type: 'Protected Bikeway', startPoint: 'Theodore Wirth Park', endPoint: 'Mississippi River', distance: 8.7, avgDailyTraffic: 5000, condition: 'excellent', status: 'active' },
      { name: 'Causeway Bridge', routeNumber: 'LA-CB', type: 'Bridge/Causeway', startPoint: 'Metairie, LA', endPoint: 'Mandeville, LA', distance: 38.4, avgDailyTraffic: 40000, condition: 'fair', status: 'active' },
    ]);
    console.log('  Created 15 transportation routes.');

    // --- Public Facilities ---
    console.log('Seeding Public Facilities...');
    await PublicFacility.bulkCreate([
      { name: 'Central Public Library', type: 'Library', address: '710 W César Chávez St, Austin, TX', capacity: 800, yearBuilt: 2017, condition: 'excellent', operatingBudget: 12500000, servingPopulation: 250000, status: 'operational' },
      { name: 'Harborview Medical Center', type: 'Hospital', address: '325 9th Ave, Seattle, WA', capacity: 413, yearBuilt: 1931, condition: 'good', operatingBudget: 890000000, servingPopulation: 1200000, status: 'operational' },
      { name: 'Engine 7 Fire Station', type: 'Fire Station', address: '200 Cambridge St, Boston, MA', capacity: 35, yearBuilt: 1975, condition: 'fair', operatingBudget: 4500000, servingPopulation: 45000, status: 'operational' },
      { name: 'Martin Luther King Jr. Community Center', type: 'Community Center', address: '950 MLK Jr Blvd, Portland, OR', capacity: 450, yearBuilt: 2005, condition: 'good', operatingBudget: 2800000, servingPopulation: 55000, status: 'operational' },
      { name: 'Precinct 19 Police Station', type: 'Police Station', address: '153 E 67th St, New York, NY', capacity: 120, yearBuilt: 1984, condition: 'fair', operatingBudget: 18000000, servingPopulation: 180000, status: 'operational' },
      { name: 'Roosevelt High School', type: 'School', address: '1410 NE 66th St, Seattle, WA', capacity: 1800, yearBuilt: 1922, condition: 'good', operatingBudget: 25000000, servingPopulation: 35000, status: 'operational' },
      { name: 'Centennial Water Treatment Plant', type: 'Water Treatment', address: '4300 S Platte River Dr, Denver, CO', capacity: 0, yearBuilt: 1960, condition: 'fair', operatingBudget: 45000000, servingPopulation: 650000, status: 'operational' },
      { name: 'Phoenix Convention Center', type: 'Convention Center', address: '100 N 3rd St, Phoenix, AZ', capacity: 24000, yearBuilt: 1972, condition: 'good', operatingBudget: 35000000, servingPopulation: 1800000, status: 'operational' },
      { name: 'Piedmont Park Recreation Center', type: 'Recreation Center', address: '400 Park Dr NE, Atlanta, GA', capacity: 300, yearBuilt: 2010, condition: 'excellent', operatingBudget: 1800000, servingPopulation: 40000, status: 'operational' },
      { name: 'Metro Transit Bus Depot', type: 'Transit Facility', address: '1900 Marquette Ave, Minneapolis, MN', capacity: 200, yearBuilt: 1995, condition: 'fair', operatingBudget: 15000000, servingPopulation: 350000, status: 'operational' },
      { name: 'City Hall', type: 'Government Building', address: '200 N Spring St, Los Angeles, CA', capacity: 1500, yearBuilt: 1928, condition: 'fair', operatingBudget: 22000000, servingPopulation: 4000000, status: 'operational' },
      { name: 'Barton Springs Pool', type: 'Public Pool/Aquatic Center', address: '2201 Barton Springs Rd, Austin, TX', capacity: 2000, yearBuilt: 1947, condition: 'good', operatingBudget: 3200000, servingPopulation: 120000, status: 'operational' },
      { name: 'Harold Washington Library Center', type: 'Library', address: '400 S State St, Chicago, IL', capacity: 1200, yearBuilt: 1991, condition: 'good', operatingBudget: 18000000, servingPopulation: 500000, status: 'operational' },
      { name: 'Miami-Dade County Courthouse', type: 'Courthouse', address: '73 W Flagler St, Miami, FL', capacity: 600, yearBuilt: 1928, condition: 'poor', operatingBudget: 28000000, servingPopulation: 2800000, status: 'needs-renovation' },
      { name: 'Nashville Metro Wastewater Plant', type: 'Wastewater Treatment', address: '1600 Omohundro Pl, Nashville, TN', capacity: 0, yearBuilt: 1958, condition: 'fair', operatingBudget: 52000000, servingPopulation: 700000, status: 'operational' },
    ]);
    console.log('  Created 15 public facilities.');

    console.log('\nSeed completed successfully!');
    console.log('Demo login users provisioned from the local environment.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
