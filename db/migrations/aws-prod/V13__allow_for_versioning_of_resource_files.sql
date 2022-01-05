ALTER TABLE resources.files
    ADD COLUMN version integer NOT NULL DEFAULT 0,
    DROP CONSTRAINT fn_unique_to_team,
    ADD CONSTRAINT fn_version_unique_to_team UNIQUE (team_id, filename, version);
