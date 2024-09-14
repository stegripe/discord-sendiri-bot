import type { BaseCommand } from "../../structures/BaseCommand.js";
import type { MethodDecorator, Promisable } from "../../typings/index.js";
import { createMethodDecorator } from "./createMethodDecorator.js";

export function createCmdDecorator(
    func: (...args: Parameters<BaseCommand["execute"]>) => Promisable<boolean | undefined>
): MethodDecorator<BaseCommand, void> {
    return createMethodDecorator<BaseCommand, BaseCommand["execute"]>(func);
}
