import { InteractionData } from "../schema/schema.ts";
import { hello } from "./hello.ts";
import { registerUser } from "./register/register.ts";

export function handleCommand(data: InteractionData): Response {
    switch (data.name) {
        case 'hello':
            return hello(data)

        case 'register':
            return registerUser(data);

        default: {
            // deno-lint-ignore no-unused-vars
            const exhaustiveCheck: never = data;
            throw new Error("Exhaustive check failed in command handler");
        }
    }
}