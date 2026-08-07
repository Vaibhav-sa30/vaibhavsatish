-- ========================================================
-- SUPABASE DATABASE SETUP FOR PORTFOLIO ENGAGEMENT & ANNOTATIONS
-- Copy and paste this script into your Supabase SQL Editor
-- ========================================================

-- 1. Create table for tracking article likes count
CREATE TABLE IF NOT EXISTS article_likes (
  article_id TEXT PRIMARY KEY,
  like_count INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for optional reader handles attached to likes
CREATE TABLE IF NOT EXISTS article_like_handles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id TEXT NOT NULL,
  reader_handle TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table for article comments
CREATE TABLE IF NOT EXISTS article_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create table for author pen tablet handwritten annotations
CREATE TABLE IF NOT EXISTS article_annotations (
  article_id TEXT PRIMARY KEY,
  strokes_json JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_like_handles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_annotations ENABLE ROW LEVEL SECURITY;

-- 6. Safely Drop and Re-create Policies (Prevents Policy Already Exists Error)

-- Likes Policies
DROP POLICY IF EXISTS "Allow public read on article_likes" ON article_likes;
DROP POLICY IF EXISTS "Allow public insert on article_likes" ON article_likes;
DROP POLICY IF EXISTS "Allow public update on article_likes" ON article_likes;
CREATE POLICY "Allow public read on article_likes" ON article_likes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on article_likes" ON article_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on article_likes" ON article_likes FOR UPDATE USING (true);

-- Like Handles Policies
DROP POLICY IF EXISTS "Allow public read on article_like_handles" ON article_like_handles;
DROP POLICY IF EXISTS "Allow public insert on article_like_handles" ON article_like_handles;
CREATE POLICY "Allow public read on article_like_handles" ON article_like_handles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on article_like_handles" ON article_like_handles FOR INSERT WITH CHECK (true);

-- Comments Policies (Allows SELECT, INSERT, and DELETE for admin comment moderation)
DROP POLICY IF EXISTS "Allow public read on article_comments" ON article_comments;
DROP POLICY IF EXISTS "Allow public insert on article_comments" ON article_comments;
DROP POLICY IF EXISTS "Allow public delete on article_comments" ON article_comments;
CREATE POLICY "Allow public read on article_comments" ON article_comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on article_comments" ON article_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on article_comments" ON article_comments FOR DELETE USING (true);

-- Annotations Policies
DROP POLICY IF EXISTS "Allow public read on article_annotations" ON article_annotations;
DROP POLICY IF EXISTS "Allow public insert on article_annotations" ON article_annotations;
DROP POLICY IF EXISTS "Allow public update on article_annotations" ON article_annotations;
CREATE POLICY "Allow public read on article_annotations" ON article_annotations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on article_annotations" ON article_annotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on article_annotations" ON article_annotations FOR UPDATE USING (true);

-- 7. Helper function for atomic increment of likes
CREATE OR REPLACE FUNCTION increment_like(target_article_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO article_likes (article_id, like_count)
  VALUES (target_article_id, 1)
  ON CONFLICT (article_id)
  DO UPDATE SET 
    like_count = article_likes.like_count + 1,
    updated_at = timezone('utc'::text, now())
  RETURNING like_count INTO new_count;
  
  RETURN new_count;
END;
$$;
