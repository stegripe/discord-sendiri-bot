import { Message, User } from "discord.js-selfbot-v13";
import { BaseEvent } from "../structures/BaseEvent.js";
import { Event } from "../utils/decorators/Event.js";

@Event("messageCreate")
export class MessageCreateEvent extends BaseEvent {
    public async execute(message: Message): Promise<void> {
        if (message.author.bot || message.channel.type === "DM") return;

        if (message.content.startsWith(this.client.config.prefix)) {
            await this.client.commands.handle(message);
            return;
        }

        if (this.getUserFromMention(message.content)?.id === this.client.user?.id) {
            try {
                await message.reply(`Hello! My prefix is \`${this.client.config.prefix}\`.`);
            } catch (error) {
                this.client.logger.error("PROMISE_ERR:", error);
                console.log(error);
            }
        }
    }

    private getUserFromMention(mention: string): User | undefined {
        const match = (/^<@!?(?<id>\d+)>$/u).exec(mention);
        if (!match) return undefined;

        const id = match.groups?.id ?? "";
        return this.client.users.cache.get(id);
    }
}