import process from "node:process";
import { clientOptions } from "./config/index.js";
import { BotClient } from "./structures/BotClient.js";

const client = new BotClient(clientOptions);

async function gracefulShutdown(signal: string): Promise<void> {
    client.logger.info(`Received ${signal}, shutting down gracefully...`);
    client.destroy();
    process.exit(0);
}

process.on("SIGINT", () => void gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));

process.on("exit", (code) => {
    client.logger.info(`NodeJS process exited with code ${code}`);
});
process.on("uncaughtException", (err) => {
    client.logger.error({ err }, "UNCAUGHT_EXCEPTION");
    client.logger.warn("Uncaught Exception detected, trying to restart...");
    process.exit(1);
});
process.on("unhandledRejection", (reason: Error) => {
    client.logger.error({ reason: reason.stack ?? reason.message }, "UNHANDLED_REJECTION");
});
process.on("warning", (...args) => client.logger.warn({ args }, "NODE_WARNING"));

try {
    await client.build();
} catch (error) {
    client.logger.error({ error }, "Failed to login client");
}
