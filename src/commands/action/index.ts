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

export type NekosCategory =
    | "baka"
    | "bite"
    | "blush"
    | "bored"
    | "cry"
    | "cuddle"
    | "dance"
    | "facepalm"
    | "feed"
    | "handhold"
    | "handshake"
    | "happy"
    | "highfive"
    | "hug"
    | "husbando"
    | "kick"
    | "kiss"
    | "kitsune"
    | "laugh"
    | "lurk"
    | "neko"
    | "nod"
    | "nom"
    | "nope"
    | "pat"
    | "peck"
    | "poke"
    | "pout"
    | "punch"
    | "shoot"
    | "shrug"
    | "slap"
    | "sleep"
    | "smile"
    | "smug"
    | "stare"
    | "think"
    | "thumbsup"
    | "tickle"
    | "waifu"
    | "wave"
    | "wink"
    | "yawn"
    | "yeet";

interface NekosResult {
    artist_href: string;
    artist_name: string;
    source_url: string;
    url: string;
}

interface NekosResponse {
    results: NekosResult[];
}

const fetchNekos = async (baseUrl: string, category: NekosCategory, amount: number = 1): Promise<NekosResponse> => {
    const url = `${baseUrl}/${category}` + (amount > 1 ? `?amount=${amount}` : "");

    return fetch(url).then((r) => r.json());
};

export interface Action {
    name: string;
    description: string;
    category?: NekosCategory;
    messages: ActionMessages;
}

export interface ActionMessages {
    normal: string;
    lonely: string;
    self: string;
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
            let invoker = interaction.user;
            if (!invoker) {
                invoker = interaction.member!.user;
            }

            const user = (interaction as APIChatInputInteraction).data.options![0] as APICommandInteractionUserOption;
            try {
                const nekos = await fetchNekos(env.NEKOS_API_URL, action.category || (action.name as NekosCategory));

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
                                    url: nekos.results[0].url,
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
