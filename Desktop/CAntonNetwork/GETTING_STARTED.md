# Canton Loyalty - Getting Started Guide

## 🚀 Quick Setup (10 Minutes)

### Step 1: Install Prerequisites

```bash
# Install DAML SDK
curl -sSL https://get.daml.com/ | sh
export PATH="$HOME/.daml/bin:$PATH"

# Verify installation
daml version  # Should show 2.9.0 or later
node -v       # Should show 18+ 
npm -v        # Should show 9+
```

### Step 2: Initialize Project

```bash
cd /Users/kthacker/Desktop/CAntonNetwork

# Install root dependencies
npm run install:all
```

### Step 3: Start DAML Contracts (Terminal 1)

```bash
# Build and start local Canton ledger
npm run dev:daml

# Or manually:
cd daml
daml build
daml start
```

This will:
- Compile DAML contracts
- Start local Canton ledger on `localhost:6865`
- Deploy contracts automatically
- Run setup script with test data

### Step 4: Start Business Dashboard (Terminal 2)

```bash
# Copy environment variables
cd business-dashboard
cp .env.example .env.local

# Edit .env.local and add your Clerk keys:
# Get free keys from https://clerk.com
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 5: Start Customer App (Terminal 3)

```bash
# Copy environment variables
cd customer-app
cp .env.example .env

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📱 Testing the App

### Test Business Dashboard

1. Go to http://localhost:3000
2. Sign up with Clerk (use test email)
3. Complete onboarding form:
   - Business Name: "Joe's Coffee"
   - Category: Coffee Shop
   - Create loyalty program
4. Go to Dashboard → Issue Tokens tab
5. Enter customer phone: `+1-555-0123`
6. Issue 10 tokens

### Test Customer App

1. Go to http://localhost:5173
2. Sign in with:
   - Name: Alice
   - Phone: +1-555-0123
3. View wallet → See your 10 tokens!
4. Go to Rewards → Redeem something
5. Go to Scan → Test QR scanner

---

## 🔧 Common Issues & Fixes

### DAML won't start
```bash
# Kill existing processes
pkill -f daml
rm -rf .daml/  # In daml folder
daml start
```

### Business dashboard errors
```bash
cd business-dashboard
rm -rf .next node_modules
npm install
npm run dev
```

### Customer app won't build
```bash
cd customer-app
rm -rf node_modules dist
npm install
npm run dev
```

### Port conflicts
```bash
# Change ports in package.json or:
# Business: PORT=3001 npm run dev
# Customer: vite --port 5174
```

---

## 📦 Project Structure Overview

```
CAntonNetwork/
├── daml/                          # Smart Contracts
│   ├── BusinessProfile.daml       # Business registration
│   ├── LoyaltyToken.daml         # Token logic
│   ├── Reward.daml               # Rewards catalog
│   ├── Setup.daml                # Test data
│   └── Tests.daml                # Unit tests
│
├── business-dashboard/            # Next.js App
│   ├── src/app/                  # Pages
│   │   ├── page.tsx              # Sign in
│   │   ├── onboarding/           # Setup wizard
│   │   └── dashboard/            # Main dashboard
│   └── src/components/           # UI components
│
├── customer-app/                  # React PWA
│   ├── src/pages/                # App pages
│   │   ├── WalletPage.tsx        # Token balances
│   │   ├── ScanPage.tsx          # QR scanner
│   │   ├── RewardsPage.tsx       # Browse rewards
│   │   └── ProfilePage.tsx       # User profile
│   └── src/components/           # UI components
│
└── database/                      # PostgreSQL Schema
    └── schema.sql                # Database structure
```

---

## 🧪 Running Tests

### Test DAML Contracts
```bash
cd daml
daml test  # Runs all unit tests
```

### Test Business Dashboard
```bash
cd business-dashboard
npm test
```

### Test Customer App
```bash
cd customer-app
npm test
```

---

## 🌐 Deploy to Production

### 1. Deploy DAML to Canton Network

```bash
cd daml
daml build -o canton-loyalty.dar

# Get Canton Network credentials from https://canton.network
daml ledger upload-dar canton-loyalty.dar \
  --host testnet.canton.network \
  --port 6865 \
  --access-token-file ~/.canton/token
```

### 2. Deploy Business Dashboard to Vercel

```bash
cd business-dashboard

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_CANTON_LEDGER_URL
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - DATABASE_URL
```

### 3. Deploy Customer App to Vercel

```bash
cd customer-app
vercel deploy --prod

# Set environment variables:
# - VITE_CANTON_LEDGER_URL
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

### 4. Set Up Database (Supabase)

1. Go to https://supabase.com
2. Create new project
3. Go to SQL Editor
4. Run contents of `database/schema.sql`
5. Copy connection string to env vars

---

## 📖 Next Steps

### Week 2: Integrate Canton Network
- [ ] Replace mock data with real Canton Ledger API calls
- [ ] Implement token issuance transactions
- [ ] Add real-time balance updates
- [ ] Test on Canton LocalNet

### Week 3: Add Features
- [ ] QR code scanning with real camera
- [ ] Push notifications for token earnings
- [ ] Transaction history
- [ ] Analytics dashboard

### Week 4: Launch Prep
- [ ] Find 3 local businesses for beta testing
- [ ] Create marketing materials
- [ ] Set up customer support
- [ ] Deploy to Canton testnet

---

## 🆘 Need Help?

- **DAML Issues**: https://docs.daml.com
- **Canton Network**: https://docs.sync.global
- **Discord**: https://discord.gg/canton
- **GitHub Issues**: [Create an issue]

---

## 💡 Tips

1. **Start simple**: Get one business + one customer working first
2. **Test locally**: Use `daml start` before deploying to Canton
3. **Mock data**: Frontend works without Canton integration for UI testing
4. **Incremental**: Deploy contracts → Business dashboard → Customer app
5. **Ask for help**: Canton community is very helpful on Discord

---

**You're ready to build!** 🎉

Start with `npm run dev:daml` and follow the steps above.
