import express, { Response, NextFunction, Application } from "express";
import withResources from "../resources";
import * as validate from "../utils/validate";

export interface Request extends express.Request {
    session?: any;
    data?: any;
};

export interface Authentication {
    type: string;
};

export class Authentication implements Authentication {
    static Type = {
        USER: "user",
        APP: "app"
    }

    constructor(config: any) {
        if (!config.type) {
            const err = new Error("Authentication Config Error: Auth Type is required.");
            console.error(err);
            throw err;
        }
        const validTypes: string[] = Object.keys(Authentication.Type);
        if (validTypes.some(k => k === config.type)) {
            const err = new Error(
                "Authentication Config Error: " + config.type +
                    " is not a valid authentication type. " +
                    " Please choose from " + validTypes.join(", ")
            );
            console.error(err);
            throw err;
        }
        this.type = config.type;
    }

    handler = async (req: Request, res: Response, next: NextFunction) => {
        const appName = req.get("X-APP-NAME");
        const apiKey = req.get("X-API-KEY");
        if (!req.session.loggedIn) {
            return next({
                status: 401,
                message: "User authentication is required to access this resource"
            });
        }
        // TODO(adam): implement authentication
        next();
    }
};

export interface ValidationRule<T> {
    validate: (data: T) => boolean;
    message: string | ((data: T) => string);
};

export interface ValidationField<T> {
    key: string | string[];
    mapTo?: string | string[];
    name: string;
    clientField?: string;
    required: boolean;
    minLength?: number;
    maxLength?: number;
    rules: ValidationRule<T>[];
};

export interface ValidationConfig {
    params: ValidationField<any>[];
    query: ValidationField<any>[];
    body: ValidationField<any>[];
};

type RequestField = "params" | "query" | "body";

interface ValidationResult {
    message: string;
    field?: string;
};

export class Validation {
    constructor(public config: ValidationConfig) {
    }

    doValidation = (req: Request, reqField: RequestField): ValidationResult | null => {
        if (this.config[reqField].length === 0)
            return null;
        for (const validationItem of this.config[reqField]) {
            const { key, name, mapTo, clientField, required, minLength, maxLength, rules } = validationItem;
            let value;
            if (typeof key === "string") {
                value = req[reqField][key];
            } else {
                value = req[reqField];
                for (let i = 0; i < key.length; ++i) {
                    value = value[key[i]];
                }
            }
                
            if (!required && !validate.exists(value))
                continue;

            if (required && !validate.exists(value)) {
                return {
                    message: name + " is required",
                    field: clientField
                }
            }

            if (minLength && value.length < minLength) {
                return {
                    message: name + " must be at least " + minLength + " characters",
                    field: clientField
                };
            }

            if (maxLength && value.length > maxLength) {
                return {
                    message: name + " cannot be more than " + maxLength + " characters",
                    field: clientField
                };
            }

            for (let j = 0; j < rules.length; ++j) {
                const rule = rules[j];
                if (!rule.validate(value)) {
                    if (typeof rule.message === "string") {
                        return {
                            message: rule.message.replace("${value}", value),
                            field: clientField
                        };
                    }
                    // Assume fn
                    return {
                        message: rule.message(value),
                        field: clientField
                    };
                }
            }

            let dataKey = mapTo || key;
            if (typeof dataKey === "string") {
                req.data[dataKey] = value;
            } else {
                let temp = req.data;
                for (let i = 0; i < dataKey.length - 1; ++i) {
                    if (!temp[dataKey[i]])
                        temp[dataKey[i]] = {}
                    temp = temp[dataKey[i]];
                }
                temp[dataKey[dataKey.length - 1]] = value;
            }
        }
        return null;
    }

    handler = async (req: Request, res: Response, next: NextFunction) => {
        let result: ValidationResult | null;
        req.data = {};
        if ((result = this.doValidation(req, "params"))) {
            const { message, field } = result;
            return next({
                status: 400,
                field,
                message
            });
        }
        if ((result = this.doValidation(req, "query"))) {
            const { message, field } = result;
            return next({
                status: 400,
                field,
                message
            });
        }
        if ((result = this.doValidation(req, "body"))) {
            const { message, field } = result;
            return next({
                status: 400,
                field,
                message
            });
        }
        next();
    };
};

export interface Logger {
    format: any;
}

export class Logger implements Logger {
    static formatter: any;

    // TODO(adam): format string
    constructor(public format: any) {
    }

    static SetFormat(_formatter: any) {
        Logger.formatter = _formatter;
    }

    static Get(label: string) {
        const format = (msg: string) => `[${label}]: ${this.formatter(msg)}`;
        return new Logger(format);
    }

    info(msg: string) {
        console.log(this.format(msg));
    }

    debug(msg: string) {
        console.debug(this.format(msg));
    }

    warn(msg: string) {
        console.warn(this.format(msg));
    }

    error(msg: string) {
        console.error(this.format(msg));
    }

    trace(msg: string) {
        console.trace(this.format(msg));
    }
}

export interface Route {
    pipeline: any[];
    authentication?: any;
    middleware: any[];
};

export class Route {
    constructor(
        handler: any,
        middleware: any[],
        authentication?: any,
        validation?: any
    ) {
        this.pipeline = [];
        if (authentication)
            this.pipeline.push(authentication);
        if (validation)
            this.pipeline.push(validation);
        middleware.forEach((fn: any) => this.pipeline.push(fn));
        this.pipeline.push(handler);
    }
};

export interface RouteBuilder {
    authentication?: Authentication | null;
    validation?: Validation | null;
    middlewareFns: any[];
    resourceMap?: any;
    handlerFn?: any;
};

export class RouteBuilder {
    constructor() {
        this.authentication = null;
        this.validation = null;
        this.middlewareFns = [];
        this.resourceMap = null;
        this.handlerFn = null;
    }

    validate(config: ValidationConfig) {
        this.validation = new Validation(config);
        return this;
    }

    authenticate(config: any) {
        this.authentication = new Authentication(config);
        return this;
    }

    middleware(fn: any) {
        this.middlewareFns.push(fn);
        return this;
    }

    handler(fn: any) {
        this.handlerFn = fn;
        return this;
    }

    resources(resourceMap: any) {
        this.resourceMap = resourceMap;
        return this;
    }

    tryCatch(fn: any) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await fn(req, res, next);
            } catch (err) {
                return next(err);
            }
        }
    }

    build() : Application[] {
        if (!this.handlerFn) {
            const err = new Error("Route Builder Error: Handler function is required.");
            console.error(err);
            process.exit(-1);
        }
        if (this.resourceMap) {
            this.handlerFn = withResources(this.resourceMap, this.handlerFn);
        }
        const handler = async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.handlerFn(req, res, next);
            } catch (err) {
                next(err);
            }
        };
        let authHandler = null;
        if (this.authentication)
            authHandler = this.tryCatch(this.authentication.handler);
        let validationHandler = null;
        if (this.validation)
            validationHandler = this.tryCatch(this.validation.handler);
        const route = new Route(
            handler,
            this.middlewareFns.map(this.tryCatch),
            authHandler,
            validationHandler
        );
        return route.pipeline;
    }
};
