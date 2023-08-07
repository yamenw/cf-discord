import { dbService } from "../../database/service.ts";
import { getOption } from "../../helper/get-option.ts";
import { LeaderboardData } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";

export async function leaderboard(payload: LeaderboardData): Promise<IInteractionResponse> {
    let days_since = +(getOption('days_since', payload.options) ?? 30);
    if (!days_since || isNaN(days_since))
        days_since = 30;
    let data: { user_handle: string; count: number; score: number; }[];
    try {
        data = await dbService.getUserScores(days_since);
    } catch (_error) {
        return { data: { content: 'Something went wrong while fetching the data' }, type: 4 }
    }

    const rankings = data
        .sort((a, b) => a.score - b.score)
        .slice(0, 15)
        .map(({ count, score, user_handle }, index) => `#${index}: **${user_handle}**, **${score}** points, **${count}** solved.`)
        .join('\n');

    console.log(rankings);
    return { data: { content: `## Leaderboard in the past ${days_since} days:\n${rankings ? rankings : 'No data.'}` }, type: 4 }
}