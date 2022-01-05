INSERT INTO competitions.leagues
    (id,                                      competition_id,                         name)
VALUES
    ('200de15d-223f-423f-a627-81d1c167f308', '57cc0dc5-4959-4334-b4b9-0b10fca18ec9', 'Elementary'),
    ('99be27fe-8273-43b5-8694-e28c60aee32b', '57cc0dc5-4959-4334-b4b9-0b10fca18ec9', 'Middle School'),
    ('6f65fc1b-03c4-485a-b0f2-e30f2f1160a6', '57cc0dc5-4959-4334-b4b9-0b10fca18ec9', 'High School');

INSERT INTO competitions.activities
    (id,
     competition_id,
     name, description,
     start_date, end_date)
VALUES
    ('6316388b-4751-4fb7-bbaf-c568365cebfb',
     '57cc0dc5-4959-4334-b4b9-0b10fca18ec9',
     'Spacecraft Builder', 'Design a spacecraft for interplanetary travel',
     '2021-01-01', '2022-01-01'),
    ('267f8862-6124-4b5c-9a89-72a84677b4a2',
     '57cc0dc5-4959-4334-b4b9-0b10fca18ec9',
     'Planet Designer', 'Design a planet',
     '2021-01-01', '2022-01-01'),
    ('dd417d4e-4655-4a53-9fc1-e0b5a658f208',
     '57cc0dc5-4959-4334-b4b9-0b10fca18ec9',
     'Orbit Designer', 'Create a trajectory to get to Vulcan',
     '2021-01-01', '2022-01-01'),
    ('189a61bd-020b-4199-95f6-7827386d3741',
     '57cc0dc5-4959-4334-b4b9-0b10fca18ec9',
     'Orbital Descent', 'Pilot your lander to make it to Vulcan safely',
     '2021-01-01', '2022-01-01'),
    ('b7d1a073-b742-4f94-b80d-cd607c0fe2ee',
     '57cc0dc5-4959-4334-b4b9-0b10fca18ec9',
     'Habitat Builder', 'Design a habitat for your crew',
     '2021-01-01', '2022-01-01'),
    ('f159b870-6022-499a-885e-631bb681fc97',
     '57cc0dc5-4959-4334-b4b9-0b10fca18ec9',
     'Surface Operations', 'Gather resources on Vulcan to support your habitat',
     '2021-01-01', '2022-01-01');
