const { getAllPlayers } = require('../utils');
module.exports = {
  name: "tip",
  async execute(bot, user, message, args) {
    if (args.length < 2) return bot.message.send("!tip @user amount");
    let username = args[0].replace("@", "");
    const amount = parseInt(args[1]);
    const amounts = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];
    if (!amounts.includes(amount)) return bot.message.send("Amounts: " + amounts.join(", "));
    try {
      const players = await getAllPlayers(bot);
      console.log("[TIP] Players:", players.map(p => p.username));
      const search = username.toLowerCase().trim();
      let found = players.find(p => (p.username || '').toLowerCase().trim() === search);
      if (!found) found = players.find(p => (p.username || '').toLowerCase().includes(search));
      if (!found) return bot.message.send("Player not found. Available: " + players.map(x => x.username).join(", "));
      console.log("[TIP] Found:", found.username, found.id);
      await bot.player.tip(found.id, amount);
      bot.message.send("Tip " + amount + " gold to " + found.username);
    } catch (e) {
      console.log("[TIP] Error:", e);
      bot.message.send("Error: " + e.message);
    }
  }
};