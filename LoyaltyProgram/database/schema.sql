-- Database schema for Canton Loyalty App
-- PostgreSQL / Supabase

-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  canton_party_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Loyalty programs table
CREATE TABLE loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  description TEXT,
  total_issued INTEGER DEFAULT 0,
  total_redeemed INTEGER DEFAULT 0,
  canton_contract_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  canton_party_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customer token balances (aggregated view)
CREATE TABLE token_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  canton_contract_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, program_id)
);

-- Rewards catalog
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  token_cost INTEGER NOT NULL,
  category TEXT NOT NULL,
  inventory INTEGER DEFAULT 0,
  image_url TEXT,
  terms TEXT,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  canton_contract_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(business_id, reward_id)
);

-- Token transactions (history)
CREATE TABLE token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'earned', 'redeemed', 'transferred', 'received', 'burned'
  amount INTEGER NOT NULL,
  balance_after INTEGER,
  reason TEXT,
  reward_id UUID REFERENCES rewards(id),
  recipient_id UUID REFERENCES customers(id),
  canton_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Redemption receipts
CREATE TABLE redemption_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  tokens_cost INTEGER NOT NULL,
  canton_contract_id TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Business statistics (materialized view for performance)
CREATE MATERIALIZED VIEW business_stats AS
SELECT 
  b.id as business_id,
  b.business_name,
  COUNT(DISTINCT tb.customer_id) as total_customers,
  COALESCE(SUM(lp.total_issued), 0) as total_tokens_issued,
  COALESCE(SUM(lp.total_redeemed), 0) as total_tokens_redeemed,
  COUNT(DISTINCT rr.id) as total_redemptions,
  COUNT(DISTINCT tt.id) as total_transactions
FROM businesses b
LEFT JOIN loyalty_programs lp ON lp.business_id = b.id
LEFT JOIN token_balances tb ON tb.program_id = lp.id
LEFT JOIN redemption_receipts rr ON rr.business_id = b.id
LEFT JOIN token_transactions tt ON tt.business_id = b.id
WHERE b.is_active = true
GROUP BY b.id, b.business_name;

-- Indexes for performance
CREATE INDEX idx_businesses_clerk_user ON businesses(clerk_user_id);
CREATE INDEX idx_businesses_canton_party ON businesses(canton_party_id);
CREATE INDEX idx_loyalty_programs_business ON loyalty_programs(business_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_canton_party ON customers(canton_party_id);
CREATE INDEX idx_token_balances_customer ON token_balances(customer_id);
CREATE INDEX idx_token_balances_program ON token_balances(program_id);
CREATE INDEX idx_rewards_business ON rewards(business_id);
CREATE INDEX idx_transactions_business ON token_transactions(business_id);
CREATE INDEX idx_transactions_customer ON token_transactions(customer_id);
CREATE INDEX idx_transactions_created ON token_transactions(created_at DESC);
CREATE INDEX idx_receipts_business ON redemption_receipts(business_id);
CREATE INDEX idx_receipts_customer ON redemption_receipts(customer_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_programs_updated_at BEFORE UPDATE ON loyalty_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_token_balances_updated_at BEFORE UPDATE ON token_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Refresh materialized view function
CREATE OR REPLACE FUNCTION refresh_business_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY business_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Sample seed data for testing
INSERT INTO businesses (clerk_user_id, business_name, category, location, email, phone, canton_party_id) VALUES
('clerk_user_123', 'Joe''s Coffee Shop', 'coffee_shop', '123 Main St, San Francisco, CA', 'joe@joescoffee.com', '+1-415-555-0100', 'joe-coffee-party-123');

INSERT INTO customers (phone, full_name, email, canton_party_id) VALUES
('+1-555-0123', 'Alice Johnson', 'alice@example.com', 'alice-party-123'),
('+1-555-0456', 'Bob Smith', 'bob@example.com', 'bob-party-456'),
('+1-555-0789', 'Carol White', 'carol@example.com', 'carol-party-789');

-- Comments for documentation
COMMENT ON TABLE businesses IS 'Business profiles for loyalty program operators';
COMMENT ON TABLE loyalty_programs IS 'Loyalty programs created by businesses';
COMMENT ON TABLE customers IS 'Customer profiles for app users';
COMMENT ON TABLE token_balances IS 'Current token balances for customers in each program';
COMMENT ON TABLE rewards IS 'Reward catalog items that can be redeemed';
COMMENT ON TABLE token_transactions IS 'History of all token movements';
COMMENT ON TABLE redemption_receipts IS 'Proof of reward redemptions';
COMMENT ON MATERIALIZED VIEW business_stats IS 'Aggregated statistics for business dashboard';
