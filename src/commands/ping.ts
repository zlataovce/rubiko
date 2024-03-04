import type { Command } from "./";
import type { Env } from "@/env";
import {
    type APIInteractionResponse,
    type APIApplicationCommandInteraction,
    InteractionResponseType,
    MessageFlags,
} from "discord-api-types/payloads/v10";

const ping: Command = {
    name: "ping",
    description: "Sends a ping interaction.",
    handler: async (_interaction: APIApplicationCommandInteraction, _env: Env): Promise<APIInteractionResponse> => {
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
