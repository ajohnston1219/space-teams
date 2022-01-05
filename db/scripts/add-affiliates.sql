CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DO $$
BEGIN
	FOR counter in 1..100 LOOP
		INSERT INTO auth.registration_sources 
			(id, name, code)
		VALUES
			(uuid_generate_v4(), 'Ref' || LPAD(counter::text, 3, '0'), 'Ref' || LPAD(counter::text, 3, '0'));
	END LOOP;
END; $$
