import { PermissionFlagsBits } from "discord-api-types/v10";
import type { PermissionResolvable } from "discord.js-selfbot-v13";
import { createCmdDecorator } from "./createCmdDecorator.js";

export function memberReqPerms(
    perms: PermissionResolvable,
    fallbackMsg: string
): ReturnType<typeof createCmdDecorator> {
    return createCmdDecorator(ctx => {
        if (ctx.member?.permissions.has(perms) !== true) {
            void ctx.reply(`An error occurred: ${fallbackMsg}`);
            return false;
        }
        return true;
    });
}

export function botReqPerms(
    perms: PermissionResolvable,
    fallbackMsg: string
): ReturnType<typeof createCmdDecorator> {
    return createCmdDecorator(ctx => {
        if (ctx.guild?.members.me?.permissions.has(perms) !== true) {
            void ctx.reply(`An error occurred: ${fallbackMsg}`);
            return false;
        }
        return true;
    });
}

export function isModerator(): ReturnType<typeof createCmdDecorator> {
    return memberReqPerms(
        [PermissionFlagsBits.ManageRoles],
        "Sorry, but you're not the server staff."
    );
}
