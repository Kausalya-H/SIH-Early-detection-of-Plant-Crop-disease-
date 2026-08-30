import base64

# Read current file
with open('frontend/app/farmer/services/scanService.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the getScans method to use real API
old_getScans = """  async getScans(): Promise<CropScan[]> {
    const saved = localStorage.getItem(LOCAL_STORAGE_SCANS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached scans', e);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(mockScans));
    return mockScans;
  },"""

new_getScans = """  async getScans(): Promise<CropScan[]> {
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
  },"""

content = content.replace(old_getScans, new_getScans)

# Replace getScanById
old_getById = """  async getScanById(id: string): Promise<CropScan | null> {
    const scans = await this.getScans();
    return scans.find((s) => s.id === id) || null;
  },"""

new_getById = """  async getScanById(id: string): Promise<CropScan | null> {
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
  },"""

content = content.replace(old_getById, new_getById)

# Remove localStorage usage
content = content.replace("const LOCAL_STORAGE_SCANS_KEY = 'farmer_portal_scans';", "")

with open('frontend/app/farmer/services/scanService.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"scanService updated: {len(content)} chars")
