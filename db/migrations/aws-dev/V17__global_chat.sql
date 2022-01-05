ALTER TABLE messages.chat_messages
    ADD COLUMN temp_team_id uuid REFERENCES auth.teams(id);

DO $$
DECLARE
    msg RECORD;
BEGIN
    FOR msg IN SELECT * FROM messages.chat_messages
    LOOP
        UPDATE messages.chat_messages SET temp_team_id = msg.team_id WHERE id = msg.id;
    END LOOP;
END;
$$;

ALTER TABLE messages.chat_messages
    DROP COLUMN team_id;

ALTER TABLE messages.chat_messages
    RENAME COLUMN temp_team_id TO team_id;
