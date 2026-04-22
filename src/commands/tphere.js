const { findUser } = require('../utils');
module.exports = {
  name: "tphere",
  async execute(bot, user, message, args) {
    if (!args[0]) return bot.message.send("!tphere @username");
    const username = args[0].replace("@", "");
    try {
      const p = await findUser(bot, username);
      if (!p) return bot.message.send("Player not found.");
      const myPos = await bot.room.position(bot.info.user.id);
      if (!myPos) return bot.message.send("Error.");
       await bot.player.teleport(p.id, myPos.x, myPos.y, myPos.z, myPos.facing);
      bot.message.send(p.username + " to you.");
    } catch (e) {
      bot.message.send("Error.");
    }
  }
};