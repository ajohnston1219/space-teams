import { Router } from "express";
import {
    RouteBuilder,
    Authentication
} from "../Route";

const router = Router();

const route = new RouteBuilder()
    // .validate(require("./login").validation)
    .handler(require("./login").post)
    .build()

router.post("/login", route);

module.exports = router;
