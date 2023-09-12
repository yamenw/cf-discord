import { dbService } from "../../database/service.ts";
import { getOption } from "../../helper/get-option.ts";
import { MemberSchema, UpdateData } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { MESSAGES } from "../../types/constants.ts";
import { getProblems, updateUserSubmissions } from "../../util/codeforces.ts";

export async function updateUser(member: MemberSchema, payload: UpdateData): Promise<IInteractionResponse> {
    const { data, error } = await dbService.getUserProfile(member.user.id);
    if (error)
        return { type: 4, data: { content: "Something went wrong while retrieving user from database" } }
    if (data === null || !(data?.[0]))
        return { type: 4, data: { content: MESSAGES.USER_NOT_FOUND } }

    const { cf_handle, last_fetched } = data[0];

    if (!cf_handle || !last_fetched)
        return { type: 4, data: { content: MESSAGES.USER_NOT_FOUND } }

    const refetch = getOption('refetch_last', payload?.options) ?? 0;
    const offset = Math.max(last_fetched - refetch, 0);
    let submissions: unknown[]; // TODO: extract all problem counting logic elsewhere
    try {
        submissions = await getProblems(Math.max(offset, 1), cf_handle);
    } catch (error) {
        console.error(error);
        return { type: 4, data: { content: "Error occured while querying CF API." } }
    }

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