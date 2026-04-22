module.exports = {
  name: "addvip",
  minLevel: 3,
  description: "Добавить VIP",
  async execute(bot, user, message, args) {
    if (!args[0]) return bot.message.send("!addvip @username");
    const username = args[0].replace("@", "");
    const cfg = bot.handler.config;
    if (cfg.vips.includes(username)) {
      return bot.message.send(`@${username} уже VIP.`);
    }
    cfg.vips.push(username);
    bot.message.send(`@${username} назначен VIP.`);
  }
};