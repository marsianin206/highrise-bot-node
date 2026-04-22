module.exports = {
  name: "debug",
  minLevel: 3,
  async execute(bot, user, message, args) {
    try {
      const users = await bot.room.players.get();
      let list = [];
      let count = 0;
      for (const u of users || []) {
        count++;
        list.push(u[0].username || "unknown");
      }
      bot.message.send("Count: " + count + " | " + list.join(", "));
    } catch (e) {
      bot.message.send("Error: " + e.message);
    }
  }
};