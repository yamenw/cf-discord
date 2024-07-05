# cf-discord

A Discord bot that gamifies solving problems on Codeforces, is supposed to be easy to deploy, maintain, and develop.

## Tech Stack

- Supabase: Postgres and Deno edge functions

## Contributing

### Adding or Modifying Commands

To add or modify a command, create or change its `.command.ts` file ([example here](./src/commands/resolver.ts)), and then add it to the [all-commands.command.ts file](./src/commands/all-commands.command.ts) and submit it using the `submit` command.

To configure which bot you want to submit the commands to, create a [.env.secret](./.env.secret) file at the root of the project and add the `CFRANK_BOT_TOKEN` and `CFRANK_BOT_ID` env vars to it, then run:

```bash
deno task submit
```
