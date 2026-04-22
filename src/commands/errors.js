module.exports = {
  name: "errors",
  minLevel: 3,
  async execute(bot, user, message, args) {
    try {
      if (args[0] === 'report') {
        if (bot.analyzer) bot.analyzer.report();
        return;
      }
      if (args[0] === 'check') {
        if (bot.analyzer) {
          const r = bot.analyzer.checkAll();
          bot.message.send(`AutoCheck: ✅${r.ok} ❌${r.fail}`);
        }
        return;
      }
      const errs = bot.analyzer ? bot.analyzer.getErrors(5) : [];
      if (!errs.length) return bot.message.send("✅ Ошибок нет");
      bot.message.send(`⚠️ Последние ${errs.length} ошибок:`);
      for (const e of errs) {
        const t = new Date(e.time).toLocaleTimeString("ru");
        bot.message.send(`!${e.cmd} [${t}] ${e.error}`);
      }
    } catch (err) {
      bot.message.send("Ошибка");
    }
  }
};