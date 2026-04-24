const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false }
});

const TrafficSimulation = sequelize.define('TrafficSimulation', {
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  vehicleCount: { type: DataTypes.INTEGER },
  peakHour: { type: DataTypes.STRING },
  avgSpeed: { type: DataTypes.FLOAT },
  congestionLevel: { type: DataTypes.STRING },
  roadType: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  aiAnalysis: { type: DataTypes.TEXT }
});

const PopulationDensity = sequelize.define('PopulationDensity', {
  name: { type: DataTypes.STRING, allowNull: false },
  district: { type: DataTypes.STRING, allowNull: false },
  currentPopulation: { type: DataTypes.INTEGER },
  area: { type: DataTypes.FLOAT },
  density: { type: DataTypes.FLOAT },
  growthRate: { type: DataTypes.FLOAT },
  projectedPopulation: { type: DataTypes.INTEGER },
  yearProjected: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING, defaultValue: 'active' },
  aiAnalysis: { type: DataTypes.TEXT }
});

const InfrastructureImpact = sequelize.define('InfrastructureImpact', {
  name: { type: DataTypes.STRING, allowNull: false },
  projectType: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  estimatedCost: { type: DataTypes.FLOAT },
  impactRadius: { type: DataTypes.FLOAT },
  affectedPopulation: { type: DataTypes.INTEGER },
  duration: { type: DataTypes.STRING },
  severity: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'assessment' },
  aiAnalysis: { type: DataTypes.TEXT }
});

const ZoningCompliance = sequelize.define('ZoningCompliance', {
  name: { type: DataTypes.STRING, allowNull: false },
  parcelId: { type: DataTypes.STRING, allowNull: false },
  zoneType: { type: DataTypes.STRING },
  currentUse: { type: DataTypes.STRING },
  proposedUse: { type: DataTypes.STRING },
  buildingHeight: { type: DataTypes.FLOAT },
  lotCoverage: { type: DataTypes.FLOAT },
  setback: { type: DataTypes.FLOAT },
  complianceStatus: { type: DataTypes.STRING, defaultValue: 'pending' },
  aiAnalysis: { type: DataTypes.TEXT }
});

const EnvironmentalAssessment = sequelize.define('EnvironmentalAssessment', {
  name: { type: DataTypes.STRING, allowNull: false },
  projectName: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  assessmentType: { type: DataTypes.STRING },
  airQualityIndex: { type: DataTypes.FLOAT },
  waterQualityScore: { type: DataTypes.FLOAT },
  soilCondition: { type: DataTypes.STRING },
  biodiversityImpact: { type: DataTypes.STRING },
  riskLevel: { type: DataTypes.STRING, defaultValue: 'moderate' },
  aiAnalysis: { type: DataTypes.TEXT }
});

const NoiseAnalysis = sequelize.define('NoiseAnalysis', {
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  decibelLevel: { type: DataTypes.FLOAT },
  source: { type: DataTypes.STRING },
  timeOfDay: { type: DataTypes.STRING },
  affectedArea: { type: DataTypes.FLOAT },
  residentialProximity: { type: DataTypes.FLOAT },
  complianceStatus: { type: DataTypes.STRING, defaultValue: 'within-limits' },
  aiAnalysis: { type: DataTypes.TEXT }
});

const GreenSpace = sequelize.define('GreenSpace', {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  area: { type: DataTypes.FLOAT },
  treeCount: { type: DataTypes.INTEGER },
  biodiversityScore: { type: DataTypes.FLOAT },
  maintenanceCost: { type: DataTypes.FLOAT },
  accessibility: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'active' },
  aiAnalysis: { type: DataTypes.TEXT }
});

const LandUse = sequelize.define('LandUse', {
  name: { type: DataTypes.STRING, allowNull: false },
  parcelNumber: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  currentUse: { type: DataTypes.STRING },
  owner: { type: DataTypes.STRING },
  area: { type: DataTypes.FLOAT },
  zoneDistrict: { type: DataTypes.STRING },
  assessedValue: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
});

const BuildingPermit = sequelize.define('BuildingPermit', {
  permitNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  applicant: { type: DataTypes.STRING, allowNull: false },
  projectAddress: { type: DataTypes.STRING },
  permitType: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  estimatedCost: { type: DataTypes.FLOAT },
  sqFootage: { type: DataTypes.FLOAT },
  stories: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING, defaultValue: 'submitted' }
});

const DistrictZone = sequelize.define('DistrictZone', {
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  category: { type: DataTypes.STRING },
  maxHeight: { type: DataTypes.FLOAT },
  maxDensity: { type: DataTypes.FLOAT },
  minLotSize: { type: DataTypes.FLOAT },
  allowedUses: { type: DataTypes.TEXT },
  restrictions: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
});

const TransportationRoute = sequelize.define('TransportationRoute', {
  name: { type: DataTypes.STRING, allowNull: false },
  routeNumber: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING },
  startPoint: { type: DataTypes.STRING },
  endPoint: { type: DataTypes.STRING },
  distance: { type: DataTypes.FLOAT },
  avgDailyTraffic: { type: DataTypes.INTEGER },
  condition: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
});

const PublicFacility = sequelize.define('PublicFacility', {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER },
  yearBuilt: { type: DataTypes.INTEGER },
  condition: { type: DataTypes.STRING },
  operatingBudget: { type: DataTypes.FLOAT },
  servingPopulation: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING, defaultValue: 'operational' }
});

module.exports = {
  User, TrafficSimulation, PopulationDensity, InfrastructureImpact,
  ZoningCompliance, EnvironmentalAssessment, NoiseAnalysis, GreenSpace,
  LandUse, BuildingPermit, DistrictZone, TransportationRoute, PublicFacility
};
