import Consul from "consul";
import { env } from "./env.js";

const consul = new Consul({
    host: "localhost",
    port: 8500
});

export async function registerService() {

    try {

        await consul.agent.service.register({
            id: `auth-service-${Math.ceil(Math.random() * 1000)}`,
            name: "auth-service",
            address: "localhost",
            port: env.PORT,
            check: {
                name: "auth-service-health-check",
                http: `http://localhost:${env.PORT}/health`,
                interval: "10s",
                timeout: "5s"
            }
        });

        console.log("auth service registered to service registery");


    } catch (error: any) {
        console.log(error.message);
        return;
    }

}