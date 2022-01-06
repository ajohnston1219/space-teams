CREATE TABLE auth.team_event_types (
    id    integer         PRIMARY KEY,
    name  varchar(255)  NOT NULL UNIQUE
);

INSERT INTO auth.team_event_types
    (id, name)
VALUES
    (0, 'MEMBER_JOINED'),
    (1, 'MEMBER_INVITED'),
    (2, 'MEMBER_LEFT'),
    (3, 'MEMBER_ONLINE'),
    (4, 'MEMBER_OFFLINE'),
    (5, 'NEW_HIGH_SCORE_POSTED');

CREATE TABLE auth.team_activity_stream (
    id          uuid      PRIMARY KEY,
    user_id     uuid      NOT NULL REFERENCES auth.users(id),
    team_id     uuid      NOT NULL REFERENCES auth.teams(id),
    event_type  integer   NOT NULL REFERENCES auth.team_event_types(id),     
    posted_at   timestamp NOT NULL DEFAULT NOW(),
    payload     jsonb
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO auth;
