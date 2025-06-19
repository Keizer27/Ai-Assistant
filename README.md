# AI Assistant with Secure Key Rotation

## Features
- 🚀 No-login instant access
- 🔄 4-key auto-rotation
- 🛡️ Secure proxy server
- 🎨 Modern dashboard with 10 AI tools

## Setup
1. Add keys: `cp server/keys.example.json server/keys.json`
2. Configure: `echo "EMERGENCY_TOKEN=$(openssl rand -hex 32)" > .env`
3. Install: `npm install`
4. Run: `npm start`

Access:
- Landing: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard.html`
