module.exports = {
  name: "emote",
  description: "Показать эмоцию",
  async execute(bot, user, message, args) {
    if (!args[0]) return bot.message.send("Использование: !emote id_эмоции");
    const emoteId = args[0];
    try {
      await bot.player.emote(emoteId);
    } catch (error) {
      bot.message.send("Неверный ID эмоции.");
    }
  }
};