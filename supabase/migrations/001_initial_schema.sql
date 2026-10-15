-- Walter AI — Database Schema Migration
-- Apply this migration to your Supabase project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- profiles
-- ========================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT DEFAULT '',
    occupation TEXT DEFAULT '',
    introduction TEXT DEFAULT '',
    approved_information JSONB DEFAULT '{}',
    private_information_rules JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ========================================
-- answering_rules
-- ========================================
CREATE TABLE IF NOT EXISTS answering_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    greeting TEXT DEFAULT 'Hello, this is Walter, an AI assistant.',
    communication_style TEXT DEFAULT 'professional',
    working_hours JSONB DEFAULT '{}',
    urgency_rules JSONB DEFAULT '{}',
    fallback_message TEXT DEFAULT 'I''ll pass your message along to the owner.',
    escalation_settings JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_answering_rules_user_id ON answering_rules(user_id);

ALTER TABLE answering_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own answering rules"
    ON answering_rules FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own answering rules"
    ON answering_rules FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answering rules"
    ON answering_rules FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ========================================
-- trusted_contacts
-- ========================================
CREATE TABLE IF NOT EXISTS trusted_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    relationship TEXT DEFAULT '',
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trusted_contacts_user_id ON trusted_contacts(user_id);

ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trusted contacts"
    ON trusted_contacts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own trusted contacts"
    ON trusted_contacts FOR ALL
    USING (auth.uid() = user_id);

-- ========================================
-- call_sessions
-- ========================================
CREATE TABLE IF NOT EXISTS call_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_call_id TEXT,
    caller_number TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    status TEXT DEFAULT 'completed' CHECK (status IN ('active', 'completed', 'failed', 'missed')),
    source TEXT DEFAULT 'simulator' CHECK (source IN ('twilio', 'simulator')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_call_sessions_user_id ON call_sessions(user_id);
CREATE INDEX idx_call_sessions_created_at ON call_sessions(created_at DESC);
CREATE INDEX idx_call_sessions_status ON call_sessions(status);
CREATE INDEX idx_call_sessions_source ON call_sessions(source);

ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own call sessions"
    ON call_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert call sessions"
    ON call_sessions FOR INSERT
    WITH CHECK (TRUE);

-- ========================================
-- call_summaries
-- ========================================
CREATE TABLE IF NOT EXISTS call_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    summary TEXT NOT NULL DEFAULT '',
    category TEXT DEFAULT 'general',
    urgency TEXT DEFAULT 'low' CHECK (urgency IN ('critical', 'high', 'medium', 'low')),
    key_details JSONB DEFAULT '{}',
    follow_up_actions JSONB DEFAULT '[]',
    escalation_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(call_id)
);

CREATE INDEX idx_call_summaries_call_id ON call_summaries(call_id);
CREATE INDEX idx_call_summaries_user_id ON call_summaries(user_id);
CREATE INDEX idx_call_summaries_urgency ON call_summaries(urgency);

ALTER TABLE call_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own call summaries"
    ON call_summaries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert call summaries"
    ON call_summaries FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Users can update own call summaries"
    ON call_summaries FOR UPDATE
    USING (auth.uid() = user_id);

-- ========================================
-- integration_connections
-- ========================================
CREATE TABLE IF NOT EXISTS integration_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('twilio', 'openai', 'supabase', 'alexa')),
    connection_status TEXT DEFAULT 'not_configured',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

CREATE INDEX idx_integration_connections_user_id ON integration_connections(user_id);

ALTER TABLE integration_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own integration connections"
    ON integration_connections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integration connections"
    ON integration_connections FOR ALL
    USING (auth.uid() = user_id);

-- ========================================
-- Auto-create profile on user signup
-- ========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

    INSERT INTO answering_rules (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ========================================
-- Updated_at trigger
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER answering_rules_updated_at
    BEFORE UPDATE ON answering_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER integration_connections_updated_at
    BEFORE UPDATE ON integration_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
