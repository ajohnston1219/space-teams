// App
import express, { Response, NextFunction } from "express";
import { Request } from "./routes/Route";
import { Server } from "http";
// Websocket
// import Pusher from "./pusher";
// Messaging
// import MessageServer from "./messages/server";

// App setup
const app = express();
const http = new Server(app);
const port = process.env.TESTING ? 15000 : 5000;
app.use(express.json());

// Session and cache setup
// const session = require("express-session");
// const redis = require("redis");
// const RedisStore = require("connect-redis")(session);
// const redisClient = redis.createClient({
//     host: "redis" + (process.env.NAMESPACE || ""),
//     port: 6379
// });
// const sessionConfig = {
//     store: new RedisStore({ client: redisClient }),
//     saveUninitialized: false,
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     cookie: {
//         secure: false,
//         maxAge: 60 * 60 * 1000, // 60 minutes
//         httpOnly: true
//     }
// };
// if (process.env.NODE_ENV === "production") {
//     app.set("trust proxy", 1);
//     sessionConfig.cookie.secure = true;
// }
// app.use(session(sessionConfig));

// Websocket
// const io = require("socket.io")(http, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// CORS
const cors = require("cors");
const origin = process.env.NODE_ENV === "production"
    ? "https://labq.hippoexpress.io"
    : "http://localhost:8080";
app.use(cors({
    origin,
    optionsSuccess: 200,
    methods: ["GET, POST, PUT, PATCH, DELETE, OPTIONS"],
    allowedHeaders: ["Content-Type", "X-APP-NAME", "Authorization"],
    credentials: true
}));

// Routes
app.use("/", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/teams", require("./routes/teams"));

// Health Checking
app.use("/health-check", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send();
});

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err === null) {
        console.error("Null error sent to default error handler");
        return res.status(500).send({
            message: `${req.path} -> [Server Error]: Unknown error.`
        });
    }

    err.status = err.status || 500;
    if (!err.tag) {
        if (err.status === 400)
            err.tag = "Validation";
        else if (err.status === 401)
            err.tag = "Authentication";
        else if (err.status === 402)
            err.tag = "Payment";
        else if (err.status === 403)
            err.tag = "Authorization";
        else if (err.status === 404)
            err.tag = "Not Found";
        else if (err.status === 409)
            err.tag = "Conflict";
        else
            err.tag = "Server";
    }

    err.reason = err.reason || err.tag;
    err.message = err.message || "Unknown error.";

    if (!process.env.SUPRESS_LOGGING) {
        console.error(`${req.path} -> [${err.tag}]: ${err.message}`);
    }
    if (err.stack)
        console.error(err.stack);
    return res.status(err.status).send({
        reason: err.reason,
        field: err.field,
        message: err.message,
        link: err.link
    });
});

// Main Server
const server = http.listen(port, () => console.log(`Listening on port ${port}`));

// Message Server
// const messageServer = new MessageServer();
// messageServer.start();

// Websocket Server
// const pusher = new Pusher(io);
// pusher.start();

module.exports = server;
