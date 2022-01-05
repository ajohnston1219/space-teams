CREATE ROLE spacecraft   LOGIN INHERIT;
CREATE ROLE app          LOGIN;
CREATE ROLE auth         LOGIN INHERIT;
CREATE ROLE sims         LOGIN INHERIT;
CREATE ROLE competitions LOGIN INHERIT;
CREATE ROLE messages     LOGIN INHERIT;
CREATE ROLE resources    LOGIN INHERIT;
CREATE ROLE billing      LOGIN INHERIT;

GRANT app TO auth;
GRANT app TO sims;
GRANT app TO competitions;
GRANT app TO messages;
GRANT app TO resources;
GRANT app TO billing;
GRANT spacecraft TO postgres;
GRANT auth TO postgres;
GRANT sims TO postgres;
GRANT competitions TO postgres;
GRANT messages TO postgres;
GRANT resources TO postgres;
GRANT billing TO postgres;

CREATE DATABASE spacecraft WITH
    OWNER spacecraft
    ENCODING 'UTF8'
    CONNECTION LIMIT -1;

GRANT ALL PRIVILEGES ON DATABASE spacecraft TO spacecraft;
GRANT ALL PRIVILEGES ON DATABASE spacecraft TO postgres;

\c spacecraft
CREATE SCHEMA auth         AUTHORIZATION auth;
CREATE SCHEMA sims         AUTHORIZATION sims;
CREATE SCHEMA competitions AUTHORIZATION competitions;
CREATE SCHEMA messages     AUTHORIZATION messages;
CREATE SCHEMA resources    AUTHORIZATION resources;
CREATE SCHEMA billing      AUTHORIZATION billing;
