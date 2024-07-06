import { MemberSchema, RegisterDataSchema } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { getProblems, getUserProfile, updateUserSubmissions } from "../../util/codeforces.ts";
import { dbService } from "../../database/service.ts";
import { Offsets } from "../update/update.ts";

export async function registerUser(data: RegisterDataSchema, member: MemberSchema): Promise<IInteractionResponse> {
    const handleOption = data?.options?.find(
        (option: { name: string; value: string }) => option.name === 'handle'
    )
    if (!handleOption)
        throw new Error("Missing handle");

    const { value: handle } = handleOption;
    let res: IInteractionResponse;
    let problems: unknown[];
    let pfp: string | null = null;
    try {
        const [profileResult, problemsResult] = await Promise.allSettled([getUserProfile(handle), getProblems(new Offsets(-1), handle)]);
        if (problemsResult.status === 'rejected') {
            throw new Error('Failed to fetch submissions', { cause: problemsResult.reason });
        }
        problems = problemsResult.value;
        if (profileResult.status === 'rejected')
            console.error('Could not fetch profile');
        else
            pfp = profileResult.value;
    } catch (error) {
        console.error(error)
        return { type: 4, data: { content: "Could not retrieve submissions from the CF API." } };
    }

    const { error } = await dbService.insertUser({ cf_handle: handle, discord_user_id: member.user.id, profile_picture: pfp });
    if (error?.code === '23503')
        return { type: 4, data: { content: "User is not in the database" } };
    if (error?.code === '23505')
        return { type: 4, data: { content: "Database error: Duplicate found" } };


    let problem_count: number;
    try {
        const subbedProblems = await updateUserSubmissions(handle, member.user.id, problems);
        problem_count = subbedProblems.payload.length;
        res = {
            type: 4,
            data: {
                content: `Registered CF user "${handle}", found ${problem_count} submissions.`,
            },
        }
    } catch (error) {
        console.error(error);
        res = { type: 4, data: { content: "Something went wrong" } }
    }
    return res;
}