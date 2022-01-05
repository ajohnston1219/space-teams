ALTER ROLE  auth          WITH password 'spacecraft';
ALTER ROLE  sims          WITH password 'spacecraft';
ALTER ROLE  competitions  WITH password 'spacecraft';
ALTER ROLE  messages      WITH password 'spacecraft';
ALTER ROLE  resources     WITH password 'spacecraft';
ALTER ROLE  billing       WITH password 'spacecraft';

\c spacecraft

INSERT INTO auth.applications
    (id, name, api_key)
VALUES
    ('cc5568d0-c827-4cb0-aaf4-ff371952a817', 'application', 'SPACECRAFT-KEY');

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
    ('04aede91-e4ed-4524-a1e4-9de8a72fb56a',
     'edebd9e3-1f1b-4c51-b807-9c187ed3a984',
     'Old Competition', '2020-08-01', '2020-09-01'),
    ('6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'edebd9e3-1f1b-4c51-b807-9c187ed3a984',
     'Space Teams', '2021-01-01', '2022-01-01'),
    ('91ac659b-2fc0-4561-9ba5-9e2bb1ccaf66',
     'edebd9e3-1f1b-4c51-b807-9c187ed3a984',
     'Other Competition', '2020-09-01', '2021-02-01'),
    ('e9e9ccb0-fe26-4e90-a174-005f14d37976',
     'edebd9e3-1f1b-4c51-b807-9c187ed3a984',
     'Upcoming Competition', '2021-07-01', '2022-01-01');

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
     '2021-01-01', '2022-01-01'),
    ('267f8862-6124-4b5c-9a89-72a84677b4a2',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Planet Designer', 'Design a planet',
     '2021-01-01', '2022-01-01'),
    ('dd417d4e-4655-4a53-9fc1-e0b5a658f208',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Orbit Designer', 'Create a trajectory to get to Vulcan',
     '2021-01-01', '2022-01-01'),
    ('54bb0c32-e293-4199-9221-2eeadd0631f9',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Remote Sensing', 'Design an orbit to scan Vulcan for resources',
     '2021-01-01', '2022-01-01'),
    ('189a61bd-020b-4199-95f6-7827386d3741',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Orbital Descent', 'Pilot your lander to make it to Vulcan safely',
     '2021-01-01', '2022-01-01'),
    ('b7d1a073-b742-4f94-b80d-cd607c0fe2ee',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Habitat Builder', 'Design a habitat for your crew',
     '2021-01-01', '2022-01-01'),
    ('f159b870-6022-499a-885e-631bb681fc97',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Surface Operations', 'Gather resources on Vulcan to support your habitat',
     '2021-01-01', '2022-01-01');

INSERT INTO billing.competition_prices
    (competition_id,                         price)
VALUES
    ('6ee2f37d-1342-4f2c-928c-c766eb3aa1dd', 100.0),
    ('e9e9ccb0-fe26-4e90-a174-005f14d37976', 249.0);
