ALTER TABLE messages.chat_messages
    ADD COLUMN competition_id uuid REFERENCES competitions.competitions(id);

DO $$
DECLARE
    msg RECORD;
BEGIN
    FOR msg IN SELECT * FROM messages.chat_messages WHERE team_id IS NULL
    LOOP
        UPDATE messages.chat_messages
        SET competition_id = '6ee2f37d-1342-4f2c-928c-c766eb3aa1dd'
        WHERE id = msg.id;
    END LOOP;
END;
$$;

ALTER TABLE messages.chat_messages
    ADD CONSTRAINT global_chat_message_has_comp_id CHECK (team_id IS NOT NULL OR competition_id IS NOT NULL);
