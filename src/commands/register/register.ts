import { json } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { dbService } from "../../database/service.ts";
import { MemberSchema, RegisterData } from "../../schema/schema.ts";
import { getProblems } from "../../util/codeforces.ts";
import { IInteractionResponse } from "../../types/commands.ts";

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
        dbService.registerUser({ cf_handle: handle, discord_user_id: member.user.id });
        const problems = await getProblems(1, handle);
        dbService.updateSubmissionCount(member.user.id, problems.length);
        problem_count = problems.length;
        res = {
            type: 4,
            data: {
                content: `Registered user ${handle}!, found ${problem_count} problems`,
            },
        }
    } catch (error) {
        console.error(error);
        res = { type: 4, data: { content: "Something went wrong" } }
    }
    return json(res);
}