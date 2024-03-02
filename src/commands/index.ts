import type { APIApplicationCommand, APIInteraction, APIInteractionResponse } from "discord-api-types/payloads/v10";
import ping from "./ping";

export type CommandHandler = (interaction: APIInteraction) => APIInteractionResponse;

export interface Command extends Partial<APIApplicationCommand> {
    handler: CommandHandler;
}

export const COMMANDS: Command[] = [ping];

const commands = new Map(COMMANDS.map((cmd) => [cmd.name!.toLowerCase(), cmd]));
export const findHandler = (name: string): CommandHandler | null => {
    const cmd = commands.get(name.toLowerCase());
    if (!cmd) {
        return null;
    }

    return cmd.handler;
};
