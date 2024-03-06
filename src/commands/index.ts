import type { Env } from "@/env";
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
import slap from "./action/slap";
import bite from "./action/bite";
import tickle from "./action/tickle";
import blush from "./action/blush";
import cuddle from "./action/cuddle";
import pout from "./action/pout";

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
    slap,
    bite,
    tickle,
    blush,
    cuddle,
    pout,
];

const commands = new Map(COMMANDS.map((cmd) => [cmd.name!.toLowerCase(), cmd]));
export const findHandler = (name: string): CommandHandler | null => {
    const cmd = commands.get(name.toLowerCase());
    if (!cmd) {
        return null;
    }

    return cmd.handler;
};
