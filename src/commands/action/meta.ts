import type { Command } from "@/commands";
import type { Env } from "@/env";
import { USER_AGENT } from "@/util";
import {
  type APIApplicationCommandInteraction,
  type APIMessageApplicationCommandInteraction as APIMessageInteraction,
  type APIInteractionResponse,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionResponseType,
  MessageFlags,
} from "discord-api-types/payloads/v10";

const meta: Command = {
  type: ApplicationCommandType.Message,
  name: "What's this?",
  integration_types: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
  contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
  async handle(
    interaction: APIApplicationCommandInteraction,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<APIInteractionResponse> {
    const message = Object.values((interaction as APIMessageInteraction).data.resolved.messages)[0];
    if (!message) {
      return error("Something is wrong with the interaction.");
    }

    const url = message.embeds[0]?.image?.url;
    if (message.author.id !== interaction.application_id || !url || !url.startsWith(env.NEKOS_API_URL)) {
      return error("You need to click on an action message from me!");
    }

    try {
      const name = (await fetch(url, { headers: { "User-Agent": USER_AGENT } })).headers.get("anime_name");
      if (!name) {
        return {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: ":x: S-Sorry! I couldn't figure it out ._.",
            flags: MessageFlags.Ephemeral,
          },
        };
      }

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          // decodeURIComponent doesn't decode spaces from pluses for some reason...
          content: `:eyes: That one is from _${decodeURIComponent(name.replace(/\+/g, "%20"))}_!`,
          flags: MessageFlags.Ephemeral,
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

const error = (message: string): APIInteractionResponse => {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `:x: B-Baka! ${message} -_-`,
      flags: MessageFlags.Ephemeral,
    },
  };
};

export default meta;
