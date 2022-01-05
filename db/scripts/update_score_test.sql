INSERT INTO auth.teams
    (id, name)
VALUES
    ('d17d96e0-2b69-4f0c-81d1-ec8e8037452d', 'The A Team');

INSERT INTO competitions.teams
    (team_id, competition_id)
VALUES
    ('d17d96e0-2b69-4f0c-81d1-ec8e8037452d', '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd');

INSERT INTO competitions.scores
    (team_id, competition_id, score)
VALUES
    ('d17d96e0-2b69-4f0c-81d1-ec8e8037452d', '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd', 0);

INSERT INTO competitions.activity_scores
    (team_id, activity_id, score)
VALUES
    ('d17d96e0-2b69-4f0c-81d1-ec8e8037452d', '6316388b-4751-4fb7-bbaf-c568365cebfb', 250);
