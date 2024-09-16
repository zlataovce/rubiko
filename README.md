# rubiko [![Invite](https://img.shields.io/badge/discord-invite-blue)](https://discord.com/oauth2/authorize?client_id=1213159235513352213&permissions=2147485696&scope=bot+applications.commands)

A small, server-less Discord bot for roleplaying and utility commands, designed to run on [Cloudflare Workers](https://workers.cloudflare.com/).

## Deployment

You'll need a JS runtime of your choice, e.g. Node.js, Deno or Bun, and `pnpm`.

Run `pnpm install` to download all needed dependencies, then `pnpm wrangler login` and log into your Cloudflare account.

At last, run `pnpm wrangler deploy` to deploy rubiko to a Worker.
You'll need to create these secrets for the bot, you can get them from the [Discord Developer Portal](https://discord.com/developers/applications):

```bash
pnpm wrangler secret put DISCORD_TOKEN
pnpm wrangler secret put DISCORD_PUBLIC_KEY
pnpm wrangler secret put DISCORD_APPLICATION_ID
```

At this point, the Worker is running and responding to interactions, but Discord doesn't know how to reach it.
Paste your Worker URL into the `Interactions Endpoint URL` field of your bot's page in the DDP and save changes.

Now, you can register the Worker's commands with Discord by issuing a `PUT` request with the appropriate `Authorization` header:
`curl -X PUT -H "Authorization: Bot <token>" <worker url>`

Everything should be up and running by now, make sure to grant the `bot` and `applications.commands` scopes when inviting.

## Licensing

This project is licensed under the [MIT License](./LICENSE).
