-- Add circle_blink as a valid marker type (animated pulsing circle)
ALTER TABLE map_markers DROP CONSTRAINT IF EXISTS map_markers_type_check;
ALTER TABLE map_markers ADD CONSTRAINT map_markers_type_check
  CHECK (type IN ('circle', 'triangle', 'circle_blink'));
