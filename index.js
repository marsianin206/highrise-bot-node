require('dotenv').config();
const { Highrise } = require("highrise-js-sdk");

// Проверяем наличие переменных окружения
if (!process.env.BOT_TOKEN || !process.env.ROOM_ID) {
  console.error("Ошибка: BOT_TOKEN или ROOM_ID не установлены в файле .env");
  process.exit(1);
}

// Создаем экземпляр бота и указываем события, которые хотим получать
const bot = new Highrise({
  events: [
    "ready",
    "messages",
    "playerJoin",
    "playerLeave",
    "emoteCreate"
  ]
});

// Событие: Бот готов к работе
bot.on("ready", (session) => {
  console.log(`Бот успешно подключен!`);
  console.log(`ID бота: ${session.user_id}`);
  console.log(`Комната: ${session.room_info.room_name}`);
});

// Событие: Новое сообщение в чате
bot.on("chatMessageCreate", (user, message) => {
  console.log(`[Чат] ${user.username || user}: ${message}`);
  const msg = message.toLowerCase();

  // Команда !ping
  if (msg === "!ping") {
    bot.message.send(`Pong! 🏓`);
  }

  // Команда !help
  if (msg === "!help") {
    bot.message.send(`Доступные команды: !ping, !help, !about, !users`);
  }

  // Команда !about
  if (msg === "!about") {
    bot.message.send(`Я бот для Highrise, написанный на Node.js! 🤖`);
  }

  // Команда !users
  if (msg === "!users") {
    bot.room.players.get().then(players => {
      bot.message.send(`Сейчас в комнате: ${players.length} игроков. 👥`);
    }).catch(err => {
      console.error("Ошибка при получении списка игроков:", err);
    });
  }

  // Реакция на упоминание "бот"
  if (msg.includes("бот") || msg.includes("bot")) {
    bot.message.send(`Вы звали меня, @${user.username || user}? Я тут! 👋`);
  }
});

// Событие: Игрок использует эмоцию (танец и т.д.)
bot.on("emoteCreate", (user, receiver, emote_id) => {
  console.log(`${user.username} использовал эмоцию: ${emote_id}`);
  
  // Бот повторяет эмоцию за игроком (авто-танец)
  // Мы не проверяем ID бота, так как SDK обычно не присылает события от самого себя в этот обработчик
  bot.player.emote(emote_id).catch(err => {
    console.error("Ошибка при выполнении эмоции:", err);
  });
});

// Событие: Игрок зашел в комнату
bot.on("playerJoin", (user, position) => {
  console.log(`${user.username} зашел в комнату.`);
  bot.message.send(`Добро пожаловать в комнату, @${user.username}! 👋`);
});

// Событие: Игрок вышел из комнаты
bot.on("playerLeave", (user) => {
  console.log(`${user.username} покинул комнату.`);
});

// Обработка ошибок
bot.on("error", (error) => {
  console.error("Произошла ошибка бота:", error);
});

// Запуск бота
bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);
