import { Bot, InlineKeyboard } from "grammy";
import { insertOrUpdate, listOrders } from "./db/repo";
import { emojis, plurals, statuses, triggers } from "./vars";
import type { MessageOriginChannel } from "grammy/types";

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN is not set");
if (!process.env.CHAT_ID) throw new Error("CHAT_ID is not set");
if (!process.env.CHANNEL_ID) throw new Error("CHANNEL_ID is not set");
if (!process.env.POST_ID) throw new Error("POST_ID is not set");

export const bot = new Bot(process.env.BOT_TOKEN, {
  botInfo: process.env.BOT_INFO ? JSON.parse(process.env.BOT_INFO) : undefined,
});

// filters
const inGroup = bot
  .chatType("supergroup")
  .filter((c) => c.chat.id === parseInt(`-100${process.env.CHAT_ID}`));
const replyFromChannel = inGroup
  .filter((c) => c.msg?.reply_to_message?.is_automatic_forward === true)
  .filter((c) => c.msg?.reply_to_message?.caption !== undefined);
const forwarded = inGroup.filter((c) => c.msg?.is_automatic_forward === true);

// add new orders
forwarded.on(":caption", async (c) => {
  const caption = c.msg.caption!;
  const id = c.msgId;
  const post = (c.msg.forward_origin as MessageOriginChannel).message_id;
  const reply_parameters = { message_id: c.msgId };
  const disable_notification = true;

  try {
    await insertOrUpdate({
      id,
      status: "created",
      createdAt: new Date(),
      caption,
      post,
    });
    await c.reply("Новый", { reply_parameters, disable_notification });
  } catch (e) {
    await c.reply("Ошибка при создании!", {
      reply_parameters,
      disable_notification,
    });
  }
});

// order management
for (const status of statuses) {
  replyFromChannel.hears(triggers[status], async (c) => {
    const msg = c.msg.reply_to_message!;
    const id = msg.message_id;
    const post = (msg.forward_origin as MessageOriginChannel).message_id;
    const caption = msg.caption!;

    try {
      await insertOrUpdate({
        id,
        status,
        createdAt: new Date(),
        caption,
        post,
      });
      await c.react("👍");
    } catch (e) {
      console.log(e);
      await c.react("😢");
    }
  });
}

// commands
bot.chatType("private").command("commands", async (c) => {
  await bot.api.setMyCommands([
    { command: "n", description: "Новый" },
    { command: "r", description: "В работе" },
    { command: "g", description: "Готов" },
    { command: "v", description: "Выдан" },
  ]);
});
// post
const generateKeyboard = (status?: (typeof statuses)[number]) => {
  const kb = new InlineKeyboard();
  kb.text("Все", "all");
  if (!status) kb.primary();
  for (const s of statuses) {
    kb.text(emojis[s], s);
    if (s == status) kb.primary();
  }
  return kb;
};
bot.chatType("private").command("post", async (c) => {
  try {
    await bot.api.editMessageText(
      parseInt(`-100${process.env.CHANNEL_ID}`),
      parseInt(process.env.POST_ID!),
      "POST",
      { reply_markup: generateKeyboard("created") },
    );
    await c.react("👍");
  } catch (e) {
    console.log(e);
    await c.react("😢");
  }
});
bot
  .chatType("channel")
  .callbackQuery(["created", "processing", "ready", "completed"], async (c) => {
    const status = c.match as (typeof statuses)[number];

    try {
      const orders = await listOrders(status);
      await bot.api.editMessageText(
        parseInt(`-100${process.env.CHANNEL_ID}`),
        parseInt(process.env.POST_ID!),
        `<b>${plurals[status]}${status === "completed" ? " (последние 10)" : ""}</b>\n${orders.length ? orders.map((o, i) => `${i + 1}. <i>${o.createdAt.toLocaleDateString("ru", { day: "2-digit", month: "short" })}</i> <a href="t.me/c/${process.env.CHANNEL_ID}/${o.post}?comment=${o.id}">${o.caption}</a>`).join("\n") : "Пока что нет заказ-нарядов."}`,
        { reply_markup: generateKeyboard(status), parse_mode: "HTML" },
      );
    } catch (e) {
      console.log(e);
    }
    await c.answerCallbackQuery();
  });

bot.chatType("channel").callbackQuery("all", async (c) => {
  try {
    const orders = await listOrders();
    if (orders.length > 30)
      return await c.answerCallbackQuery("Заказ-нарядов слишком много.");
    await bot.api.editMessageText(
      parseInt(`-100${process.env.CHANNEL_ID}`),
      parseInt(process.env.POST_ID!),
      `<b>Все заказ-наряды</b>\n${orders.length ? orders.map((o, i) => `${i + 1}. <i>${o.createdAt.toLocaleDateString("ru", { day: "2-digit", month: "short" })}</i> <a href="t.me/c/${process.env.CHANNEL_ID}/${o.post}?comment=${o.id}">${o.caption}</a>`).join("\n") : "Пока что нет заказ-нарядов."}`,
      { reply_markup: generateKeyboard(), parse_mode: "HTML" },
    );
  } catch (e) {
    console.log(e);
  }
  await c.answerCallbackQuery();
});
