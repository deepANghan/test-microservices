import express, { type NextFunction, type Request, type Response } from "express";
import { env } from "./config/env.js";
import { AuthController } from "./controllers/auth.controller.js";
import { createServiceToken } from "@package/auth/sign";
import { startProducer } from "./clients/producer.js";
import { doPublish } from "./services/outbox-publisher.js";
import { registerService } from "./config/consul.js";
import cors from "cors";

const app = express();
const PORT = env.PORT;

app.use(cors({
    origin: "*"
}));

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

app.get("/api/auth/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "auth-service"
    });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});


app.listen(PORT, async () => {
    console.log(`auth service running on ${PORT}`);
    await registerService();
});


// startProducer();

// doPublish();