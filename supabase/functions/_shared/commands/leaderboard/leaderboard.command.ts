export const leaderboardCommandDefinition = {
    "name": "leaderboard",
    "description": "Show the leaderboard (top 15 users)",
    "options": [
        {
            "name": "days_since",
            "description": "How many days old a submission is allowed to be to be taken into account",
            "type": 4,
            "required": false,
            "min": 1,
            "max": 365
        }
    ]
} as const;
