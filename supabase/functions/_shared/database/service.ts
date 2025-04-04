
import { Database } from "../database.types.ts";
import { ISubmissionModel } from "../types/codeforces.ts";
import { supabase } from "./db.ts"

async function insertUser(user: Database['public']['Tables']['users']['Insert']) {
    return await supabase.from('users').insert(user);
}

async function insertSubmissions(submissions: ISubmissionModel[]) {
    if (!submissions)
        return { error: null };
    return await supabase.from('submissions').upsert(submissions, { ignoreDuplicates: true });
}

async function updateSubmissionCount(userId: string, problem_count: number) {
    return await supabase
        .from('users')
        .update({ last_fetched: problem_count })
        .eq('discord_user_id', userId);
}

async function getUserProfile(userId: string) {
    return await supabase
        .from('users')
        .select('last_fetched, cf_handle')
        .eq('discord_user_id', userId);
}

async function getAllUserProfiles() {
    return await supabase
        .from('users')
        .select('cf_handle, profile_picture');
}

/**
 * 
 * @param time Time in Milliseconds
 * @returns 
 */
async function getSubmissionsByDate(time: Date) {
    return await supabase
        .from('submissions')
        .select('rating, user_handle')
        .gt('creation_time', time.toISOString())
        .eq('verdict', 'OK');
}

async function getUserScores(days_since: number) {
    const { data, error } = await supabase
        .rpc('get_user_scores', {
            days: days_since
        })

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

async function insertProblems(new_submissions: ISubmissionModel[], user_id: string, sub_count: number, cf_handle: string) {
    const { data, error } = await supabase
        .rpc('insert_submission_models', {
            cf_handle,
            new_submissions,
            sub_count,
            user_id,
        })

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

/**
 * This will cause a cascade delete on the users submissions
 * 
 * @param discord_id Discord ID of the user to delete
 * @returns 
 */
async function deleteUserByDiscordId(discord_id: string) {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('discord_user_id', discord_id);

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

async function getUserScoresREST(days_since: number) {
    const { data, error } = await supabase
        .rpc('get_user_scores_rest', {
            days: days_since
        })

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}



export const dbService = {
    insertUser,
    insertSubmissions,
    updateSubmissionCount,
    getUserProfile,
    getSubmissionsByDate,
    getAllUserProfiles,
    getUserScores,
    getUserScoresREST,
    insertProblems,
    deleteUserByDiscordId,
    CONTSTANTS: {
        UNRATED_PLACEHOLDER: -1
    } as const,
}