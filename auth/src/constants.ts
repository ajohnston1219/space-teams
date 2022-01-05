let saltRounds = () => Math.ceil(5 + (Math.random() * 5));
if (process.env.NODE_ENV === "test") {
    saltRounds = () => 3;
}
export const SALT_ROUNDS = saltRounds;

export const DEFAULT_REGISTRATION_SOURCE_ID = "4d6ae7c9-03fc-4669-8efc-8aacff2fbbf5";
