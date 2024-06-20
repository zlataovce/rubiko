import type { Command } from "./";
import type { Env } from "@/env";
import {
    type APIInteractionResponse,
    type APIApplicationCommandInteraction,
    InteractionResponseType,
    MessageFlags,
    ApplicationIntegrationType,
    InteractionContextType,
} from "discord-api-types/payloads/v10";

const ping: Command = {
    name: "ping",
    description: "Sends a ping interaction.",
    integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
    contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
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
