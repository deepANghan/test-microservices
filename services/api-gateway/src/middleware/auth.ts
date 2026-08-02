import type { Request, Response, NextFunction } from "express";
import { validateJWT } from "../utils/jwt.js";
import { randomUUID } from "node:crypto";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const header = req.headers.authorization;
    if (!header) {

        return res.status(401)
            .json({
                message: "Missing token"
            });

    }

    const token = header.split(" ")[1];

    try {

        const payload = validateJWT(token as string) as { userId: string, role: string };

        req.headers["X-UserId"] = payload.userId;
        req.headers["X-RequestId"] = randomUUID();

        next();

    } catch (error) {

        return res.status(401)
            .json({
                message: "Invalid token"
            });

    }

}