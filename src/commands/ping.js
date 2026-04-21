module.exports = {
  name: "ping",
  description: "Проверка задержки бота",
  async execute(bot, user, message, args) {
    bot.chat.send(`Pong! 🏓 (Hot Reload работает!)`);
  }
};
