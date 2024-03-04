import { Router, IRequest, json, error } from "itty-router";
import { verifyKey } from "discord-interactions";
import { type APIInteraction, InteractionType, InteractionResponseType } from "discord-api-types/payloads/v10";
import { COMMANDS, findHandler } from "./commands";
import type { Env } from "./env";

const readInteraction = async (request: Request, env: Env): Promise<APIInteraction | null> => {
    const signature = request.headers.get("X-Signature-Ed25519");
    if (!signature) return null;
    const timestamp = request.headers.get("X-Signature-Timestamp");
    if (!timestamp) return null;

    const body = await request.text();
    if (!verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY)) {
        return null;
    }

    return JSON.parse(body);
};

const router = Router()
    .get("/", (_request: IRequest, env: Env, _ctx: ExecutionContext): Response => {
        return json({ status: 200, id: env.DISCORD_APPLICATION_ID });
    })
    .post("/", async (request: IRequest, env: Env, _ctx: ExecutionContext): Promise<Response> => {
        const interaction = await readInteraction(request, env);
        if (!interaction) {
            return error(401, "Bad request signature");
        }

        switch (interaction.type) {
            case InteractionType.Ping: {
                return json({ type: InteractionResponseType.Pong });
            }
            case InteractionType.ApplicationCommand: {
                const handler = findHandler(interaction.data.name);
                if (!handler) {
                    return error(400, "Unknown command");
                }

                return json(await handler(interaction, env));
            }
        }

        return error(400, "Unsupported interaction");
    })
    .put("/", async (request: IRequest, env: Env, _ctx: ExecutionContext): Promise<Response> => {
        if (request.headers.get("Authorization") !== `Bot ${env.DISCORD_TOKEN}`) {
            return error(401, "Mismatching token");
        }

        const resp = await fetch(`https://discord.com/api/v10/applications/${env.DISCORD_APPLICATION_ID}/commands`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bot ${env.DISCORD_TOKEN}`,
            },
            body: JSON.stringify(COMMANDS),
        });
        if (!resp.ok) {
            return error(500, { error: "Failed to register commands", data: await resp.json() });
        }

        return json({ status: 200, data: await resp.json() });
    });

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        return router.handle(request, env, ctx).catch(error);
    },
};
