import express, { type NextFunction, type Request, type Response } from "express";
import { UserController } from "./controllers/user.controller.js";
import dotenv from "dotenv";
import { env } from "./config/env.js";
import { startGrpcServer } from "./grpc/server.js";

dotenv.config();

const app = express();
const PORT = env.PORT;

app.use(express.json());

const userController = new UserController();

app.post("/api/user", userController.create);
app.get("/api/user/:id", userController.get);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

});

app.listen(PORT, () => console.log(`user service running on ${PORT}`));

startGrpcServer();