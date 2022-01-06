CREATE TABLE competitions.user_roles (
    id    integer      PRIMARY KEY,
    name  varchar(20)  NOT NULL UNIQUE
);
INSERT INTO competitions.user_roles
    (id, name)
VALUES
    (0, 'COMPETITOR'),
    (1, 'ROAMER'),
    (2, 'GUEST'),
    (3, 'TEACHER'),
    (4, 'INDUSTRY_MENTOR');

CREATE TABLE competitions.user_statuses (
    id    integer      PRIMARY KEY,
    name  varchar(20)  NOT NULL UNIQUE
);
INSERT INTO competitions.user_statuses
    (id, name)
VALUES
    (0, 'ACTIVE'),
    (1, 'PENDING_PAYMENT'),
    (2, 'BANNED');

CREATE TABLE competitions.competition_users (
    user_id         uuid     NOT NULL REFERENCES auth.users(id),
    competition_id  uuid     NOT NULL REFERENCES competitions.competitions(id),
    role            integer  NOT NULL REFERENCES competitions.user_roles(id),
    status          integer  NOT NULL REFERENCES competitions.user_statuses(id),
    chat_enabled    boolean  NOT NULL DEFAULT true
);

CREATE VIEW competition_users AS (
    SELECT
      user_id,
      competition_id,
      (SELECT name FROM competitions.user_roles WHERE id = role) AS role,
      (SELECT name FROM competitions.user_statuses WHERE id = status) AS status,
      chat_enabled
    FROM competitions.competition_users
);

CREATE FUNCTION migrate_competition_users() RETURNS void
AS $migrate_competition_users$
   DECLARE
       comp_id uuid;
       user_id uuid;
   BEGIN
       FOR comp_id IN
           SELECT c.id FROM competitions.competitions c
       LOOP
           FOR user_id IN
               SELECT tm.user_id FROM auth.team_members tm
               JOIN competitions.teams ct ON tm.team_id = ct.team_id
               WHERE ct.competition_id = comp_id
           LOOP
               INSERT INTO competitions.competition_users
                   (user_id, competition_id, role, status, chat_enabled)
               VALUES (user_id, comp_id, 0, 0, true);
           END LOOP;
       END LOOP;
   END;
$migrate_competition_users$ LANGUAGE plpgsql;

SELECT migrate_competition_users();

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA competitions TO competitions;
GRANT SELECT ON competition_users TO app;
