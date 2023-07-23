import { InteractionSchema } from "../schema/schema.ts";
import { hello } from "./hello.ts";
import { registerUser } from "./register/register.ts";

export async function handleCommand(interaction: InteractionSchema): Promise<Response> {
    switch (interaction.data.name) {
        case 'hello':
            return hello(interaction.data.options)

        case 'register':
            return await registerUser(interaction.data, interaction.member);

        default: {
            // deno-lint-ignore no-unused-vars
            const exhaustiveCheck: never = interaction.data;
            throw new Error("Exhaustive check failed in command handler");
        }
    }
}