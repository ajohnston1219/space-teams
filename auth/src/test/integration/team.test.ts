import TeamRepository from "../../repository/team";
import TeamService, { CreateTeamRequest } from "../../service/team";
import UserService, { CreateUserRequest } from "../../service/user";
import UserRepository from "../../repository/user";
import User, { TeamRole } from "../../model/user";
import Team, { TeamMember } from "../../model/team";
import CompetitionService from "../../external/competition";
import db, { sql } from "../../repository/database";
import sinon from "sinon";

const COMPETITION_ID = "6ee2f37d-1342-4f2c-928c-c766eb3aa1dd";

async function cleanDatabase() {
    await db.query(sql`DELETE FROM auth.users`);
    await db.query(sql`DELETE FROM auth.team_members`);
    await db.query(sql`DELETE FROM auth.teams`);
}

interface DefaultUserInfo {
    username?: string;
    email?: string;
    password?: string;
}

async function createUser(userService: UserService, {
    username = "tester-person",
    email = "tester@people.com",
    password = "SuperSecret007!"
}: DefaultUserInfo): Promise<User> {
    const request: CreateUserRequest = { username, email, password };
    return await userService.createUser(request);
}

async function createTeam(userService: UserService, teamService: TeamService): Promise<Team> {
    const user = await createUser(userService, {});
    const request: CreateTeamRequest = {
        userId: user.id,
        teamName: "my-team",
        competitionId: COMPETITION_ID
    };
    const team = await teamService.createTeam(request);
    return team;
}

describe("Team Service", () => {
    beforeAll(async () => {
        let attempts = 0;
        return new Promise<void>((resolve, reject) => {
            const interval = setInterval(() => {
                db.query(sql`SELECT`)
                    .then(() => {
                        clearInterval(interval);
                        resolve();
                    })
                    .catch(err => {
                        console.error(err);
                        ++attempts;
                        if (attempts > 3) {
                            console.error("Max attempts reached");
                            reject(err);
                        }
                    });
            }, 1000);
        });
    });

    const sandbox = sinon.createSandbox();
    let userService: UserService;
    let teamService: TeamService;
    let competitionService: CompetitionService;
    beforeEach(() => {
        userService = new UserService(new UserRepository());
        competitionService = new CompetitionService();
        teamService = new TeamService(
            new TeamRepository(), userService, competitionService
        );
    });

    afterEach(() => {
        sandbox.restore();
    });

    afterAll(() => {
        db.dispose();
    });

    it("Successfully creates a new team", async () => {
        // Arrange
        await cleanDatabase();
        sandbox.stub(competitionService, "registerTeamForCompetition")
            .callsFake(async () => {});
        const user = await createUser(userService, {});
        const request: CreateTeamRequest = {
            userId: user.id,
            teamName: "my-team",
            competitionId: COMPETITION_ID
        };

        // Act
        const team = await teamService.createTeam(request);

        // Assert
        const actual = await teamService.getTeamById(team.id);
        expect(actual).not.toBeNull();
        expect(actual?.id).toBe(team.id);
        expect(actual?.name).toBe(request.teamName);
        // NOTE(adam): Cannot test this until we are synchronizing a local view
        // expect(actual?.competitionId).toBe(request.competitionId);
        expect(actual?.members.length).toBe(1);
        const members = actual?.members;
        const expectedMember = new TeamMember(
            user.id, TeamRole.OWNER
        );
        expect(members && members[0]).toStrictEqual(expectedMember);
    });

    it("Fails to create team when competition service fails", async () => {
        // Arrange
        await cleanDatabase();
        sandbox.stub(competitionService, "registerTeamForCompetition")
            .rejects();
        const user = await createUser(userService, {});
        const request: CreateTeamRequest = {
            userId: user.id,
            teamName: "my-team",
            competitionId: COMPETITION_ID
        };

        // Act
        const act = async () => await teamService.createTeam(request);

        // Assert
        expect(act).rejects.toThrow();
        const actual = await userService.getUserById(user.id);
        expect(actual?.competitions.length).toBe(0);
    });

    it("Successfully adds a member to a team", async () => {
        // Arrange
        await cleanDatabase();
        sandbox.stub(competitionService, "registerTeamForCompetition")
            .callsFake(async () => {});
        const team = await createTeam(userService, teamService);
        const user = await createUser(userService, { username: "test-member", email: "test@members.com" });
        const teamMember = new TeamMember(user.id, TeamRole.MEMBER);

        // Act
        await teamService.addTeamMember(team.id, teamMember);

        // Assert
        const actual = await teamService.getTeamById(team.id);
        expect(actual?.members.length).toBe(2);
        const expectedMember = new TeamMember(
            user.id, TeamRole.MEMBER
        );
        const actualMember = actual?.members.find(tm => tm.userId === user.id);
        expect(actualMember).toStrictEqual(expectedMember);
    });

    it("Successfully removes a member from a team", async () => {
        // Arrange
        await cleanDatabase();
        const team = await createTeam(userService, teamService);
        const user = await createUser(userService, { username: "test-member", email: "test@members.com" });
        const teamMember = new TeamMember(user.id, TeamRole.MEMBER);
        await teamService.addTeamMember(team.id, teamMember);

        // Act
        await teamService.removeTeamMember(team.id, user.id);

        // Assert
        const actual = await teamService.getTeamById(team.id);
        expect(actual?.members.length).toBe(1);
        expect(actual?.members.some(tm => tm.userId === user.id)).toStrictEqual(false);
    });
});
