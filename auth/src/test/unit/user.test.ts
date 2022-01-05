import User, {
    UserFactory,
    UserType,
    RegistrationSource,
    Address,
    AccountInfo,
    Parent,
    PhoneNumber,
    TeamInvite,
    UserCompetition,
    InviteStatus,
    CompetitionRole,
    ParentApprovalStatus,
    TeamRole
} from "../../model/user";
import { DateTime } from "luxon";
import * as uuid from "uuid";
import crypto from "crypto";

function createDateOfBirthFromAge(age: number): DateTime {
    const now = DateTime.now();
    const birthYear = now.year - age;
    const dateOfBirth = DateTime.fromObject({ month: 1, day: 1, year: birthYear });
    return dateOfBirth;
}

interface DefaultInitialUserInfo {
    username?: string;
    email?: string;
    password?: string;
}

async function createInitialUser({
    username = "test-person",
    email = "test.person@gmail.com",
    password = "SuperSecret007!"
}: DefaultInitialUserInfo): Promise<User> {
    return await UserFactory.createInitial(username, email, password);
}

interface DefaultAccountInfo {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: DateTime;
    addressLineOne?: string;
    addressLineTwo?: string;
    city?: string;
    zipCode?: string;
    state?: string;
    country?: string;
    school?: string;
}

function createAccountInfo({
    firstName = "Test",
    lastName = "McTesterson",
    dateOfBirth = DateTime.fromISO("2007-12-19"),
    addressLineOne = "2407 Pedernales Dr",
    addressLineTwo = "D",
    city = "College Station",
    zipCode = "77845",
    state = "TX",
    country = "US",
    school = "Texas A&M University"
}: DefaultAccountInfo): AccountInfo {
    const address = new Address(
        addressLineOne, addressLineTwo,
        city, zipCode, state, country
    );
    return new AccountInfo(
        firstName, lastName, dateOfBirth,
        address, school
    );
}

interface DefaultParentInfo {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: PhoneNumber;
}

function createParent({
    firstName = "Bob",
    lastName = "Fatherson",
    email = "bob.fatherson@yahoo.com",
    phoneNumber = new PhoneNumber("1", "2145551234")
}: DefaultParentInfo): Parent {
    return UserFactory.createParent(firstName, lastName, email, phoneNumber);
}

interface DefaultUserInfo {
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: DateTime;
    addressLineOne?: string;
    addressLineTwo?: string;
    city?: string;
    zipCode?: string;
    state?: string;
    country?: string;
    school?: string;
}

export async function createActiveUser({
    username = "test-person",
    email = "test.person@gmail.com",
    password = "SuperSecret007!",
    firstName = "Test",
    lastName = "McTesterson",
    dateOfBirth = DateTime.fromISO("2007-12-19"),
    addressLineOne = "2407 Pedernales Dr",
    addressLineTwo = "D",
    city = "College Station",
    zipCode = "77845",
    state = "TX",
    country = "US",
    school = "Texas A&M University"
}: DefaultUserInfo): Promise<User> {
    const user = await UserFactory.createInitial(username, email, password);
    user.activate(
        createAccountInfo({
            firstName, lastName, dateOfBirth,
            addressLineOne, addressLineTwo, city, zipCode,
            state, country, school
        }),
        createParent({})
    );
    return user
}

describe("User Factory", () => {
    it("Creates initial user successfully", async () => {
        // Arrange
        const username = "test-person";
        const email = "test.person@gmail.com";
        const password = "SuperSecret007!";
        const registrationSource = new RegistrationSource(
            "123", "Some Website", "WEB"
        );

        // Act
        const newUser = await UserFactory.createInitial(
            username, email, password, registrationSource
        );

        // Assert
        expect(newUser.username).toBe(username);
        expect(newUser.email).toBe(email);
        expect(newUser.registrationSource).toStrictEqual(registrationSource);
        expect(newUser.teamInvites).toStrictEqual([]);
        expect(newUser.userType).toBe(UserType.INITIAL_USER);
    });
});

