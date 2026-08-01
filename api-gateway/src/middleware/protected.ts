import type { NextFunction, Request, Response } from "express";
import { routes } from "../routes.config.js";
import { authMiddleware } from "./auth.js";

function protect(req: Request, res: Response, next: NextFunction) {

    const route = routes.find(r => req.path.startsWith(r.path));

    if (!route) {

        return res.status(404)
            .json({
                message: "Route not found"
            });

    }

    if (route.protected) {
        return authMiddleware(req, res, next);
    }

    next();
}

export { protect };