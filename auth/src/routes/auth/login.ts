import { Response, NextFunction } from "express";
import UserRepository from "../../repository/user";
import UserService, {
    AuthenticationRequest,
    AuthenticationFailureReason
} from "../../service/user";
import { Request, ValidationConfig } from "../Route";
import * as validate from "../../utils/validate";
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

    if (!validate.exists(req.body.email) && !validate.exists(req.body.username)) {
        return next({
            status: 400,
            message: "Username or email is required"
        });
    }

    if (!validate.exists(req.body.password)) {
        return next({
            status: 400,
            message: "Password is required"
        });
    }
    
    // NOTE: default to email if both present
    let authenticationRequest;
    if (validate.exists(req.body.email)) {
        authenticationRequest = AuthenticationRequest.ByEmail(req.body.email, req.body.password);
    } else {
        authenticationRequest = AuthenticationRequest.ByUsername(req.body.username, req.body.password);
    }
    const authenticationResult = await userService.authenticateUser(authenticationRequest);
    if (!authenticationResult.successful || !authenticationResult.user) {
        if (authenticationResult.reason === AuthenticationFailureReason.USER_NOT_FOUND) {
            return next({
                status: 404,
                message: "User not found"
            });
        } else {
            return next({
                status: 401,
                reason: authenticationResult.reason?.toString() || "Authentication Failure",
                message: authenticationResult.message || "Authentication failed"
            });
        }
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
