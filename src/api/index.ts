import { dbService } from "../database/service.ts";
import { getProfiles } from "../util/ranking.ts";

async function getRankings(): Promise<Response> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const { error, data } = await dbService.getSubmissionsByDate(startDate);
    if (error || !data) {
        return new Response(
            null,
            { headers: { "Content-Type": "application/json" }, status: 500 },
        )
    }
    const rankings = await getProfiles(data);

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, Content-Type',
    }

    return new Response(
        JSON.stringify(rankings),
        { headers: { "Content-Type": "application/json", ...corsHeaders } },
    )
}

export async function resolveREST(req: Request): Promise<Response> {
    return getRankings();
}