import { json } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { dbService } from "../../database/service.ts";
import { RegisterData } from "../../schema/schema.ts";

export function registerUser(data: RegisterData): Response {
    const handleOption = data?.options?.find(
        (option: { name: string; value: string }) => option.name === 'handle'
    )
    if (!handleOption)
        throw new Error("Missing handle");

    const { value } = handleOption;
    try {
        dbService.registerUser({ cf_handle: value });
    } catch (error) {
        console.error(error);
    }
    return json({
        type: 4,
        data: {
            content: `Registered user ${value}!`,
        },
    })
}