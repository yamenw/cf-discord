import { dbService } from "../database/service.ts";
import { rankUsersLegacy } from "../util/ranking.ts";

export async function resolveREST(req: Request): Promise<Response> {
    // const body = await req.json();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const { error, data } = await dbService.getSubmissionsByDate(startDate);
    if (error || !data) {
        return new Response(
            null,
            { headers: { "Content-Type": "application/json" }, status: 500 },
        )
    }
    const rankings = Object.entries(rankUsersLegacy(data)).sort((a, b) => b[1] - a[1])
    return new Response(
        JSON.stringify({ data: rankings }),
        { headers: { "Content-Type": "application/json" } },
    )
}