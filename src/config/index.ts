import type { ClientOptions } from "discord.js-selfbot-v13";
import { Options } from "discord.js-selfbot-v13";
import type { PresenceData } from "../typings/index.js";
// import { prefix } from "./env.js";

export const clientOptions: ClientOptions = {
    partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
    makeCache: Options.cacheWithLimits({
        ...Options.defaultSweeperSettings,
        ThreadManager: {
            maxSize: Infinity
        }
    }),
    sweepers: {
        ...Options.defaultSweeperSettings,
        threads: {
            interval: 300,
            lifetime: 10_800
        }
    }
};

export const presenceData: PresenceData = {
    activities: [
        /* { name: `my prefix is ${prefix}`, type: "PLAYING" },
        { name: "with {userCount} users", type: "PLAYING" },
        {
            name: "{textChannelCount} of text channels in {guildCount} guilds",
            type: "WATCHING"
        } */
    ],
    interval: 60_000,
    status: ["idle"]
};

export * from "./constants.js";
export * from "./env.js";
