import { Farm } from '../types/farmer';

export const mockFarms: Farm[] = [
  {
    id: "farm_01",
    farmerId: "farmer_mh_413801",
    name: "Baramati North Plot (Tomato)",
    plotNumber: "Gat No. 142/A",
    village: "Malegaon Khurd",
    taluka: "Baramati",
    district: "Pune",
    state: "Maharashtra",
    areaAcres: 2.5,
    soilType: "Black Cotton Soil (Medium Deep)",
    irrigationType: "DRIP",
    crop: {
      name: "Tomato",
      variety: "Abhinav (Syngenta)",
      sowingDate: "2026-06-10",
      expectedHarvestDate: "2026-09-30",
      stage: "FRUITING",
      health: "WATCH",
      currentRisk: "HIGH"
    },
    lastScanDate: "2026-08-25T10:30:00Z",
    totalScansCount: 6,
    createdAt: "2025-01-10"
  },
  {
    id: "farm_02",
    farmerId: "farmer_mh_413801",
    name: "Karanje Riverbed Field (Chilli)",
    plotNumber: "Gat No. 89",
    village: "Karanje",
    taluka: "Baramati",
    district: "Pune",
    state: "Maharashtra",
    areaAcres: 2.0,
    soilType: "Clay Loam Soil",
    irrigationType: "DRIP",
    crop: {
      name: "Chilli",
      variety: "Sitara Gold (Teja)",
      sowingDate: "2026-05-20",
      expectedHarvestDate: "2026-10-15",
      stage: "FLOWERING",
      health: "HEALTHY",
      currentRisk: "LOW"
    },
    lastScanDate: "2026-08-26T14:15:00Z",
    totalScansCount: 4,
    createdAt: "2025-02-01"
  },
  {
    id: "farm_03",
    farmerId: "farmer_mh_413801",
    name: "Junnar Hill Plot (Groundnut)",
    plotNumber: "Gat No. 204/1",
    village: "Narayangaon",
    taluka: "Junnar",
    district: "Pune",
    state: "Maharashtra",
    areaAcres: 1.8,
    soilType: "Red Sandy Loam",
    irrigationType: "SPRINKLER",
    crop: {
      name: "Groundnut",
      variety: "TAG-24",
      sowingDate: "2026-06-25",
      expectedHarvestDate: "2026-10-30",
      stage: "VEGETATIVE",
      health: "AFFECTED",
      currentRisk: "MODERATE"
    },
    lastScanDate: "2026-08-24T09:00:00Z",
    totalScansCount: 3,
    createdAt: "2025-03-12"
  },
  {
    id: "farm_04",
    farmerId: "farmer_mh_413801",
    name: "Shirur Road Farm (Rice / Paddy)",
    plotNumber: "Gat No. 315",
    village: "Supa",
    taluka: "Shirur",
    district: "Pune",
    state: "Maharashtra",
    areaAcres: 2.2,
    soilType: "Alluvial Clay",
    irrigationType: "FLOOD",
    crop: {
      name: "Rice",
      variety: "Indrayani",
      sowingDate: "2026-07-05",
      expectedHarvestDate: "2026-11-20",
      stage: "VEGETATIVE",
      health: "HEALTHY",
      currentRisk: "LOW"
    },
    lastScanDate: "2026-08-22T16:45:00Z",
    totalScansCount: 2,
    createdAt: "2025-05-18"
  }
];
