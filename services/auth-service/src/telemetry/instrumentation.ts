import { NodeSDK } from "@opentelemetry/sdk-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: "auth-service",
    }),

    traceExporter: new OTLPTraceExporter({
        url: "http://localhost:4317"
    }),
    instrumentations: [
        getNodeAutoInstrumentations()
    ]
});

sdk.start();