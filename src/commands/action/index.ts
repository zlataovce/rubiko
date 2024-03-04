import type { Env } from "@/env";
import type { Command } from "@/commands";
import { randomColor } from "@/util";
import {
    type APIInteractionResponse,
    type APIApplicationCommandInteraction,
    type APIChatInputApplicationCommandInteraction as APIChatInputInteraction,
    type APIApplicationCommandInteractionDataUserOption as APICommandInteractionUserOption,
    ApplicationCommandOptionType,
    InteractionResponseType,
    MessageFlags,
} from "discord-api-types/payloads/v10";

export interface Action {
    name: string;
    description: string;
    category: string;
    messages: ActionMessages;
}

export interface ActionMessages {
    normal: string;
    lonely: string;
    self: string;
}

interface NekosResult {
    artist_href: string;
    artist_name: string;
    source_url: string;
    url: string;
}

interface NekosResponse {
    results: NekosResult[];
}

// based on Mantaro's interactions <3

export const createAction = (action: Action): Command => {
    return {
        name: action.name,
        description: action.description,
        options: [
            {
                type: ApplicationCommandOptionType.User,
                name: "user",
                description: "The receiving user.",
                required: true,
            },
        ],
        handler: async (interaction: APIApplicationCommandInteraction, env: Env): Promise<APIInteractionResponse> => {
            const url = `${env.NEKOS_API_URL}/${action.category}`;

            let invoker = interaction.user;
            if (!invoker) {
                invoker = interaction.member!.user;
            }

            const user = (interaction as APIChatInputInteraction).data.options![0] as APICommandInteractionUserOption;
            try {
                const resp = (await fetch(url).then((r) => r.json())) as NekosResponse;

                let message = action.messages.normal;
                if (user.value === invoker.id) {
                    message = action.messages.lonely;
                } else if (user.value === interaction.application_id) {
                    message = action.messages.self;
                }

                message = message.replace("%invoker%", `<@${invoker.id}>`).replace("%user%", `<@${user.value}>`);

                return {
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: `:speech_balloon: ${message}`,
                        embeds: [
                            {
                                color: randomColor(),
                                image: {
                                    url: resp.results[0].url,
                                },
                            },
                        ],
                    },
                };
            } catch (e) {
                console.error(e);

                return {
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: ":x: S-Sorry! I dropped the image. (something went wrong with my request to the API)",
                        flags: MessageFlags.Ephemeral,
                    },
                };
            }
        },
    };
};
