ALTER TABLE auth.users
    ADD COLUMN address   varchar(100),
    ADD COLUMN zip_code  varchar(20);
