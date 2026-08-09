import express, { type NextFunction, type Request, type Response } from "express";
import { UserController } from "./controllers/user.controller.js";
import dotenv from "dotenv";
import { env } from "./config/env.js";
import { startGrpcServer } from "./grpc/server.js";
import { verifyServiceToken } from "@package/auth/verify";
import { startConsuming } from "./services/consumer.js";
import { registerService } from "./config/consul.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = env.PORT;

app.use(cors({
    origin: "*"
}));

app.use(express.json());

const userController = new UserController();

// app.use("/", (req, res, next) => {
//     try {

//         if (req.path == "/health") {
//             next();
//             return;
//         }

//         const tokenHeader = req.headers["x-service-token"] as string;

//         if (!tokenHeader) {
//             return res.status(401).json({
//                 message: "Service token missing"
//             });
//         }

//         const token = tokenHeader.split(" ")[1];

//         verifyServiceToken(
//             token as string
//         );

//         next();

//     } catch (error) {

//         return res.status(401).json({
//             message: "Invalid service token"
//         });
//     }
// });

app.post("/api/user", userController.create);
app.get("/api/user/:id", userController.get);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "user-service"
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
    console.log(`user service running on ${PORT}`);

    await registerService();
});

startGrpcServer();

// startConsuming();