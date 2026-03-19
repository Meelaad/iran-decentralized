-- Map markers table — editable via admin panel, read-only for public
CREATE TABLE IF NOT EXISTS map_markers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text NOT NULL CHECK (type IN ('circle', 'triangle')),
  lon         numeric(9,4) NOT NULL,
  lat         numeric(9,4) NOT NULL,
  color       text NOT NULL DEFAULT '#26DEC2',
  label       text NOT NULL DEFAULT '',
  description text,
  region      text,
  pop_estimate text,
  created_by  uuid REFERENCES auth.users(id),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- RLS: anyone can read, only admins can write
ALTER TABLE map_markers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "map_markers_read" ON map_markers
  FOR SELECT USING (true);

CREATE POLICY "map_markers_write" ON map_markers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Role-level grants (RLS alone is not enough without explicit GRANT)
GRANT SELECT ON map_markers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON map_markers TO authenticated;
