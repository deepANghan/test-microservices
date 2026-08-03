import express, { type NextFunction, type Request, type Response } from "express";
import { TodoController } from "./controllers/todo.controller.js";
import { env } from "./config/env.js";
import { verifyServiceToken } from "@package/auth/verify";

const app = express();
const PORT = env.PORT;

app.use(express.json());

const todoController = new TodoController();

app.use("/", (req, res, next) => {

    try {
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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

});

app.listen(PORT, () => console.log(`todo service running on ${PORT}`));