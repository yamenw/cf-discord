import { json } from "sift";
import { InteractionSchema } from "../schema/schema.ts";
import { registerUser } from "./register/register.ts";
import { updateUser } from "./update/update.ts";
import { leaderboard } from "./leaderboard/leaderboard.ts";

export async function handleCommand(interaction: InteractionSchema): Promise<Response> { // TODO: decouple from sift
    switch (interaction.data.name) {
        case 'register':
            return json(await registerUser(interaction.data, interaction.member));

        case "update":
            return json(await updateUser(interaction.member));

        case 'leaderboard':
            return json(await leaderboard(interaction.data));

        default: {
            // deno-lint-ignore no-unused-vars
            const exhaustiveCheck: never = interaction.data;
            throw new Error("Exhaustive check failed in command handler");
        }
    }
}