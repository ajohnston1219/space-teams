ALTER TABLE competitions.competitions
    ADD COLUMN allow_team_modifications boolean NOT NULL DEFAULT true;

DROP VIEW competition_info;

CREATE VIEW competition_info AS (
    SELECT
        c.id,
        c.name,
        c.start_date,
        c.end_date,
        c.allow_team_modifications
    FROM competitions.competitions c
);

GRANT SELECT ON competition_info TO app;