describe("User", () => {
    it("Successfully checks correct password", async () => {
        // Arrange
        const password = "SuperSecret007!";
        const user = await createActiveUser({ password });

        // Act
        const result = await user.checkPassword(password);

        // Assert
        expect(result).toBe(true);
    });

    it("Successfully checks incorrect password", async () => {
        // Arrange
        const password = "SuperSecret007!";
        const user = await createActiveUser({ password });

        // Act
        const result = await user.checkPassword("WrongPassword");

        // Assert
        expect(result).toBe(false);
    });

    it("Correctly calculates age", async () => {
        // Arrange
        const expected = 13;
        const dateOfBirth = createDateOfBirthFromAge(expected);
        const user = await createActiveUser({ dateOfBirth });

        // Act
        const age = user.age;

        // Assert
        expect(age).toBe(expected);
    });

    it("Activates normal user over 13 and adds account info", async () => {
        // Arrange
        const user = await createInitialUser({});
        const firstName = "Test";
        const lastName = "McTesterson";
        const dateOfBirth = createDateOfBirthFromAge(14);
        const address = new Address(
            "2407 Pedernales Dr", "D",
            "College Station",
            "77845", "TX", "US"
        );
        const school = "Texas A&M University";
        const accountInfo = new AccountInfo(
            firstName, lastName, dateOfBirth,
            address, school
        );

        // Act
        user.activate(accountInfo);

        // Assert
        expect(user.accountInfo).toStrictEqual(accountInfo);
        expect(user.userType).toBe(UserType.USER);
    });

    it("Activates normal user under 13 and adds account and parent info", async () => {
        // Arrange
        const user = await createInitialUser({});
        const firstName = "Test";
        const lastName = "McTesterson";
        const dateOfBirth = createDateOfBirthFromAge(12);
        const address = new Address(
            "2407 Pedernales Dr", "D",
            "College Station",
            "77845", "TX", "US"
        );
        const school = "Texas A&M University";
        const accountInfo = new AccountInfo(
            firstName, lastName, dateOfBirth,
            address, school
        );
        const parent = createParent({});

        // Act
        user.activate(accountInfo, parent);

        // Assert
        expect(user.accountInfo).toStrictEqual(accountInfo);
        expect(user.parent).toStrictEqual(parent);
        expect(user.userType).toBe(UserType.USER);
    });

    it("Cannot activate user under 13 without parent info", async () => {
        // Arrange
        const user = await createInitialUser({});
        const firstName = "Test";
        const lastName = "McTesterson";
        const dateOfBirth = createDateOfBirthFromAge(12);
        const address = new Address(
            "2407 Pedernales Dr", "D",
            "College Station",
            "77845", "TX", "US"
        );
        const school = "Texas A&M University";
        const accountInfo = new AccountInfo(
            firstName, lastName, dateOfBirth,
            address, school
        );

        // Act
        const act = () => user.activate(accountInfo);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot activate already active user", async () => {
        // Arrange
        const user = await createActiveUser({});
        const accountInfo = createAccountInfo({});

        // Act
        const act = () => user.activate(accountInfo);

        // Assert
        expect(act).toThrow();
    });

    it("Can update account info", async () => {
        // Arrange
        const user = await createActiveUser({});
        const firstName = "New";
        const lastName = "Testerman";
        const dateOfBirth = createDateOfBirthFromAge(19);
        const address = new Address(
            "123 Sesame St", "2",
            "Knoxville",
            "37919", "TN", "US"
        );
        const school = "University of Tennessee";
        const newAccountInfo = new AccountInfo(
            firstName, lastName, dateOfBirth,
            address, school
        );

        // Act
        user.updateAccountInfo(newAccountInfo);

        // Assert
        expect(user.accountInfo).toStrictEqual(newAccountInfo);
    });

    it("Cannot update account info when not activated", async () => {
        // Arrange
        const user = await createInitialUser({});
        const accountInfo = createAccountInfo({});

        // Act
        const act = () => user.updateAccountInfo(accountInfo);

        // Assert
        expect(act).toThrow();
    });

    it("Can update parent", async () => {
        // Arrange
        const user = await createActiveUser({});
        const firstName = "Carolyn";
        const lastName = "Motherson";
        const email = "carolyn@mothers.com";
        const phoneNumber = new PhoneNumber("1", "4695554321");
        const newParent =
            UserFactory.createParent(firstName, lastName, email, phoneNumber);

        // Act
        user.updateParent(firstName, lastName, email, phoneNumber);

        // Assert
        expect(user.parent).toStrictEqual(newParent);
    });

    it("Keeps approved parent consent status after updating", async () => {
        // Arrange
        const user = await createActiveUser({});
        const firstName = "Carolyn";
        const lastName = "Motherson";
        const email = "carolyn@mothers.com";
        const phoneNumber = new PhoneNumber("1", "4695554321");
        user.parentApprove();
        const expected = new Parent(
            firstName, lastName, email, phoneNumber, ParentApprovalStatus.APPROVED
        );

        // Act
        user.updateParent(firstName, lastName, email, phoneNumber);

        // Assert
        expect(user.parent).toStrictEqual(expected);
    });

    it("Keeps denied parent consent status after updating", async () => {
        // Arrange
        const user = await createActiveUser({});
        const firstName = "Carolyn";
        const lastName = "Motherson";
        const email = "carolyn@mothers.com";
        const phoneNumber = new PhoneNumber("1", "4695554321");
        user.parentDeny();
        const expected = new Parent(
            firstName, lastName, email, phoneNumber, ParentApprovalStatus.DENIED
        );

        // Act
        user.updateParent(firstName, lastName, email, phoneNumber);

        // Assert
        expect(user.parent).toStrictEqual(expected);
    });

    it("Cannot update parent when not activated", async () => {
        // Arrange
        const user = await createInitialUser({});
        const firstName = "Carolyn";
        const lastName = "Motherson";
        const email = "carolyn@mothers.com";
        const phoneNumber = new PhoneNumber("1", "4695554321");

        // Act
        const act = () => user.updateParent(firstName, lastName, email, phoneNumber);

        // Assert
        expect(act).toThrow();
    });

    it("Parent consent is false before user adds account info", async () => {
        // Act
        const user = await createInitialUser({});

        // Assert
        expect(user.parentConsent).toBe(false);
    });

    it("Parent consent is false before approval when parent is required", async () => {
        // Arrange
        const dateOfBirth = createDateOfBirthFromAge(11);

        // Act
        const user = await createActiveUser({ dateOfBirth });

        // Assert
        expect(user.parentConsent).toBe(false);
    });

    it("Parent consent is true before approval when parent is not required",
       async () => {
        // Arrange
        const dateOfBirth = createDateOfBirthFromAge(19);

        // Act
        const user = await createActiveUser({ dateOfBirth });

        // Assert
        expect(user.parentConsent).toBe(true);
    });

    it("Parent can approve", async () => {
        // Arrange
        const dateOfBirth = createDateOfBirthFromAge(11);
        const user = await createActiveUser({ dateOfBirth });

        // Act
        user.parentApprove();

        // Assert
        expect(user.parentConsent).toBe(true);
    });

    it("Parent cannot approve if not present", async () => {
        // Arrange
        const user = await createInitialUser({});
        const dateOfBirth = createDateOfBirthFromAge(19);
        const accountInfo = createAccountInfo({ dateOfBirth });
        user.activate(accountInfo);

        // Act
        const act = () => user.parentApprove();

        // Assert
        expect(act).toThrow();
    });

    it("Parent can deny", async () => {
        // Arrange
        const dateOfBirth = createDateOfBirthFromAge(11);
        const user = await createActiveUser({ dateOfBirth });

        // Act
        user.parentDeny();

        // Assert
        expect(user.parentConsent).toBe(false);
    });

    it("Parent cannot deny if not present", async () => {
        // Arrange
        const user = await createInitialUser({});
        const dateOfBirth = createDateOfBirthFromAge(19);
        const accountInfo = createAccountInfo({ dateOfBirth });
        user.activate(accountInfo);

        // Act
        const act = () => user.parentDeny();

        // Assert
        expect(act).toThrow();
    });

    it("Can be invited to a new team", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentBy = await createActiveUser({});
        const expected = new TeamInvite(
            teamId, competitionId, sentBy, InviteStatus.ACTIVE
        );

        // Act
        user.inviteToTeam(teamId, competitionId, sentBy);

        // Assert
        expect(user.teamInvites.length).toBe(1);
        expect(user.teamInvites[0]).toStrictEqual(expected);
    });

    it("Cannot be invited to a team when already a member", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentByFirst = await createActiveUser({});
        user.inviteToTeam(teamId, competitionId, sentByFirst);
        user.acceptInvite(teamId);
        const sentBySecond = await createActiveUser({});

        // Act
        const act = () => user.inviteToTeam(teamId, competitionId, sentBySecond);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot be invited to a team when already in competition", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const otherTeamId = uuid.v4();
        user.joinCompetition(competitionId, otherTeamId, TeamRole.OWNER);
        const sentBy = await createActiveUser({});

        // Act
        const act = () => user.inviteToTeam(teamId, competitionId, sentBy);

        // Assert
        expect(act).toThrow();
    });

    it("Can accept an invitation", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentBy = await createActiveUser({});
        user.inviteToTeam(teamId, competitionId, sentBy);
        const expected = new UserCompetition(
            competitionId, CompetitionRole.COMPETITOR, teamId, TeamRole.MEMBER
        );

        // Act
        user.acceptInvite(teamId);

        // Assert
        expect(user.competitions.length).toBe(1);
        expect(user.competitions[0]).toStrictEqual(expected);
    });

    it("Cannot accept an invitation when invite does not exist", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();

        // Act
        const act = () => user.acceptInvite(teamId);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot accept an invitation that has already been accepted", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentBy = await createActiveUser({});
        user.inviteToTeam(teamId, competitionId, sentBy);
        user.acceptInvite(teamId);

        // Act
        const act = () => user.acceptInvite(teamId);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot accept an invitation that has already been rejected", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentBy = await createActiveUser({});
        user.inviteToTeam(teamId, competitionId, sentBy);
        user.rejectInvite(teamId);

        // Act
        const act = () => user.acceptInvite(teamId);

        // Assert
        expect(act).toThrow();
    });

    it("Can reject an invitation", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentBy = await createActiveUser({});
        user.inviteToTeam(teamId, competitionId, sentBy);

        // Act
        user.rejectInvite(teamId);

        // Assert
        expect(user.competitions.length).toBe(0);
    });

    it("Cannot reject an invitation when invite does not exist", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();

        // Act
        const act = () => user.rejectInvite(teamId);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot reject an invitation that has already been accepted", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentBy = await createActiveUser({});
        user.inviteToTeam(teamId, competitionId, sentBy);
        user.acceptInvite(teamId);

        // Act
        const act = () => user.rejectInvite(teamId);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot reject an invitation that has already been rejected", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentBy = await createActiveUser({});
        user.inviteToTeam(teamId, competitionId, sentBy);
        user.rejectInvite(teamId);

        // Act
        const act = () => user.rejectInvite(teamId);

        // Assert
        expect(act).toThrow();
    });

    it("Can revoke an invitation", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentBy = await createActiveUser({});
        user.inviteToTeam(teamId, competitionId, sentBy);
        const expected = new UserCompetition(
            competitionId, CompetitionRole.COMPETITOR, teamId, TeamRole.MEMBER
        );

        // Act
        user.revokeInvite(teamId);

        // Assert
        expect(user.competitions.length).toBe(0);
    });

    it("Cannot revoke an invitation when invite does not exist", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();

        // Act
        const act = () => user.revokeInvite(teamId);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot revoke an invitation that has already been accepted", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentBy = await createActiveUser({});
        user.inviteToTeam(teamId, competitionId, sentBy);
        user.acceptInvite(teamId);

        // Act
        const act = () => user.revokeInvite(teamId);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot revoke an invitation that has already been rejected", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const sentBy = await createActiveUser({});
        user.inviteToTeam(teamId, competitionId, sentBy);
        user.rejectInvite(teamId);

        // Act
        const act = () => user.revokeInvite(teamId);

        // Assert
        expect(act).toThrow();
    });

    it("Can join competition without invite", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        const expected = new UserCompetition(
            competitionId, CompetitionRole.COMPETITOR, teamId, TeamRole.OWNER
        );

        // Act
        user.joinCompetition(competitionId, teamId, TeamRole.OWNER);

        // Assert
        expect(user.competitions.length).toBe(1);
        expect(user.competitions[0]).toStrictEqual(expected);
    });

    it("Cannot join competition when already in competition", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        user.joinCompetition(competitionId, teamId, TeamRole.OWNER);

        // Act
        const act = () => user.joinCompetition(competitionId, teamId, TeamRole.OWNER);

        // Assert
        expect(act).toThrow();
    });

    it("Can leave a team", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        user.joinCompetition(competitionId, teamId, TeamRole.OWNER);

        // Act
        user.leaveTeam(teamId);

        // Assert
        expect(user.competitions.length).toBe(0);
    });

    it("Cannot leave a team that user is no already on", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();

        // Act
        const act = () => user.leaveTeam(teamId);

        // Assert
        expect(act).toThrow();
    });

    it("Can leave a team when on multiple teams", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId_1 = uuid.v4();
        const competitionId_1 = uuid.v4();
        const expected = new UserCompetition(
            competitionId_1, CompetitionRole.COMPETITOR, teamId_1, TeamRole.OWNER
        );
        user.joinCompetition(competitionId_1, teamId_1, TeamRole.OWNER);
        const teamId_2 = uuid.v4();
        const competitionId_2 = uuid.v4();
        user.joinCompetition(competitionId_2, teamId_2, TeamRole.OWNER);

        // Act
        user.leaveTeam(teamId_2);

        // Assert
        expect(user.competitions.length).toBe(1);
        expect(user.competitions[0]).toStrictEqual(expected);
    });

    it("Can assign learning platform code", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        user.joinCompetition(competitionId, teamId, TeamRole.OWNER);
        const code = crypto.randomBytes(5).toString("hex");

        // Act
        user.assignLearningPlatformCode(code, competitionId);

        // Assert
        expect(user.getLearningPlatformCode(competitionId)).toBe(code);
    });

    it("Cannot assign learning platform code when not in competition", async () => {
        // Arrange
        const user = await createActiveUser({});
        const competitionId = uuid.v4();
        const code = crypto.randomBytes(5).toString("hex");

        // Act
        const act = () => user.assignLearningPlatformCode(code, competitionId);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot assign learning platform code when already assigned", async () => {
        // Arrange
        const user = await createActiveUser({});
        const teamId = uuid.v4();
        const competitionId = uuid.v4();
        user.joinCompetition(competitionId, teamId, TeamRole.OWNER);
        const code = crypto.randomBytes(5).toString("hex");
        user.assignLearningPlatformCode(code, competitionId);
        const otherCode = crypto.randomBytes(5).toString("hex");

        // Act
        const act = () => user.assignLearningPlatformCode(otherCode, competitionId);

        // Assert
        expect(act).toThrow();
    });

    it("Cannot get learning platform code when not in competition", async () => {
        // Arrange
        const user = await createActiveUser({});
        const competitionId = uuid.v4();

        // Act
        const act = () => user.getLearningPlatformCode(competitionId);

        // Assert
        expect(act).toThrow();
    });
});
