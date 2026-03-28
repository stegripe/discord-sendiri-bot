import type { Message } from "discord.js-selfbot-v13";
import type { BotClient } from "../../structures/BotClient.js";

const RESPONSE_TTL_MS = 86_400 * 1_000;

type TrackerData = {
    responseMessageId: string;
    channelId: string;
};

type TrackerEntry = {
    value: TrackerData;
    expires: number;
};

export class MessageResponseTracker {
    private readonly store = new Map<string, TrackerEntry>();

    public constructor(private readonly client: BotClient) {}

    public async track(
        commandMessageId: string,
        responseMessageId: string,
        channelId: string,
    ): Promise<void> {
        this.store.set(commandMessageId, {
            value: { responseMessageId, channelId },
            expires: Date.now() + RESPONSE_TTL_MS,
        });
    }

    public async get(commandMessageId: string): Promise<TrackerData | null> {
        const entry = this.store.get(commandMessageId);
        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expires) {
            this.store.delete(commandMessageId);
            return null;
        }

        return entry.value;
    }

    public async untrack(commandMessageId: string): Promise<void> {
        this.store.delete(commandMessageId);
    }

    public async handleDelete(commandMessageId: string): Promise<void> {
        const data = await this.get(commandMessageId);
        if (!data) {
            return;
        }

        try {
            const channel = this.client.channels.cache.get(data.channelId);
            if (channel && "messages" in channel) {
                const message = (await channel.messages
                    .fetch(data.responseMessageId)
                    .catch(() => null)) as Message | null;
                if (message && message.author.id === this.client.user?.id) {
                    await message.delete().catch(() => null);
                    this.client.logger.debug(
                        `Deleted response message ${data.responseMessageId} for deleted command ${commandMessageId}`,
                    );
                }
            }
        } catch {
            // Silently ignore fetch/delete failures.
        }

        await this.untrack(commandMessageId);
    }
}
