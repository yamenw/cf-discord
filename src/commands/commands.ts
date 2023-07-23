import { InteractionData, MemberSchema } from "../schema/schema.ts";
import { hello } from "./hello.ts";
import { registerUser } from "./register/register.ts";

export async function handleCommand(data: InteractionData, member: MemberSchema): Promise<Response> {
    switch (data.name) {
        case 'hello':
            return hello(data)

        case 'register':
            return await registerUser(data, member);

        default: {
            // deno-lint-ignore no-unused-vars
            const exhaustiveCheck: never = data;
            throw new Error("Exhaustive check failed in command handler");
        }
    }
}