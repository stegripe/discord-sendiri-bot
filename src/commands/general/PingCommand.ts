import { ColorResolvable } from "discord.js-selfbot-v13";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { CommandContext } from "../../structures/CommandContext.js";
import { Command } from "../../utils/decorators/Command.js";

@Command<typeof PingCommand>({
    aliases: ["pong", "pang", "pung", "peng", "pingpong"],
    description: "Shows current ping of the bot.",
    devOnly: true,
    name: "ping",
    usage: "{prefix}ping"
})
export class PingCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<void> {
        const msg = await ctx.reply("🏓");
        const latency = msg.createdTimestamp - ctx.context.createdTimestamp;
        const wsLatency = this.client.ws.ping.toFixed(0);
        await msg.edit(`📶 **|** API: **\`${latency}\`** ms\n🌐 **|** WebSocket: **\`${wsLatency}\`** ms`);
    }

    private static searchHex(ms: number | string): ColorResolvable {
        const listColorHex = [
            [0, 20, "Green"],
            [21, 50, "Green"],
            [51, 100, "Yellow"],
            [101, 150, "Yellow"],
            [150, 200, "Red"]
        ];

        const defaultColor = "Red";

        const min = listColorHex.map(el => el[0]);
        const max = listColorHex.map(el => el[1]);
        const hex = listColorHex.map(el => el[2]);
        let ret: number | string = "#000000";

        for (let i = 0; i < listColorHex.length; i++) {
            if (min[i] <= ms && ms <= max[i]) {
                ret = hex[i];
                break;
            } else {
                ret = defaultColor;
            }
        }
        return ret as ColorResolvable;
    }
}
