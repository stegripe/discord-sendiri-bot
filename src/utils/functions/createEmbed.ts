import { ColorResolvable, MessageEmbed } from "discord.js-selfbot-v13";
import { embedColor } from "../../config/env.js";

type HexColorsType = "error" | "info" | "success" | "warn";
const hexColors: Record<HexColorsType, ColorResolvable> = {
    error: "RED",
    info: embedColor,
    success: "GREEN",
    warn: "YELLOW",
};

export function createEmbed(type: HexColorsType, message?: string, emoji = false): MessageEmbed {
    const embed = new MessageEmbed().setColor(hexColors[type]);

    if (message) {
        embed.setDescription(message);
    }
    if (type === "error" && emoji) {
        embed.setDescription(`❌ **|** ${message}`);
    }
    if (type === "success" && emoji) {
        embed.setDescription(`✅ **|** ${message}`);
    }

    return embed;
}
