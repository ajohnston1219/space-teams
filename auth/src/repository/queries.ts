import { AccountInfo, UserType } from "../model/user";
import { sql, SQLQuery } from "./database";
import { DEFAULT_REGISTRATION_SOURCE_ID } from "../constants";

export const findUserById = (id: string): SQLQuery => sql`
SELECT
u.*,
(SELECT name FROM auth.user_types WHERE id = u.type) AS user_type,
p.first_name AS parent_first_name,
p.last_name AS parent_last_name,
p.email AS parent_email,
p.phone_number AS parent_phone_number,
(SELECT name FROM auth.parent_consent_status WHERE id = p.consent_status)
AS parent_consent_status,
r.id AS registration_source_id,
r.name AS registration_source_name,
r.code AS registration_source_code
FROM auth.users u
LEFT JOIN auth.parents p ON p.user_id = u.id
JOIN auth.registration_sources r ON r.id = u.registration_source
WHERE u.id = ${id}`;

export const getUserInvites = (userId: string): SQLQuery => sql`
SELECT ti.*, (SELECT name FROM auth.invite_status WHERE id = ti.status) AS status
FROM auth.team_invites ti
WHERE ti.sent_to = ${userId}`;

export const getUserTeams = (userId: string): SQLQuery => sql`
SELECT t.*, tm.team_id,
(SELECT name FROM auth.team_roles WHERE id = tm.role) AS team_role,
ct.competition_id
FROM auth.team_members tm
JOIN auth.teams t ON t.id = tm.team_id
JOIN competition_teams ct ON t.id = ct.team_id
WHERE tm.user_id = ${userId}`;

export const insertNewUser = (
    id: string,
    username: string,
    email: string,
    password: string
): SQLQuery => sql`
INSERT INTO auth.users (id, username, email, password, registration_source, type)
VALUES (${id}, ${username}, ${email}, ${password}, ${DEFAULT_REGISTRATION_SOURCE_ID},
(SELECT id FROM auth.user_types WHERE name = 'INITIAL_USER'))`;

export const insertAccountInfo = (
    id: string,
    newType: UserType,
    accountInfo: AccountInfo 
): SQLQuery => sql`
UPDATE auth.users SET
type = (SELECT id FROM auth.user_types WHERE name = ${newType.toString()}),
first_name = ${accountInfo.firstName},
last_name = ${accountInfo.lastName},
date_of_birth = ${accountInfo.dateOfBirth},
address = ${accountInfo.address.lineOne},
city = ${accountInfo.address.city},
state_or_province = ${accountInfo.address.stateOrProvince},
zip_code = ${accountInfo.address.zipCode},
country = ${accountInfo.address.country},
school_or_organization = ${accountInfo.schoolOrOrganization}
WHERE id = ${id}`;
