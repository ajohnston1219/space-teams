CREATE TABLE auth.applications (
    id      uuid        PRIMARY KEY,
    name    varchar(50) NOT NULL UNIQUE,
    api_key varchar(50) NOT NULL UNIQUE
);

CREATE TABLE auth.user_types (
    id   integer     PRIMARY KEY,
    name varchar(20) NOT NULL UNIQUE
);

INSERT INTO auth.user_types
    (id, name)
VALUES
    (0, 'USER'),
    (1, 'ADMIN');

CREATE TABLE auth.inactive_reasons (
    id    integer      PRIMARY KEY,
    name  varchar(20)  NOT NULL UNIQUE
);

INSERT INTO auth.inactive_reasons
    (id, name)
VALUES
    (0, 'NO_PAY'),
    (1, 'TEMPORARY'),
    (2, 'SUSPENDED'),
    (3, 'EXPIRED');

CREATE TABLE auth.registration_sources (
    id      uuid          PRIMARY KEY,
    name    varchar(100)  NOT NULL UNIQUE,
    code    varchar(20)   NOT NULL UNIQUE
);

CREATE TABLE auth.users (
    id                      uuid          PRIMARY KEY,
    type                    integer       NOT NULL REFERENCES auth.user_types(id) DEFAULT 0,
    username                varchar(50)   UNIQUE,
    email                   varchar(100)  NOT NULL UNIQUE,
    first_name              varchar(100),
    last_name               varchar(100),
    date_of_birth           date,
    city                    varchar(100),
    state_or_province       varchar(100), 
    country                 varchar(100),
    school_or_organization  varchar(100), 
    registration_source     uuid          REFERENCES auth.registration_sources DEFAULT '02853963-9716-4bb4-b361-d39250f488dd',
    password                varchar(255), 
    active                  boolean       NOT NULL DEFAULT true,
    inactive_reason         integer       REFERENCES auth.inactive_reasons DEFAULT NULL,
    hash                    varchar(255),

    CONSTRAINT has_type CHECK (active = false OR username IS NOT NULL),
    CONSTRAINT has_password CHECK (active = false OR password IS NOT NULL),
    CONSTRAINT has_first_name CHECK (active = false OR first_name IS NOT NULL),
    CONSTRAINT has_last_name CHECK (active = false OR last_name IS NOT NULL),
    CONSTRAINT regular_user_has_dob CHECK (type != 0 OR date_of_birth IS NOT NULL),
    CONSTRAINT regular_user_has_city CHECK (type != 0 OR city IS NOT NULL),
    CONSTRAINT regular_user_has_country CHECK (type != 0 OR country IS NOT NULL),
    CONSTRAINT inactive_has_reason CHECK (active = true OR inactive_reason IS NOT NULL),
    CONSTRAINT active_does_not_have_inactive_reason CHECK (active = false OR inactive_reason IS NULL)
);

CREATE TABLE auth.admin_roles (
    id   integer     PRIMARY KEY,
    name varchar(20) NOT NULL UNIQUE
);

INSERT INTO auth.admin_roles
    (id, name)
VALUES
    (0, 'SC_ROOT'),
    (1, 'SC_ADMIN'),
    (2, 'ORG_ADMIN');

CREATE TABLE auth.admins (
    id           uuid        PRIMARY KEY,
    user_id      uuid        NOT NULL REFERENCES auth.users(id),
    role         integer     NOT NULL REFERENCES auth.admin_roles(id),
    phone_number varchar(30) NOT NULL
);

CREATE TABLE auth.approved_admins (
    user_id      uuid        NOT NULL REFERENCES auth.users(id),
    role         integer     NOT NULL REFERENCES auth.admin_roles(id),

    PRIMARY KEY (user_id, role)
);

CREATE VIEW user_info AS (
    SELECT id, username, email FROM auth.users
);

CREATE TABLE auth.organizations (
    id   uuid        PRIMARY KEY,
    name varchar(50) NOT NULL UNIQUE
);

CREATE TABLE auth.organaization_admins (
    admin_id        uuid NOT NULL REFERENCES auth.admins(id),
    organization_id uuid NOT NULL REFERENCES auth.organizations(id),

    PRIMARY KEY (admin_id, organization_id)
);

CREATE TABLE auth.team_roles (
    id   integer     PRIMARY KEY,
    name varchar(20) NOT NULL UNIQUE
);

INSERT INTO auth.team_roles
    (id, name)
