-- Add INITIAL_USER type for users who have not entered in all account info
INSERT INTO auth.user_types
    (id, name)
VALUES
    (3, 'INITIAL_USER');

-- Change constraints so that 'INITIAL_USER' only needs email, username and password
ALTER TABLE auth.users
    DROP CONSTRAINT active_user_has_dob,
    ADD CONSTRAINT full_active_user_has_dob CHECK (
        active = false OR type != 0 OR date_of_birth IS NOT NULL),

    DROP CONSTRAINT active_user_has_city,
    ADD CONSTRAINT full_active_user_has_city CHECK (
        active = false OR type !=0 OR city IS NOT NULL),

    DROP CONSTRAINT active_user_has_country,
    ADD CONSTRAINT full_active_user_has_country CHECK (
        active = false OR type !=0 OR country IS NOT NULL),

    DROP CONSTRAINT active_user_has_address,
    DROP CONSTRAINT active_user_has_zip_code,

    DROP CONSTRAINT has_first_name,
    ADD CONSTRAINT full_active_user_has_first_name CHECK (
        active = false OR type = 3 OR first_name IS NOT NULL),

    DROP CONSTRAINT has_last_name,
    ADD CONSTRAINT full_active_user_has_last_name CHECK (
        active = false OR type = 3 OR last_name IS NOT NULL),

    DROP CONSTRAINT has_type,
    ADD CONSTRAINT active_user_has_username CHECK (
        active = false OR username IS NOT NULL);
