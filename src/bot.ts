import process from "node:process";
import { clientOptions } from "./config/index.js";
import { BotClient } from "./structures/BotClient.js";

const client = new BotClient(clientOptions);

process.on("exit", code => {
    client.logger.info(`NodeJS process exited with code ${code}`);
});
process.on("uncaughtException", err => {
    client.logger.error("UNCAUGHT_EXCEPTION:", err);
    client.logger.warn("Uncaught Exception detected, trying to restart...");
    process.exit(1);
});
process.on("unhandledRejection", (reason: Error) => {
    client.logger.error("UNHANDLED_REJECTION:", reason.stack ?? reason.message);
});
process.on("warning", (...args) => client.logger.warn(...args));

try {
    await client.build();
} catch (error) {
    client.logger.error(error);
}
