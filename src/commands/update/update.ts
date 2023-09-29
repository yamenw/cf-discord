import { dbService } from "../../database/service.ts";
import { getOption } from "../../helper/get-option.ts";
import { MemberSchema, UpdateDataSchmea } from "../../schema/schema.ts";
import { ISubmissionModel } from "../../types/codeforces.ts";
import { IInteractionResponse } from "../../types/commands.ts";
import { MESSAGES } from "../../types/constants.ts";
import { getProblems, updateUserSubmissions } from "../../util/codeforces.ts";

export class Offsets {
    /**
     * The from parameter from the [CFAPI](https://codeforces.com/apiHelp/methods#user.status)
     * 
     * > *1-based index of the first submission to return.*
     * 
     * Cannot be non-positive.
     */
    readonly startFromCFAPI: `${number}`;
    private readonly offset: number;
    readonly count = '9999';
    constructor(last_fetched: number, payload: UpdateDataSchmea) {
        const refetch = getOption('refetch_last', payload?.options) ?? 0;

        this.offset = Math.max(last_fetched - refetch, 0);
        this.startFromCFAPI = `${Math.max(this.offset, 1)}`;
    }

    calcUsersLastFetchedOffset(problemsCount: number) {
        return problemsCount + 1 + this.offset
    }
}

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

    // TODO: if prob count is incremented correctly
    return {
        type: 4,
        data: {
            content: `Updated user [${cf_handle}](<${CFAPI}/profile/${cf_handle}>), ${message}`,
        },
    }
}