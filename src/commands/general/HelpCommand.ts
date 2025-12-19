import { Message } from "discord.js-selfbot-v13";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { CommandContext } from "../../structures/CommandContext.js";
import { Command } from "../../utils/decorators/Command.js";

@Command<typeof HelpCommand>({
    aliases: ["h", "command", "commands", "cmd", "cmds"],
    description: "Shows the command list or information for a specific command.",
    devOnly: true,
    name: "help",
    slash: {
        options: [
            {
                type: "STRING",
                name: "command",
                description: "Command name to view a specific information about the command"
            }
        ]
    },
    usage: "{prefix}help [command]"
})
export class HelpCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<Message | undefined> {
        let helpMessage = "";
        const val = ctx.args[0] as string | undefined;
        if (val === undefined) {
            for (const category of this.client.commands.categories.values()) {
                const isDev = this.client.config.devs.includes(ctx.author.id);
                const cmds = category.cmds.reduce<string[]>((pr, cu) => {
                    const cmd = this.client.commands.get(cu);
                    if (!isDev && (cmd?.meta.devOnly ?? false)) return pr;

                    return [...pr, `\`${cmd?.meta.name}\``];
                }, []);

                if (cmds.length === 0) continue;
                if (category.hide && !isDev) continue;

                // Append to helpMessage instead of overwriting it
                helpMessage += `**${category.name}**\n${cmds.join(", ")}\n\n`;
            }

            try {
                await ctx.send(helpMessage);
            } catch (error) {
                this.client.logger.error({ error }, "PROMISE_ERR");
            }

            return;
        }

        const command = this.client.commands.get(val) ??
            this.client.commands.get(this.client.commands.aliases.get(val) as unknown as string);

        if (!command) {
            await ctx.send("Command not found.");

            return;
        }

        await ctx.send(`**${command.meta.name}**\n${command.meta.description}`);
    }
}
