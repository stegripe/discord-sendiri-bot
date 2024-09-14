import type { FunctionType, MethodDecorator, Promisable } from "../../typings/index.js";

export function createMethodDecorator<TC = any, Target extends FunctionType = FunctionType>(
    func: (...args: Parameters<Target>) => Promisable<boolean | undefined>
): MethodDecorator<TC, any> {
    return (target, _, descriptor) => {
        const originalMethod = descriptor.value as Target;

        descriptor.value = async function value(...args: Parameters<Target>): Promise<ReturnType<Target> | undefined> {
            const res = await func(...args);
            if (res === false) return undefined;

            return originalMethod.apply(this, args) as ReturnType<Target>;
        };
    };
}
