import { createClient } from 'supabase-js';
import { Database } from "../database.types.ts";

const url = Deno.env.get('SUPABASE_URL');
const token = Deno.env.get('SUPABASE_ANON_KEY');

if (!token)
    throw new Error("Missing Supabase Token");

if (!url)
    throw new Error("Missing Supabase URL");

export const supabase = createClient<Database>(url, token);
