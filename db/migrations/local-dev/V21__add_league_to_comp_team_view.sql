CREATE OR REPLACE VIEW competition_teams AS (
    SELECT
        ct.competition_id,
        c.name AS competition_name,
        ct.team_id,
        t.name AS team_name,
        (SELECT name FROM competitions.leagues WHERE id = ct.league_id) AS league
    FROM competitions.teams ct
    JOIN competitions.competitions c ON c.id = ct.competition_id
    JOIN auth.teams t ON t.id = ct.team_id
);
GRANT SELECT ON competition_teams TO app;
