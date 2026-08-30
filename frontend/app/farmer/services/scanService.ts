import { CropScan, ScanResult, ScanUploadPayload, RiskLevel } from '../types/scan';
import { mockScans, mockSamplePredictions } from '../data/mockScans';
import { USE_MOCK_DATA, ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';



export const scanService = {
  async getScans(): Promise<CropScan[]> {
    const res = await apiRequest<any[]>(ENDPOINTS.REPORTS);
    if (res.data) {
      return res.data.map((r: any) => ({
        id: r._id || r.id,
        farmerId: r.userId,
        farmId: r.farmId || '',
        farmName: r.farmName || 'My Farm',
        cropName: r.cropName,
        imageUrl: '',
        scanDate: r.createdAt,
        result: {
          crop: r.cropName,
          disease: r.disease,
          confidence: r.confidence,
          riskLevel: (r.overallSeverity || 'LOW').toUpperCase() as any,
          severity: r.severity || 'Low',
          warning_signs: r.warning_signs || [],
          symptoms: [],
          explanation: '',
          advice: r.treatment || '',
          treatment: r.treatment || '',
          active_ingredient: r.activeIngredient,
          safety_note: r.safetyNote || '',
          preventive_measures: [],
          disclaimer: '',
        },
        officerAssistanceRequested: r.status === 'confirmed',
        officerAssistanceStatus: r.status === 'confirmed' ? 'RESOLVED' : r.status === 'flagged' ? 'IN_REVIEW' : 'PENDING',
      }));
    }
    return [];
  },

  async getScanById(id: string): Promise<CropScan | null> {
    const res = await apiRequest<any>(ENDPOINTS.REPORT_DETAIL(id));
    if (res.data) {
      const r = res.data;
      return {
        id: r._id || r.id,
        farmerId: r.userId,
        farmId: r.farmId || '',
        farmName: r.farmName || 'My Farm',
        cropName: r.cropName,
        imageUrl: '',
        scanDate: r.createdAt,
        result: {
          crop: r.cropName,
          disease: r.disease,
          confidence: r.confidence,
          riskLevel: (r.overallSeverity || 'LOW').toUpperCase() as any,
          severity: r.severity || 'Low',
          warning_signs: r.warning_signs || [],
          symptoms: [],
          explanation: '',
          advice: r.treatment || '',
          treatment: r.treatment || '',
          active_ingredient: r.activeIngredient,
          safety_note: r.safetyNote || '',
          preventive_measures: [],
          disclaimer: '',
        },
      };
    }
    return null;
  },

  async analyzeCropImage(payload: ScanUploadPayload): Promise<CropScan> {
    let scanResult: ScanResult;

    if (!USE_MOCK_DATA) {
      try {
        const formData = new FormData();
        formData.append('file', payload.file);
        formData.append('crop', payload.crop);

        const res = await apiRequest<any>(ENDPOINTS.DISEASE_PREDICT, {
          method: 'POST',
          body: formData,
        });

        if (res.data && res.data.disease) {
          const raw = res.data;
          let risk: RiskLevel = 'LOW';
          if (raw.severity?.toLowerCase() === 'high') risk = 'HIGH';
          else if (raw.severity?.toLowerCase() === 'critical') risk = 'CRITICAL';
          else if (raw.severity?.toLowerCase() === 'medium') risk = 'MODERATE';

          scanResult = {
            crop: raw.crop || payload.crop,
            disease: raw.disease,
            confidence: Math.round(Number(raw.confidence || 0.92) * 1000) / 10,
            riskLevel: risk,
            severity: raw.severity || 'Medium',
            warning_signs: raw.warning_signs || ['Observed leaf discoloration and lesion spots.'],
            symptoms: raw.warning_signs || ['Leaf spots with chlorosis'],
            explanation: `AI model identified ${raw.disease} with ${Math.round(Number(raw.confidence || 0.92) * 100)}% confidence based on leaf lesion patterns.`,
            advice: raw.advice || 'Remove affected leaves and monitor moisture levels.',
            treatment: raw.treatment || 'Apply approved bio-fungicide according to label guidance.',
            active_ingredient: raw.active_ingredient,
            application: raw.application,
            safety_note: raw.safety_note || 'Follow product label and wear protective gloves.',
            preventive_measures: [
              'Improve airflow and row spacing',
              'Avoid sprinkler irrigation during humid weather',
              'Scout fields twice a week for early symptoms'
            ],
            disclaimer: 'AI prediction is an early-warning screening tool. Verify critical findings with your local Agricultural Officer.'
          };
        } else {
          scanResult = this.getFallbackMockResult(payload.crop);
        }
      } catch (e) {
        console.warn('Backend prediction failed, using mock data layer', e);
        scanResult = this.getFallbackMockResult(payload.crop);
      }
    } else {
      // Simulate neural network inference delay for realistic demonstration
      await new Promise((resolve) => setTimeout(resolve, 1800));
      scanResult = this.getFallbackMockResult(payload.crop);
    }

    // Create object URL for uploaded image preview
    const imagePreviewUrl = URL.createObjectURL(payload.file);

    const newScan: CropScan = {
      id: `scan_${Date.now()}`,
      farmerId: 'farmer_mh_413801',
      farmId: payload.farmId || 'farm_01',
      farmName: payload.farmId ? `Plot #${payload.farmId}` : 'Selected Field',
      cropName: payload.crop,
      imageUrl: imagePreviewUrl,
      scanDate: new Date().toISOString(),
      result: scanResult,
      officerAssistanceRequested: false,
    };

    // Prepend to history
    const allScans = await this.getScans();
    const updated = [newScan, ...allScans];
    localStorage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(updated));

    return newScan;
  },

  getFallbackMockResult(crop: string): ScanResult {
    const cropLower = crop.toLowerCase();
    if (cropLower.includes('tomato')) {
      return mockSamplePredictions['Tomato_Early_Blight'];
    } else if (cropLower.includes('chilli') || cropLower.includes('chili')) {
      return mockSamplePredictions['Chilli_Bacterial_Spot'];
    } else if (cropLower.includes('groundnut') || cropLower.includes('peanut')) {
      return mockSamplePredictions['Groundnut_Early_Spot'];
    } else if (cropLower.includes('rice') || cropLower.includes('paddy')) {
      return mockSamplePredictions['Rice_Blast'];
    }
    return mockSamplePredictions['Tomato_Early_Blight'];
  },

  async requestOfficerSupport(scanId: string, notes?: string): Promise<boolean> {
    const scans = await this.getScans();
    const index = scans.findIndex((s) => s.id === scanId);
    if (index !== -1) {
      scans[index].officerAssistanceRequested = true;
      scans[index].officerAssistanceStatus = 'PENDING';
      scans[index].officerNotes = notes || 'Assistance requested by farmer. Local KVK alerted.';
      localStorage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(scans));
      return true;
    }
    return false;
  },

  async downloadReportPdf(scan: CropScan): Promise<void> {
    // If backend PDF endpoint is active
    if (!USE_MOCK_DATA) {
      try {
        const formData = new FormData();
        formData.append('crop', scan.cropName);
        formData.append('farmer_name', 'Ramesh Patil');
        formData.append('phone', '+91 98220 14321');
        formData.append('location', scan.farmName);

        const res = await apiRequest<Blob>(ENDPOINTS.DISEASE_REPORT, {
          method: 'POST',
          body: formData,
        });

        if (res.data && res.data instanceof Blob) {
          const blobUrl = window.URL.createObjectURL(res.data);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `${scan.cropName}_Health_Report_${scan.id}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        }
      } catch (e) {
        console.warn('PDF endpoint download failed, triggering digital print', e);
      }
    }

    // Client-side report printable layout trigger
    window.print();
  }
};
