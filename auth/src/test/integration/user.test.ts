import { UserType } from "../../model/user";
import UserRepository from "../../repository/user";
import UserService, { CreateUserRequest } from "../../service/user";
import db, { sql } from "../../repository/database";

async function cleanDatabase() {
    await db.query(sql`DELETE FROM auth.users`);
}

describe("User Service", () => {
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
});
