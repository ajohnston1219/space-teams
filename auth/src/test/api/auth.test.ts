import request from "supertest";
import User from "../../model/user";
import UserRepository from "../../repository/user";
import UserService from "../../service/user";
import db, { sql } from "../../repository/database";

async function cleanDatabase() {
    await db.query(sql`DELETE FROM auth.users`);
    await db.query(sql`DELETE FROM auth.team_members`);
    await db.query(sql`DELETE FROM auth.teams`);
}

async function createUser(): Promise<User> {
    const userRepo = new UserRepository();
    const userService = new UserService(userRepo);
    return userService.createUser({
        username: "adam",
        email: "ajohnston1219@tamu.edu",
        password: "password"
    })
}

describe("User Login", () => {

    let server: any;
    beforeAll(async () => {
        server = await require("../../index");
    });

    // Successful username
    it("successfully logs in user with username",
        async () => {
            // Arrange
            await cleanDatabase();
            const user = await createUser();

            // Act
            const response = await request(server)
                .post("/login")
                .send({
                    username: "adam",
                    password: "password"
                });
            expect(response.status).toEqual(200);
        });

    // Successful email
    it("successfully logs in user with email",
        async () => {
            // Arrange
            await cleanDatabase();
            const user = await createUser();

            // Act
            const response = await request(server)
                .post("/login")
                .send({
                    email: "ajohnston1219@tamu.edu",
                    password: "password"
                });
            expect(response.status).toEqual(200);
        });

    // // Failed wrong password email
    // it("rejects user login by username with wrong password",
    //     done => {
    //         request(server)
    //             .post("/login")
    //             .send({
    //                 username: "adam",
    //                 password: "wrong-password"
    //             })
    //             .expect(401, done);
    //     });

    // // Failed wrong password email
    // it("rejects user login by email with wrong password",
    //     done => {
    //         request(server)
    //             .post("/login")
    //             .send({
    //                 email: "ajohnston1219@tamu.edu",
    //                 password: "wrong-password"
    //             })
    //             .expect(401, done);
    //     });

    // // Failed missing username/email
    // it("rejects user login when missing username/email",
    //     done => {
    //         request(server)
    //             .post("/login")
    //             .send({
    //                 password: "wrong-password"
    //             })
    //             .expect(400, done);
    //     });

    // // Failed missing password
    // it("rejects user login when missing password",
    //     done => {
    //         request(server)
    //             .post("/login")
    //             .send({
    //                 username: "adam"
    //             })
    //             .expect(400, done);
    //     });

    // // Failed user not found by username
    // it("rejects login when user not found by username",
    //     done => {
    //         request(server)
    //             .post("/login")
    //             .send({
    //                 username: "not-a-person",
    //                 password: "doesn't-matter"
    //             })
    //             .expect(404, done);
    //     });

    // // Failed user not found by email
    // it("rejects login when user not found by email",
    //     done => {
    //         request(server)
    //             .post("/login")
    //             .send({
    //                 email: "not-an-email",
    //                 password: "doesn't-matter"
    //             })
    //             .expect(404, done);
    //     });

    afterAll(() => {
        db.dispose();
        server.close()
    });
});
