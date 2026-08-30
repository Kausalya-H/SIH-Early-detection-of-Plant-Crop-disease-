import base64, sys

# Read the current file
with open('frontend/app/farmer/pages/SharedLoginPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original: {len(content)} chars, {content.count(chr(10))} lines")

# 1. Add registerFull to auth destructuring
content = content.replace(
    "const { user, role, isAuthenticated, login, logout } = useAuth();",
    "const { user, role, isAuthenticated, login, registerFull, logout } = useAuth();"
)

# 2. Add authMode and regStep state
content = content.replace(
    "const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');",
    "const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');\n  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');\n  const [regStep, setRegStep] = useState(1);"
)

# 3. Add registration state after adminKey
content = content.replace(
    "const [adminKey, setAdminKey] = useState('admin2026');",
    """const [adminKey, setAdminKey] = useState('admin2026');

  // Registration form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPlace, setRegPlace] = useState("");
  const [regLat, setRegLat] = useState(0);
  const [regLng, setRegLng] = useState(0);
  const [regLocationResolved, setRegLocationResolved] = useState(false);
  const [regFarmName, setRegFarmName] = useState("");
  const [regArea, setRegArea] = useState("");
  const [regCrops, setRegCrops] = useState<Array<{cropName: string; variety: string; acreage: string; sowingDate: string}>>([]);
  const [regCropName, setRegCropName] = useState("");
  const [regCropVariety, setRegCropVariety] = useState("");
  const [regCropAcreage, setRegCropAcreage] = useState("");
  const [regCropDate, setRegCropDate] = useState("");"""
)

# 4. Add handlers before handleFarmerSubmit
handlers = """  const geocodePlace = async (placeName: string) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        setRegLat(parseFloat(data[0].lat));
        setRegLng(parseFloat(data[0].lon));
        setRegLocationResolved(true);
        return true;
      }
    } catch (err) { console.error('Geocoding failed:', err); }
    setRegLocationResolved(false);
    return false;
  };

  const addCrop = () => {
    if (!regCropName.trim()) return;
    setRegCrops([...regCrops, { cropName: regCropName, variety: regCropVariety, acreage: regCropAcreage, sowingDate: regCropDate }]);
    setRegCropName(''); setRegCropVariety(''); setRegCropAcreage(''); setRegCropDate('');
  };

  const removeCrop = (idx: number) => { setRegCrops(regCrops.filter((_, i) => i !== idx)); };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setAuthError("");
    if (regPlace && !regLocationResolved) {
      const found = await geocodePlace(regPlace);
      if (!found) { setAuthError('Could not find location. Please try a different place name.'); setIsLoading(false); return; }
    }
    const params: any = { name: regName, email: regEmail, password: regPassword, phone: regPhone || undefined, language: language };
    if (regFarmName) { params.farm = { farmName: regFarmName, location: regPlace, latitude: regLat, longitude: regLng, area: parseFloat(regArea) || 0, areaUnit: 'acres' }; }
    if (regCrops.length > 0) { params.crops = regCrops.map(c => ({ cropName: c.cropName, variety: c.variety || undefined, acreage: parseFloat(c.acreage) || 0, sowingDate: c.sowingDate || undefined })); }
    const result = await registerFull(params);
    setIsLoading(false);
    if (result.success) { navigate('/farmer/dashboard'); } else { setAuthError(result.error || 'Registration failed'); }
  };

"""

content = content.replace(
    "const handleFarmerSubmit = async (e: React.FormEvent) => {",
    handlers + "const handleFarmerSubmit = async (e: React.FormEvent) => {"
)

# 5. Replace the farmer form with toggle + login/register modes
# Find the farmer form start
old_farmer_start = """            {selectedRole === 'FARMER' && (
              <form onSubmit={handleFarmerSubmit} className="space-y-4 animate-fade-in">
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <Sprout className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-950 font-bold">Kisan / Farmer Portal Access</strong>
                    <span>Instant AI leaf diagnosis, regional crop advisories, and local plot management.</span>
                  </div>
                </div>"""

new_farmer_start = """            {selectedRole === 'FARMER' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <Sprout className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-950 font-bold">Kisan / Farmer Portal Access</strong>
                    <span>Instant AI leaf diagnosis, regional crop advisories, and local plot management.</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
                  <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-emerald-700 text-white shadow' : 'text-slate-600 hover:bg-white'}`}>Login</button>
                  <button type="button" onClick={() => { setAuthMode('register'); setRegStep(1); setAuthError(''); }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'register' ? 'bg-emerald-700 text-white shadow' : 'text-slate-600 hover:bg-white'}`}>New Registration</button>
                </div>

                {authMode === 'login' && (
                <form onSubmit={handleFarmerSubmit} className="space-y-4">"""

content = content.replace(old_farmer_start, new_farmer_start)

# 6. Close login form and add registration form after Quick Login button
# Find the Quick Login button end
idx = content.find('Quick Login (test@farm.com)')
form_end = content.find('</form>', idx) + 7

# Read the registration JSX from the b64 file
jsx_b64 = open('_reg_form.b64', 'r').read().strip()
jsx = base64.b64decode(jsx_b64).decode('utf-8')

# Insert after </form> and before )}
content = content[:form_end] + '\n                )}\n\n' + jsx + '\n              </div>' + content[form_end+len(')\n\n            '):]

with open('frontend/app/farmer/pages/SharedLoginPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Updated: {len(content)} chars, {content.count(chr(10))} lines")
