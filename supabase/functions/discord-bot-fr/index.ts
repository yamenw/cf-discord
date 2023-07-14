import * as sift from 'sift';
import { home } from '../../../src/home.ts';

sift.serve({
  '/discord-bot-fr': home,
})