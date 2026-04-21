module.exports = {
  name: "help",
  description: "Список доступных команд",
  async execute(bot, user, message, args) {
    bot.chat.send(`Доступные команды: !ping, !users, !about, !help 🤖`);
  }
};
