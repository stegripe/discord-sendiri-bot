import type {
    Guild,
    GuildMember,
    Interaction,
    InteractionReplyOptions,
    MessageOptions,
    MessagePayload,
    TextBasedChannel,
    User,
} from "discord.js-selfbot-v13";
import { Message } from "discord.js-selfbot-v13";

export class CommandContext {
    public constructor(
        public readonly context: Interaction | Message,
        public args: string[] = [],
    ) {}

    public get author(): User {
        return (this.context as Message).author;
    }

    public get channel(): TextBasedChannel | null {
        return this.context.channel;
    }

    public get guild(): Guild | null {
        return this.context.guild;
    }

    public get member(): GuildMember | null {
        return this.guild?.members.resolve(this.author.id) ?? null;
    }

    public async reply(options: Parameters<this["send"]>[0]): Promise<Message> {
        const reply = await this.send(options).catch((error: unknown) => error as Error);
        if (reply instanceof Error) {
            throw new Error(`Unable to reply context, because: ${reply.message}`);
        }

        return reply;
    }

    public async send(
        options: InteractionReplyOptions | MessageOptions | MessagePayload | string,
    ): Promise<Message> {
        if ((options as InteractionReplyOptions).ephemeral === true) {
            throw new Error("Cannot send ephemeral message in a non-interaction context.");
        }

        if (typeof options !== "string") {
            const opts = options as MessageOptions;
            const hasEmbeds = Array.isArray(opts.embeds) && opts.embeds.length > 0;
            const hasContent =
                typeof opts.content === "string"
                    ? opts.content.length > 0
                    : opts.content !== undefined && opts.content !== null;

            // Selfbot runtime can drop embeds or reject embed-only payloads as empty messages.
            if (hasEmbeds) {
                const fallback = CommandContext.extractEmbedFallback(opts.embeds?.[0]);

                if (!hasContent || opts.content === "\u200B") {
                    opts.content = fallback || "(no content)";
                }
            }
        }

        return (this.context as Message).reply(options as MessageOptions | MessagePayload | string);
    }

    private static extractEmbedFallback(embed: unknown): string {
        if (!embed || typeof embed !== "object") {
            return "";
        }

        const raw = embed as {
            title?: string;
            description?: string;
            fields?: Array<{ name?: string; value?: string }>;
        };

        const chunks: string[] = [];

        if (raw.title) {
            chunks.push(`**${raw.title}**`);
        }
        if (raw.description) {
            chunks.push(raw.description);
        }
        if (Array.isArray(raw.fields) && raw.fields.length > 0) {
            const fields = raw.fields.map((field) => {
                const name = field.name?.trim() || "Field";
                const value = field.value?.trim() || "-";
                return `**${name}**\n${value}`;
            });
            chunks.push(fields.join("\n\n"));
        }

        return chunks.join("\n\n").trim();
    }

    public async delete(): Promise<void> {
        if (this.isMessage()) {
            await this.context.delete();
        }
    }

    public isMessage(): this is MessageCommandContext {
        return this.context instanceof Message;
    }
}

type MessageCommandContext = CommandContext & { context: Message };
