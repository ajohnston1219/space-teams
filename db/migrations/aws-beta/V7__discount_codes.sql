CREATE TABLE billing.discount_codes (
   id               serial       PRIMARY KEY,
   code             varchar(50)  NOT NULL UNIQUE,
   affiliate_id     uuid         NOT NULL REFERENCES auth.registration_sources(id)
);

CREATE TABLE billing.discount_code_ranges (
   discount_code_id  serial   NOT NULL REFERENCES billing.discount_codes,
   competition_id    uuid     NOT NULL REFERENCES competitions.competitions,
   up_to             integer  NOT NULL,
   discount_amount   numeric  NOT NULL,

   CONSTRAINT discount_less_than_one CHECK (discount_amount < 1.0),
   CONSTRAINT up_to_positive_or_neg_one CHECK (up_to = -1 OR up_to > 0)
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA billing TO billing;
