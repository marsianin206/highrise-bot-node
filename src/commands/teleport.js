const { findUser } = require('../utils');
module.exports = {
  name: "tp",
  async execute(bot, user, message, args) {
    if (args.length < 4) return bot.message.send("!tp @user x y z");
    const username = args[0].replace("@", "");
    const x = parseFloat(args[1]);
    const y = parseFloat(args[2]);
    const z = parseFloat(args[3]);
    if (isNaN(x) || isNaN(y) || isNaN(z)) return bot.message.send("Invalid coords.");
    try {
      const p = await findUser(bot, username);
      if (!p) return bot.message.send("Player not found.");
       await bot.player.teleport(p.id, x, y, z, args[4] || "FrontRight");
      bot.message.send(p.username + " teleported.");
    } catch (e) {
      bot.message.send("Error.");
    }
  }
};