module.exports = {
  name: "check",
  minLevel: 3,
  async execute(bot, user, message, args) {
    try {
      if (!args[0]) {
        const cmds = Array.from(bot.handler.commands.keys());
        let ok = 0, fail = 0;
        for (const name of cmds) {
          try {
            const cmd = bot.handler.commands.get(name);
            if (cmd.name && typeof cmd.execute === 'function') ok++;
            else fail++;
          } catch { fail++; }
        }
        return bot.message.send(`📊 Команды: ${ok} ✅ ${fail} ❌`);
      }
      const name = args[0].replace("!", "");
      const cmd = bot.handler.commands.get(name.toLowerCase());
      if (!cmd) return bot.message.send(`Команда !${name} не найдена`);
      const checks = [
        { name: "name", ok: !!cmd.name },
        { name: "execute", ok: typeof cmd.execute === 'function' },
        { name: "minLevel", ok: cmd.minLevel !== undefined },
        { name: "async", ok: cmd.execute?.constructor?.name === 'AsyncFunction' }
      ];
      const results = checks.map(c => c.ok ? "✅" : "❌").join(" ");
      bot.message.send(`🔍 !${name}: ${results}`);
    } catch (err) {
      bot.message.send("Ошибка проверки");
    }
  }
};