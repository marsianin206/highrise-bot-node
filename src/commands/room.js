module.exports = {
  name: "room",
  async execute(bot, user, message, args) {
    try {
      const users = await bot.room.players.get();
      let count = 0;
      for (const u of users || []) {
        if (u[0].username) count++;
      }
      bot.message.send("Players: " + count);
    } catch (e) {
      bot.message.send("Error");
    }
  }
};