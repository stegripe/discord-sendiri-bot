import { ChildProcess, spawn } from "node:child_process";
import { Collection } from "discord.js-selfbot-v13";
import kill from "tree-kill";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { CommandContext } from "../../structures/CommandContext.js";
import { Command } from "../../utils/decorators/Command.js";

@Command<typeof SpawnCommand>({
    description: "Spawn process for executing bash commands.",
    devOnly: true,
    name: "spawn",
    usage: "{prefix}spawn <option>"
})
export class SpawnCommand extends BaseCommand {
    private readonly processes = new Collection<string, ChildProcess>();

    public async execute(ctx: CommandContext): Promise<void> {
        const option = ctx.args.shift();

        if (option === "create") {
            const name = ctx.args.shift();
            if (name === undefined || name === "") {
                void ctx.reply("Please provide the process name.");
                return;
            }
            if (ctx.args.length === 0) {
                void ctx.reply("Please provide the command to execute.");
                return;
            }
            if (this.processes.has(name)) {
                void ctx.reply("There's a running process with that name. Terminate it first, and then try again.");
                return;
            }

            await ctx.reply(`❯_ ${ctx.args.join(" ")}`);
            const process = spawn(ctx.args.shift() as unknown as string, ctx.args, { shell: true, windowsHide: true })
                .on("spawn", () => {
                    void ctx.reply(`Process **\`${name}\`** has spawned.`);
                })
                .on("close", (code: string, signal: string) => {
                    this.processes.delete(name);
                    void ctx.reply(`Process **\`${name}\`** closed with code **\`${code}\`**, signal **\`${signal}\`**`);
                })
                .on("error", err => {
                    void ctx.reply(`An error occured on the process **\`${name}\`**: \n\`\`\`${err.message}\`\`\``);
                });

            process.stdout.on("data", async data => {
                const pages = SpawnCommand.paginate(String(data), 1_950);
                for (const page of pages) {
                    await ctx.reply(`\`\`\`\n${page}\`\`\``);
                }
            });
            process.stderr.on("data", async data => {
                const pages = SpawnCommand.paginate(String(data), 1_950);
                for (const page of pages) {
                    await ctx.reply(`\`\`\`\n${page}\`\`\``);
                }
            });

            this.processes.set(name, process);
        } else if (option === "terminate") {
            const name = ctx.args.shift();
            if (name === undefined || name === "") {
                void ctx.reply("Please provide the process name.");
                return;
            }
            const process = this.processes.get(name);
            if (process === undefined) {
                void ctx.reply("There's no process with that name.");
                return;
            }

            try {
                if (process.pid !== undefined) {
                    await new Promise<void>((resolve, reject) => {
                        kill(process.pid as unknown as number, "SIGTERM", err => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                }
                this.processes.delete(name);

                void ctx.reply("Process has terminated.");
            } catch (error) {
                void ctx.reply(`An error occured while trying to terminate process: ${(error as Error).message}`);
            }
        } else {
            void ctx.reply("Invalid usage, valid options are **`create`** and **`terminate`**");
        }
    }

    private static paginate(text: string, limit = 2_000): string[] {
        const lines = text.trim().split("\n");
        const pages = [];
        let chunk = "";

        for (const line of lines) {
            if (chunk.length + line.length > limit && chunk.length > 0) {
                pages.push(chunk);
                chunk = "";
            }

            if (line.length > limit) {
                const lineChunks = line.length / limit;

                for (let i = 0; i < lineChunks; i++) {
                    const start = i * limit;
                    const end = start + limit;
                    pages.push(line.slice(start, end));
                }
            } else {
                chunk += `${line}\n`;
            }
        }

        if (chunk.length > 0) {
            pages.push(chunk);
        }

        return pages;
    }
}
