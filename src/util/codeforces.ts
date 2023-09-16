import { dbService } from "../database/service.ts";
import { ISubmission, ISubmissionModel } from "../types/codeforces.ts";

export async function getProblems(start: number, handle: string): Promise<unknown[]> {
    const url = new URL('https://codeforces.com/api/user.status')
    url.searchParams.append('count', '9999');
    url.searchParams.append('handle', handle);
    url.searchParams.append('from', `${start}`);
    let data: unknown;
    try {
        const res = await fetch(url);
        if (!res.ok || res.status !== 200) {
            console.error(res);
            throw new Error('Could not fetch data');
        }
        data = await res.json();
        if (!(data && typeof data === 'object' && 'status' in data && 'result' in data && Array.isArray(data.result)))
            throw new Error('Incorrect data format');
        if (data.status !== 'OK') {
            console.error(data);
            throw new Error('Codeforces returned non-OK status');
        }
    } catch (error) {
        console.error(error)
        throw new Error('Could not retrieve problems from the CF API.');
    }
    const { result } = data;
    if (Array.isArray(result))
        return result;
    throw new Error('Incorrect data format');
}

/**
 * 
 * @param handle CF username
 * @param discord_user_id Discord ID of the account attached to this CF handle
 * @param problems array of problems from the CF API
 * @param prob_count current offset for fetching problems
 * @returns number of problems that have been accepted
 */
export async function updateUserSubmissions(handle: string, discord_user_id: string, problems: unknown[], prob_count = 0) {
    const payload = transformData(problems, handle);
    await dbService.insertProblems(payload, discord_user_id, problems.length + 1 + prob_count, handle);
    return payload.length;
}


/**
 * Pure function
 * @param data arrat of problems fetched from the CF API
 * @param user_handle the CF handle to be attached to these names
 * @returns the problems in parsed correctly for insertion in the database
 */
export function transformData(data: readonly unknown[], user_handle: string): ISubmissionModel[] {
    const result: ISubmissionModel[] = [];
    const problemIndices: Map<string, number> = new Map();
    const { UNRATED_PLACEHOLDER } = dbService.CONTSTANTS;
    for (let index = 0; index < data.length; index++)
        try {
            const elem = data[index] as ISubmission;
            if (elem?.verdict !== 'OK')
                continue;
            if (!(elem?.problem?.contestId && elem?.problem?.index))
                continue;
            const problem_id = `${elem?.problem?.contestId}${elem?.problem?.index}`;
            const parsedSubmission = {
                creation_time: new Date(elem.creationTimeSeconds * 1000).toISOString(),
                rating: elem?.problem?.rating ?? UNRATED_PLACEHOLDER,
                verdict: elem.verdict,
                user_handle,
                problem_id,
            };
            if (!problemIndices.has(problem_id)) {
                result.push(parsedSubmission);
                problemIndices.set(problem_id, index)
                continue;
            }
            const duplicateSub = result[problemIndices.get(problem_id)!];
            if (duplicateSub.rating === UNRATED_PLACEHOLDER && parsedSubmission.rating !== UNRATED_PLACEHOLDER) {
                duplicateSub.rating = parsedSubmission.rating;
                duplicateSub.creation_time = parsedSubmission.creation_time;
            }
            // deno-lint-ignore no-unused-vars
        } catch (error) {
            /* each element is assumed to be correct and incorrectly formatted items are ignored for performance reasons*/
        }
    return result;
}
interface Profile {
    lastName: string
    lastOnlineTimeSeconds: number
    rating: number
    friendOfCount: number
    titlePhoto: string
    handle: string
    avatar: string
    firstName: string
    contribution: number
    organization: string
    rank: string
    maxRating: number
    registrationTimeSeconds: number
    maxRank: string
}

export async function getUserProfile(handle: string): Promise<string | null> {
    const url = new URL('https://codeforces.com/api/user.info');
    url.searchParams.append('handles', handle);
    let res: { status: string, result: Profile[] };
    try {
        res = await (await fetch(url)).json();
        if (res?.status !== 'OK') {
            console.error("CF API returned non-OK status");
            return null;
        }
        return res?.result?.[0]?.titlePhoto;
    } catch (error) {
        console.error(error);
        return null;
    }
}