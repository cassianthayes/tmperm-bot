import { expect, test, describe, beforeEach, afterEach } from "bun:test";

describe("config", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Clear process.env and restore it to a base state
    for (const key in process.env) {
      delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
  });

  afterEach(() => {
    for (const key in process.env) {
      delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
  });

  test("should correctly prefix CHAT_ID and CHANNEL_ID", async () => {
    process.env.BOT_TOKEN = "test_token";
    process.env.CHAT_ID = "12345";
    process.env.CHANNEL_ID = "67890";
    process.env.POST_ID = "111";
    process.env.DATABASE_URL = "libsql://test.db";

    // Dynamic import to trigger the logic with new env vars
    // We use a timestamp to avoid module caching
    const { config } = await import(`./config.ts?update=${Date.now()}`);

    expect(config.prefixedChatId).toBe(-10012345);
    expect(config.prefixedChannelId).toBe(-10067890);
  });

  test("should throw error if BOT_TOKEN is missing", async () => {
    delete process.env.BOT_TOKEN;
    process.env.CHAT_ID = "12345";
    process.env.CHANNEL_ID = "67890";
    process.env.POST_ID = "111";
    process.env.DATABASE_URL = "libsql://test.db";

    try {
      await import(`./config.ts?update=${Date.now() + 1}`);
      expect().fail("Should have thrown an error");
    } catch (e: any) {
      expect(e.message).toBe("Environment variable BOT_TOKEN is required");
    }
  });
});
