export const registerCommandDefinition = {
    "name": "register",
    "description": "Assign a Codeforces handle to yourself",
    "options": [
        {
            "name": "handle",
            "description": "The handle of your Codeforces account ",
            "type": 3,
            "required": true,
            "min_length": 1,
            "max_length": 32
        }
    ]
} as const;
