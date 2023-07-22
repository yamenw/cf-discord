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

export function transformCFData(data: unknown[]) {

}