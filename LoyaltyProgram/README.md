# Canton Loyalty - Community Token Loyalty/Rewards App

A decentralized loyalty rewards platform built on Canton Network where businesses can issue tokens to customers and customers can manage all their loyalty programs in one place.

## 🎯 Features

### For Businesses
- Create custom loyalty programs with branded tokens
- Issue tokens to customers via QR codes
- Set up reward catalogs (e.g., "Free Coffee = 10 tokens")
- Real-time dashboard with analytics
- Multi-location support

### For Customers
- One wallet for all loyalty programs
- Scan QR to earn tokens at checkout
- Browse and redeem rewards
- Transfer/gift tokens to friends
- Track transaction history

## 🏗️ Project Structure

```
CAntonNetwork/
├── daml/                      # DAML Smart Contracts
│   ├── BusinessProfile.daml
│   ├── LoyaltyToken.daml
│   ├── Reward.daml
│   └── tests/
├── business-dashboard/        # Next.js Business App
│   ├── src/
│   ├── components/
│   └── lib/
├── customer-app/             # React PWA Customer App
│   ├── src/
│   ├── components/
│   └── public/
├── database/                 # Database Schema
│   └── schema.sql
└── docs/                     # Documentation
```

## 📋 Prerequisites

- **DAML SDK** 2.9.0 or later
- **Node.js** 18+ and npm
- **Docker** (for local Canton testing)
- **PostgreSQL** or **Supabase** account
- **Canton Network** account (get from https://canton.network/)

## 🚀 Quick Start

### 1. Install DAML SDK

```bash
# macOS/Linux
curl -sSL https://get.daml.com/ | sh

# Add to PATH
export PATH="$HOME/.daml/bin:$PATH"

# Verify installation
daml version
```

### 2. Set Up DAML Contracts (Week 1)

```bash
cd daml
daml build
daml start  # Starts local Canton ledger
```

Open DAML Studio in VS Code:
```bash
code .
```

Run tests:
```bash
daml test
```

### 3. Set Up Business Dashboard (Week 2)

```bash
cd business-dashboard
npm install

# Create .env.local file
cp .env.example .env.local

# Add your keys:
# NEXT_PUBLIC_CANTON_LEDGER_URL=http://localhost:6865
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
# CLERK_SECRET_KEY=your_secret
# DATABASE_URL=your_postgres_url

# Run development server
npm run dev
```

Open http://localhost:3000

### 4. Set Up Customer App (Week 3)

```bash
cd customer-app
npm install

# Create .env
cp .env.example .env

# Add your keys
# REACT_APP_CANTON_LEDGER_URL=http://localhost:6865
# REACT_APP_SUPABASE_URL=your_url
# REACT_APP_SUPABASE_ANON_KEY=your_key

# Run development server
npm start
```

Open http://localhost:3001

### 5. Set Up Database

```bash
# If using PostgreSQL locally
psql -U postgres -d canton_loyalty < database/schema.sql

# Or import to Supabase via dashboard
```

## 📅 Development Roadmap

### ✅ Week 1: Smart Contracts
- [x] Set up DAML development environment
- [x] Write BusinessProfile, LoyaltyToken, Reward contracts
- [x] Write test cases for all flows
- [x] Deploy to Canton LocalNet for testing

### Week 2: Business Dashboard
- [ ] Create Next.js project
- [ ] Build signup/login (Clerk auth)
- [ ] Integrate Canton Wallet SDK
- [ ] Business dashboard (issue tokens, view stats)
- [ ] QR code generator for checkout

### Week 3: Customer App
- [ ] PWA or React Native setup
- [ ] Wallet UI (show all tokens)
- [ ] QR scanner (earn tokens)
- [ ] Rewards browser (redeem)
- [ ] Canton integration

### Week 4: Testing & Launch
- [ ] Beta test with 3 local businesses
- [ ] Fix bugs, polish UX
- [ ] Deploy to Canton testnet
- [ ] Launch marketing campaign

## 💰 Monetization

### SaaS Pricing
- **Free**: 100 tokens/month, 1 location
- **Starter ($29/mo)**: Unlimited tokens, 3 locations
- **Pro ($99/mo)**: Multi-location, analytics, custom branding
- **Enterprise ($299/mo)**: API access, white-label, dedicated support

### Canton Coin Rewards
Earn CC based on user activity and transaction volume

## 🔧 Tech Stack

- **Smart Contracts**: DAML on Canton Network
- **Business Dashboard**: Next.js 14, TypeScript, Tailwind CSS, Shadcn UI
- **Customer App**: React PWA, TypeScript, Vite
- **Auth**: Clerk (business), Supabase Auth (customers)
- **Database**: PostgreSQL / Supabase
- **Canton Integration**: Canton Wallet SDK, Canton Ledger API
- **Deployment**: Vercel (frontend), Railway (if needed)

## 📖 Documentation

- [DAML Contracts Documentation](./docs/daml-contracts.md)
- [API Reference](./docs/api-reference.md)
- [Deployment Guide](./docs/deployment.md)
- [Business User Guide](./docs/business-guide.md)
- [Customer User Guide](./docs/customer-guide.md)

## 🧪 Testing

```bash
# Test DAML contracts
cd daml && daml test

# Test business dashboard
cd business-dashboard && npm test

# Test customer app
cd customer-app && npm test

# E2E tests
npm run test:e2e
```

## 🚢 Deployment

### Deploy to Canton Network

```bash
# Build DAML contracts
cd daml
daml build -o canton-loyalty.dar

# Deploy to Canton testnet
daml ledger upload-dar canton-loyalty.dar --host testnet.canton.network --port 6865
```

### Deploy Frontend

```bash
# Business dashboard
cd business-dashboard
vercel deploy

# Customer app
cd customer-app
vercel deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🔗 Links

- **Canton Network**: https://canton.network/
- **DAML Documentation**: https://docs.daml.com/
- **Canton Docs**: https://docs.sync.global/
- **Discord Community**: https://discord.gg/canton

## 📧 Support

- Email: support@cantonloyalty.app (placeholder)
- Discord: [Join our server](#)
- Issues: [GitHub Issues](https://github.com/yourusername/canton-loyalty/issues)

---

**Built with ❤️ for the Canton Network community**
