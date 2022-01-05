import Team, {
    TeamMember
} from "../model/team";
import { TeamRole } from "../model/user";
import db from "./database";
import * as q from "./queries";

function getTeamMemberRole(role: string): TeamRole {
    switch (role) {
        case "OWNER":
            return TeamRole.OWNER;
        case "ADMIN":
            return TeamRole.ADMIN;
        case "MEMBER":
            return TeamRole.MEMBER;
        default:
            throw new Error(`Unrecognized team role: ${role}`);
    }
}

export default class TeamRepository {
    public async findTeamById(id: string): Promise<Team | null> {
        const teams = await db.query(q.findTeamById(id));
        if (teams.length === 0) {
            return null;
        }
        const teamRow = teams[0];
        const teamMemberRows = await db.query(q.findTeamMembersByTeamId(id));
        const teamMembers = teamMemberRows.map(row => new TeamMember(
            row.user_id, getTeamMemberRole(row.role)
        ));
        const team = new Team(
            id, teamRow.name, teamRow.competition_id, teamRow.active, teamMembers
        );
        return team;
    }

    public async createTeam(team: Team): Promise<void> {
        if (team.members.length === 0) {
            throw new Error("Team must have at least one member");
        }
        if (!team.members.some(tm => tm.role === TeamRole.OWNER)) {
            throw new Error("Team must have an owner");
        }
        await db.query(q.insertTeam(team.id, team.name));
        // NOTE(adam): Will we ever create a team with multiple members?
        await Promise.all(team.members.map(async tm => {
            await db.query(q.addTeamMember(team.id, tm.userId, tm.role));
        }));
    }

    public async addTeamMember(teamId: string, member: TeamMember): Promise<void> {
        const team = await db.query(q.findTeamById(teamId));
        if (team === null) {
            throw new Error("Team not found");
        }
        await db.query(q.addTeamMember(teamId, member.userId, member.role));
    }

    public async removeTeamMember(teamId: string, userId: string): Promise<void> {
        const team = await db.query(q.findTeamById(teamId));
        if (team === null) {
            throw new Error("Team not found");
        }
        await db.query(q.removeTeamMember(teamId, userId));
    }
}
