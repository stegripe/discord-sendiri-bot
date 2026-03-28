import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import type { ShardClientUtil } from "discord.js-selfbot-v13";
import { Client } from "discord.js-selfbot-v13";
import * as config from "../config/index.js";
import { createLogger } from "../utils/functions/createLogger.js";
import { formatMS } from "../utils/functions/formatMS.js";
import { ClientUtils } from "../utils/structures/ClientUtils.js";
import { CommandManager } from "../utils/structures/CommandManager.js";
import { EventLoader } from "../utils/structures/EventLoader.js";
import { MessageResponseTracker } from "../utils/structures/MessageResponseTracker.js";

const basePath = path.dirname(fileURLToPath(import.meta.url));

export class BotClient extends Client {
    public readonly config = config;
    public readonly utils = new ClientUtils(this);
    public readonly commands = new CommandManager(this);
    public readonly events = new EventLoader(this);
    public readonly messageResponseTracker = new MessageResponseTracker(this);

    private getShardId(): number {
        return (this.shard as unknown as ShardClientUtil | null)?.ids?.[0] ?? process.pid;
    }

    public readonly logger = createLogger({
        name: "bot",
        shardId: this.getShardId(),
        type: "shard",
        dev: this.config.isDev,
    });

    public async build(token?: string): Promise<this> {
        const start = Date.now();
        await this.events.readFromDir(path.resolve(basePath, "..", "events"));
        const listener = (): void => {
            void this.commands.readFromDir(path.resolve(basePath, "..", "commands"));
            this.logger.info(`Ready in ${formatMS(Date.now() - start)}.`);

            this.removeAllListeners("ready");
        };

        this.on("ready", listener);
        await this.login(token);
        return this;
    }
}
