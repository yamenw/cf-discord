import { dbService } from "../../database/service.ts";
import { getOption } from "../../helper/get-option.ts";
import { LeaderboardData } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { rankUsersLegacy } from "../../util/ranking.ts";

export async function leaderboard(payload: LeaderboardData): Promise<IInteractionResponse> {
    const startDate = new Date();
    let days_since: number;
    if (payload?.options) {
        days_since = +(getOption('days_since', payload.options) ?? 0); // TODO: extract this into a function
        if (days_since && !isNaN(days_since)) {
            startDate.setDate(startDate.getDate() - days_since)
        } else {
            days_since = 30;
            startDate.setDate(startDate.getDate() - 30);
        }
    } else {
        days_since = 30;
        startDate.setDate(startDate.getDate() - 30);
    }

    const { error, data } = await dbService.getSubmissionsByDate(startDate);
    if (error) {
        console.error(error);
        return { data: { content: 'Something went wrong while fetching the data' }, type: 4 }
    }
    const rankings = Object.entries(rankUsersLegacy(data))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([name, score], index) => `#${index}: **${name}**, **${score}** points`)
        .join('\n');
    return { data: { content: `## Leaderboard in the past ${days_since} days:\n${rankings ? rankings : 'No data.'}` }, type: 4 }
}