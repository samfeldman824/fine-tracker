-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fines table
CREATE TABLE IF NOT EXISTS fines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  offender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  proposed_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  replies INTEGER DEFAULT 0 CHECK (replies >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credits table
CREATE TABLE IF NOT EXISTS credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fines_offender_id ON fines(offender_id);
CREATE INDEX IF NOT EXISTS idx_fines_proposed_by_id ON fines(proposed_by_id);
CREATE INDEX IF NOT EXISTS idx_fines_date ON fines(date);
CREATE INDEX IF NOT EXISTS idx_credits_person_id ON credits(person_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for fines table
DROP TRIGGER IF EXISTS update_fines_updated_at ON fines;
CREATE TRIGGER update_fines_updated_at
    BEFORE UPDATE ON fines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample users for development
INSERT INTO users (name, username, password_hash, role) VALUES
  ('John Doe', 'john', '$2a$10$dummy_hash_for_development', 'admin'),
  ('Jane Smith', 'jane', '$2a$10$dummy_hash_for_development', 'user'),
  ('Bob Johnson', 'bob', '$2a$10$dummy_hash_for_development', 'user'),
  ('Alice Brown', 'alice', '$2a$10$dummy_hash_for_development', 'user')
ON CONFLICT (username) DO NOTHING;

-- Insert sample fines for development
INSERT INTO fines (offender_id, description, amount, proposed_by_id, replies) 
SELECT 
  u1.id as offender_id,
  'Speeding violation on Highway 101',
  75.00,
  u2.id as proposed_by_id,
  2
FROM users u1, users u2 
WHERE u1.username = 'jane' AND u2.username = 'john'
ON CONFLICT DO NOTHING;

INSERT INTO fines (offender_id, description, amount, proposed_by_id, replies) 
SELECT 
  u1.id as offender_id,
  'Parking in no-parking zone',
  50.00,
  u2.id as proposed_by_id,
  0
FROM users u1, users u2 
WHERE u1.username = 'bob' AND u2.username = 'john'
ON CONFLICT DO NOTHING;