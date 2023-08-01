import { dbService } from "../../database/service.ts";
import { getOption } from "../../helper/get-option.ts";
import { LeaderboardData } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { rankUsersLegacy } from "../../util/ranking.ts";

export async function leaderboard(payload: LeaderboardData): Promise<IInteractionResponse> {
    const today = new Date();
    const days_since = +getOption('days_since', payload.options);
    if (days_since && !isNaN(days_since)) {
        today.setDate(today.getDate())
    }
    const startOfCurrMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const { error, data } = await dbService.getSubmissionsByDate(startOfCurrMonth);
    if (error) {
        console.error(error);
        return { data: { content: 'Something went wrong while fetching the data' }, type: 4 }
    }
    const rankings = Object.entries(rankUsersLegacy(data))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([name, score], index) => `#${index}: **${name}**, **${score}** points`)
        .join('\n');
    return { data: { content: rankings }, type: 4 }
}