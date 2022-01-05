ALTER TABLE auth.organizations
    ADD COLUMN contact_first_name  varchar(100),
    ADD COLUMN contact_last_name   varchar(100),
    ADD COLUMN contact_email       varchar(100) UNIQUE,
    ADD COLUMN phone_number        varchar(30),
    ADD COLUMN address             varchar(100),
    ADD COLUMN country             varchar(100),
    ADD COLUMN state_or_province   varchar(100),
    ADD COLUMN city                varchar(100),
    ADD COLUMN zip_code            varchar(20);

CREATE TABLE billing.competition_bulk_payments (
    id              uuid        PRIMARY KEY,
    invoice_id      serial      NOT NULL UNIQUE,
    transaction_id  varchar(30) UNIQUE,
    organization_id uuid        NOT NULL REFERENCES auth.organizations(id),
    competition_id  uuid        NOT NULL REFERENCES competitions.competitions(id),
    num_students    integer     NOT NULL,
    approved        boolean     NOT NULL DEFAULT false,

    CONSTRAINT payment_has_transaction_id CHECK (approved = false OR transaction_id IS NOT NULL),
    CONSTRAINT more_than_zero_students CHECK (num_students > 0)
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth         TO auth;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA billing      TO billing;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA billing    TO billing;
