import { dbService } from "../../database/service.ts";
import { getOption } from "../../helper/get-option.ts";
import { MemberSchema, UpdateData } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { getProblems, updateUserSubmissions } from "../../util/codeforces.ts";

export async function updateUser(member: MemberSchema, payload: UpdateData): Promise<IInteractionResponse> {
    const { data, error } = await dbService.getUserProfile(member.user.id);
    if (error)
        return { type: 4, data: { content: "Something went wrong while retrieving user from database" } }
    if (data === null || !(data?.[0]))
        return { type: 4, data: { content: "Could not find user in database." } }

    const { cf_handle, last_fetched } = data[0];

    if (!cf_handle || !last_fetched)
        return { type: 4, data: { content: "Could not find user in database." } }

    const refetch = getOption('refetch_last', payload?.options) ?? 0;
    const offset = Math.max(last_fetched - refetch, 0);
    const submissions = await getProblems(offset, cf_handle);

    const prob_count = await updateUserSubmissions(cf_handle, member.user.id, submissions, offset);
    // TODO: if prob count is incremented correctly
    return {
        type: 4,
        data: {
            content: `Updated user [${cf_handle}](<https://codeforces.com/profile/${cf_handle}>), \
registered ${prob_count} problem${prob_count === 1 ? '' : 's'} \
out of ${submissions.length} submission${submissions.length === 1 ? '' : 's'}`,
        },
    }
}