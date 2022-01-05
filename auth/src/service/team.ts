import TeamRepository from "../repository/team";
import Team, { TeamFactory, TeamMember } from "../model/team";
import UserService from "./user";
import { TeamRole } from "../model/user";

export interface CreateTeamRequest {
    userId: string;
    teamName: string;
    competitionId: string;
}

export default class TeamService {
    constructor(
        private teamRepository: TeamRepository,
        private userService: UserService
    ) {}

    public async createTeam(request: CreateTeamRequest): Promise<Team> {
        // TODO(adam): Coordinate with competition service
        const team = TeamFactory.createTeam(
            request.userId, request.teamName, request.competitionId
        );
        const user = await this.userService.getUserById(request.userId);
        if (user === null) {
            throw new Error("User not found");
        }
        // NOTE(adam): This currently isn't being persisted as it is derived
        //             from the team_members table, which is persisted inside
        //             the createTeam function. We call this function to check
        //             the invariants around a user joining a competition.
        user.joinCompetition(request.competitionId, team.id, TeamRole.OWNER);

        await this.teamRepository.createTeam(team);
        return team;
    }

    public async addTeamMember(teamId: string, member: TeamMember): Promise<void> {
        await this.teamRepository.addTeamMember(teamId, member);
    }

    public async removeTeamMember(teamId: string, userId: string): Promise<void> {
        await this.teamRepository.removeTeamMember(teamId, userId);
    }

    public async getTeamById(id: string): Promise<Team| null> {
        return await this.teamRepository.findTeamById(id);
    }
}
