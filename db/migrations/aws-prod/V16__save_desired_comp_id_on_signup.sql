ALTER TABLE auth.users
    ADD COLUMN desired_competition_id uuid REFERENCES competitions.competitions(id);
