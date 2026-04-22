const { findUser } = require('../utils');
module.exports = {
  name: "unmod",
  minLevel: 2,
  cooldown: true,
  async execute(bot, user, message, args) {
    if (!args[0]) return bot.message.send("!unmod @username");
    const username = args[0].replace("@", "");
    try {
      const p = await findUser(bot, username);
      if (!p) return bot.message.send("Player not found.");
       await bot.player.moderator.remove(p.id);
      bot.message.send(`${p.username} removed.`);
    } catch (e) {
      bot.message.send("Error.");
    }
  }
};