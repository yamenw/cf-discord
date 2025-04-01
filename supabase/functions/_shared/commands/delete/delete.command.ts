import { CommandDefinition } from "../../types/commands.ts";

export const deleteCommandDefinition = {
    name: "delete",
    description: "Delete all data associated with your handle, requires /register to use again",
    options: []
} as const satisfies CommandDefinition;
