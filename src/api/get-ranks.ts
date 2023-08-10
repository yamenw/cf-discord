import { dbService } from "../database/service.ts";

export async function getRankings(): Promise<Response> {
    const scores = await dbService.getUserScoresREST(30);

    const placeholder = 'https://assets.stickpng.com/images/5845e687fb0b0755fa99d7ee.png';

    const profiles = scores
        .sort((a, b) => b.score - a.score)
        .map(({ count, score, user_handle, pfp }, index) => ({
            display_name: 'Placeholder',
            handle: user_handle,
            image: pfp ?? placeholder,
            rank: index,
            score: score,
            solved: count,
        }))

    return new Response(JSON.stringify(profiles))
}