module.exports = {
  name: "users",
  description: "Показывает количество игроков в комнате",
  async execute(bot, user, message, args) {
    try {
      const players = await bot.room.players.get();
      bot.chat.send(`Сейчас в комнате: ${players.length} игроков. 👥`);
    } catch (error) {
      console.error("Ошибка команды users:", error);
    }
  }
};
