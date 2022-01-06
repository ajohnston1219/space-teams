ALTER TABLE billing.competition_payments
    RENAME TO legacy_competition_payments;
ALTER TABLE billing.competition_prices
    RENAME TO legacy_competition_prices;

CREATE TABLE auth.membership_types (
    id    integer      PRIMARY KEY,
    name  varchar(20)  NOT NULL UNIQUE
);
INSERT INTO auth.membership_types
    (id, name)
VALUES
    (0, 'INTRO'),
    (1, 'FULL');

CREATE TABLE auth.user_memberships (
    user_id    uuid         NOT NULL REFERENCES auth.users(id),
    type       integer      NOT NULL REFERENCES auth.membership_types(id),
    starts_at  timestamptz  NOT NULL,
    ends_at    timestamptz  NOT NULL
);

CREATE TABLE billing.item_categories (
    id    integer      PRIMARY KEY,
    name  varchar(20)  NOT NULL UNIQUE
);
INSERT INTO billing.item_categories
    (id, name)
VALUES
    (0, 'MEMBERSHIP'),
    (1, 'COMPETITION');

CREATE TABLE billing.item_prices (
    id              uuid     PRIMARY KEY,
    category        integer  NOT NULL REFERENCES billing.item_categories(id),
    membership_type integer  REFERENCES auth.membership_types(id),
    competition_id  uuid     REFERENCES competitions.competitions(id),
    price           numeric  NOT NULL,

    CONSTRAINT price_is_positive CHECK (price > 0),
    CONSTRAINT membership_price_has_type CHECK (category != 0 OR membership_type IS NOT NULL),
    CONSTRAINT competition_price_has_id CHECK (category != 1 OR competition_id IS NOT NULL)
);

CREATE TABLE billing.payment_types (
    id    integer      PRIMARY KEY,
    name  varchar(20)  NOT NULL UNIQUE
);
INSERT INTO billing.payment_types
    (id, name)
VALUES
    (0, 'LEGACY'),
    (1, 'CREDIT_CARD'),
    (2, 'MANUAL');

CREATE TABLE billing.payments (
    id            uuid         PRIMARY KEY,
    user_id       uuid         REFERENCES auth.users(id),
    paid_amount   numeric      NOT NULL,
    payment_type  integer      NOT NULL REFERENCES billing.payment_types(id),
    payment_data  jsonb,
    received_at   timestamptz  NOT NULL DEFAULT NOW(),
    approved      boolean      NOT NULL,

    CONSTRAINT paid_amount_is_positive CHECK (paid_amount > 0),
    CONSTRAINT credit_card_payment_has_user_id CHECK (payment_type != 1 OR user_id IS NOT NULL)
);
CREATE TABLE billing.payment_items (
    payment_id  uuid          NOT NULL REFERENCES billing.payments,
    name        varchar(100)  NOT NULL,
    item_id     uuid          NOT NULL REFERENCES billing.item_prices,
    price       numeric,

    CONSTRAINT price_is_positive CHECK (price > 0)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE FUNCTION migrate_competition_prices() RETURNS void
AS $migrate_competition_prices$
    DECLARE
        comp_price record;
    BEGIN
        FOR comp_price IN SELECT * FROM billing.legacy_competition_prices
        LOOP
            INSERT INTO billing.item_prices
                (id, category, membership_type, competition_id, price)
            VALUES
                (uuid_generate_v4(), 1, NULL, comp_price.competition_id, comp_price.price);
        END LOOP;
    END;
$migrate_competition_prices$ LANGUAGE plpgsql;

SELECT migrate_competition_prices();

CREATE FUNCTION migrate_competition_payments() RETURNS void
AS $migrate_competition_payments$
    DECLARE
        payment record;
    BEGIN
        FOR payment IN SELECT * FROM billing.legacy_competition_payments
        LOOP
            INSERT INTO billing.payments
                (id, user_id, paid_amount, payment_type, payment_data, received_at, approved)
            VALUES
                (payment.id, payment.user_id, 0,
                json_build_object('invoiceId', payment.invoice_id, 'transactionId', payment.transaction_id),
                NOW(), payment.approved);

            INSERT INTO billing.payment_items
                (payment_id, item_id, price)
            VALUES
                (payment.id,
                (SELECT id FROM billing.item_prices WHERE competition_id = payment.competition_id),
                (SELECT price FROM billing.legacy_competition_prices WHERE competition_id = payment.competition_id));
        END LOOP;
    END;
$migrate_competition_payments$ LANGUAGE plpgsql;

SELECT migrate_competition_payments();

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth         TO auth;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA billing      TO billing;
