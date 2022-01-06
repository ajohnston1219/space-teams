import User, {
    UserType,
    Address,
    PhoneNumber,
    AccountInfo,
    Parent,
    ParentApprovalStatus,
    RegistrationSource,
    TeamInvite,
    InviteStatus,
    UserCompetition,
    CompetitionRole
} from "../model/user";
import { DateTime } from "luxon";
import db from "./database";
import * as q from "./queries";

function getUserType(userType: string): UserType {
    switch (userType) {
        case "USER":
            return UserType.USER;
        case "INITIAL_USER":
            return UserType.INITIAL_USER;
        case "ADMIN":
            return UserType.ADMIN;
        default:
            throw new Error(`Unrecognized user type: ${userType}`);
    }
}

function getApprovalStatus(status: string): ParentApprovalStatus {
    switch (status) {
        case "PENDING":
            return ParentApprovalStatus.PENDING;
        case "APPROVED":
            return ParentApprovalStatus.APPROVED;
        case "DENIED":
            return ParentApprovalStatus.DENIED;
        default:
            throw new Error(`Unrecognized parent consent status: ${status}`);
    }
}

function getInviteStatus(status: string): InviteStatus {
    switch (status) {
        case "ACTIVE":
            return InviteStatus.ACTIVE;
        case "ACCEPTED":
            return InviteStatus.ACCEPTED;
        case "REJECTED":
            return InviteStatus.REJECTED;
        case "REVOKED":
            return InviteStatus.REVOKED;
        default:
            throw new Error(`Unrecognized invite status: ${status}`);
    }
}

export default class UserRepository {
    public async findUserById(id: string): Promise<User | null> {
        const users = await db.query(q.findUserById(id));
        if (users.length === 0) {
            return null;
        }
        const userRow = users[0];
        const user = this.constructUser(userRow);
        return user;
    }

    public async findUserByUsername(username: string): Promise<User | null> {
        const users = await db.query(q.findUserByUsername(username));
        if (users.length === 0) {
            return null;
        }
        const userRow = users[0];
        const user = this.constructUser(userRow);
        return user;
    }

    public async findUserByEmail(email: string): Promise<User | null> {
        const users = await db.query(q.findUserByEmail(email));
        if (users.length === 0) {
            return null;
        }
        const userRow = users[0];
        const user = this.constructUser(userRow);
        return user;
    }

    public async createUser(user: User): Promise<void> {
        await db.query(q.insertNewUser(
            user.id, user.username, user.email, user.password
        ));
    }

    public async activateUser(user: User): Promise<void> {
        if (!user.accountInfo) {
            throw new Error("User must have account info to activate");
        }
        await db.query(q.insertAccountInfo(
            user.id, user.userType, user.accountInfo
        ));
    }

    private async constructUser(userRow: any): Promise<User> {
        const id = userRow.id;
        let address = null;
        if (userRow.address) {
            address = new Address(
                userRow.address, "", userRow.city, userRow.zip_code,
                userRow.state_or_province, userRow.country
            );
        }
        let accountInfo = null;
        if (address) {
            accountInfo = new AccountInfo(
                userRow.first_name, userRow.last_name,
                DateTime.fromSQL(userRow.date_of_birth), address,
                userRow.school_or_organization
            );
        }
        let parent = null;
        if (userRow.parent_first_name) {
            const phoneNumber = new PhoneNumber("", userRow.parent_phone_number);
            const approvalStatus = getApprovalStatus(userRow.parent_consent_status);
            parent = new Parent(
                userRow.parent_first_name, userRow.parent_last_name,
                userRow.parent_email, phoneNumber, approvalStatus
            );
        }
        let registrationSource = null;
        if (userRow.registration_source_id) {
            registrationSource = new RegistrationSource(
                userRow.registration_source_id,
                userRow.registration_source_name,
                userRow.registration_source_code
            );
        }
        const inviteRows = await db.query(q.getUserInvites(id));
        const invites = await Promise.all(inviteRows.map(async row => {
            const sentBy = await this.findUserById(row.sent_from);
            if (!sentBy) {
                throw new Error("Sending user not found for invite");
            }
            return new TeamInvite(
                row.team_id, row.competition_id, sentBy,
                getInviteStatus(row.status)
            )
        }));
        const teams = await db.query(q.getUserTeams(id));
        // TODO(adam): Comp roles and LP codes
        const userComps = teams.map(t => new UserCompetition(
            t.competition_id, CompetitionRole.COMPETITOR, t.team_id,
            t.team_role
        ));
        const user = new User(
            userRow.id, userRow.username, userRow.email, userRow.password,
            getUserType(userRow.user_type), accountInfo, parent, registrationSource,
            invites, userComps
        );
        return user;
    }
}
