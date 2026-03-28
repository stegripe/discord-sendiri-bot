import type { Message, PartialMessage } from "discord.js-selfbot-v13";
import { BaseEvent } from "../structures/BaseEvent.js";
import { Event } from "../utils/decorators/Event.js";

@Event("messageDelete")
export class MessageDeleteResponseCleanupEvent extends BaseEvent {
    public async execute(message: Message | PartialMessage): Promise<void> {
        if (message.author?.bot) {
            return;
        }

        await this.client.messageResponseTracker.handleDelete(message.id);
    }
}
