import { InteractionSchema } from "../schema/schema.ts";
import { registerUser } from "./register/register.ts";
import { updateUser } from "./update/update.ts";
import { leaderboard } from "./leaderboard/leaderboard.ts";
import { IInteractionResponse } from "../types/commands.ts";

export async function handleCommand(interaction: InteractionSchema): Promise<IInteractionResponse> {
    switch (interaction.data.name) {
        case 'register':
            return await registerUser(interaction.data, interaction.member);

        case "update":
            return await updateUser(interaction.member);

        case 'leaderboard':
            return await leaderboard(interaction.data);

        default: {
            interaction.data satisfies never;
            throw new Error("Exhaustive check failed in command handler");
        }
    }
}