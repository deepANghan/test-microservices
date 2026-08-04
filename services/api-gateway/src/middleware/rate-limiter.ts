import type { NextFunction, Request, Response } from "express";
import { ClientBucket, ClientWindow } from "../rate-limit/rate-limit.js";

// let clients = new Map<string, ClientWindow>();
let clients = new Map<string, ClientBucket>();

function rateLimit(req: Request, res: Response, next: NextFunction) {

    let ip = req.ip ?? "";

    let client = clients.get(ip);

    if (!client) {
        client = new ClientBucket();
        clients.set(ip, client);
    }

    if (!client.consumeToken()) {
        return res.status(429).json({
            message: "Too many Requests"
        })
    }

    next();
}

export { rateLimit };