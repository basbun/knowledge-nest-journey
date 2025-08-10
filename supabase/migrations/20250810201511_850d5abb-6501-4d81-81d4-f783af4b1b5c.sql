-- Normalize topics to use category_id and enable robust realtime

-- 1) Add category_id to topics if not exists
ALTER TABLE public.topics ADD COLUMN IF NOT EXISTS category_id UUID;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_topics_category_id ON public.topics (category_id);

-- Foreign key (if not already present)
DO $$ BEGIN
  ALTER TABLE public.topics
    ADD CONSTRAINT topics_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.categories (id)
    ON UPDATE CASCADE ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) Backfill category_id using name match per user
UPDATE public.topics t
SET category_id = c.id
FROM public.categories c
WHERE t.category_id IS NULL
  AND t.category IS NOT NULL
  AND t.category <> ''
  AND c.name = t.category
  AND c.user_id = t.user_id;

-- 3) Ensure REPLICA IDENTITY FULL for comprehensive realtime payloads
ALTER TABLE public.topics REPLICA IDENTITY FULL;
ALTER TABLE public.learning_methods REPLICA IDENTITY FULL;
ALTER TABLE public.journal_entries REPLICA IDENTITY FULL;
ALTER TABLE public.resources REPLICA IDENTITY FULL;
ALTER TABLE public.categories REPLICA IDENTITY FULL;

-- 4) Add tables to supabase_realtime publication (safe to run if not yet added)
DO $$ BEGIN
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.topics';
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_methods';
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.journal_entries';
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.resources';
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.categories';
EXCEPTION WHEN OTHERS THEN NULL; END $$;