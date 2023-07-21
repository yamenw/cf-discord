import { createClient } from 'supabase-js';

const url = Deno.env.get('SUPABASE_URL');
const token = Deno.env.get('SUPABASE_TOKEN');

if (!token)
    throw new Error("Missing Supabase Token");

if (!url)
    throw new Error("Missing Supabase URL");

export const supabase = createClient(url, token);
