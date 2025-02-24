export function sendTeleMessage(chat_id: string, message: string) {
  const TelegramBot = require("node-telegram-bot-api");
  const bot = new TelegramBot(process.env.TELE_BOT_TOKEN, { polling: false });
  bot.sendMessage(chat_id, message, { parse_mode: "HTML" });
}
