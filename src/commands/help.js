module.exports = {
  name: "help",
  async execute(bot, user, message, args) {
    try {
      const username = user?.username || user;
      const level = bot.handler ? bot.handler.getLevel(username) : 0;
      bot.message.send("📋 <b>HELP</b>\n—");
      if (level >= 3) {
        bot.message.send("👑 Owner: !addmod !remmod !addvip !remvip");
      }
      bot.message.send("🛡️ Mod: !k !b !ub !m !um !mod !unmod");
      bot.message.send("🎨 Des: !des !undes !perms");
      bot.message.send("ℹ️ Info: !va !vr !modlist !room !user !rank");
      bot.message.send("⚡ Other: !tp !tphere !react !emote !tip !walk !sit");
    } catch (e) {
      bot.message.send("Ошибка");
    }
  }
};