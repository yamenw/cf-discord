import { Database } from "../../database.types.ts"
import { ISubmissionModel } from "../types/codeforces.ts";
import { supabase } from "./db.ts"

async function registerUser(user: Database['public']['Tables']['users']['Insert']) {
    return await supabase.from('users').insert(user);
}

async function insertSubmissions(submissions: ISubmissionModel[]) {
    return await supabase.from('submissions').insert(submissions);
}

async function updateSubmissionCount(userId: string, problem_count: number) {
    return await supabase
        .from('users')
        .update({ last_fetched: problem_count })
        .eq('discord_user_id', userId);
}

export const dbService = {
    registerUser,
    insertSubmissions,
    updateSubmissionCount
}