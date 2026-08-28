import { CropScan, ScanResult } from '../types/scan';

export const mockSamplePredictions: Record<string, ScanResult> = {
  "Tomato_Early_Blight": {
    crop: "Tomato",
    disease: "Early Blight (Alternaria solani)",
    confidence: 93.4,
    riskLevel: "HIGH",
    severity: "High",
    warning_signs: [
      "Small dark brown to black spots appear on older lower leaves",
      "Concentric ring 'target board' pattern clearly visible inside spots",
      "Surrounding leaf tissue turns chlorotic yellow and drops prematurely",
      "Stems show dark, slightly sunken circular lesions near soil level"
    ],
    symptoms: [
      "Lower canopy leaf yellowing",
      "Target-like concentric ring spots (3-6mm)",
      "Partial leaf defoliation on lower branches"
    ],
    explanation: "AI model detected high probability of Alternaria solani fungal infection. High humidity (>80%) and moderate temperatures (24-29°C) favor rapid spore germination across lower canopy foliage.",
    advice: "Remove severely affected lower leaves immediately and dispose away from the field. Avoid overhead sprinkler watering to reduce leaf wetness duration.",
    treatment: "Remove infected plant material and improve air circulation between rows. Use an approved fungicide only when necessary and strictly according to the product label.",
    active_ingredient: "Chlorothalonil (75% WP) or Mancozeb (75% WP)",
    application: "Follow the locally approved product label for crop, dose, spray interval, and pre-harvest interval (PHI).",
    safety_note: "Use only products approved for tomato and early blight. Wear protective gloves and face mask during spray application. Do not spray during peak daytime heat.",
    preventive_measures: [
      "Maintain 60cm plant spacing for adequate air circulation",
      "Apply clean straw or plastic mulch to prevent soil splashing",
      "Practice 3-year crop rotation with non-solanaceous crops",
      "Ensure balanced potassium and nitrogen fertilization"
    ],
    disclaimer: "AI prediction is an early-warning screening tool based on visible leaf patterns. Consult your local Taluka Agricultural Officer or KVK specialist if symptoms spread."
  },
  "Tomato_Late_Blight": {
    crop: "Tomato",
    disease: "Late Blight (Phytophthora infestans)",
    confidence: 96.2,
    riskLevel: "CRITICAL",
    severity: "Critical",
    warning_signs: [
      "Dark water-soaked, irregular lesions on leaf margins and tips",
      "White fungal growth/mold visible on lower leaf surfaces in humid morning hours",
      "Rapid browning and wilting of whole foliage canopy within 48-72 hours",
      "Brown firm dry rot patches on developing green tomato fruits"
    ],
    symptoms: [
      "Rapid water-soaked leaf blighting",
      "White mildew underleaf sporulation",
      "Stem blackened girdling lesions"
    ],
    explanation: "Critical fungal-like oomycete pathogen detected. Extremely contagious under cool, humid, wet weather conditions. Can destroy untreated field plots within 4-7 days.",
    advice: "Immediately isolate affected plot area. Stop all sprinkler irrigation and do not work in wet fields to prevent spore transfer on tools.",
    treatment: "Remove severely blighted foliage immediately. Apply an appropriately approved systemic and contact fungicide combination as permitted by local agricultural authority.",
    active_ingredient: "Metalaxyl 8% + Mancozeb 64% WP or Cymoxanil 8% + Mancozeb 64% WP",
    application: "Follow label instructions strictly. Ensure thorough coverage of both upper and lower leaf surfaces with a fine mist sprayer.",
    safety_note: "Use only certified CIBRC-registered products for tomato late blight. Strictly adhere to the recommended pre-harvest interval (PHI) before picking fruit.",
    preventive_measures: [
      "Use certified resistant tomato hybrid seedlings",
      "Avoid planting near old potato or solanaceous crop residues",
      "Ensure proper furrow or drip drainage so no stagnant water stands",
      "Regular morning field scouting during overcast cloudy periods"
    ],
    disclaimer: "CRITICAL RISK: Late Blight requires urgent intervention. Contact your nearest Agricultural Officer or KVK immediately for emergency plot inspection."
  },
  "Chilli_Bacterial_Spot": {
    crop: "Chilli",
    disease: "Bacterial Leaf Spot (Xanthomonas campestris)",
    confidence: 88.7,
    riskLevel: "MODERATE",
    severity: "Medium",
    warning_signs: [
      "Small circular water-soaked spots (1-2mm) on underside of leaves",
      "Spots enlarge and turn dark brown with yellowish halo",
      "Severely spotted leaves turn yellow and drop prematurely, causing sunscald on fruits"
    ],
    symptoms: [
      "Dark angular spots with yellow halo",
      "Premature leaf drop",
      "Corky scab lesions on green chillies"
    ],
    explanation: "Bacterial pathogen favored by rainy, warm conditions (25-30°C). Water droplets and wind-driven rain spread the bacteria across foliage.",
    advice: "Avoid overhead splashing. Prune severely diseased lower leaves and spray bio-fungicide or copper bactericide during early morning hours.",
    treatment: "Remove affected plant material and reduce leaf wetness. Use only locally approved disease-management products when necessary.",
    active_ingredient: "Copper Oxychloride 50% WP or Streptocycline + Copper Hydroxide",
    application: "Follow the locally approved product label for chilli, including dose and application interval (usually 10-12 days).",
    safety_note: "Use only products approved for chilli and bacterial leaf spot. Follow the product label and avoid tank-mixing with incompatible chemicals.",
    preventive_measures: [
      "Treat seeds with hot water (50°C for 25 min) or certified bio-inoculants",
      "Disinfect pruning scissors and stakes between rows",
      "Adopt drip fertigation rather than sprinkler flooding",
      "Spray neem seed kernel extract (NSKE 5%) as preventive measure"
    ],
    disclaimer: "AI prediction is for decision support. Seek local agricultural extension advice for chemical treatment verification."
  },
  "Groundnut_Early_Spot": {
    crop: "Groundnut",
    disease: "Early Leaf Spot (Tikka Disease - Cercospora arachidicola)",
    confidence: 91.0,
    riskLevel: "MODERATE",
    severity: "Medium",
    warning_signs: [
      "Sub-circular reddish-brown to dark spots on upper leaf surfaces",
      "Prominent bright yellow halo around dark lesions",
      "Infection initiates 30-35 days after sowing on lower canopy leaves"
    ],
    symptoms: [
      "Reddish-brown spots with prominent yellow halo",
      "Lower canopy leaf shedding",
      "Reduced pod filling if untreated"
    ],
    explanation: "Common fungal disease in groundnut belts. High soil moisture combined with warm temperatures stimulates Cercospora spore dispersal.",
    advice: "Monitor lower leaves regularly and remove heavily affected plant material. Ensure adequate potassium nutrition to enhance natural plant resistance.",
    treatment: "Use integrated disease management and an approved fungicide when necessary.",
    active_ingredient: "Carbendazim 50% WP or Chlorothalonil 75% WP",
    application: "Follow the locally approved product label for groundnut, including dose and spray interval.",
    safety_note: "Use only products approved for groundnut and diagnosed disease. Observe all safety guidelines on product packaging.",
    preventive_measures: [
      "Deep summer ploughing to bury old crop stubble",
      "Seed treatment with Trichoderma viride @ 4g/kg seed before sowing",
      "Intercropping with pearl millet or pigeon pea",
      "Avoid waterlogging in heavy soil pockets"
    ],
    disclaimer: "AI screening recommendation. Verify with local agricultural university or district KVK."
  },
  "Rice_Blast": {
    crop: "Rice",
    disease: "Rice Blast (Magnaporthe oryzae)",
    confidence: 94.8,
    riskLevel: "HIGH",
    severity: "High",
    warning_signs: [
      "Spindle-shaped elliptical lesions with pointed ends on leaves",
      "Lesions feature gray or whitish centers with brown to reddish margins",
      "Lesions enlarge and coalesce, causing entire leaf blades to dry and whiten (leaf blast)",
      "Node infection turns black and breaks easily under wind stress"
    ],
    symptoms: [
      "Spindle-shaped gray-centered leaf lesions",
      "Severe leaf drying",
      "Neck/node discoloration"
    ],
    explanation: "Magnaporthe oryzae fungal infection detected. Excessive nitrogen fertilizer, high relative humidity (>90%), and dew formation on leaves accelerate blast progression.",
    advice: "Avoid excessive urea/nitrogen application. Maintain optimum field water level and do not let soil dry to cracking during active vegetative tillering.",
    treatment: "Use integrated disease management and an approved blast-management fungicide when necessary.",
    active_ingredient: "Tricyclazole 75% WP or Isoprothiolane 40% EC",
    application: "Follow the locally approved product label for rice, including dose, application timing, and pre-harvest interval.",
    safety_note: "Use only products approved for rice blast in your region and follow the product label. Do not discharge spray runoff into fish ponds.",
    preventive_measures: [
      "Split nitrogen fertilizer into 3-4 split doses rather than heavy single dose",
      "Apply potassium and silica fertilizers to strengthen leaf epidermal cell walls",
      "Seed treatment with Pseudomonas fluorescens @ 10g/kg",
      "Use certified disease-free certified seeds"
    ],
    disclaimer: "AI early-warning prediction. Consult your regional Agricultural Extension Officer for localized advisory."
  },
  "Healthy_Crop": {
    crop: "Tomato",
    disease: "No Disease Detected (Healthy Crop)",
    confidence: 98.1,
    riskLevel: "LOW",
    severity: "Low",
    warning_signs: [
      "Foliage shows vibrant deep green coloration",
      "No visible spots, water-soaking, curling, or fungal sporulation",
      "Normal vegetative vigor and healthy node elongation"
    ],
    symptoms: [
      "Clean leaf blades",
      "Vigorous shoots",
      "Zero lesion activity"
    ],
    explanation: "The scanned crop sample shows healthy tissue morphology with no detectable fungal, bacterial, or viral disease lesions.",
    advice: "Continue routine preventive agronomic care, balanced fertigation, and regular weekly field scouting.",
    treatment: "No chemical fungicide treatment required at this time. Maintain soil health and beneficial micro-organisms.",
    safety_note: "Avoid unnecessary preventative pesticide spraying to preserve beneficial predatory insects and pollinators.",
    preventive_measures: [
      "Maintain consistent drip irrigation schedule",
      "Apply organic neem oil (1500 ppm) once every 15 days as natural deterrent",
      "Monitor yellow sticky traps for early whitefly or thrips presence",
      "Keep field borders free from weed hosts"
    ],
    disclaimer: "AI prediction indicates clean leaf sample. Continue regular weekly field monitoring."
  }
};

