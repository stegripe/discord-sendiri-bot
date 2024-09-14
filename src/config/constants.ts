import type { ColorResolvable, ShardingManagerMode, UserResolvable } from "discord.js-selfbot-v13";

export const shardingMode: ShardingManagerMode = "worker";
export const shardsCount: number | "auto" = "auto";
export const devs: UserResolvable[] = ["319872685897416725", "397322976552550400", "956162927726063626"];
export const devGuild: string[] = [];
export const embedColor = "4B7EFF" as ColorResolvable;
export const defaultPrefix = "m!";
