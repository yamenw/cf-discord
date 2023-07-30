import { json } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { MemberSchema, RegisterData } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { updateUserSubmissions } from "../../util/codeforces.ts";

export async function registerUser(data: RegisterData, member: MemberSchema): Promise<Response> {
    const handleOption = data?.options?.find(
        (option: { name: string; value: string }) => option.name === 'handle'
    )
    if (!handleOption)
        throw new Error("Missing handle");

    const { value: handle } = handleOption;
    let problem_count: number;
    let res: IInteractionResponse;
    try {
        problem_count = await updateUserSubmissions(handle, member.user.id, 1);
        res = {
            type: 4,
            data: {
                content: `Registered CF user "${handle}", found ${problem_count} problems.`,
            },
        }
    } catch (error) {
        console.error(error);
        res = { type: 4, data: { content: "Something went wrong" } }
    }
    return json(res);
}