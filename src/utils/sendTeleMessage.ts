export function sendTeleMessage(
  token: string,
  chat_id: string,
  message: string
) {
  const TelegramBot = require("node-telegram-bot-api");
  const bot = new TelegramBot(token, { polling: true });
  bot.sendMessage(chat_id, message, { parse_mode: "HTML" });
}
