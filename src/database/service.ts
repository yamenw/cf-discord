import { Database } from "../../database.types.ts"
import { supabase } from "./db.ts"

async function registerUser(user: Database['public']['Tables']['users']['Insert']) {
    return await supabase.from('users').insert(user);
}

export const dbService = {
    registerUser
}