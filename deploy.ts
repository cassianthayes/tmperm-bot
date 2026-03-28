import { webhookCallback } from "grammy";
import { bot } from "./src";

export default {
  async fetch(request: Request) {
    return await webhookCallback(bot, "cloudflare-mod")(request);
  },
};
