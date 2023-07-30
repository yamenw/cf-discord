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
        if (!res.ok || res.status !== 200)
            throw new Error('Could not fetch data');
        data = await res.json();
        if (!(data && typeof data === 'object' && 'status' in data && 'result' in data && Array.isArray(data.result)))
            throw new Error('Incorrect data format');
        if (data.status !== 'OK') {
            console.error(data);
            throw new Error('Codeforces returned non-OK status');
        }
    } catch (error) {
        throw new Error(error);
    }
    const { result } = data;
    if (Array.isArray(result))
        return result;
    throw new Error('Incorrect data format');
}

export async function updateUserSubmissions(handle: string, discord_user_id: string, start: number) {
    const problems = await getProblems(start, handle);
    const payload = transformData(problems, handle);
    await dbService.insertUser({ cf_handle: handle, discord_user_id: discord_user_id });
    const [{ error: error1 }, { error: error2 }] = await Promise.all([
        dbService.updateSubmissionCount(discord_user_id, problems.length),
        dbService.insertSubmissions(payload)
    ])
    if (error1) {
        console.error(error1); // TODO: Refactor this mess
        throw error1;
    }
    if (error2) {
        console.error(error2);
        throw error2;
    }
    return problems.length;
}


/**
 * Pure function
 * @param data arrat of problems fetched from the CF API
 * @param user_handle the CF handle to be attached to these names
 * @returns the problems in parsed correctly for insertion in the database
 */
export function transformData(data: readonly unknown[], user_handle: string): ISubmissionModel[] {
    const result: ISubmissionModel[] = []; // TODO: better error handling
    for (let index = 0; index < data.length; index++)
        try {
            const elem = data[index] as ISubmission;
            if (!(elem?.problem?.rating))
                continue;
            if (elem?.verdict !== 'OK')
                continue;
            if (!(elem?.problem?.contestId && elem?.problem?.index))
                continue;
            const problem_id = `${elem?.problem?.contestId}${elem?.problem?.index}`
            result.push({
                creation_time: new Date(elem.creationTimeSeconds * 1000).toISOString(),
                rating: elem.problem.rating,
                verdict: elem.verdict,
                user_handle,
                problem_id,
            })
            // deno-lint-ignore no-unused-vars
        } catch (error) {
            /* each element is assumed to be correct and incorrectly formatted items are ignored for performance reasons*/
        }
    return result;
}