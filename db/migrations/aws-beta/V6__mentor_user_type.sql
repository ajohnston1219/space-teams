INSERT INTO auth.user_types
    (id, name)
VALUES
    (2, 'MENTOR');

CREATE TABLE auth.mentor_invitations (
    team_id   uuid          NOT NULL REFERENCES auth.teams(id),
    email     varchar(100)  NOT NULL,
    hash      varchar(100)  NOT NULL,
    status    integer       NOT NULL REFERENCES auth.invite_status(id) DEFAULT 0,

    PRIMARY KEY (team_id, email)
);

CREATE TABLE auth.team_mentors (
   team_id  uuid  NOT NULL UNIQUE REFERENCES auth.teams(id),
   user_id  uuid  NOT NULL REFERENCES auth.users(id),

   PRIMARY KEY (team_id, user_id)
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO auth;
