-- =============================================
-- NOTEVIBE: Library Management Module
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Libraries table
CREATE TABLE libraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  phone TEXT,
  logo_url TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Books table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  library_id UUID REFERENCES libraries(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT,
  language TEXT DEFAULT 'uz',
  description TEXT,
  cover_url TEXT,
  total_count INTEGER DEFAULT 1,
  available_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Borrowings table
CREATE TABLE borrowings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  library_id UUID REFERENCES libraries(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  taken_date TIMESTAMPTZ,
  return_date TIMESTAMPTZ,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'borrowed', 'returned', 'late')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Book reviews table
CREATE TABLE book_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowings ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies: everyone can read, authenticated can insert
CREATE POLICY "Anyone can view libraries" ON libraries FOR SELECT USING (true);
CREATE POLICY "Auth users can insert libraries" ON libraries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view approved books" ON books FOR SELECT USING (true);
CREATE POLICY "Auth users can insert books" ON books FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can update books" ON books FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view borrowings" ON borrowings FOR SELECT USING (true);
CREATE POLICY "Auth users can insert borrowings" ON borrowings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can update borrowings" ON borrowings FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view reviews" ON book_reviews FOR SELECT USING (true);
CREATE POLICY "Auth users can insert reviews" ON book_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
