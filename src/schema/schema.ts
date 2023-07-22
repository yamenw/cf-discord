import { z } from 'zod';

const registerData = z.object({
    options: z.array(z.object({
        type: z.literal(3),
        name: z.literal("handle"),
        value: z.string().min(1)
    })),
    name: z.literal('register')
})

export const dataSchema = z.discriminatedUnion('name', [
    z.object({
        options: z.array(z.any()),
        name: z.literal('hello')
    }),
    registerData
])

export const interactionSchema = z.object({
    type: z.number().min(1).max(3).int(),
    data: dataSchema
})

export type InteractionData = z.infer<typeof dataSchema>;
export type RegisterData = z.infer<typeof registerData>;
