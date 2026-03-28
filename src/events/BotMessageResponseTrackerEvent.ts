import type { Message } from "discord.js-selfbot-v13";
import { BaseEvent } from "../structures/BaseEvent.js";
import { Event } from "../utils/decorators/Event.js";

@Event("messageCreate")
export class BotMessageResponseTrackerEvent extends BaseEvent {
    public async execute(message: Message): Promise<void> {
        if (message.author.id !== this.client.user?.id) {
            return;
        }

        if (!message.reference?.messageId) {
            return;
        }

        await this.client.messageResponseTracker.track(
            message.reference.messageId,
            message.id,
            message.channel.id,
        );
    }
}
