import { getOption } from "../helper/get-option.ts";
import { UpdateDataSchmea } from "../schema/schema.ts";


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
    readonly refetch: number;
    /**
     * 
     * @param last_fetched the index of the last fetched problem, enter a negative number to refetch all
     * @param payload
     */
    constructor(last_fetched: number, payload?: UpdateDataSchmea) {
        this.refetch = getOption('refetch_last', payload?.options) ?? 0;

        this.offset = Math.max(last_fetched - this.refetch, 0);
        this.startFromCFAPI = `${Math.max(this.offset, 1)}`;
    }

    calcUsersLastFetchedOffset = (problemsCount: number) => {
        return problemsCount + 1 + this.offset
    }

    getURL = (handle: string) => `https://codeforces.com/api/user.status?${this.getParamsFromStart(handle)}`;

    getParamsFromStart = (handle: string) => (new URLSearchParams({
        'count': Math.max(25, this.refetch).toString(),
        'handle': handle,
        'from': '1',
    }))
}
