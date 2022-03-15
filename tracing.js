const opentelemetry = require("@opentelemetry/sdk-node");

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
});

sdk.start()