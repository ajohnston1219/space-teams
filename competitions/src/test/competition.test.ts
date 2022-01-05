import Competition, {
    CompetitionFactory
} from "../model/competition";

describe("CompetitionFactory", () => {
    it("Successfully creates a new competition", () => {
        // Arrange
        const name = "Some Competition";
        
        // Act
        const competition = CompetitionFactory.createCompetition(name);

        // Assert
        expect(competition.name).toBe(name);
    });
});
