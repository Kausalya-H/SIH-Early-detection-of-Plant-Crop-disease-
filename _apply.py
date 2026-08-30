
import base64

# Read current file
with open("frontend/app/farmer/pages/SharedLoginPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Step 1: Add registerFull import
content = content.replace(
    "const { user, role, isAuthenticated, login, logout } = useAuth();",
    "const { user, role, isAuthenticated, login, registerFull, logout } = useAuth();"
)

# Step 2: Add authMode and regStep state
content = content.replace(
    "const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');",
    "const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [regStep, setRegStep] = useState(1);"
)

print("Step 1-2 done")
