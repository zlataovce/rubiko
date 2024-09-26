import type { Env } from "@/env";
import type { Command } from "@/commands";
import { randomColor, USER_AGENT } from "@/util";
import {
    type APIApplicationCommandInteraction,
    type APIApplicationCommandInteractionDataUserOption as APICommandInteractionUserOption,
    type APIChatInputApplicationCommandInteraction as APIChatInputInteraction,
    type APIInteractionResponse,
    ApplicationCommandOptionType,
    ApplicationIntegrationType,
    InteractionContextType,
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
    artist_href?: string;
    artist_name?: string;
    source_url?: string;
    anime_name?: string;
    url: string;
}

interface NekosResponse {
    results: NekosResult[];
}

const fetchNekos = async (baseUrl: string, category: NekosCategory, amount: number = 1): Promise<NekosResponse> => {
    const url = `${baseUrl}/${category}` + (amount > 1 ? `?amount=${amount}` : "");

    return fetch(url, { headers: { "User-Agent": USER_AGENT } }).then((r) => r.json());
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
        integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
        contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
        async handle(
            interaction: APIApplicationCommandInteraction,
            env: Env,
            _ctx: ExecutionContext
        ): Promise<APIInteractionResponse> {
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

                let content = `:speech_balloon: ${message}`;

                const result = nekos.results[0];
                if (result.anime_name) {
                    content += `\n-# ${result.anime_name} • [Search on AniList](<https://anilist.co/search/anime?search=${encodeURIComponent(result.anime_name)}>)`;
                }

                return {
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: {
                        content: content,
                        embeds: [
                            {
                                color: randomColor(),
                                image: {
                                    url: result.url,
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
