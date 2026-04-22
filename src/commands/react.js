const { findUser } = require('../utils');
module.exports = {
  name: "react",
  async execute(bot, user, message, args) {
    if (args.length < 2) return bot.message.send("!react @user type");
    const username = args[0].replace("@", "");
    const type = args[1].toLowerCase();
    const types = ["clap", "heart", "thumbs", "wave", "wink"];
    if (!types.includes(type)) return bot.message.send("Types: " + types.join(", "));
    try {
      const p = await findUser(bot, username);
      if (!p) return bot.message.send("Player not found.");
       await bot.player.react(p.id, type);
      bot.message.send("React " + type + " to " + p.username);
    } catch (e) {
      bot.message.send("Error.");
    }
  }
};