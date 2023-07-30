import { MemberSchema, RegisterData } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { getProblems, updateUserSubmissions } from "../../util/codeforces.ts";
import { dbService } from "../../database/service.ts";

export async function registerUser(data: RegisterData, member: MemberSchema): Promise<IInteractionResponse> {
    const handleOption = data?.options?.find(
        (option: { name: string; value: string }) => option.name === 'handle'
    )
    if (!handleOption)
        throw new Error("Missing handle");

    const { value: handle } = handleOption;
    let problem_count: number;
    let res: IInteractionResponse;
    let problems: unknown[];
    try {
        problems = await getProblems(1, handle);
    } catch (error) {
        console.error(error)
        return { type: 4, data: { content: "Could not retrieve problems from the CF API." } };
    }

    const { error } = await dbService.insertUser({ cf_handle: handle, discord_user_id: member.user.id });
    if (error?.code === '23503')
        return { type: 4, data: { content: "User is not in the database" } };
    if (error?.code === '23505')
        return { type: 4, data: { content: "Database error: Duplicate found" } };


    try {
        problem_count = await updateUserSubmissions(handle, member.user.id, problems);
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
    return res;
}