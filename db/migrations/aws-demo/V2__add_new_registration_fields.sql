ALTER TABLE auth.users
    ADD COLUMN address   varchar(100),
    ADD COLUMN zip_code  varchar(20),
    ADD CONSTRAINT active_user_has_address CHECK (
        active = false OR address IS NOT NULL),
    ADD CONSTRAINT active_user_has_zip_code CHECK (
        active = false OR zip_code IS NOT NULL);

-- Fix constraints for inactive users
ALTER TABLE auth.users
    DROP CONSTRAINT regular_user_has_dob,
    DROP CONSTRAINT regular_user_has_city,
    DROP CONSTRAINT regular_user_has_country,
    ADD CONSTRAINT active_user_has_dob CHECK (
        active = false OR type != 0 OR date_of_birth IS NOT NULL),
    ADD CONSTRAINT active_user_has_city CHECK (
        active = false OR type !=0 OR city IS NOT NULL),
    ADD CONSTRAINT active_user_has_country CHECK (
        active = false OR type !=0 OR country IS NOT NULL);
