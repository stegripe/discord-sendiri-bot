import type { ClientEvents } from "discord.js-selfbot-v13";
import type { BotClient } from "./BotClient.js";

export abstract class BaseEvent {
    public constructor(
        public readonly client: BotClient,
        public readonly name: keyof ClientEvents
    ) {}

    public abstract execute(...args: unknown[]): any;
}

export type EventConstructor = new (...args: ConstructorParameters<typeof BaseEvent>) => BaseEvent;
