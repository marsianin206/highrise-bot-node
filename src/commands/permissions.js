module.exports = {
  name: "perms",
  async execute(bot, user, message, args) {
    const targetUser = args[0] ? args[0].replace("@", "") : (user?.username || user);
    try {
      const users = await bot.room.players.get();
      let found = null;
      for (const u of users || []) {
        if ((u[0].username || '').toLowerCase() === targetUser.toLowerCase()) {
          found = u[0];
          break;
        }
      }
      if (found) {
        try {
           const perms = await bot.player.permissions.get(found.id);
          let text = "Player";
          if (perms?.moderator) text = "Moderator";
          if (perms?.designer) text = "Designer";
          bot.message.send(found.username + ": " + text);
        } catch {
          bot.message.send(found.username + ": Player");
        }
      } else {
        bot.message.send("Player not found");
      }
    } catch (e) {
      bot.message.send("Error");
    }
  }
};