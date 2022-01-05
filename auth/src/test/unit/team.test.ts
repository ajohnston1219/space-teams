import Team, {
    TeamFactory,
    TeamMember,
} from "../../model/team";
import { TeamRole } from "../../model/user";
import * as uuid from "uuid";

interface DefaultTeamInfo {
    ownerId?: string;
    name?: string;
    competitionId?: string;
}

function createTeam({
    ownerId = uuid.v4(),
    name = "my-team",
    competitionId = uuid.v4()
}: DefaultTeamInfo): Team {
    return TeamFactory.createTeam(ownerId, name, competitionId);
}

describe("TeamFactory", () => {
    it("Successfully creates a new team", () => {
        // Arrange
        const ownerId = uuid.v4();
        const name = "my-team";
        const competitionId = uuid.v4();
        const expected = new TeamMember(ownerId, TeamRole.OWNER);

        // Act
        const team = TeamFactory.createTeam(ownerId, name, competitionId);

        // Assert
        expect(team.name).toBe(name);
        expect(team.competitionId).toBe(competitionId);
        expect(team.members.length).toBe(1);
        expect(team.members[0]).toStrictEqual(expected);
        expect(team.active).toBe(true);
    });
});

describe("Team", () => {
    it("Successfully adds member", () => {
        // Arrange
        const team = createTeam({});
        const userId = uuid.v4();
        const member = new TeamMember(userId, TeamRole.MEMBER);

        // Act
        team.addMember(member);

        // Assert
        expect(team.members.length).toBe(2);
        expect(team.isMember(userId)).toBe(true);
    });

    it("Cannot add member when already on team", () => {
        // Arrange
        const team = createTeam({});
        const userId = uuid.v4();
        const member = new TeamMember(userId, TeamRole.MEMBER);
        team.addMember(member);

        // Act
        const act = () => team.addMember(member);

        // Assert
        expect(act).toThrow();
    });

    it("Successfully removes member", () => {
        // Arrange
        const team = createTeam({});
        const userId = uuid.v4();
        const member = new TeamMember(userId, TeamRole.MEMBER);
        team.addMember(member);

        // Act
        team.removeMember(userId);

        // Assert
        expect(team.members.length).toBe(1);
        expect(team.isMember(userId)).toBe(false);
    });

    it("Cannot remove owner", () => {
        // Arrange
        const ownerId = uuid.v4();
        const team = createTeam({ ownerId });

        // Act
        const act = () => team.removeMember(ownerId);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot remove member not already on team", () => {
        // Arrange
        const userId = uuid.v4();
        const team = createTeam({});

        // Act
        const act = () => team.removeMember(userId);

        // Assert
        expect(act).toThrow();
    });

    it("Successfully marks team as deleted", () => {
        // Arrange
        const team = createTeam({});

        // Act
        team.markAsDeleted();

        // Assert
        expect(team.active).toBe(false);
    });
});
