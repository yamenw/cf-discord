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

export const rankUsers = (submissions: { rating: number; user_handle: string; }[]) => {
    const userToRating: Record<string, number> = {};
    for (const submission of submissions) {
        if (submission.user_handle in userToRating) {
            userToRating[submission.user_handle] += scores[submission.rating];
        } else {
            userToRating[submission.user_handle] = scores[submission.rating];
        }
    }
    return userToRating;
}