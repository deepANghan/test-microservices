import express, { type NextFunction, type Request, type Response } from "express";
import { env } from "./config/env.js";
import { AuthController } from "./controllers/auth.controller.js";
import { createServiceToken } from "@package/auth/sign";
import { startProducer } from "./clients/producer.js";
import { doPublish } from "./services/outbox-publisher.js";

const app = express();
const PORT = env.PORT;

app.use(express.json());

const authController = new AuthController();

app.post("/api/auth/signup", authController.register);
app.post("/api/auth/signin", authController.login);

app.post("/api/auth/serviceToken", (req, res) => {

    const { serviceName } = req.body;

    let token = createServiceToken(serviceName);

    return res.status(201).json({
        data: token
    });

});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

});

app.listen(PORT, () => console.log(`auth service running on ${PORT}`));

// startProducer();

doPublish();