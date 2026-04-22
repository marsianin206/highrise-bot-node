module.exports = {
  name: "addmod",
  minLevel: 3,
  description: "Добавить модератора",
  async execute(bot, user, message, args) {
    if (!args[0]) return bot.message.send("!addmod @username");
    const username = args[0].replace("@", "");
    const cfg = bot.handler.config;
    if (cfg.moderators.includes(username)) {
      return bot.message.send(`@${username} уже модератор.`);
    }
    cfg.moderators.push(username);
    bot.message.send(`@${username} назначен модератором.`);
  }
};