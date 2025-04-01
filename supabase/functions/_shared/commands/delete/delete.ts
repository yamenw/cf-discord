import { dbService } from "../../database/service.ts";
import { MemberSchema } from "../../schema/schema.ts";
import { IInteractionResponse } from "../../types/commands.ts";

export async function deleteUser(member: MemberSchema): Promise<IInteractionResponse> {
    try {
        await dbService.deleteUserByDiscordId(member.user.id);
    } catch (_error) {
        return { data: { content: 'Something went wrong while deleting the user' }, type: 4 }
    }

    return {
        data: {
            content: `Delete user with ID ${member.user.id} (<@${member.user.id}>) from the database.`,
        }, type: 4
    }
}
