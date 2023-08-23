import { dbService } from "../../database/service.ts";
import { MemberSchema } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { getProblems, updateUserSubmissions } from "../../util/codeforces.ts";

export async function updateUser(member: MemberSchema): Promise<IInteractionResponse> {
    const { data, error } = await dbService.getUserProfile(member.user.id);
    if (error)
        return { type: 4, data: { content: "Something went wrong while retrieving user from database" } }
    if (data === null || !(data?.[0]))
        return { type: 4, data: { content: "Could not find user in database." } }

    const { cf_handle, last_fetched } = data[0];

    if (!cf_handle || !last_fetched)
        return { type: 4, data: { content: "Could not find user in database." } }

    const problems = await getProblems(last_fetched, cf_handle);

    const prob_count = await updateUserSubmissions(cf_handle, member.user.id, problems, last_fetched);
    // TODO: if prob count is incremented correctly
    return {
        type: 4,
        data: {
            content: `Updated user ${cf_handle}, found ${prob_count} submission${prob_count === 1 ? '' : 's'}`,
        },
    }
}