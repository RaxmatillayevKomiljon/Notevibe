CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert komiljonraxmatillayev5@gmail.com by finding their profile ID
INSERT INTO admin_users (user_id)
SELECT id FROM profiles 
WHERE username = 'komiljonraxmatillayev5@gmail.com' -- or however they are registered, or we can just let them run a separate query to insert their ID
ON CONFLICT DO NOTHING;

-- Since the user didn't register with an exact email matching username, a safer approach to add the first admin:
-- 1. In Supabase Auth, they login.
-- 2. They need to find their profile ID and insert it.
-- Let's provide a query that finds the user by email in the auth schema and inserts into admin_users

INSERT INTO admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'komiljonraxmatillayev5@gmail.com'
ON CONFLICT DO NOTHING;

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read admin_users" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Admins can insert admin_users" ON admin_users FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM admin_users)
);
CREATE POLICY "Admins can delete admin_users" ON admin_users FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

-- Note: we can drop admin_emails table if they already created it
DROP TABLE IF EXISTS admin_emails;
