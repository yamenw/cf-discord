import * as sift from 'sift';
import { BotInstance } from '../../../src/home.ts';

const bot = new BotInstance(Deno.env.get('DISCORD_PUBLIC_KEY')!);

sift.serve({
  '/discord-bot-fr': bot.home,
})
