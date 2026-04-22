module.exports = {
  name: "walk",
  description: "Идти к координатам",
  async execute(bot, user, message, args) {
    if (args.length < 3) return bot.message.send("Использование: !walk x y z [facing]");
    const x = parseFloat(args[0]);
    const y = parseFloat(args[1]);
    const z = parseFloat(args[2]);
    const facing = args[3] || "FrontRight";
    if (isNaN(x) || isNaN(y) || isNaN(z)) return bot.message.send("Координаты должны быть числами.");
    try {
      await bot.move.walk(x, y, z, facing);
    } catch (error) {
      bot.message.send("Ошибка выполнения.");
    }
  }
};