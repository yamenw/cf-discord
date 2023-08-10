import { getRankings } from "./get-ranks.ts";


export async function resolveREST(req: Request): Promise<Response> {
    const res = await getRankings();
    res.headers.append('Access-Control-Allow-Origin', '*');
    res.headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.headers.append('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, Content-Type');
    res.headers.append("Content-Type", "application/json");
    return res;
}