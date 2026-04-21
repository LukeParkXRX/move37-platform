-- Projects: 스타트업이 등록하는 프로젝트 브리프 (Enabler 매칭 대기)
CREATE TYPE project_status AS ENUM ('draft', 'open', 'matched', 'in_progress', 'completed', 'cancelled');

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT,
  budget TEXT,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  attachment_url TEXT,
  status project_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_startup ON public.projects(startup_id);
CREATE INDEX idx_projects_status_created ON public.projects(status, created_at DESC);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects: owner read"
  ON public.projects FOR SELECT
  USING (startup_id = auth.uid());

CREATE POLICY "Projects: owner insert"
  ON public.projects FOR INSERT
  WITH CHECK (startup_id = auth.uid());

CREATE POLICY "Projects: owner update"
  ON public.projects FOR UPDATE
  USING (startup_id = auth.uid());

CREATE POLICY "Projects: public read open"
  ON public.projects FOR SELECT
  USING (status = 'open');

GRANT ALL ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO anon;

-- Storage bucket for project attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-attachments', 'project-attachments', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "project-attachments-owner-read" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "project-attachments-owner-insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
