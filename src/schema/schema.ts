import { z } from 'zod';

const registerData = z.object({
    options: z.array(z.object({
        type: z.literal(3),
        name: z.literal("handle"),
        value: z.string().min(1),
    })),
    name: z.literal('register')
})

export const updateData = z.object({
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

export const leaderboardData = z.object({
    options: z.optional(z.array(
        z.object({
            type: z.literal(4),
            name: z.literal("days_since"),
            value: z.number().min(1).max(365),
        }))),
    name: z.literal('leaderboard'),
});

export const dataSchema = z.discriminatedUnion('name', [
    registerData,
    updateData,
    leaderboardData,
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

export type LeaderboardData = z.infer<typeof leaderboardData>;
export type UpdateData = z.infer<typeof updateData>;
export type RegisterData = z.infer<typeof registerData>;
export type DataSchema = z.infer<typeof dataSchema>;
export type MemberSchema = z.infer<typeof memberSchema>;
export type InteractionSchema = z.infer<typeof interactionSchema>;
// TODO: rename all this