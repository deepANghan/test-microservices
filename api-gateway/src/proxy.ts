import type { Request, Response } from "express";
import { routes } from "./routes.config.js";
import axios from "axios";

async function handleProxy(req: Request, res: Response) {

    const path = req.path;

    const route = routes.find((r) => path.startsWith(r.path));

    // console.log(req.path, req.originalUrl, req.route, route);

    if (!route) {
        return res.status(404)
            .json({
                message: "Route not found"
            });
    }

    try {

        // console.log("Target:", route.target + req.originalUrl);

        const result = await axios({
            url: route.target + req.originalUrl,
            method: req.method,
            data: req.body,
            timeout: 5000
        });

        return res.status(result.status).json(result.data);


    } catch (error) {

        return res.status(503)
            .json({
                message:
                    "Service unavailable"
            });
    }

}

export { handleProxy };