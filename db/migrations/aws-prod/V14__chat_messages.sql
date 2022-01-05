CREATE TABLE messages.chat_channels (
    id       uuid          PRIMARY KEY,
    name     varchar(100)  NOT NULL,
    team_id  uuid          NOT NULL REFERENCES auth.teams(id),

    CONSTRAINT channel_unique_to_team UNIQUE (name, team_id)
);

CREATE TABLE messages.chat_channel_members (
    channel_id  uuid  NOT NULL REFERENCES messages.chat_channels(id),
    user_id     uuid  NOT NULL REFERENCES auth.users(id),

    PRIMARY KEY (channel_id, user_id)
);

CREATE TABLE messages.chat_messages (
    id         uuid       PRIMARY KEY,
    message    text       NOT NULL,
    sender_id  uuid       NOT NULL REFERENCES auth.users(id),
    team_id    uuid       NOT NULL REFERENCES auth.teams(id),
    channel    uuid       REFERENCES messages.chat_channels(id),
    sent_at    timestamp  NOT NULL DEFAULT NOW()
);

CREATE TABLE messages.chat_message_read_by (
    message_id  uuid     NOT NULL REFERENCES messages.chat_messages(id) ON DELETE CASCADE,
    user_id     uuid     NOT NULL REFERENCES auth.users(id),

    PRIMARY KEY (message_id, user_id)
);

CREATE TABLE messages.chat_mentions (
    message_id  uuid  NOT NULL REFERENCES messages.chat_messages(id) ON DELETE CASCADE,
    user_id     uuid  NOT NULL REFERENCES auth.users(id),

    PRIMARY KEY (message_id, user_id)
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA messages TO messages;
