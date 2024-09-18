import type { Env } from "@/env";
import type { Command } from "@/commands";
import {
    type APIApplicationCommandInteraction,
    type APIApplicationCommandInteractionDataSubcommandOption as APICommandInteractionSubcommandOption,
    type APIApplicationCommandInteractionDataStringOption as APICommandInteractionStringOption,
    type APIChatInputApplicationCommandInteraction as APIChatInputInteraction,
    type APIInteractionResponse,
    type APIInteraction,
    ApplicationCommandOptionType,
    ApplicationIntegrationType,
    InteractionContextType,
    InteractionResponseType,
    MessageFlags,
} from "discord-api-types/payloads/v10";

const models: Record<string, BaseAiTextGenerationModels> = {
    "phi-2": "@cf/microsoft/phi-2",
    "gemma-7b": "@hf/google/gemma-7b-it",
    "qwen-1-5-7b": "@cf/qwen/qwen1.5-7b-chat-awq",
    "llama-3-8b": "@cf/meta/llama-3-8b-instruct",
    "tinyllama-1-1b": "@cf/tinyllama/tinyllama-1.1b-chat-v1.0",
};

interface ImmediateAnswer {
    response?: string;
}

const sendDeferred = async (interaction: APIInteraction, env: Env, data: any) => {
    await fetch(
        `https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${interaction.token}/messages/@original`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data),
        }
    );
};

const handleDeferred = async (
    interaction: APIApplicationCommandInteraction,
    prompt: string,
    model: BaseAiTextGenerationModels,
    env: Env
) => {
    try {
        const answer = (await env.AI.run(model, { prompt })) as ImmediateAnswer;

        const resp = answer.response?.trim() ? answer.response : "_LLM silence_";
        await sendDeferred(interaction, env, {
            content: resp.substring(0, 2000), // limit to 2k characters
            allowed_mentions: { parse: [] },
        });
    } catch (e) {
        console.error(e);

        await sendDeferred(interaction, env, {
            content: ":x: S-Sorry! I dropped the response. (maybe I exceeded my AI limit)",
        });
    }
};

const generate: Command = {
    name: "generate",
    description: "Generates various things.",
    options: Object.entries(models).map(([k, v]) => ({
        type: ApplicationCommandOptionType.Subcommand,
        name: k,
        description: `Generates text using the ${v} model.`,
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "prompt",
                description: "The input prompt.",
                required: true,
            },
        ],
    })),
    integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
    contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
    async handle(
        interaction: APIApplicationCommandInteraction,
        env: Env,
        ctx: ExecutionContext
    ): Promise<APIInteractionResponse> {
        const cmd = (interaction as APIChatInputInteraction).data.options![0] as APICommandInteractionSubcommandOption;

        const model = models[cmd.name];
        if (!model) {
            return {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: ":x: S-Sorry! I lost the model :(",
                    flags: MessageFlags.Ephemeral,
                },
            };
        }

        const prompt = (cmd.options![0] as APICommandInteractionStringOption).value;
        ctx.waitUntil(handleDeferred(interaction, prompt, model, env));

        return { type: InteractionResponseType.DeferredChannelMessageWithSource };
    },
};

export default generate;
