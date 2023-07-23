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

export function transformData(data: readonly unknown[], user_handle: string): ISubmissionModel[] {
    const result: ISubmissionModel[] = []; // TODO: better error handling
    for (let index = 0; index < data.length; index++)
        try {
            const elem = data[index] as ISubmission;
            if (!(elem?.problem?.rating))
                continue;
            if (elem?.verdict !== 'OK')
                continue;
            result.push({
                creation_time: new Date(elem.creationTimeSeconds).toISOString(),
                rating: elem.problem.rating,
                verdict: elem.verdict,
                user_handle,
                problem_id: null,
            })
            // deno-lint-ignore no-unused-vars
        } catch (error) {
            /* each element is assumed to be correct and incorrectly formatted items are ignored for performance reasons*/
        }
    return result;
}