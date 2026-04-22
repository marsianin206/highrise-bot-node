module.exports = {
  name: "sit",
  description: "Сесть на объект",
  async execute(bot, user, message, args) {
    if (args.length < 1) return bot.message.send("Использование: !sit entity_id [anchor_index]");
    const entityId = args[0];
    const anchorIndex = parseInt(args[1]) || 0;
    try {
      await bot.move.sit(entityId, anchorIndex);
    } catch (error) {
      bot.message.send("Ошибка выполнения.");
    }
  }
};