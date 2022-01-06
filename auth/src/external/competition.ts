import Team from "../model/team";

export default interface CompetitionService {
    registerTeamForCompetition(competitionId: string, team: Team): Promise<void>;
}

export default class CompetitionService {
    public async registerTeamForCompetition(competitionId: string, team: Team): Promise<void> {
        return;
    }
}
