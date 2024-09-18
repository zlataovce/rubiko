import type { Env } from "@/env";
import type {
    APIApplicationCommand,
    APIApplicationCommandInteraction,
    APIInteractionResponse,
} from "discord-api-types/payloads/v10";
// import ping from "./ping";
import generate from "./generate";
// import meta from "./action/meta";
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
import peek from "./action/peek";
import punch from "./action/punch";
import sleep from "./action/sleep";
import yeet from "./action/yeet";

export interface Command extends Partial<APIApplicationCommand> {
    handle(data: APIApplicationCommandInteraction, env: Env, ctx: ExecutionContext): Promise<APIInteractionResponse>;
}

export const COMMANDS: Command[] = [
    // utility

    // ping,
    generate,

    // actions

    // meta,
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
    peek,
    punch,
    sleep,
    yeet,
];

const commands = new Map(COMMANDS.map((cmd) => [cmd.name!.toLowerCase(), cmd]));
export const find = (name: string): Command | null => {
    const cmd = commands.get(name.toLowerCase());
    if (!cmd) {
        return null;
    }

    return cmd;
};
