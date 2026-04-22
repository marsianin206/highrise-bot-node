module.exports = {
  name: "modlist",
  async execute(bot, user, message, args) {
    try {
      const users = await bot.room.players.get();
      const names = [];
      for (const u of users || []) {
        if (u[0].username) names.push(u[0].username);
      }
      if (names.length) {
        bot.message.send("Players: " + names.join(", "));
      } else {
        bot.message.send("No players.");
      }
    } catch (e) {
      bot.message.send("Error.");
    }
  }
};