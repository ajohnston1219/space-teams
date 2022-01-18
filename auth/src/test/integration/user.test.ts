import User, { UserType } from "../../model/user";
import UserRepository from "../../repository/user";
import UserService, { AuthenticationRequest, AuthenticationResult, CreateUserRequest } from "../../service/user";
import db, { sql } from "../../repository/database";

async function cleanDatabase() {
    await db.query(sql`DELETE FROM auth.users`);
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

describe("User Service", () => {
    let userService: UserService;
    beforeEach(() => {
        userService = new UserService(new UserRepository());
    });

    afterAll(() => {
        db.dispose();
    });

    it("Successfully creates a new user", async () => {
        // Arrange
        await cleanDatabase();
        const request: CreateUserRequest = {
            username: "tester-person",
            email: "tester@people.com",
            password: "SuperSecret007!"
        };

        // Act
        const user = await userService.createUser(request);

        // Assert
        const actual = await userService.getUserById(user.id);
        expect(actual).not.toBeNull();
        expect(actual?.id).toBe(user.id);
        expect(actual?.username).toBe(request.username);
        expect(actual?.email).toBe(request.email);
        const passwordCheck = await actual?.checkPassword(request.password);
        expect(passwordCheck).toBe(true);
        expect(actual?.userType).toBe(UserType.INITIAL_USER);
    });

    it("Successfully authenticates user by username/password", async () => {
        // Arrange
        await cleanDatabase();
        const USERNAME = "tester-person";
        const PASSWORD = "SuperSecret007!";
        const user = await createUser(userService, { username: USERNAME, password: PASSWORD });
        const authenticationRequest = AuthenticationRequest.ByUsername(USERNAME, PASSWORD);

        // Act
        const result = await userService.authenticateUser(authenticationRequest);

        // Assert
        const expected = AuthenticationResult.Successful(user);
        expect(result).toStrictEqual(expected);
    });

    it("Successfully authenticates user by email/password", async () => {
        // Arrange
        await cleanDatabase();
        const EMAIL = "tester@people.com";
        const PASSWORD = "SuperSecret007!";
        const user = await createUser(userService, { email: EMAIL, password: PASSWORD });
        const authenticationRequest = AuthenticationRequest.ByEmail(EMAIL, PASSWORD);
        // Act
        const result = await userService.authenticateUser(authenticationRequest);

        // Assert
        const expected = AuthenticationResult.Successful(user);
        expect(result).toStrictEqual(expected);
    });

    it("Fails to authenticate user when user not found by username", async () => {
        // Arrange
        await cleanDatabase();
        const USERNAME = "tester-person";
        const PASSWORD = "SuperSecret007!";
        const authenticationRequest = AuthenticationRequest.ByUsername(USERNAME, PASSWORD);

        // Act
        const result = await userService.authenticateUser(authenticationRequest);

        // Assert
        const expected = AuthenticationResult.UserNotFound(authenticationRequest);
        expect(result).toStrictEqual(expected);
    });

    it("Fails to authenticate user when user not found by email", async () => {
        // Arrange
        await cleanDatabase();
        const EMAIL = "tester@people.com";
        const PASSWORD = "SuperSecret007!";
        const authenticationRequest = AuthenticationRequest.ByEmail(EMAIL, PASSWORD);

        // Act
        const result = await userService.authenticateUser(authenticationRequest);

        // Assert
        const expected = AuthenticationResult.UserNotFound(authenticationRequest);
        expect(result).toStrictEqual(expected);
    });

    it("Fails to authenticate user when password is incorrect", async () => {
        // Arrange
        await cleanDatabase();
        const EMAIL = "tester@people.com";
        const PASSWORD = "SuperSecret007!";
        await createUser(userService, { email: EMAIL, password: PASSWORD });
        const authenticationRequest = AuthenticationRequest.ByEmail(EMAIL, "Incorrect");

        // Act
        const result = await userService.authenticateUser(authenticationRequest);

        // Assert
        const expected = AuthenticationResult.InvalidPassword();
        expect(result).toStrictEqual(expected);
    });
});
