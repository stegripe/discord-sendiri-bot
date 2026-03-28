import type { ClientOptions } from "discord.js-selfbot-v13";
import { Options } from "discord.js-selfbot-v13";

export const clientOptions: ClientOptions = {
    presence: {
        // discord.js-selfbot-v13 may crash if activities are set before client.user exists.
        // Real activities are set later by ReadyEvent via setPresence().
        status: "dnd",
    },
    partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
    makeCache: Options.cacheWithLimits({
        ...Options.defaultSweeperSettings,
        ThreadManager: {
            maxSize: Number.POSITIVE_INFINITY,
        },
    }),
    sweepers: {
        ...Options.defaultSweeperSettings,
        threads: {
            interval: 300,
            lifetime: 10_800,
        },
    },
};

export * from "./constants.js";
export * from "./env.js";
