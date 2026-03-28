import process from "node:process";
import type { ColorResolvable, UserResolvable } from "discord.js-selfbot-v13";

export const defaultPrefix = "m!";
export const defaultDevs: UserResolvable[] = [
    "319872685897416725",
    "397322976552550400",
    "956162927726063626",
];
export const defaultEmbedColor = "4B7EFF" as ColorResolvable;
export const enableSharding = process.env.ENABLE_SHARDING !== "no";
