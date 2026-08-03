import type { Request, Response } from "express";
import { routes } from "./routes.config.js";
import axios from "axios";
import { getServiceToken } from "./utils/serviceToken.js";

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

        let serviceToken = await getServiceToken();

        const result = await axios({
            url: route.target + req.originalUrl,
            method: req.method,
            data: req.body,
            headers: {
                "content-type": req.headers["content-type"],
                "x-service-token": "Bearer " + serviceToken
            },
            timeout: 5000
        });

        return res.status(result.status).json(result.data);

    } catch (error: any) {

        console.log(error.message);

        if (error.response) {

            // Service responded with an error

            return res
                .status(error.response.status)
                .json(error.response.data);

        }

        return res.status(503)
            .json({
                message:
                    "Service unavailable"
            });
    }

}

export { handleProxy };