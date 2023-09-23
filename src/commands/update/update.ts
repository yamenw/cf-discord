import { dbService } from "../../database/service.ts";
import { getOption } from "../../helper/get-option.ts";
import { MemberSchema, UpdateDataSchmea } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { MESSAGES } from "../../types/constants.ts";
import { getProblems, updateUserSubmissions } from "../../util/codeforces.ts";

export async function updateUser(member: MemberSchema, payload: UpdateDataSchmea): Promise<IInteractionResponse> {
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

    const insertedProblems = await updateUserSubmissions(cf_handle, member.user.id, submissions, offset);
    const probCount = insertedProblems.payload.length;
    const CFAPI = 'https://codeforces.com/'; // TODO: better string templating
    let message: string;
    if (probCount > 0) {
        const problemIds = insertedProblems.payload
            .slice(0, 10)
            .map(({ problem_id: pid }) => `[${pid}](<${CFAPI}contest/${pid.slice(0, -1)}/problem/${pid.slice(-1)}>)`)
            .join(', ');
        message = `registered ${probCount} problem${probCount === 1 ? '' : 's'}\
out of ${submissions.length} submission${submissions.length === 1 ? '' : 's'}: ${problemIds}`;
    } else {
        message = 'found no new solved problems.'
    }
    // TODO: if prob count is incremented correctly
    return {
        type: 4,
        data: {
            content: `Updated user [${cf_handle}](<${CFAPI}/profile/${cf_handle}>), ${message}`,
        },
    }
}