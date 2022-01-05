ALTER TABLE auth.team_mentors
    ADD COLUMN temp_team_id uuid REFERENCES auth.teams(id);

UPDATE auth.team_mentors SET temp_team_id = team_id;

ALTER TABLE auth.team_mentors
    DROP COLUMN team_id;

ALTER TABLE auth.team_mentors
    RENAME COLUMN temp_team_id TO team_id;

ALTER TABLE auth.team_mentors
    ADD CONSTRAINT team_id_not_null CHECK (team_id IS NOT NULL);
