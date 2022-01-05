CREATE TABLE auth.learning_platform_codes (
    user_id      uuid         REFERENCES auth.users(id),
    code         varchar(50)  PRIMARY KEY,
    is_assigned  boolean      NOT NULL DEFAULT false,

    CONSTRAINT assigned_code_has_user_id CHECK (NOT is_assigned OR user_id IS NOT NULL),
    CONSTRAINT unassigned_code_has_no_user_id CHECK (is_assigned OR user_id IS NULL)
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO auth;
