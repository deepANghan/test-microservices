import express, { type Request, type Response } from "express";
import { handleProxy } from "./proxy.js";
import { routes } from "./routes.config.js";
import { authMiddleware } from "./middleware/auth.js";
import type { NextFunction } from "express-serve-static-core";
import { protect } from "./middleware/protected.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api", protect, handleProxy);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    return res.status(500).json({
        message: err.message
    })

});

app.listen(PORT, () => console.log(`API-GATEWAY running ON ${PORT}`));