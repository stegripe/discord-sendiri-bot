import { BaseCommand } from "../../structures/BaseCommand.js";
import { CommandContext } from "../../structures/CommandContext.js";
import { Command } from "../../utils/decorators/Command.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";

@Command<typeof HelpCommand>({
    aliases: ["h", "command", "commands", "cmd", "cmds"],
    description: "Shows the command list or information for a specific command.",
    name: "help",
    usage: "{prefix}help [command]",
})
export class HelpCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<void> {
        const commandName = ctx.args[0];

        if (commandName) {
            const command =
                this.client.commands.get(commandName) ??
                this.client.commands.get(
                    this.client.commands.aliases.get(commandName) as unknown as string,
                );

            if (!command) {
                await ctx.reply({
                    embeds: [createEmbed("error", "Command not found.", true)],
                });
                return;
            }

            const embed = createEmbed("info")
                .setAuthor({
                    name: `${this.client.user?.username} - Information: ${command.meta.name}`,
                    iconURL: this.client.user?.displayAvatarURL(),
                })
                .addFields(
                    { name: "Name", value: `\`${command.meta.name}\``, inline: true },
                    {
                        name: "Description",
                        value: command.meta.description || "No description.",
                        inline: true,
                    },
                    {
                        name: "Aliases",
                        value:
                            command.meta.aliases && command.meta.aliases.length > 0
                                ? command.meta.aliases.map((x) => `\`${x}\``).join(", ")
                                : "None",
                        inline: false,
                    },
                    {
                        name: "Category",
                        value: command.meta.category || "Uncategorized",
                        inline: true,
                    },
                )
                .setFooter({
                    text: `${this.client.config.prefix}help [command]`,
                    iconURL: "https://cdn.stegripe.org/images/information.png",
                });

            await ctx.reply({ embeds: [embed] });
            return;
        }

        const isDev = this.client.config.devs.includes(ctx.author.id);
        const embed = createEmbed("info").setAuthor({
            name: `${this.client.user?.username} - Command List`,
            iconURL: this.client.user?.displayAvatarURL(),
        });

        for (const category of this.client.commands.categories.values()) {
            const cmds = category.cmds.reduce<string[]>((acc, name) => {
                const cmd = this.client.commands.get(name);
                if (!cmd) {
                    return acc;
                }
                if (!isDev && (cmd.meta.devOnly ?? false)) {
                    return acc;
                }

                return [...acc, `\`${cmd.meta.name}\``];
            }, []);

            if (cmds.length === 0) {
                continue;
            }
            if (category.hide && !isDev) {
                continue;
            }

            embed.addFields({
                name: `**${category.name.toUpperCase()}**`,
                value: cmds.join(", "),
            });
        }

        embed.setFooter({
            text: `${this.client.config.prefix}help <command> for more information.`,
            iconURL: "https://cdn.stegripe.org/images/information.png",
        });

        await ctx.reply({ embeds: [embed] });
    }
}
