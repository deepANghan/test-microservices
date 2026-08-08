import Consul from "consul";
import { env } from "./env.js";

const consul = new Consul({
    host: "localhost",
    port: 8500
});

export async function registerService() {

    try {

        await consul.agent.service.register({
            id: `todo-service-1`,
            name: "todo-service",
            address: "localhost",
            port: env.PORT,
            check: {
                name: "todo-service-health-check",
                http: `http://host.docker.internal:${env.PORT}/health`,
                interval: "10s",
                timeout: "5s"
            }
        });

        console.log("todo service registered to service registery");


    } catch (error: any) {
        console.log(error.message);
        return;
    }

}

process.on("SIGINT", async () => {

    await consul.agent.service.deregister(
        "todo-service-1"
    );
    process.exit();

});