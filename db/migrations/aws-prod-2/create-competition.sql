\c spacecraft

INSERT INTO competitions.activities
    (id,
     competition_id,
     name, description,
     start_date, end_date)
VALUES
		('4ee7c9e3-115e-4849-8988-f8b12022588b',
     'bed3e27d-b1b6-45ce-b855-c55783fb8b06',
     'Spacecraft Builder', 'Design a spacecraft for interplanetary travel',
     '2021-06-28', '2022-07-03'),
    ('84f2d108-396f-45ac-a676-f99034d46a55',
     'bed3e27d-b1b6-45ce-b855-c55783fb8b06',
     'Planet Designer', 'Design a planet',
     '2021-06-28', '2022-07-03'),
    ('189ab6f6-bd51-4b5f-b3d1-73b5a07466bf',
     'bed3e27d-b1b6-45ce-b855-c55783fb8b06',
     'Orbit Designer', 'Create a trajectory to get to Vulcan',
     '2021-06-28', '2022-07-03'),
    ('ddfa728a-e3d7-4909-88d4-c8d5bec4e6b8',
     'bed3e27d-b1b6-45ce-b855-c55783fb8b06',
     'Orbital Descent', 'Pilot your lander to make it to Vulcan safely',
     '2021-06-28', '2022-07-03'),
    ('213f4f00-370a-4a80-944e-cba117887c91',
     'bed3e27d-b1b6-45ce-b855-c55783fb8b06',
     'Habitat Builder', 'Design a habitat for your crew',
     '2021-06-28', '2022-07-03'),
    ('8224105e-9568-47be-ac19-03746ef6d8fc',
     'bed3e27d-b1b6-45ce-b855-c55783fb8b06',
     'Surface Operations', 'Gather resources on Vulcan to support your habitat',
     '2021-06-28', '2022-07-03');
