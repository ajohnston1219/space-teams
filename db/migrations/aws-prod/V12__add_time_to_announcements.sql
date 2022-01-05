ALTER TABLE messages.announcements
    ADD COLUMN created_at timestamp NOT NULL DEFAULT NOW();
