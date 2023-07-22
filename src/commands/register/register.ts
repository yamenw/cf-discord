import { json } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { dbService } from "../../database/service.ts";
import { RegisterData } from "../../schema/schema.ts";
import { getProblems } from "../../util/codeforces.ts";

export async function registerUser(data: RegisterData): Promise<Response> {
    const handleOption = data?.options?.find(
        (option: { name: string; value: string }) => option.name === 'handle'
    )
    if (!handleOption)
        throw new Error("Missing handle");

    const { value: handle } = handleOption;
    try {
        dbService.registerUser({ cf_handle: handle });
    } catch (error) {
        console.error(error);
    }
    const problems = await getProblems(1, handle);
    return json({
        type: 4,
        data: {
            content: `Registered user ${handle}!, found ${problems.length} problems`,
        },
    })
}