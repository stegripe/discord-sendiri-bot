import type { Guild, GuildMember, InteractionReplyOptions, MessageOptions, MessagePayload, TextBasedChannel, User, Interaction } from "discord.js-selfbot-v13";
import { Message } from "discord.js-selfbot-v13";

export class CommandContext {
    public constructor(public readonly context: Interaction | Message, public args: string[] = []) {}

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
        if (reply instanceof Error) throw new Error(`Unable to reply context, because: ${reply.message}`);

        return reply;
    }

    public async send(options: InteractionReplyOptions | MessageOptions | MessagePayload | string): Promise<Message> {
        if ((options as InteractionReplyOptions).ephemeral === true) {
            throw new Error("Cannot send ephemeral message in a non-interaction context.");
        }
        return (this.context as Message).reply(options as MessageOptions | MessagePayload | string);
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

type MessageCommandContext = CommandContext & { context: Message; };
