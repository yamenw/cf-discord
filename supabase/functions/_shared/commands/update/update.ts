import { Offsets } from "../../common/offsets.ts";
import { dbService } from "../../database/service.ts";
import { MemberSchema, UpdateDataSchmea } from "../../schema/schema.ts";
import { ISubmissionModel } from "../../types/codeforces.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { MESSAGES } from "../../types/constants.ts";
import { getProblems, updateUserSubmissions } from "../../util/codeforces.ts";


const CFAPI = 'https://codeforces.com/'; // TODO: better string templating

function formateUpdateMessage(subCount: number, solved: ISubmissionModel[]) {
    const probCount = solved.length;
    if (probCount === 0) {
        return 'found no new solved problems.'
    }

    const problemIds = solved
        .slice(0, 10)
        .map(({ problem_id: pid }) => `[${pid}](<${CFAPI}contest/${pid.slice(0, -1)}/problem/${pid.slice(-1)}>)`)
        .join(', ');
    return `registered ${probCount} problem${probCount === 1 ? '' : 's'} \
out of ${subCount} submission${subCount === 1 ? '' : 's'}: \
${problemIds}${solved.length > 10 ? '...' : ''}`;
}

export async function updateUser(member: MemberSchema, payload: UpdateDataSchmea): Promise<IInteractionResponse> {
    const { data, error } = await dbService.getUserProfile(member.user.id);
    if (error)
        return { type: 4, data: { content: "Something went wrong while retrieving user from database" } }
    if (data === null || !(data?.[0]))
        return { type: 4, data: { content: MESSAGES.USER_NOT_FOUND } }

    const { cf_handle, last_fetched } = data[0];

    if (!cf_handle || !last_fetched)
        return { type: 4, data: { content: MESSAGES.USER_NOT_FOUND } }

    const offsets = new Offsets(last_fetched, payload);

    let submissions: unknown[];
    try {
        submissions = await getProblems(offsets, cf_handle);
    } catch (error) {
        console.error(error);
        return { type: 4, data: { content: "Error occured while querying CF API." } }
    }

    const insertedProblems = await updateUserSubmissions(cf_handle, member.user.id, submissions, offsets);
    const message = formateUpdateMessage(submissions.length, insertedProblems.payload);

    return {
        type: 4,
        data: {
            content: `Updated user [\`${cf_handle}\`](<${CFAPI}/profile/${cf_handle}>), ${message}`,
        },
    }
}