import { SALT_ROUNDS } from "../constants";
import { DateTime } from "luxon";
import * as uuid from "uuid";
import bcrypt from "bcrypt";

export enum UserType {
    INITIAL_USER = "INITIAL_USER",
    USER = "USER",
    ADMIN = "ADMIN"
}

export class Address {
    constructor(
        public readonly lineOne: string,
        public readonly lineTwo: string | null,
        public readonly city: string,
        public readonly zipCode: string | null,
        public readonly stateOrProvince: string | null,
        public readonly country: string
    ) {}
}

export class AccountInfo {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly dateOfBirth: DateTime,
        public readonly address: Address,
        public readonly schoolOrOrganization: string
    ) {}
}

// TODO(adam): Formatting and tests
export class PhoneNumber {
    constructor(
        private _countryCode: string,
        private _number: string
    ) {}

    public toString(): string {
        return `+${this._countryCode}${this._number}`;
    }
}

export enum ParentApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    DENIED = "DENIED"
}

export class Parent {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: PhoneNumber,
        public readonly approvalStatus: ParentApprovalStatus 
    ) {}
}

export class RegistrationSource {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly code: string
    ) {}
}

export enum InviteStatus {
    ACTIVE = "ACTIVE",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    REVOKED = "REVOKED"
}

export class TeamInvite {
    constructor(
        public readonly teamId: string,
        public readonly competitionId: string,
        public readonly sentBy: User,
        public readonly status: InviteStatus
    ) {}

    public equals(other: TeamInvite): boolean {
        return (
            other.teamId === this.teamId &&
                other.competitionId === this.competitionId &&
                other.sentBy.id === this.sentBy.id &&
                other.status === this.status
        );
    }
}

export enum CompetitionRole {
    COMPETITOR = "COMPETITOR"
}

export enum TeamRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}

export class UserCompetition {
    constructor(
        public readonly competitionId: string,
        public readonly competitionRole: CompetitionRole,
        public readonly teamId: string,
        public readonly teamRole: TeamRole,
        public readonly learningPlatformCode?: string
    ) {}
}

export default class User {

    private _teamInvites: TeamInvite[];
    private _competitions: UserCompetition[];

    constructor(
        private _id: string,
        private _username: string,
        private _email: string,
        private _password: string,
        private _userType: UserType,
        private _accountInfo: AccountInfo | null,
        private _parent: Parent | null,
        // TODO(adam): Default value?
        private _registrationSource: RegistrationSource | null,
        _teamInvites: TeamInvite[] | null,
        _competitions: UserCompetition[] | null
    ) {
        if (this.shouldHaveAccountInfo() && _accountInfo === null) {
            throw new Error(
                `User of type ${_userType.toString()} must have account info`
            );
        }
        if (this.shouldHaveParent() && _parent === null) {
            throw new Error(
                `User of age ${this.age} should have parent`
            );
        }
        this._teamInvites = _teamInvites || [];
        this._competitions = _competitions || [];
    }

    public activate(accountInfo: AccountInfo, parent?: Parent): void {
        if (!this.canBeActivated()) {
            throw new Error(
                `User of type ${this._userType.toString()} cannot be activated`
            );
        }
        this._accountInfo = accountInfo;
        this._userType = UserType.USER;
        if (this.shouldHaveParent() && !parent) {
            throw new Error(
                `User of age ${this.age} should have parent`
            );
        }
        this._parent = parent || null;
    }

    public parentApprove(): void {
        if (!this._parent) {
            throw new Error("No parent information for this user");
        }
        this._parent = new Parent(
            this._parent.firstName,
            this._parent.lastName,
            this._parent.email,
            this._parent.phoneNumber,
            ParentApprovalStatus.APPROVED
        );
    }

    public parentDeny(): void {
        if (!this._parent) {
            throw new Error("No parent information for this user");
        }
        this._parent = new Parent(
            this._parent.firstName,
            this._parent.lastName,
            this._parent.email,
            this._parent.phoneNumber,
            ParentApprovalStatus.DENIED
        );
    }

    public joinCompetition(
        competitionId: string,
        teamId: string,
        teamRole: TeamRole
    ): void {
        if (this.isInCompetition(competitionId)) {
            throw new Error("Already in this competition");
        }
        const competition = new UserCompetition(
            competitionId, CompetitionRole.COMPETITOR, teamId, teamRole
        );
        this._competitions.push(competition);
        this._teamInvites = this._teamInvites.map(i => {
            if (i.competitionId === competitionId && i.status === InviteStatus.ACTIVE) {
                return new TeamInvite(
                    i.teamId, i.competitionId, i.sentBy, InviteStatus.REJECTED
                );
            }
            return i;
        });
    }

    public inviteToTeam(teamId: string, competitionId: string, sentBy: User): void {
        if (this.isOnTeam(teamId)) {
            throw new Error("Already a member of this team");
        }
        if (this.isInCompetition(competitionId)) {
            throw new Error("Already in this competition");
        }
        const invite = new TeamInvite(
            teamId, competitionId, sentBy, InviteStatus.ACTIVE
        );
        this._teamInvites.push(invite);
    }

