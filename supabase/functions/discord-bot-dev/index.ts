// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// TODO: Investigate using deno serve.

import * as sift from 'sift';
import { BotInstance } from '../../../src/home.ts';

const bot = new BotInstance(Deno.env.get('DISCORD_BOT_DEV_PUBKEY')!);

sift.serve({
  '/discord-bot-dev': bot.home,
})
