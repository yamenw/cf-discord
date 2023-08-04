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

type Submissions = { rating: number; user_handle: string; }[]; //TODO: tidy this
type Rankings = Record<string, { count: number, score: number }>;

export const rankUsersLegacy = (submissions: Submissions): Rankings => {
    const userToRating: Rankings = {};
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

export function getProfiles(submissions: Submissions): Person[] {
    return Object.entries(rankUsersLegacy(submissions))
        .sort((a, b) => b[1].score - a[1].score)
        .map(([handle, { count, score }], index) => ({
            display_name: 'Placeholder',
            handle: handle,
            image: 'placeholder',
            rank: index,
            score: score,
            solved: count,
        }))
}