export enum DiscordCommandType {
    Ping = 1,
    ApplicationCommand = 2,
}

export interface IInteractionResponse {
    type: 1 | 4 | 5 | 6 | 7 | 8 | 9;
    data?: {
        content: string;
    }
}

type CommandOption = {
    name: string;
    description: string;
    type: number;
    required: boolean;
    min_length?: number;
    max_length?: number;
    choices?: {
        name: string;
        value: number;
    }[];
};

export type CommandDefinition = {
    name: string;
    description: string;
    options: CommandOption[];
};
