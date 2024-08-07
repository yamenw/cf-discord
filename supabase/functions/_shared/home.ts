import nacl from 'nacl';
import * as sift from 'sift';
import { DiscordCommandType } from './types/commands.ts';
import { interactionSchema, validateInteractionSchema } from './schema/schema.ts';
import { handleCommand } from './commands/resolver.ts';

export class BotInstance {
    private readonly botToken: string;
    constructor(botToken: string) {
        this.botToken = botToken;
    }

    home = async (request: Request) => {
        const { error } = await sift.validateRequest(request, {
            POST: {
                headers: ['X-Signature-Ed25519', 'X-Signature-Timestamp'],
            },
        })
        if (error) {
            return sift.json({ error: error.message }, { status: error.status })
        }

        const { valid, body } = await this.verifySignature(request)
        if (!valid) {
            return sift.json({ error: 'Invalid request' }, { status: 401 })
        }

        const interaction = validateInteractionSchema.parse(JSON.parse(body))
        switch (interaction.type) {
            case DiscordCommandType.Ping:
                return sift.json({ type: 1 })

            case DiscordCommandType.ApplicationCommand: {
                const interactionWithData = interactionSchema.safeParse(interaction);
                if (interactionWithData.success)
                    return sift.json(await handleCommand(interactionWithData.data));
                else
                    return sift.json({ status: 200 })
            }

            default:
                return sift.json({ error: 'ETYPEZERO: bad request' }, { status: 400 })
        }
    }

    verifySignature = async (request: Request): Promise<{ valid: boolean; body: string }> => {
        const PUBLIC_KEY = this.botToken;
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

}

function hexToUint8Array(hex: string) {
    return new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)))
}
