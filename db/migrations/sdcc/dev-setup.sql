\c spacecraft

INSERT INTO auth.applications
    (id, name, api_key)
VALUES
    ('a79a770d-19ce-4573-b567-7983d30de858', 'application',  'SPACECRAFT-KEY');

INSERT INTO auth.registration_sources
    (id,                                      name,                code)
VALUES
    ('4d6ae7c9-03fc-4669-8efc-8aacff2fbbf5', 'Space Teams',       'ST'),
    ('62736b74-2b9e-4921-8180-52e09f39ad74', 'Texas Space Grant', 'TSG'),
    ('de808080-8037-4f36-ad99-4f48f9514402', 'One Giant Leap',    'OGL'),
    ('c65607fc-30e3-4703-bf68-fc92ee0c9357', 'Future Tech Live',  'FTL');

INSERT INTO auth.organizations
    (id, name, contact_first_name, contact_last_name, contact_email, phone_number,
     address, country, city, state_or_province, zip_code)
VALUES
    ('edebd9e3-1f1b-4c51-b807-9c187ed3a984', 'Texas Space Grant',
     'Adam', 'Johnston', 'ajohnston1219@gmail.com', '8179012102',
     '123 Sesame St', 'United States of America', 'Dallas', 'TX', '75204');

INSERT INTO competitions.competitions
    (id,
     organization_id,
     name, start_date, end_date)
VALUES
    ('6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'edebd9e3-1f1b-4c51-b807-9c187ed3a984',
     'Space Teams', '2021-07-23', '2022-08-23');

INSERT INTO competitions.leagues
    (id,                                      competition_id,                         name)
VALUES
    ('200de15d-223f-423f-a627-81d1c167f308', '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd', 'Elementary'),
    ('99be27fe-8273-43b5-8694-e28c60aee32b', '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd', 'Middle School'),
    ('6f65fc1b-03c4-485a-b0f2-e30f2f1160a6', '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd', 'High School');

INSERT INTO competitions.activities
    (id,
     competition_id,
     name, description,
     start_date, end_date)
VALUES
    ('6316388b-4751-4fb7-bbaf-c568365cebfb',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Spacecraft Builder', 'Design a spacecraft for interplanetary travel',
     '2021-07-23', '2022-08-23');

INSERT INTO billing.competition_prices
    (competition_id,                         price)
VALUES
    ('6ee2f37d-1342-4f2c-928c-c766eb3aa1dd', 100.0);
