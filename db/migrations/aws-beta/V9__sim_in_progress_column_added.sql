ALTER TABLE sims.sims
    ADD COLUMN in_progress boolean DEFAULT false;
UPDATE sims.sims SET in_progress = false;
ALTER TABLE sims.sims
    ADD CONSTRAINT in_progress_not_null CHECK (in_progress IS NOT NULL);
