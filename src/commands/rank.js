module.exports = {
  name: "rank",
  description: "Показать свой уровень",
  async execute(bot, user, message, args) {
    const username = user?.username || user;
    const level = bot.handler.getLevel(username);
    const names = { 0: "игрок", 0.5: "VIP", 1: "дизайнер", 2: "модератор", 3: "владелец" };
    bot.message.send(`@${username}: ${names[level] || "игрок"}`);
  }
};