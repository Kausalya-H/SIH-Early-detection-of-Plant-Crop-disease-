import { DiagnosisRecord } from '../types/disease';

export const mockDiagnoses: DiagnosisRecord[] = [
  {
    id: 'diag_101',
    farmId: 'farm_01',
    farmName: 'Baramati North Plot',
    cropName: 'Tomato',
    cropVariety: 'Abhinav F1',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?w=600&auto=format&fit=crop&q=80',
    diseaseDetected: 'Early Blight (Alternaria solani)',
    scientificName: 'Alternaria solani',
    confidence: 94.8,
    riskLevel: 'MODERATE',
    symptoms: [
      'Concentric target-board rings on lower leaves',
      'Yellow chlorotic halos surrounding lesions',
      'Premature leaf senescence and defoliation on lower canopy',
    ],
    diagnosedAt: '2026-08-26 10:14 AM',
    treatment: {
      chemicalControl: [
        'Mancozeb 75% WP @ 2.5 g/liter of water',
        'Azoxystrobin 23% SC @ 1 ml/liter (if severe)',
      ],
      biologicalControl: [
        'Trichoderma viride foliar spray @ 5 g/liter',
        'Pseudomonas fluorescens 1% WP root zone drenching',
      ],
      culturalPractices: [
        'Prune lower affected leaves to improve air circulation',
        'Avoid overhead sprinkler irrigation; maintain drip timings',
        'Apply straw mulch around root zone to prevent soil splash',
      ],
      safetyPrecautions: [
        'Observe 7-day pre-harvest interval after chemical spray',
        'Wear protective mask and gloves during preparation',
      ],
    },
    status: 'REVIEWED',
    officerNotes: 'Mild outbreak in Baramati sector. Advised preventive copper spray before upcoming rains.',
  },
  {
    id: 'diag_102',
    farmId: 'farm_03',
    farmName: 'East Ridge Chilli Field',
    cropName: 'Chilli',
    cropVariety: 'G-4 (Bhagirathi)',
    imageUrl: 'https://images.unsplash.com/photo-1588644525127-06e22c954e7d?w=600&auto=format&fit=crop&q=80',
    diseaseDetected: 'Chilli Leaf Curl & Thrips Infestation',
    scientificName: 'Begomovirus / Scirtothrips dorsalis',
    confidence: 91.2,
    riskLevel: 'HIGH',
    symptoms: [
      'Upward boat-shaped curling of young terminal leaves',
      'Shortening of internodes and stunted bushy canopy',
      'Silvery discoloration on lower leaf epidermis caused by thrips',
    ],
    diagnosedAt: '2026-08-25 04:30 PM',
    treatment: {
      chemicalControl: [
        'Diafenthiuron 50% WP @ 1.2 g/liter',
        'Acetamiprid 20% SP @ 0.3 g/liter for vector suppression',
      ],
      biologicalControl: [
        'Neem Oil (Azadirachtin 10,000 ppm) @ 2 ml/liter',
        'Install yellow and blue sticky traps (15 traps/acre)',
      ],
      culturalPractices: [
        'Roguing and destruction of severely virused plants',
        'Erect 2 rows of maize as border crop barrier against vector winds',
      ],
      safetyPrecautions: [
        'Spray during early morning or late evening to protect pollinator bees',
      ],
    },
    status: 'ACTION_TAKEN',
    officerNotes: 'Trap installation confirmed. Vector count reduced by 40% in follow-up check.',
  },
  {
    id: 'diag_103',
    farmId: 'farm_02',
    farmName: 'Nira Riverbank Parcel',
    cropName: 'Soybean',
    cropVariety: 'JS-335',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    diseaseDetected: 'Healthy Crop (No Active Pathology)',
    confidence: 98.6,
    riskLevel: 'LOW',
    symptoms: [
      'Vibrant green foliage with balanced nodulation',
      'Uniform canopy development with zero necrotic spots',
    ],
    diagnosedAt: '2026-08-24 11:20 AM',
    treatment: {
      chemicalControl: [],
      biologicalControl: ['Rhizobium culture seed booster application recommended for future cycle'],
      culturalPractices: ['Maintain regular weeding and check moisture after weekly rainfall'],
      safetyPrecautions: ['Continue standard organic compost feeding'],
    },
    status: 'RESOLVED',
  },
  {
    id: 'diag_104',
    farmId: 'farm_04',
    farmName: 'South Cotton Block',
    cropName: 'Cotton',
    cropVariety: 'Bt Cotton (Bollgard II)',
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80',
    diseaseDetected: 'Bacterial Blight / Angular Leaf Spot',
    scientificName: 'Xanthomonas citri pv. malvacearum',
    confidence: 89.4,
    riskLevel: 'MODERATE',
    symptoms: [
      'Water-soaked angular spots bounded by leaf veins',
      'Brown to black crusty lesions on petioles',
    ],
    diagnosedAt: '2026-08-22 09:15 AM',
    treatment: {
      chemicalControl: [
        'Copper Oxychloride 50% WP @ 2.5 g + Streptocycline @ 0.1 g/liter',
      ],
      biologicalControl: [
        'Pseudomonas fluorescens spray @ 2.5 kg/ha',
      ],
      culturalPractices: [
        'Avoid intercultivation when canopy is wet to stop bacterial slime spread',
      ],
      safetyPrecautions: [
        'Do not mix bactericide with high phosphorus fertilizers',
      ],
    },
    status: 'REVIEWED',
  },
];
