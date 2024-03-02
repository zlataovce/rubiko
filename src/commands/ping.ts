import type { Command } from "./";
import {
    type APIInteractionResponse,
    type APIInteraction,
    InteractionResponseType,
    MessageFlags,
} from "discord-api-types/payloads/v10";

const ping: Command = {
    name: "ping",
    description: "Sends a ping interaction.",
    handler: (_interaction: APIInteraction): APIInteractionResponse => {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: ":ping_pong: Pong!",
                flags: MessageFlags.Ephemeral,
            },
        };
    },
};

export default ping;
