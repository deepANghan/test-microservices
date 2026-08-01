import express, { type NextFunction, type Request, type Response } from "express";
import { env } from "./config/env.js";
import { AuthController } from "./controllers/auth.controller.js";

const app = express();
const PORT = env.PORT;

app.use(express.json());

const authController = new AuthController();

app.post("/api/auth/signup", authController.register);
app.post("/api/auth/signin", authController.login);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

});

app.listen(PORT, () => console.log(`auth service running on ${PORT}`));