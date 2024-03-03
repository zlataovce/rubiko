import type { Env } from "../";
import type {
    APIApplicationCommand,
    APIApplicationCommandInteraction,
    APIInteractionResponse,
} from "discord-api-types/payloads/v10";
import ping from "./ping";
import pat from "./action/pat";
import hug from "./action/hug";
import kiss from "./action/kiss";
import poke from "./action/poke";

export type CommandHandler = (
    interaction: APIApplicationCommandInteraction,
    env: Env
) => Promise<APIInteractionResponse>;

export interface Command extends Partial<APIApplicationCommand> {
    handler: CommandHandler;
}

export const COMMANDS: Command[] = [
    // utility
    ping,
    // actions
    pat,
    hug,
    kiss,
    poke,
];

const commands = new Map(COMMANDS.map((cmd) => [cmd.name!.toLowerCase(), cmd]));
export const findHandler = (name: string): CommandHandler | null => {
    const cmd = commands.get(name.toLowerCase());
    if (!cmd) {
        return null;
    }

    return cmd.handler;
};
