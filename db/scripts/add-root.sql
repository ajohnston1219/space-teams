INSERT INTO auth.admins
(
	id, 
	user_id, 
	role, 
	first_name, 
	last_name, 
	phone_number
)
VALUES
(
	'7e33f7d7-03de-4efc-a686-1f5ae5d29adb', 
	(SELECT u.id FROM auth.users u WHERE u.username = 'root'),
	(SELECT r.id FROM auth.admin_roles r WHERE r.name = 'SC_ROOT'),
	'Adam',
	'Johnston',
	'8179012102'
);
UPDATE auth.users SET type = (SELECT id FROM auth.user_types WHERE name = 'ADMIN') WHERE username = 'root';
