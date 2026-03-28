# discord-sendiri-bot

A TypeScript Discord self-bot with a custom command handler and developer-only access control.

## Requirements

- Node.js 20+
- pnpm 9+

## Quick Start

### Setup

```bash
git clone https://github.com/stegripe/discord-sendiri-bot.git
cd discord-sendiri-bot
pnpm install
cp .env.example .env
```

Then fill `.env` with at least:

- `DISCORD_TOKEN`
- `DEVS` (comma-separated user IDs)

### Build and Run

```bash
pnpm build
pnpm start
```

## Available Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Build and start |
| `pnpm build` | Lint and compile TypeScript to `dist/` |
| `pnpm start` | Run compiled output with dotenv and pretty logs |
| `pnpm lint` | Run Biome checks |
| `pnpm lint:fix` | Auto-fix style and lint issues with Biome |

## Environment Variables

Main reference: `.env.example`.

| Variable | Required | Description |
| --- | --- | --- |
| `DISCORD_TOKEN` | Yes | Discord token used by the self-bot |
| `PREFIX` | No | Prefix command. Default: `m!` (dev mode: `dm!`) |
| `DEVS` | Yes | Developer user IDs (comma-separated). Only these IDs can run commands |
| `NODE_ENV` | No | `production` or `development` |

## Commands

### General

- `help` (`h`, `command`, `commands`, `cmd`, `cmds`)
- `ping` (`pong`, `pang`, `pung`, `peng`, `pingpong`)

### Developer

- `eval` (`evaluate`, `ev`, `js-exec`)
- `exec` (`$`, `bash`, `execute`)
- `spawn`

## Features

- Custom command and event loader (without Sapphire framework)
- Developer-only gate using `DEVS` in both message event and command manager layers
- Embed response helper with fallback for selfbot runtime edge cases
- Sharding manager support

## Docker

Run using the GHCR image configured in `docker-compose.yaml`:

```bash
docker compose up -d
docker compose logs -f
docker compose down
```

Make sure `.env` exists before starting containers.
