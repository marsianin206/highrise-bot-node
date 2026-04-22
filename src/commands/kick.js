const { findUser } = require('../utils');
module.exports = {
  name: "k",
  minLevel: 2,
  cooldown: true,
  async execute(bot, user, message, args) {
    if (!args[0]) return bot.message.send("!k @username");
    const username = args[0].replace("@", "");
    try {
      const p = await findUser(bot, username);
      if (!p) return bot.message.send("Player not found.");
      await bot.player.kick(p.id);
      bot.message.send(`${p.username} kicked.`);
    } catch (e) {
      bot.message.send("Error.");
    }
  }
};