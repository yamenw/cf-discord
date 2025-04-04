import { z } from 'zod';

const registerDataSchema = z.object({
    options: z.array(z.object({
        type: z.literal(3),
        name: z.literal("handle"),
        value: z.string().min(1),
    })),
    name: z.literal('register')
})

export const updateDataSchema = z.object({
    name: z.literal('update'),
    options: z.optional(z.array(
        z.discriminatedUnion('name', [
            z.object({
                type: z.literal(3),
                name: z.literal("set_nickname"),
                value: z.string().min(1).max(32),
            }),
            z.object({
                type: z.literal(4),
                name: z.literal("refetch_last"),
                value: z.union([
                    z.literal(25),
                    z.literal(50),
                    z.literal(100),
                    z.literal(250),
                ]),
            }),
        ]
        ))),
});

export const leaderboardDataSchema = z.object({
    options: z.optional(z.array(
        z.object({
            type: z.literal(4),
            name: z.literal("days_since"),
            value: z.number().min(1).max(365),
        }))),
    name: z.literal('leaderboard'),
});

const deleteDataSchema = z.object({
    options: z.optional(z.array(z.object({}))),
    name: z.literal('delete'),
});

export const dataSchema = z.discriminatedUnion('name', [
    registerDataSchema,
    updateDataSchema,
    leaderboardDataSchema,
    deleteDataSchema,
])

export const memberSchema = z.object({
    user: z.object({
        id: z.string(),
        username: z.string(),
    })
})

export const interactionSchema = z.object({
    type: z.number().min(1).max(3).int(),
    data: dataSchema,
    member: memberSchema,
})

/**
 * This is for the discord error:
 * alidation errors:
 * interactions_endpoint_url: The specified interactions endpoint url could not be verified.
 * 
 * Discord will try to validate the interactions endpoint
 * For that, it will send a request with no data or member info
 */
export const validateInteractionSchema = z.object({
    type: z.number().min(1).max(3).int(),
    data: z.optional(dataSchema),
    member: z.optional(memberSchema),
})

export type LeaderboardDataSchema = z.infer<typeof leaderboardDataSchema>;
export type UpdateDataSchmea = z.infer<typeof updateDataSchema>;
export type RegisterDataSchema = z.infer<typeof registerDataSchema>;
export type CommandDataSchema = z.infer<typeof dataSchema>;
export type MemberSchema = z.infer<typeof memberSchema>;
export type InteractionSchema = z.infer<typeof interactionSchema>;
