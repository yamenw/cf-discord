import { deleteCommandDefinition } from "./delete/delete.command.ts";
import { leaderboardCommandDefinition } from "./leaderboard/leaderboard.command.ts";
import { registerCommandDefinition } from "./register/register.command.ts";
import { updateCommandDefinition } from "./update/update.command.ts";

export const allCommandsSchemas = [
    updateCommandDefinition,
    registerCommandDefinition,
    leaderboardCommandDefinition,
    deleteCommandDefinition,
];
