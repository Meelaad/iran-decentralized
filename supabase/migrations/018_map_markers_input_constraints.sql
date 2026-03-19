-- Input length limits and color format validation for map_markers

-- Length limits on text fields
ALTER TABLE map_markers
  ADD CONSTRAINT map_markers_label_length       CHECK (char_length(label)       <= 200),
  ADD CONSTRAINT map_markers_description_length CHECK (char_length(description) <= 2000),
  ADD CONSTRAINT map_markers_region_length      CHECK (char_length(region)      <= 100),
  ADD CONSTRAINT map_markers_pop_estimate_length CHECK (char_length(pop_estimate) <= 50);

-- Color must be a valid 3 or 6 digit hex (e.g. #fff or #26DEC2)
ALTER TABLE map_markers
  ADD CONSTRAINT map_markers_color_hex
    CHECK (color ~ '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$');
