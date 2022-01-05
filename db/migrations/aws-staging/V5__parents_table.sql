CREATE TABLE auth.parent_consent_status (
    id    integer      PRIMARY KEY,
    name  varchar(20)  NOT NULL UNIQUE
);

INSERT INTO auth.parent_consent_status
    (id, name)
VALUES
    (0, 'PENDING'),
    (1, 'DENIED'),
    (2, 'APPROVED');

CREATE TABLE auth.parents (
    user_id         uuid          PRIMARY KEY REFERENCES auth.users(id),
    first_name      varchar(100)  NOT NULL,
    last_name       varchar(100)  NOT NULL,
    email           varchar(100)  NOT NULL,
    phone_number    varchar(30)   NOT NULL,
    consent_status  integer       NOT NULL REFERENCES auth.parent_consent_status(id) DEFAULT 0,
    hash            varchar(255)
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO auth;