VALUES
    (0, 'OWNER'),
    (1, 'ADMIN'),
    (2, 'MEMBER');

CREATE TABLE auth.teams (
    id           uuid         PRIMARY KEY,
    name         varchar(50)  NOT NULL UNIQUE,
    organization uuid         REFERENCES auth.organizations(id),
    active       boolean      NOT NULL DEFAULT true
);

CREATE TABLE auth.team_members (
    team_id uuid    NOT NULL REFERENCES auth.teams(id) ON DELETE CASCADE,
    user_id uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role    integer NOT NULL REFERENCES auth.team_roles(id),

    PRIMARY KEY (team_id, user_id)
);

CREATE VIEW team_info AS (
    SELECT id, name, active FROM auth.teams
);

CREATE VIEW team_member_info AS (
    SELECT
        t.id AS team_id,
        t.name AS team_name,
        tm.user_id AS user_id,
        u.username AS username,
        tr.name AS role
    FROM auth.teams t
    JOIN auth.team_members tm ON t.id = tm.team_id
    JOIN auth.users u ON tm.user_id = u.id
    JOIN auth.team_roles tr ON tr.id = tm.role
);

CREATE TABLE auth.invite_status (
    id   integer     PRIMARY KEY,
    name varchar(20) NOT NULL UNIQUE
);

INSERT INTO auth.invite_status
    (id, name)
VALUES
    (0, 'ACTIVE'),
    (1, 'ACCEPTED'),
    (2, 'REJECTED'),
    (3, 'REVOKED');

CREATE TABLE auth.team_invites (
    team_id   uuid    NOT NULL REFERENCES auth.teams(id) ON DELETE CASCADE,
    sent_to   uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sent_from uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status    integer NOT NULL REFERENCES auth.invite_status(id) DEFAULT 0,

    PRIMARY KEY (team_id, sent_to, sent_from),
    CONSTRAINT invite_to_self CHECK (sent_to != sent_from)
);

CREATE TABLE auth.authorized_tokens (
    user_id uuid         NOT NULL REFERENCES auth.users(id),
    token   varchar(255) PRIMARY KEY
);

CREATE TABLE auth.password_reset_keys (
    user_id   uuid         NOT NULL REFERENCES auth.users(id),
    reset_key varchar(255) NOT NULL,

    PRIMARY KEY (user_id, reset_key)
);

CREATE TABLE sims.sims (
    id              uuid         PRIMARY KEY,
    name            varchar(255) NOT NULL UNIQUE,
    sim_number      integer      NOT NULL,
    activity        varchar(255) NOT NULL,
    team_id         uuid         NOT NULL REFERENCES auth.teams(id),
    hostname        varchar(255) NOT NULL,
    port            integer      NOT NULL,
    hash            char(16)     NOT NULL,
    created_at      timestamp    NOT NULL
);

CREATE TABLE sims.voip_channels (
    sim_id  uuid        NOT NULL REFERENCES sims.sims(id) ON DELETE CASCADE,
    voip_id varchar(50) NOT NULL UNIQUE,

    PRIMARY KEY(sim_id, voip_id)
);

CREATE TABLE sims.sim_members (
    sim_id  uuid        NOT NULL REFERENCES sims.sims(id),
    user_id uuid        NOT NULL REFERENCES auth.users(id),
    ip      varchar(50) NOT NULL,

    PRIMARY KEY (sim_id, user_id)
);

CREATE TABLE competitions.competitions (
    id              uuid        PRIMARY KEY,
    organization_id uuid        NOT NULL REFERENCES auth.organizations(id),
    name            varchar(50) NOT NULL,
    start_date      date        NOT NULL,
    end_date        date        NOT NULL,

    UNIQUE (organization_id, name),
    CONSTRAINT competition_end_after_start CHECK (end_date > start_date)
);

CREATE TABLE competitions.leagues (
    id             uuid        PRIMARY KEY,
    competition_id uuid        NOT NULL REFERENCES competitions.competitions(id),
    name           varchar(50) NOT NULL,

    UNIQUE (competition_id, name)
);

CREATE TABLE competitions.teams (
    competition_id uuid NOT NULL REFERENCES competitions.competitions(id),
    team_id        uuid NOT NULL REFERENCES auth.teams(id),
    league_id      uuid NOT NULL REFERENCES competitions.leagues(id),

    PRIMARY KEY (competition_id, team_id)
);

