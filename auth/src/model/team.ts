import { TeamRole } from "./user";
import * as uuid from "uuid";

export class TeamMember {
    constructor(
        public readonly userId: string,
        public readonly role: TeamRole
    ) {}
}

export default class Team {
    constructor(
        private _id: string,
        private _name: string,
        private _competitionId: string,
        private _active: boolean,
        private _members: TeamMember[]
    ) {}

    public addMember(member: TeamMember) {
        if (this.isMember(member.userId)) {
            throw new Error("User is already a member of this team");
        }
        this._members.push(member);
    }

    public removeMember(userId: string) {
        const member = this._members.find(m => m.userId === userId);
        if (!member) {
            throw new Error("User is not a member of this team");
        }
        if (member.role === TeamRole.OWNER) {
            throw new Error("Owner cannot leave the team");
        }
        this._members = this._members.filter(m => m.userId !== userId);
    }

    public isMember(userId: string) {
        return this._members.some(m => m.userId === userId);
    }

    public markAsDeleted() { this._active = false; }

    public get id(): string { return this._id; }
    public get name(): string { return this._name; }
    public get competitionId(): string { return this._competitionId; }
    public get active(): boolean { return this._active; }
    public get members(): TeamMember[] { return this._members; }
}

export class TeamFactory {
    public static createTeam(ownerId: string, name: string, competitionId: string): Team {
        const member = new TeamMember(ownerId, TeamRole.OWNER);
        return new Team(
            this.generateId(),
            name,
            competitionId,
            true,
            [member]
        );
    }

    private static generateId() { return uuid.v4(); }
}