    public acceptInvite(teamId: string): void {
        const invite = this._teamInvites
            .find(i => i.teamId === teamId && i.status === InviteStatus.ACTIVE);
        if (!invite) {
            throw new Error("Active invite does not exist for this team");
        }
        this.changeInviteStatus(invite, InviteStatus.ACCEPTED);
        this.joinCompetition(invite.competitionId, invite.teamId, TeamRole.MEMBER);
    }

    public rejectInvite(teamId: string): void {
        const invite = this._teamInvites
            .find(i => i.teamId === teamId && i.status === InviteStatus.ACTIVE);
        if (!invite) {
            throw new Error("Active invite does not exist for this team");
        }
        this.changeInviteStatus(invite, InviteStatus.REJECTED);
    }

    public revokeInvite(teamId: string): void {
        const invite = this._teamInvites
            .find(i => i.teamId === teamId && i.status === InviteStatus.ACTIVE);
        if (!invite) {
            throw new Error("Active invite does not exist for this team");
        }
        this.changeInviteStatus(invite, InviteStatus.REVOKED);
    }

    public leaveTeam(teamId: string): void {
        if (!this.isOnTeam(teamId)) {
            throw new Error("Not on this team");
        }
        this._competitions = this._competitions.filter(c => c.teamId !== teamId);
    }

    public assignLearningPlatformCode(code: string, competitionId: string) {
        const competition = this._competitions
            .find(c => c.competitionId === competitionId);
        if (!competition) {
            throw new Error("User not in this competition");
        }
        if (competition.learningPlatformCode) {
            throw new Error("Learning platform code already assigned for this user");
        }
        this._competitions = this._competitions.map(c => {
            if (c.competitionId === competitionId) {
                return new UserCompetition(
                    c.competitionId, c.competitionRole, c.teamId, c.teamRole, code
                );
            }
            return c;
        });
    }

    public getLearningPlatformCode(competitionId: string): string | null {
        const competition = this._competitions
            .find(c => c.competitionId === competitionId);
        if (!competition) {
            throw new Error("User not in this competition");
        }
        return competition.learningPlatformCode || null;
    }

    public updateAccountInfo(accountInfo: AccountInfo): void {
        if (this._accountInfo === null) {
            throw new Error("Cannot update non-existant account info");
        }
        this._accountInfo = accountInfo;
    }

    public updateParent(
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: PhoneNumber
    ): void {
        if (this._parent === null) {
            throw new Error("Cannot update non-existant parent");
        }
        this._parent = new Parent(
            firstName, lastName, email, phoneNumber, this._parent.approvalStatus
        );
    }

    public async checkPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this._password);
    }

    private changeInviteStatus(invite: TeamInvite, status: InviteStatus): void {
        this._teamInvites = this._teamInvites.map(i => {
            if (i.equals(invite)) {
                return new TeamInvite(
                    invite.teamId, invite.competitionId, invite.sentBy, status
                );
            }
            return i;
        });
    }

    private shouldHaveAccountInfo(): boolean {
        return this._userType !== UserType.INITIAL_USER;
    }

    private shouldHaveParent(): boolean {
        return (
            this._userType !== UserType.INITIAL_USER &&
                this.age <= 13
        );
    }

    private canBeActivated(): boolean {
        return this._userType === UserType.INITIAL_USER;
    }

    private isOnTeam(teamId: string) {
        return this._competitions.some(c => c.teamId === teamId);
    }

    private isInCompetition(competitionId: string) {
        return this._competitions.some(c => c.competitionId === competitionId);
    }

    public get age(): number {
        if (this.accountInfo === null) {
            throw new Error(
                `User of type ${this._userType.toString()} does not have an age`
            );
        }
        const diff = DateTime.now()
            .diff(this.accountInfo.dateOfBirth, "years")
            .toObject();
        if (!diff.years) {
            throw new Error("Age calculation error");
        }
        return Math.floor(diff.years);
    }

    public get id(): string { return this._id; }
    public get username(): string { return this._username; }
    public get email(): string { return this._email; }
    public get password(): string { return this._password; }
    public get userType(): UserType { return this._userType; }
    public get accountInfo(): AccountInfo | null { return this._accountInfo; }
    public get parent(): Parent | null { return this._parent; }
    public get parentConsent(): boolean {
        if (this._userType === UserType.INITIAL_USER) {
            return false;
        }
        if (!this.shouldHaveParent()) {
            return true;
        }
        return (
            this._parent !== null &&
                (this._parent.approvalStatus === ParentApprovalStatus.APPROVED)
        );
    }
    public get registrationSource(): RegistrationSource | null {
        return this._registrationSource;
    }
    public get teamInvites(): TeamInvite[] { return this._teamInvites; }
    public get competitions(): UserCompetition[] { return this._competitions; }
}

export class UserFactory {
    public static async createInitial(
        username: string,
        email: string,
        password: string,
        registrationSource?: RegistrationSource
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS());
        const user = new User(
            UserFactory.generateId(),
            username,
            email,
            hashedPassword,
            UserType.INITIAL_USER,
            null,
            null,
            registrationSource || null,
            null,
            null
        );
        return user;
    }

    public static createParent(
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: PhoneNumber
    ): Parent {
        return new Parent(
            firstName,
            lastName,
            email,
            phoneNumber,
            ParentApprovalStatus.PENDING
        );
    }

    private static generateId(): string { return uuid.v4(); }
}
