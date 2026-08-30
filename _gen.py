#!/usr/bin/env python3
import base64, os

# Read original file
with open('frontend/app/farmer/pages/SharedLoginPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
print(f'Original: {content.count(chr(10))} lines')

# 1. Add registerFull
content = content.replace('const { user, role, isAuthenticated, login, logout } = useAuth();', 'const { user, role, isAuthenticated, login, registerFull, logout } = useAuth();')

# 2. Add authMode and regStep
content = content.replace("const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');", "const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');\n  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');\n  const [regStep, setRegStep] = useState(1);")
print('Steps 1-2 done')

# 3. Add registration state
reg_state = """
const [adminKey, setAdminKey] = useState('admin2026');

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
  const [regCropDate, setRegCropDate] = useState("");
"""
content = content.replace("const [adminKey, setAdminKey] = useState('admin2026');", reg_state)
print('Step 3 done')

print(f'After state: {content.count(chr(10))} lines')
with open('frontend/app/farmer/pages/SharedLoginPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
