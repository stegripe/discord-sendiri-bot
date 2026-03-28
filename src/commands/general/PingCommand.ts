import { ColorResolvable } from "discord.js-selfbot-v13";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { CommandContext } from "../../structures/CommandContext.js";
import { Command } from "../../utils/decorators/Command.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";

@Command<typeof PingCommand>({
    aliases: ["pong", "pang", "pung", "peng", "pingpong"],
    description: "Shows current ping of the bot.",
    name: "ping",
    usage: "{prefix}ping",
})
export class PingCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<void> {
        const msg = await ctx.reply("🏓");
        const latency = msg.createdTimestamp - ctx.context.createdTimestamp;
        const wsLatency = Number(this.client.ws.ping.toFixed(0));
        const content = `🏓 PONG\n📶 API: \`${latency}\` ms\n🌐 WebSocket: \`${wsLatency}\` ms`;
        const embed = createEmbed("info")
            .setColor(PingCommand.searchHex(wsLatency))
            .setAuthor({ name: "🏓 PONG" })
            .addFields(
                {
                    name: "📶 **|** API",
                    value: `\`${latency}\` ms`,
                    inline: true,
                },
                {
                    name: "🌐 **|** WebSocket",
                    value: `\`${wsLatency}\` ms`,
                    inline: true,
                },
            )
            .setFooter({
                text: `Latency of: ${this.client.user?.tag}`,
                iconURL: this.client.user?.displayAvatarURL(),
            })
            .setTimestamp();

        try {
            await msg.edit({ content, embeds: [embed] });
        } catch {
            await msg.edit(content);
        }
    }

    private static searchHex(ms: number): ColorResolvable {
        const listColorHex: [number, number, ColorResolvable][] = [
            [0, 20, "#57F287"],
            [21, 50, "#57F287"],
            [51, 100, "#FEE75C"],
            [101, 150, "#FEE75C"],
            [151, Number.POSITIVE_INFINITY, "#ED4245"],
        ];

        const color = listColorHex.find(([min, max]) => min <= ms && ms <= max)?.[2];
        return color ?? "#ED4245";
    }
}
