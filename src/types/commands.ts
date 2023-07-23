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