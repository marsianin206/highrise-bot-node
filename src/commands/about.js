module.exports = {
  name: "about",
  description: "Информация о боте",
  async execute(bot, user, message, args) {
    bot.message.send(`Я продвинутый бот Highrise с поддержкой Hot Reload! 🚀`);
  }
};
