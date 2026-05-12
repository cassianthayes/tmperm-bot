const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

export const config = {
  BOT_TOKEN: getEnv("BOT_TOKEN"),
  CHAT_ID: getEnv("CHAT_ID"),
  CHANNEL_ID: getEnv("CHANNEL_ID"),
  POST_ID: parseInt(getEnv("POST_ID")),
  DATABASE_URL: getEnv("DATABASE_URL"),
  DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
  BOT_INFO: process.env.BOT_INFO ? JSON.parse(process.env.BOT_INFO) : undefined,

  get prefixedChatId() {
    return parseInt(`-100${this.CHAT_ID}`);
  },
  get prefixedChannelId() {
    return parseInt(`-100${this.CHANNEL_ID}`);
  },
};
