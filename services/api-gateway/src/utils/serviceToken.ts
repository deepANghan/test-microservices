import axios from "axios";
import { routes } from "../routes.config.js";

let serviceToken = {
    token: "",
    expiresAt: 0
};


async function getServiceToken() {

    if (Date.now() < serviceToken.expiresAt) {
        return serviceToken.token;
    }

    const route = routes.find((r) => r.path == "/auth");

    const response =
        await axios.post(
            route?.target + "/api/auth/serviceToken",
            {
                serviceName: "api-gateway"
            }
        );


    serviceToken = {
        token: response.data.data,
        expiresAt: Date.now() + 300000
    };


    return serviceToken.token;
}

export { getServiceToken };