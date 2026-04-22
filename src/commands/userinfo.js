module.exports = {
  name: "user",
  async execute(bot, user, message, args) {
    if (!args[0]) return bot.message.send("!user @username");
    const username = args[0].replace("@", "");
    try {
      const players = await bot.room.players.get();
      const p = players.find(pl => pl.username?.toLowerCase() === username.toLowerCase());
      if (!p) return bot.message.send("Игрок не найден.");
      const pos = await bot.room.position(p.id);
      let info = `@${p.username} | ${p.id}`;
      if (pos) info += ` | ${pos.x?.toFixed(1)}, ${pos.y?.toFixed(1)}, ${pos.z?.toFixed(1)}`;
      bot.message.send(info);
    } catch (e) {
      bot.message.send("Ошибка");
    }
  }
};