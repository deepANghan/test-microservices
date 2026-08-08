import express, { type NextFunction, type Request, type Response } from "express";
import { TodoController } from "./controllers/todo.controller.js";
import { env } from "./config/env.js";
import { verifyServiceToken } from "@package/auth/verify";
import { startGrpcServer } from "./grpc/server.js";
import { registerService } from "./config/consul.js";
import cors from "cors";

const app = express();
const PORT = env.PORT;

app.use(cors({
    origin: "*"
}));


app.use(express.json());

const todoController = new TodoController();

app.use("/", (req, res, next) => {

    try {

        if (req.path == "/health") {
            next();
            return;
        }


        const tokenHeader = req.headers["x-service-token"] as string;

        if (!tokenHeader) {
            return res.status(401).json({
                message: "Service token missing"
            });
        }

        const token = tokenHeader.split(" ")[1];

        verifyServiceToken(
            token as string
        );

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid service token"
        });
    }
});

app.post("/api/todo", todoController.create);
app.get("/api/todo/:id", todoController.get);
app.get("/api/todo/user/:userId", todoController.getByUser);
app.put("/api/todo/:id", todoController.update);
app.delete("/api/todo/:id", todoController.remove);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "todo-service"
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
    console.log(`todo service running on ${PORT}`);

    await registerService();
});

startGrpcServer();