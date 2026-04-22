const { findUser } = require('../utils');
module.exports = {
  name: "b",
  minLevel: 2,
  cooldown: true,
  async execute(bot, user, message, args) {
    if (!args[0]) return bot.message.send("!b @username [sec]");
    const username = args[0].replace("@", "");
    const seconds = parseInt(args[1]) || 300;
    try {
      const p = await findUser(bot, username);
      if (!p) return bot.message.send("Player not found.");
       await bot.player.ban(p.id, seconds);
      bot.message.send(`${p.username} banned.`);
    } catch (e) {
      bot.message.send("Error.");
    }
  }
};