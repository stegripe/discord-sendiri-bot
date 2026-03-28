import process from "node:process";
import type { Message, TextChannel } from "discord.js-selfbot-v13";
import { BaseEvent } from "../structures/BaseEvent.js";
import { Event } from "../utils/decorators/Event.js";

const OWO_ALERT_FORWARD_CHANNEL_ID = "972418015050211338";

@Event("messageCreate")
export class MessageCreateEvent extends BaseEvent {
    public async execute(message: Message): Promise<void> {
        if (this.isOwoAlert(message)) {
            await this.handleOwoAlert(message);
            return;
        }

        if (message.author.bot || message.channel.type === "DM") {
            return;
        }

        if (!this.client.config.devs.includes(message.author.id)) {
            return;
        }

        if (message.content.startsWith(this.client.config.prefix)) {
            await this.client.commands.handle(message);
            return;
        }

        if (
            message.content === `<@${this.client.user?.id}>` ||
            message.content === `<@!${this.client.user?.id}>`
        ) {
            try {
                await message.reply(
                    `👋 **|** Hello ${message.author.toString()}, my prefix is **\`${this.client.config.prefix}\`**`,
                );
            } catch (error) {
                this.client.logger.error({ error }, "PROMISE_ERR");
            }
        }
    }

    private isOwoAlert(message: Message): boolean {
        const userId = this.client.user?.id;
        const username = this.client.user?.username;

        if (!userId) {
            return false;
        }

        return (
            message.content.startsWith(`⚠️ **|** <@${userId}>`) ||
            message.content.startsWith(`**⚠️ |** <@${userId}>`) ||
            (username ? message.content.startsWith(`**⚠️ | ${username}**`) : false)
        );
    }

    private async handleOwoAlert(message: Message): Promise<void> {
        const relayChannel = this.client.channels.cache.get(OWO_ALERT_FORWARD_CHANNEL_ID) as
            | TextChannel
            | undefined;
        const selfUserId = this.client.user?.id;

        if (!relayChannel || !selfUserId) {
            this.client.logger.warn(
                {
                    channelId: OWO_ALERT_FORWARD_CHANNEL_ID,
                    hasRelayChannel: Boolean(relayChannel),
                    hasSelfUserId: Boolean(selfUserId),
                },
                "OWO_ALERT_RELAY_UNAVAILABLE",
            );
            process.exit(0);
            return;
        }

        const alertLink = `https://discord.com/channels/${message.guild?.id}/${message.channel.id}/${message.id}`;
        const payload = `-eval this.container.client.users.cache.get("${selfUserId}").send(\`OwO alert detected.\\n> Scroll: ${alertLink}\`)`;

        try {
            await relayChannel.send(payload);
        } catch (error) {
            this.client.logger.error({ error, alertLink }, "OWO_ALERT_RELAY_FAILED");
        } finally {
            process.exit(0);
        }
    }
}
