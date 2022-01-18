import { Response, NextFunction } from "express";
import UserRepository from "../../repository/user";
import UserService, { AuthenticationRequest } from "../../service/user";
import { Request, ValidationConfig } from "../Route";
import jwt from "jsonwebtoken";

export const validation: ValidationConfig = {
    params: [],
    query: [
    ],
    body: [
        {
            key: "password",
            mapTo: "password",
            name: "Password",
            required: true,
            rules: []
        },
        {
            key: "username",
            mapTo: "username",
            name: "Username",
            required: false,
            rules: []
        },
        {
            key: "email",
            mapTo: "email",
            name: "Email",
            required: false,
            rules: []
        }
    ],
};

export const post = async (req: Request, res: Response, next: NextFunction, resources: any) => {
    const userRepo = new UserRepository();
    const userService = new UserService(userRepo);
    
    // NOTE: default to email if both present
    let authenticationRequest;
    if (req.body.email) {
        authenticationRequest = AuthenticationRequest.ByEmail(req.body.email, req.body.password);
    } else {
        authenticationRequest = AuthenticationRequest.ByUsername(req.body.username, req.body.password);
    }
    const authenticationResult = await userService.authenticateUser(authenticationRequest);
    if (!authenticationResult.successful || !authenticationResult.user) {
        return next({
            status: 401,
            reason: authenticationResult.reason?.toString() || "Authentication Failure",
            message: authenticationResult.message || "Authentication failed"
        });
    }

    const user = authenticationResult.user;
    let token;
    try {
        token = jwt.sign({
            id: user.id
        }, process.env.JWT_KEY || "TEMP", { expiresIn: "60d"});
    } catch (err: any) {
        err.tag = "Token";
        return next(err);
    }

    res.status(200).send(token);
};
