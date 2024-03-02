import { Router, IRequest, json, error } from "itty-router";
import { verifyKey } from "discord-interactions";
import { COMMANDS, findHandler } from "./commands";
import { type APIInteraction, InteractionType, InteractionResponseType } from "discord-api-types/payloads/v10";

export interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;
    //
    // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
    // MY_SERVICE: Fetcher;
    //
    // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
    // MY_QUEUE: Queue;

    DISCORD_TOKEN: string;
    DISCORD_PUBLIC_KEY: string;
    DISCORD_APPLICATION_ID: string;
}

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

                return json(handler(interaction));
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
