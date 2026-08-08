import Consul from "consul";

const consul = new Consul({
    host: "localhost",
    port: 8500
});

export async function doDiscovery(serviceName: string = "") {

    try {

        if (serviceName == "") {
            throw new Error("service not found");
        }

        const services = await consul.health.service({
            service: serviceName,
            passing: true
        })

        console.log(services);

        const service = services[0].Service;

        return `http://${service.Address}:${service.Port}`;

    } catch (error: any) {

        console.log(error.message);

        throw new Error(error.message);
    }

}
