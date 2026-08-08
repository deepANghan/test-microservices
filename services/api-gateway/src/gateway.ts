import express, { type Request, type Response } from "express";
import { handleProxy } from "./proxy.js";
import { routes } from "./routes.config.js";
import { authMiddleware } from "./middleware/auth.js";
import type { NextFunction } from "express-serve-static-core";
import { protect } from "./middleware/protected.js";
import { rateLimit } from "./middleware/rate-limiter.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api", rateLimit, protect, handleProxy);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    return res.status(500).json({
        message: err.message
    });

});

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:");
    console.error(err);
});

process.on("unhandledRejection", (reason) => {
    console.error("UNHANDLED REJECTION:");
    console.error(reason);
});

app.listen(PORT, () => console.log(`API-GATEWAY running ON ${PORT}`));