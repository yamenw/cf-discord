import { json } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { dbService } from "../../database/service.ts";
import { MemberSchema } from "../../schema/schema.ts";

export async function updateUser(member: MemberSchema): Promise<Response> {
    const prob_count = dbService.getUserProblemCount(member.user.id);
    return json({
        type: 4,
        data: {
            content: `not yet implemented, prob cnt: ${prob_count}`,
        },
    })
}