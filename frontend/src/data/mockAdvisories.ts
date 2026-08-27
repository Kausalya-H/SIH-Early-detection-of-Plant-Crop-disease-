import { AdvisoryItem, DiseaseKnowledgeItem } from '../types/advisory';

export const mockAdvisories: AdvisoryItem[] = [
  {
    id: "adv_001",
    category: "DISEASE_PREVENTION",
    title: "Monsoon Management for Solanaceous Crops (Tomato & Chilli)",
    crop: "Tomato, Chilli",
    season: "Kharif / Monsoon",
    shortSummary: "Essential practices to prevent damping-off, early blight, and bacterial spots during persistent rainy spells.",
    keyPractices: [
      "Ensure raised beds of 15-20cm height to avoid waterlogging around stem collars",
      "Prune bottom 20cm foliage once plants reach 45 days to eliminate soil contact",
      "Sterilize pruning tools with 70% alcohol or bleach solution between plants",
      "Avoid handling or harvesting plants when leaves are wet with dew or rain"
    ],
    preventiveTips: [
      "Spray Trichoderma viride @ 5g/L on soil bed every 20 days",
      "Use silver-black reflective plastic mulch to prevent weed growth and fungal splash",
      "Install pheromone traps for fruit borer monitoring (4-5 traps/acre)"
    ],
    warningNote: "Do not apply systemic chemical sprays during active rain. Always wait for leaf surfaces to dry.",
    publishedDate: "2026-08-20"
  },
  {
    id: "adv_002",
    category: "PEST_MANAGEMENT",
    title: "Integrated Pest Management (IPM) for Sucking Pests in Chilli",
    crop: "Chilli",
    season: "All Seasons",
    shortSummary: "Eco-friendly methods to manage thrips, aphids, and mites without causing chemical resistance.",
    keyPractices: [
      "Install yellow sticky traps for whiteflies/aphids and blue sticky traps for thrips (15 traps/acre)",
      "Grow 2 border rows of maize or sorghum around chilli plots as natural insect barriers",
      "Conserve natural predators like ladybird beetles and chrysoperla",
      "Apply organic bio-pesticides (Verticillium lecanii @ 5g/L) during humid evenings"
    ],
    preventiveTips: [
      "Avoid excessive synthetic pyrethroid sprays which trigger mite resurgence",
      "Spray 5% Neem Seed Kernel Extract (NSKE) at early nursery and transplanting stages"
    ],
    publishedDate: "2026-08-15"
  },
  {
    id: "adv_003",
    category: "CROP_HEALTH",
    title: "Balanced Fertigation & Nutrient Deficiencies in Tomato",
    crop: "Tomato",
    season: "Vegetative to Fruiting",
    shortSummary: "Correcting Calcium, Magnesium, and Potassium deficiencies to prevent Blossom End Rot and leaf chlorosis.",
    keyPractices: [
      "Maintain consistent soil moisture through drip irrigation; fluctuating moisture causes Blossom End Rot",
      "Apply water-soluble Calcium Nitrate @ 2.5 kg/acre/week during active fruit setting",
      "Foliar spray of micronutrient mixture (Grade-2) @ 2g/L at 30 and 45 days after transplanting",
      "Check soil pH; optimum availability of nutrients occurs between pH 6.2 and 6.8"
    ],
    preventiveTips: [
      "Incorporate well-decomposed FYM (Farm Yard Manure) @ 8-10 tonnes/acre before planting",
      "Do not apply excessive ammonium-nitrogen during fruit sizing"
    ],
    publishedDate: "2026-08-10"
  },
  {
    id: "adv_004",
    category: "IRRIGATION",
    title: "Water Management & Drainage Strategy for Paddy (Rice)",
    crop: "Rice",
    season: "Kharif",
    shortSummary: "Alternate Wetting and Drying (AWD) technique for water saving and root blast prevention.",
    keyPractices: [
      "Maintain shallow standing water (2-3cm) during initial 10 days after transplanting",
      "Adopt Alternate Wetting and Drying (AWD) after tillering stage to strengthen root system",
      "Drain excess flood water during heavy rain spells to avoid stem rot and sheath blight",
      "Stop irrigation 10-12 days before anticipated harvest date"
    ],
    preventiveTips: [
      "Install field water tube (AWD pipe) to observe root-zone water depth accurately"
    ],
    publishedDate: "2026-08-05"
  }
];

