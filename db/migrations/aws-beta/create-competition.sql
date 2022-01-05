\c spacecraft

INSERT INTO auth.organizations
    (id, name, contact_first_name, contact_last_name, 
		 contact_email, phone_number, address,
		 city, zip_code, country)
VALUES
    ('edebd9e3-1f1b-4c51-b807-9c187ed3a984', 'Texas Space Grant', 
		 'Adam', 'Johnston', 'ajohnston1219@gmail.com', '5555555555',
		 '123 Sesame St', 'Dallas', '75204', 'United States of America');

INSERT INTO competitions.competitions
    (id,
     organization_id,
     name, start_date, end_date)
VALUES
    ('6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'edebd9e3-1f1b-4c51-b807-9c187ed3a984',
     'Texas Space Grant Space Teams Competition', 
		 '2021-06-14', '2022-06-23');

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
     '2021-06-14', '2022-06-23'),
    ('267f8862-6124-4b5c-9a89-72a84677b4a2',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Planet Designer', 'Design a planet',
     '2021-06-14', '2022-06-23'),
    ('dd417d4e-4655-4a53-9fc1-e0b5a658f208',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Orbit Designer', 'Create a trajectory to get to Vulcan',
     '2021-06-14', '2022-06-23'),
    ('189a61bd-020b-4199-95f6-7827386d3741',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Orbital Descent', 'Pilot your lander to make it to Vulcan safely',
     '2021-06-14', '2022-06-23'),
    ('b7d1a073-b742-4f94-b80d-cd607c0fe2ee',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Habitat Builder', 'Design a habitat for your crew',
     '2021-06-14', '2022-06-23'),
    ('f159b870-6022-499a-885e-631bb681fc97',
     '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd',
     'Surface Operations', 'Gather resources on Vulcan to support your habitat',
     '2021-06-14', '2022-06-23');

INSERT INTO billing.competition_prices
    (competition_id,                         price)
VALUES
    ('6ee2f37d-1342-4f2c-928c-c766eb3aa1dd', 249.00);