export const mockScans: CropScan[] = [
  {
    id: "scan_2026_001",
    farmerId: "farmer_mh_413801",
    farmId: "farm_01",
    farmName: "Baramati North Plot (Tomato)",
    cropName: "Tomato",
    imageUrl: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80",
    scanDate: "2026-08-25T10:30:00Z",
    result: mockSamplePredictions["Tomato_Early_Blight"],
    officerAssistanceRequested: true,
    officerAssistanceStatus: "IN_REVIEW",
    officerNotes: "Taluka officer Shri. Deshmukh assigned. Virtual advisory shared."
  },
  {
    id: "scan_2026_002",
    farmerId: "farmer_mh_413801",
    farmId: "farm_03",
    farmName: "Junnar Hill Plot (Groundnut)",
    cropName: "Groundnut",
    imageUrl: "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?auto=format&fit=crop&w=800&q=80",
    scanDate: "2026-08-24T09:00:00Z",
    result: mockSamplePredictions["Groundnut_Early_Spot"],
    officerAssistanceRequested: false
  },
  {
    id: "scan_2026_003",
    farmerId: "farmer_mh_413801",
    farmId: "farm_02",
    farmName: "Karanje Riverbed Field (Chilli)",
    cropName: "Chilli",
    imageUrl: "https://images.unsplash.com/photo-1588644525273-f37b60d78512?auto=format&fit=crop&w=800&q=80",
    scanDate: "2026-08-20T14:15:00Z",
    result: mockSamplePredictions["Chilli_Bacterial_Spot"],
    officerAssistanceRequested: true,
    officerAssistanceStatus: "RESOLVED",
    officerNotes: "Advised copper oxychloride spray. Follow-up scan showed recovery."
  },
  {
    id: "scan_2026_004",
    farmerId: "farmer_mh_413801",
    farmId: "farm_04",
    farmName: "Shirur Road Farm (Rice / Paddy)",
    cropName: "Rice",
    imageUrl: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80",
    scanDate: "2026-08-18T16:45:00Z",
    result: mockSamplePredictions["Rice_Blast"],
    officerAssistanceRequested: false
  },
  {
    id: "scan_2026_005",
    farmerId: "farmer_mh_413801",
    farmId: "farm_01",
    farmName: "Baramati North Plot (Tomato)",
    cropName: "Tomato",
    imageUrl: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80",
    scanDate: "2026-08-10T11:20:00Z",
    result: mockSamplePredictions["Healthy_Crop"],
    officerAssistanceRequested: false
  }
];
