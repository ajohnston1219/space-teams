import request from "supertest";
import User from "../../model/user";
import UserRepository from "../../repository/user";
import UserService from "../../service/user";
import db, { sql } from "../../repository/database";

async function cleanDatabase() {
    await db.query(sql`DELETE FROM auth.authorized_tokens`);
    await db.query(sql`DELETE FROM competitions.competition_users`);
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
    afterAll(() => {
        db.dispose();
        server.close()
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

           // Assert
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

           // Assert
           expect(response.status).toEqual(200);
       });

    // Failed wrong password username
    it("rejects user login by username with wrong password",
       async () => {
           // Arrange
           await cleanDatabase();
           const user = await createUser();

           // Act
           const response = await request(server)
               .post("/login")
               .send({
                   username: "adam",
                   password: "wrong-password"
               });

           // Assert
           expect(response.status).toEqual(401);
       });

    // Failed wrong password email
    it("rejects user login by username with wrong password",
       async () => {
           // Arrange
           await cleanDatabase();
           const user = await createUser();

           // Act
           const response = await request(server)
               .post("/login")
               .send({
                   username: "adam",
                   password: "wrong-password"
               });

           // Assert
           expect(response.status).toEqual(401);
       });

    // Failed wrong password email
    it("rejects user login by email with wrong password",
       async () => {
           // Arrange
           await cleanDatabase();
           const user = await createUser();
           
           const response = await request(server)
               .post("/login")
               .send({
                   email: "ajohnston1219@tamu.edu",
                   password: "wrong-password"
               });

           // Assert
           expect(response.status).toEqual(401);
        });

    // Failed missing username/email
    it("rejects user login when missing username/email",
       async () => {
           // Arrange
           await cleanDatabase();
           const user = await createUser();

           // Act
           const response = await request(server)
               .post("/login")
               .send({
                   password: "wrong-password"
               });

           // Assert
           expect(response.status).toEqual(400);
        });

    // Failed missing password
    it("rejects user login when missing password",
       async () => {
           // Arrange
           await cleanDatabase();
           const user = await createUser();

           // Act
           const response = await request(server)
                .post("/login")
                .send({
                    username: "adam"
                });

           // Assert
           expect(response.status).toEqual(400);
        });

    // Failed user not found by username
    it("rejects login when user not found by username",
       async () => {
           // Arrange
           await cleanDatabase();
           const user = await createUser();

           // Act
           const response = await request(server)
                .post("/login")
                .send({
                    username: "not-a-person",
                    password: "doesn't-matter"
                })

           // Assert
           expect(response.status).toEqual(404);
        });

    // Failed user not found by email
    it("rejects login when user not found by email",
       async () => {
           // Arrange
           await cleanDatabase();
           const user = await createUser();

           // Act
           const response = await request(server)
               .post("/login")
               .send({
                   email: "not-an-email",
                   password: "doesn't-matter"
               })

           // Assert
           expect(response.status).toEqual(404);
       });

});
