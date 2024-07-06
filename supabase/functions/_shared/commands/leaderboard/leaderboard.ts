import { dbService } from "../../database/service.ts";
import { getOption } from "../../helper/get-option.ts";
import { LeaderboardDataSchema } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";

type User = Awaited<ReturnType<typeof dbService['getUserScores']>>[number];

function formatRow({ count, score, user_handle }: User) {
    const name = `[\`${user_handle}\`](<https://codeforces.com/profile/${user_handle}>)`;
    return `**${name}**, **${score}** points, **${count}** solved.`
}

export async function leaderboard(payload: LeaderboardDataSchema): Promise<IInteractionResponse> {
    let days_since = +(getOption('days_since', payload.options) ?? 30);
    if (!days_since || isNaN(days_since))
        days_since = 30;
    let data: User[];
    try {
        data = await dbService.getUserScores(days_since);
    } catch (_error) {
        return { data: { content: 'Something went wrong while fetching the data' }, type: 4 }
    }

    const rankings = data
        .sort((a, b) => b.score - a.score)
        .slice(0, 15)
        .map((user, index) => `#${index}: ${formatRow(user)}`)
        .join('\n');

    return { data: { content: `## Leaderboard in the past ${days_since} days:\n${rankings ? rankings : 'No data.'}` }, type: 4 }
}