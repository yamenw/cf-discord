import { dbService } from "../database/service.ts";
import { Person } from "../types/api.ts";

const scores: { [key: number]: number } = {
    0: 0,
    800: 10, 900: 10, 1000: 10,
    1100: 25, 1200: 25, 1300: 25,
    1400: 50, 1500: 50,
    1600: 75, 1700: 75, 1800: 75,
    1900: 100, 2000: 100, 2100: 100, 2200: 100,
    2300: 100, 2400: 100, 2500: 100, 2600: 100,
    2700: 100, 2800: 100, 2900: 100, 3000: 100,
    3100: 100, 3200: 100, 3300: 100, 3400: 100
}

export type Submissions = { rating: number; user_handle: string; }[]; //TODO: tidy this
export type Rankings = Record<string, { count: number, score: number, pfp?: string }>;

export const rankUsersLegacy = (submissions: Submissions, intitialValue: Rankings = {}): Rankings => {
    const userToRating: Rankings = intitialValue ?? {};
    for (const submission of submissions) {
        if (submission.user_handle in userToRating) {
            const { count: prevCount, score: prevScore } = userToRating[submission.user_handle];
            userToRating[submission.user_handle] = { score: prevScore + scores[submission.rating], count: prevCount + 1 };
        } else {
            userToRating[submission.user_handle] = { score: scores[submission.rating], count: 1 };
        }
    }
    return userToRating;
}

export async function getProfiles(submissions: Submissions): Promise<Person[]> {
    const { data, error } = await dbService.getAllUserProfiles();
    let rankings: Rankings = {};
    if (error) {
        console.error(error);
    } else {
        rankings = Object.fromEntries(
            data.map(profile => ([profile.cf_handle, { count: 0, score: 0, pfp: profile.profile_picture }]))
        );
    }
    const placeholder = 'https://assets.stickpng.com/images/5845e687fb0b0755fa99d7ee.png';
    return Object.entries(rankUsersLegacy(submissions, rankings))
        .sort((a, b) => b[1].score - a[1].score)
        .map(([handle, { count, score, pfp }], index) => ({
            display_name: 'Placeholder',
            handle: handle,
            image: pfp ?? placeholder,
            rank: index,
            score: score,
            solved: count,
        }))
}