export const mockDiseaseLibrary: DiseaseKnowledgeItem[] = [
  {
    id: "dis_01",
    crop: "Tomato",
    diseaseName: "Early Blight",
    scientificName: "Alternaria solani",
    severityLevel: "Medium",
    commonSymptoms: [
      "Small brown-black spots on older lower leaves",
      "Concentric rings ('target board' pattern) inside spots",
      "Yellow halos surrounding leaf lesions",
      "Premature leaf drop exposing fruit to sunscald"
    ],
    favorableConditions: "Warm temperatures (24-30°C) with prolonged leaf wetness, heavy dews, and high relative humidity (>80%).",
    organicRemedies: [
      "Foliar spray of Trichoderma harzianum @ 5g/L",
      "Application of 5% Neem Seed Kernel Extract (NSKE)",
      "Copper hydroxide bio-formulations"
    ],
    approvedTreatments: "Remove infected plant material and improve air circulation. Use an approved fungicide only when necessary and strictly according to the product label.",
    activeIngredients: "Chlorothalonil (75% WP) or Mancozeb (75% WP)",
    applicationGuidance: "Follow locally approved product label for crop, dose, spray interval, and pre-harvest interval (PHI).",
    safetyInstructions: "Use only products approved for tomato and early blight. Wear protective gear and do not spray into wind."
  },
  {
    id: "dis_02",
    crop: "Tomato",
    diseaseName: "Late Blight",
    scientificName: "Phytophthora infestans",
    severityLevel: "Critical",
    commonSymptoms: [
      "Large irregular water-soaked spots on leaves and stems",
      "Delicate white fungal-like mold on leaf undersides in humid mornings",
      "Dark brown firm decay on green and ripening tomatoes",
      "Rapid plant collapse within days"
    ],
    favorableConditions: "Cool nights (10-15°C) and moderate days (15-22°C) with continuous wet foliage, overcast skies, and fog.",
    organicRemedies: [
      "Preventive Bordeaux mixture (1%) spray before monsoon onset",
      "Bio-agents: Bacillus subtilis foliar spray"
    ],
    approvedTreatments: "Remove severely affected material immediately and use an appropriately approved fungicide when required.",
    activeIngredients: "Mancozeb or Metalaxyl + Mancozeb combination",
    applicationGuidance: "Follow locally approved product label for dose, spray interval, and pre-harvest interval.",
    safetyInstructions: "Use only products approved for tomato and late blight. Follow the label and wear appropriate protective equipment."
  },
  {
    id: "dis_03",
    crop: "Chilli",
    diseaseName: "Bacterial Leaf Spot",
    scientificName: "Xanthomonas campestris pv. vesicatoria",
    severityLevel: "Medium",
    commonSymptoms: [
      "Small water-soaked circular to irregular lesions on leaves",
      "Spots turn dark brown with yellow halos",
      "Severe defoliation under warm wet weather",
      "Blister-like rough scabs on green chillies"
    ],
    favorableConditions: "High temperatures (25-30°C) with frequent rains and splashing overhead irrigation.",
    organicRemedies: [
      "Hot water seed treatment at 50°C for 25 minutes",
      "Spraying Pseudomonas fluorescens @ 5g/L"
    ],
    approvedTreatments: "Remove affected plant material and reduce leaf wetness. Use only locally approved disease-management products when necessary.",
    activeIngredients: "Copper Oxychloride (50% WP) or Streptocycline combination",
    applicationGuidance: "Follow the locally approved product label for chilli, including dose and application interval.",
    safetyInstructions: "Use only products approved for chilli and diagnosed disease. Follow product label."
  },
  {
    id: "dis_04",
    crop: "Groundnut",
    diseaseName: "Early Leaf Spot (Tikka)",
    scientificName: "Cercospora arachidicola",
    severityLevel: "Medium",
    commonSymptoms: [
      "Small sub-circular brown spots on upper leaf surfaces",
      "Distinct yellow halos surrounding brown lesions",
      "Defoliation starting from lower canopy upward"
    ],
    favorableConditions: "High soil moisture and temperatures between 25-30°C with prolonged humidity.",
    organicRemedies: [
      "Seed treatment with Trichoderma viride @ 4g/kg seed",
      "Neem oil spray (1500 ppm)"
    ],
    approvedTreatments: "Use integrated disease management and an approved fungicide when necessary.",
    activeIngredients: "Chlorothalonil or Mancozeb",
    applicationGuidance: "Follow the locally approved product label for groundnut, including dose and spray interval.",
    safetyInstructions: "Use only products approved for groundnut and the diagnosed disease."
  },
  {
    id: "dis_05",
    crop: "Rice",
    diseaseName: "Rice Blast",
    scientificName: "Magnaporthe oryzae",
    severityLevel: "High",
    commonSymptoms: [
      "Spindle-shaped elliptical lesions with gray-white centers",
      "Brown to reddish borders on leaf lesions",
      "Blackening of stem nodes and panicle neck rot"
    ],
    favorableConditions: "Excessive nitrogen fertilization, relative humidity >90%, and cool night temperatures (18-20°C).",
    organicRemedies: [
      "Seed treatment with Pseudomonas fluorescens @ 10g/kg",
      "Silica-rich soil amendments"
    ],
    approvedTreatments: "Use integrated disease management and an approved blast-management fungicide when necessary.",
    activeIngredients: "Tricyclazole 75% WP",
    applicationGuidance: "Follow the locally approved product label for rice, including dose, application timing, and pre-harvest interval.",
    safetyInstructions: "Use only products approved for rice blast in your region and follow the product label."
  }
];
