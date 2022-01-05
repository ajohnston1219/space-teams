INSERT INTO auth.admins
(
	id, 
	user_id, 
	role, 
	phone_number
)
VALUES
(
	'7e33f7d7-03de-4efc-a686-1f5ae5d29adb', 
	(SELECT u.id FROM auth.users u WHERE u.username = 'adam-root'),
	(SELECT r.id FROM auth.admin_roles r WHERE r.name = 'SC_ROOT'),
	'8179012102'
);
UPDATE auth.users SET type = (SELECT id FROM auth.user_types WHERE name = 'ADMIN') WHERE username = 'adam-root';
