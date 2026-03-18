ALTER TABLE transitional_plans ADD COLUMN IF NOT EXISTS endorsement_count int NOT NULL DEFAULT 0;
