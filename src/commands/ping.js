module.exports = {
  name: "ping",
  description: "Проверка задержки бота",
  async execute(bot, user, message, args) {
    bot.message.send(`Pong! 🏓 (Hot Reload активен)`);
  }
};
