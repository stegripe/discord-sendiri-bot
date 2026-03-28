import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { ShardingManager } from "discord.js-selfbot-v13";
import { enableSharding, isDev } from "./config/index.js";
import { createLogger } from "./utils/functions/createLogger.js";

const log = createLogger({
    name: "ShardManager",
    type: "manager",
    dev: isDev,
});

if (enableSharding) {
    const manager = new ShardingManager(
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), "bot.js"),
        {
            totalShards: "auto",
            respawn: true,
            token: process.env.DISCORD_TOKEN,
            mode: "worker",
        },
    );

    try {
        await manager
            .on("shardCreate", (shard) => {
                log.info(`Shard #${shard.id} has spawned.`);
                shard
                    .on("disconnect", () => log.warn({ shardId: shard.id }, "SHARD_DISCONNECTED"))
                    .on("reconnecting", () =>
                        log.info({ shardId: shard.id }, "SHARD_RECONNECTING"),
                    );
                if (manager.shards.size === manager.totalShards) {
                    log.info("All shards are spawned successfully.");
                }
            })
            .spawn();
    } catch (error) {
        log.error({ err: error }, "Error spawning shards");
    }
} else {
    log.info("Sharding disabled, starting bot directly...");
    await import("./bot.js");
}
