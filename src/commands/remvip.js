module.exports = {
  name: "remvip",
  minLevel: 3,
  description: "Убрать VIP",
  async execute(bot, user, message, args) {
    if (!args[0]) return bot.message.send("!remvip @username");
    const username = args[0].replace("@", "");
    const cfg = bot.handler.config;
    const idx = cfg.vips.indexOf(username);
    if (idx === -1) return bot.message.send(`@${username} не VIP.`);
    cfg.vips.splice(idx, 1);
    bot.message.send(`@${username} снят с VIP.`);
  }
};