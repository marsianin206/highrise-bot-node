module.exports = {
  name: "remmod",
  minLevel: 3,
  description: "Убрать модератора",
  async execute(bot, user, message, args) {
    if (!args[0]) return bot.message.send("!remmod @username");
    const username = args[0].replace("@", "");
    const cfg = bot.handler.config;
    const idx = cfg.moderators.indexOf(username);
    if (idx === -1) return bot.message.send(`@${username} не модератор.`);
    cfg.moderators.splice(idx, 1);
    bot.message.send(`@${username} снят с модератора.`);
  }
};