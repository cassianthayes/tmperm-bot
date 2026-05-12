# tmperm-bot

A Telegram bot for managing order status in a channel and group.

## Features

- **Automatic order creation**: Forwards from a channel to a group are automatically registered as new orders.
- **Status management**: Update order status using commands or triggers in the group.
- **Dashboard**: A pinned post in the channel displays current orders grouped by status.
- **Interactive keyboard**: Easily switch between different order statuses in the channel.

## Commands

- `/start` - Basic greeting and info.
- `/commands` - Register bot commands in the menu (New, In Progress, Ready, Done).
- `/post` - Initialize/update the status dashboard in the channel.

## Environment Variables

The following environment variables are required:

- `BOT_TOKEN`: Your Telegram Bot API token.
- `CHAT_ID`: The numeric ID of the group where orders are managed (without -100 prefix).
- `CHANNEL_ID`: The numeric ID of the channel where the dashboard is located (without -100 prefix).
- `POST_ID`: The message ID of the dashboard post in the channel.
- `DATABASE_URL`: URL for the SQLite/LibSQL database.
- `DATABASE_AUTH_TOKEN`: (Optional) Auth token for the database.
- `BOT_INFO`: (Optional) JSON string of bot information to avoid `getMe` call on startup.

## Development

This project uses [Bun](https://bun.sh).

```bash
# Install dependencies
bun install

# Run in development mode (with hot reload)
bun run dev

# Generate database migrations
bun run generate

# Push schema changes to database
bun run push
```

## Deployment

The bot is designed to run as a Cloudflare Worker.

```bash
# Deploy to Cloudflare Workers
bun wrangler deploy
```
