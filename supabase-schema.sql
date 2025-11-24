-- QuantPayChain Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- RWA Assets Table
CREATE TABLE IF NOT EXISTS public.rwa_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('real_estate', 'commodity', 'art', 'bond', 'equity', 'other')),
    description TEXT NOT NULL,
    value_usd DECIMAL(20, 2) NOT NULL CHECK (value_usd > 0),
    location VARCHAR(255) NOT NULL,
    legal_documents TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'sold', 'inactive')),
    owner_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tokens Table
CREATE TABLE IF NOT EXISTS public.tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES public.rwa_assets(id) ON DELETE CASCADE,
    token_symbol VARCHAR(10) NOT NULL,
    total_supply BIGINT NOT NULL CHECK (total_supply > 0),
    available_supply BIGINT NOT NULL CHECK (available_supply >= 0),
    price_per_token DECIMAL(20, 2) NOT NULL CHECK (price_per_token > 0),
    blockchain_network VARCHAR(50) NOT NULL,
    contract_address VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT available_supply_check CHECK (available_supply <= total_supply)
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES auth.users(id),
    token_id UUID NOT NULL REFERENCES public.tokens(id),
    quantity BIGINT NOT NULL CHECK (quantity > 0),
    total_amount DECIMAL(20, 2) NOT NULL CHECK (total_amount > 0),
    transaction_hash VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_owner ON public.rwa_assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.rwa_assets(status);
CREATE INDEX IF NOT EXISTS idx_tokens_asset ON public.tokens(asset_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON public.transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_token ON public.transactions(token_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.rwa_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RWA Assets Policies
CREATE POLICY "Anyone can view active assets" ON public.rwa_assets
    FOR SELECT USING (status = 'active' OR auth.uid() = owner_id);

CREATE POLICY "Users can insert their own assets" ON public.rwa_assets
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own assets" ON public.rwa_assets
    FOR UPDATE USING (auth.uid() = owner_id);

-- Tokens Policies
CREATE POLICY "Anyone can view tokens" ON public.tokens
    FOR SELECT USING (true);

CREATE POLICY "Asset owners can insert tokens" ON public.tokens
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.rwa_assets 
            WHERE id = asset_id AND owner_id = auth.uid()
        )
    );

-- Transactions Policies
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_rwa_assets_updated_at BEFORE UPDATE ON public.rwa_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
