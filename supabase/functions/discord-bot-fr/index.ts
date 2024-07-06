import * as sift from 'sift';
import { BotInstance } from "../_shared/home.ts";

const bot = new BotInstance(Deno.env.get('DISCORD_PUBLIC_KEY')!);

sift.serve({
  '/discord-bot-fr': bot.home,
})