CREATE FUNCTION check_user_competition_duplicate() RETURNS trigger
AS $check_user_competition_duplicate$
    DECLARE
        user_id uuid;
    BEGIN
        FOR user_id IN
            SELECT u.user_id FROM team_info t
            JOIN team_member_info u ON u.team_id = t.id
            WHERE t.id = NEW.team_id
        LOOP
            IF user_id IN (
                SELECT u.user_id FROM competitions.teams ct
                JOIN team_info t ON ct.team_id = t.id
                JOIN team_member_info u ON u.team_id = t.id
                WHERE ct.competition_id = NEW.competition_id
                      AND t.id != NEW.team_id
                      AND t.active)
            THEN
                RAISE EXCEPTION 'User is already in competition';
            END IF;
        END LOOP;

        RETURN NEW;
    END;
$check_user_competition_duplicate$ LANGUAGE plpgsql;

CREATE TRIGGER check_user_competition_duplicate
    AFTER INSERT OR UPDATE ON competitions.teams
    FOR EACH ROW
    EXECUTE PROCEDURE check_user_competition_duplicate();

CREATE TABLE competitions.activities (
    id                     uuid        PRIMARY KEY,
    competition_id         uuid        NOT NULL REFERENCES competitions.competitions(id),
    name                   varchar(50) NOT NULL,
    description            text        NOT NULL,
    start_date             date        NOT NULL,
    end_date               date        NOT NULL,
    data_template          jsonb,
    scoring_template       jsonb,
    meta_data              jsonb,

    UNIQUE (competition_id, name),
    CONSTRAINT activity_end_after_start CHECK (end_date > start_date)
);

CREATE TABLE competitions.scores (
    team_id        uuid    NOT NULL REFERENCES auth.teams(id),
    competition_id uuid    NOT NULL REFERENCES competitions.competitions(id),
    score          numeric NOT NULL,

    PRIMARY KEY (team_id, competition_id)
);

CREATE TABLE competitions.activity_scores (
    team_id       uuid       NOT NULL REFERENCES auth.teams(id),
    activity_id   uuid       NOT NULL REFERENCES competitions.activities(id),
    score         numeric    NOT NULL,
    scorecard     jsonb      NOT NULL,
    data          jsonb      NOT NULL,
    submitted_by  uuid       NOT NULL REFERENCES auth.users(id),
    submitted_on  timestamp  NOT NULL DEFAULT NOW(),

    PRIMARY KEY (team_id, activity_id)
);

CREATE FUNCTION update_competition_score() RETURNS trigger
AS $update_competition_score$
    DECLARE
        comp_id uuid;
    BEGIN
        comp_id = (SELECT a.competition_id
                   FROM competitions.activities a
                   WHERE a.id = NEW.activity_id);
        UPDATE competitions.scores s
        SET score = (SELECT sum(score) FROM competitions.activity_scores acs
                     JOIN competitions.activities a ON a.id = acs.activity_id
                     WHERE a.competition_id = comp_id AND acs.team_id = NEW.team_id)
        WHERE s.competition_id = competition_id AND s.team_id = NEW.team_id;

        RETURN NEW;
    END;
$update_competition_score$ LANGUAGE plpgsql;

CREATE TRIGGER update_score
    AFTER INSERT OR UPDATE ON competitions.activity_scores
    FOR EACH ROW
    EXECUTE PROCEDURE update_competition_score();

CREATE VIEW competition_info AS (
    SELECT
        c.id,
        c.name,
        c.start_date,
        c.end_date
    FROM competitions.competitions c
);

CREATE VIEW competition_teams AS (
    SELECT
        ct.competition_id,
        c.name AS competition_name,
        ct.team_id,
        t.name AS team_name
    FROM competitions.teams ct
    JOIN competitions.competitions c ON c.id = ct.competition_id
    JOIN auth.teams t ON t.id = ct.team_id
);

CREATE TABLE messages.announcement_types (
    id   integer     PRIMARY KEY,
    name varchar(20) NOT NULL UNIQUE
);

CREATE TABLE messages.audiences (
    id   integer     PRIMARY KEY,
    name varchar(20) NOT NULL UNIQUE
);

INSERT INTO messages.announcement_types
    (id, name)
VALUES
    (0, 'REGULAR'),
    (1, 'IMPORTANT'),
    (2, 'WARNING');

INSERT INTO messages.audiences
    (id, name)
