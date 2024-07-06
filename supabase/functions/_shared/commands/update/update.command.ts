export const updateCommandDefinition = {
    name: "update",
    description: "Update your problemlist based on your handle",
    options: [
        {
            "name": "set_nickname",
            "description": "Optional nickname for you in place of the CF handle",
            "type": 3,
            "required": false,
            "min_length": 1,
            "max_length": 32
        },
        {
            "name": "refetch_last",
            "description": "How many submissions since your first submission to skip when fetching, for debugging",
            "type": 4,
            "required": false,
            "choices": [
                {
                    "name": "last 25 submissions",
                    "value": 25
                },
                {
                    "name": "last 50 submissions",
                    "value": 50
                },
                {
                    "name": "last 100 submissions",
                    "value": 100
                },
                {
                    "name": "last 250 submissions",
                    "value": 250
                }
            ]
        }
    ]
} as const;
