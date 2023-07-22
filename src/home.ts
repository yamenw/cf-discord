import nacl from 'nacl';
import * as sift from 'sift';
import { DiscordCommandType } from './types/commands.ts';
import { interactionSchema } from './schema/schema.ts';
import { handleCommand } from './commands/commands.ts';


export async function home(request: Request) {
    const { error } = await sift.validateRequest(request, {
        POST: {
            headers: ['X-Signature-Ed25519', 'X-Signature-Timestamp'],
        },
    })
    if (error) {
        return sift.json({ error: error.message }, { status: error.status })
    }

    const { valid, body } = await verifySignature(request)
    if (!valid) {
        return sift.json(
            { error: 'Invalid request' },
            {
                status: 401,
            }
        )
    }

    const { type = 0, data } = interactionSchema.parse(JSON.parse(body))
    switch (type) {
        case DiscordCommandType.Ping:
            return sift.json({
                type: 1,
            })

        case DiscordCommandType.ApplicationCommand:
            return await handleCommand(data);

        default:
            return sift.json({ error: 'ETYPEZERO: bad request' }, { status: 400 })
    }
}

async function verifySignature(request: Request): Promise<{ valid: boolean; body: string }> {
    const PUBLIC_KEY = Deno.env.get('DISCORD_PUBLIC_KEY')!
    const signature = request.headers.get('X-Signature-Ed25519')!
    const timestamp = request.headers.get('X-Signature-Timestamp')!
    const body = await request.text()
    const valid = nacl.sign.detached.verify(
        new TextEncoder().encode(timestamp + body),
        hexToUint8Array(signature),
        hexToUint8Array(PUBLIC_KEY)
    )

    return { valid, body }
}

function hexToUint8Array(hex: string) {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)))
}