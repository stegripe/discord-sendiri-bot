import type { Message, PartialMessage, Snowflake } from "discord.js-selfbot-v13";
import { Collection } from "discord.js-selfbot-v13";
import { BaseEvent } from "../structures/BaseEvent.js";
import { Event } from "../utils/decorators/Event.js";

@Event("messageDeleteBulk")
export class MessageDeleteBulkResponseCleanupEvent extends BaseEvent {
    public async execute(messages: Collection<Snowflake, Message | PartialMessage>): Promise<void> {
        const nonBotMessages = messages.filter((msg) => !msg.author?.bot);

        await Promise.allSettled(
            nonBotMessages.map((msg) => this.client.messageResponseTracker.handleDelete(msg.id)),
        );
    }
}