VALUES
    (0, 'GLOBAL'),
    (1, 'COMPETITION'),
    (2, 'TEAM'),
    (3, 'USER');

CREATE TABLE messages.announcements (
    id              uuid    PRIMARY KEY,
    type            integer NOT NULL REFERENCES messages.announcement_types(id),
    audience        integer NOT NULL REFERENCES messages.audiences(id),
    competition_id  uuid    REFERENCES competitions.competitions(id),
    team_id         uuid    REFERENCES auth.teams(id),
    user_id         uuid    REFERENCES auth.users(id),
    deleted         bool    NOT NULL DEFAULT false,
    title           text    NOT NULL,
    content         text    NOT NULL,

    CONSTRAINT has_comp_id  CHECK (audience != 1 OR competition_id IS NOT NULL),
    CONSTRAINT has_team_id CHECK (audience != 2 OR team_id IS NOT NULL),
    CONSTRAINT has_user_id CHECK (audience != 3 OR user_id IS NOT NULL)
);

CREATE TABLE messages.user_messages (
    id      uuid      PRIMARY KEY,
    from_id uuid      NOT NULL REFERENCES auth.users(id),
    to_id   uuid      NOT NULL REFERENCES auth.users(id),
    sent_at timestamp NOT NULL DEFAULT NOW(),
    read_at timestamp,
    read    bool      NOT NULL DEFAULT false,
    deleted bool      NOT NULL DEFAULT false,
    message text      NOT NULL,

    CONSTRAINT not_send_to_self CHECK (from_id != to_id)
);

CREATE FUNCTION check_read_status() RETURNS trigger
AS $check_read_status$
    BEGIN
        IF NOT OLD.read AND NEW.read THEN
            UPDATE messages.user_messages um
            SET read_at = NOW()
            WHERE um.id = NEW.id;
        END IF;
        IF OLD.read AND NOT NEW.read THEN
            UPDATE messages.user_messages um
            SET read_at = NULL
            WHERE um.id = NEW.id;
        END IF;

        RETURN NEW;
    END;
$check_read_status$ LANGUAGE plpgsql;

CREATE TRIGGER check_read_status
    AFTER INSERT OR UPDATE ON messages.user_messages
    FOR EACH ROW
    EXECUTE PROCEDURE check_read_status();

CREATE TABLE resources.files (
    id           uuid          PRIMARY KEY,
    uploaded_by  uuid          NOT NULL REFERENCES auth.users(id),
    team_id      uuid          NOT NULL REFERENCES auth.teams(id),
    filename     varchar(255)  NOT NULL,
    metadata     jsonb         NOT NULL,

    CONSTRAINT fn_unique_to_team UNIQUE (team_id, filename)
);

CREATE TABLE billing.competition_prices (
    competition_id  uuid    PRIMARY KEY REFERENCES competitions.competitions(id),
    price           numeric NOT NULL,

    CONSTRAINT price_is_positive CHECK (price > 0)
);

CREATE TABLE billing.competition_payments (
    id              uuid        PRIMARY KEY,
    invoice_id      serial      NOT NULL UNIQUE,
    transaction_id  varchar(30) UNIQUE,
    user_id         uuid        NOT NULL REFERENCES auth.users(id),
    competition_id  uuid        NOT NULL REFERENCES competitions.competitions(id),
    approved        boolean     NOT NULL DEFAULT false,

    CONSTRAINT payment_has_transaction_id CHECK (approved = false OR transaction_id IS NOT NULL)
);

CREATE VIEW competition_payments AS (
   SELECT user_id, competition_id, approved FROM billing.competition_payments
);

CREATE TABLE bug_reports (
    id         uuid      PRIMARY KEY,
    user_id    uuid      NOT NULL REFERENCES auth.users(id),
    created_at timestamp NOT NULL DEFAULT NOW(),
    app_state  jsonb     NOT NULL,
    message    text      NOT NULL
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth         TO auth;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA sims         TO sims;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA competitions TO competitions;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA messages     TO messages;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA resources    TO resources;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA billing      TO billing;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA billing    TO billing;

GRANT SELECT ON user_info TO app;
GRANT SELECT ON team_info TO app;
GRANT SELECT ON team_member_info TO app;
GRANT SELECT ON competition_info TO app;
GRANT SELECT ON competition_teams TO app;
GRANT SELECT ON competition_payments TO app;
GRANT ALL ON bug_reports TO app;

GRANT auth, sims, competitions, messages, resources, billing TO spacecraft;
