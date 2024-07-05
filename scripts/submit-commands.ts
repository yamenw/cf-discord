import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { allCommandsSchemas } from "../src/commands/all-commands.command.ts";

async function submitAllCommands() {
    const env = await load({ envPath: '.env.secret' });

    if (!env["CFRANK_BOT_TOKEN"] || !env["CFRANK_BOT_ID"])
        throw new Error("Missing environment variables in .env.secret");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bot ${env["CFRANK_BOT_TOKEN"]}`);

    const promises = allCommandsSchemas.map(command => {
        const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(command),
            redirect: "follow"
        };
        const url = `https://discord.com/api/v8/applications/${env["CFRANK_BOT_ID"]}/commands`;
        return fetch(url, requestOptions)
    })

    try {
        const results = await Promise.all(promises);
        results.map(console.log);
    } catch (error) {
        console.error(error);
    }
}

await submitAllCommands();
