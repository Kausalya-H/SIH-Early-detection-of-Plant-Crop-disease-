import { CropAlert } from '../types/alert';

export const mockAlerts: CropAlert[] = [
  {
    id: "alert_001",
    title: "High Risk: Tomato Late Blight Alert for Baramati & Haveli Talukas",
    category: "DISEASE_OUTBREAK",
    severity: "CRITICAL",
    affectedCrops: ["Tomato", "Potato"],
    region: "Western Maharashtra",
    district: "Pune",
    description: "Continuous overcast conditions with relative humidity >85% and night temperatures around 19°C have created high risk for Phytophthora infestans (Late Blight) emergence.",
    actionRequired: "Inspect tomato fields immediately. Avoid sprinkler irrigation. If dark water-soaked leaf lesions appear, consult agricultural officer or spray approved contact fungicide.",
    createdAt: "2026-08-27T06:30:00Z",
    isRead: false,
    source: "District Agriculture Advisory Service (KVK Pune / MPKV Rahuri)"
  },
  {
    id: "alert_002",
    title: "Weather Alert: Heavy Rain & High Humidity Forecast (Next 48 Hours)",
    category: "WEATHER_RISK",
    severity: "HIGH",
    affectedCrops: ["Tomato", "Chilli", "Groundnut", "Soybean"],
    region: "Pune & Satara Districts",
    district: "Pune",
    description: "IMD predicts moderate to heavy intermittent showers (45-70mm) across Pune district. Soil waterlogging may increase root rot and fungal sporulation.",
    actionRequired: "Clear drainage channels in all standing vegetable plots. Postpone foliar spraying until rain subsides.",
    createdAt: "2026-08-26T18:00:00Z",
    isRead: false,
    source: "India Meteorological Department (IMD Agromet Advisory)"
  },
  {
    id: "alert_003",
    title: "Pest Warning: Whitefly & Thrips Population Surge in Chilli Crops",
    category: "PEST_WARNING",
    severity: "MODERATE",
    affectedCrops: ["Chilli", "Cotton"],
    region: "Nashik & Pune Belt",
    district: "Pune",
    description: "Yellow sticky trap counts indicate rise in sucking pests (thrips and whiteflies), increasing the risk of Chilli Leaf Curl Virus transmission.",
    actionRequired: "Install 15-20 yellow and blue sticky traps per acre. Apply Neem oil spray (1500 ppm) @ 3ml/litre water during early morning.",
    createdAt: "2026-08-25T11:20:00Z",
    isRead: true,
    source: "Department of Agriculture, Govt. of Maharashtra"
  },
  {
    id: "alert_004",
    title: "Officer Message: Virtual Consultation Scheduled for Plot Gat No. 142/A",
    category: "OFFICER_MESSAGE",
    severity: "LOW",
    affectedCrops: ["Tomato"],
    region: "Baramati Block",
    district: "Pune",
    description: "Taluka Agriculture Officer Shri. S. Deshmukh has reviewed your recent scan for Early Blight. A phone consultation and digital prescription have been provided.",
    actionRequired: "Check the scan reports section to review officer notes and treatment recommendations.",
    createdAt: "2026-08-25T14:45:00Z",
    isRead: true,
    source: "Office of Taluka Agriculture Officer, Baramati"
  }
];
