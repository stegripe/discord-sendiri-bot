import process from "node:process";
import type { ColorResolvable } from "discord.js-selfbot-v13";
import type { PresenceData } from "../typings/index.js";
import { defaultEmbedColor, defaultPrefix } from "./constants.js";

export const enableSlashCommand = process.env.ENABLE_SLASH_COMMAND !== "no";
export const isDev = process.env.NODE_ENV === "development";

const envPrefix = process.env.PREFIX?.trim();
export const prefix = envPrefix || (isDev ? "dm!" : defaultPrefix);

const envDevs =
    process.env.DEVS?.split(",")
        .map((x) => x.trim())
        .filter(Boolean) ?? [];
export const devs = envDevs;

export const devGuild =
    process.env.DEV_GUILD?.split(",")
        .map((x) => x.trim())
        .filter(Boolean) ?? [];

export const embedColor = (() => {
    const envColor = process.env.EMBED_COLOR?.trim();
    return (envColor ? `#${envColor.replace("#", "")}` : defaultEmbedColor) as ColorResolvable;
})();

export const presenceData: PresenceData = {
    activities: [
        { name: `my prefix is ${prefix}`, type: "PLAYING" },
        { name: "with {userCount} users", type: "PLAYING" },
        {
            name: "{textChannelCount} of text channels in {guildCount} guilds",
            type: "WATCHING",
        },
    ],
    interval: 60_000,
    status: ["online"],
};
