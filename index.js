require('dotenv').config();
const { Highrise } = require("highrise-js-sdk");

// Проверяем наличие переменных окружения
if (!process.env.HIGHRISE_TOKEN || !process.env.HIGHRISE_ROOM_ID) {
  console.error("Ошибка: HIGHRISE_TOKEN или HIGHRISE_ROOM_ID не установлены в файле .env");
  process.exit(1);
}

// Создаем экземпляр бота и указываем события, которые хотим получать
const bot = new Highrise({
  events: [
    "ready",
    "chatMessageCreate",
    "playerJoin",
    "playerLeave",
    "error"
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
  console.log(`[Чат] ${user.username}: ${message}`);

  // Команда !ping
  if (message.toLowerCase() === "!ping") {
    bot.message.send(`Pong! 🏓`);
  }

  // Команда !help
  if (message.toLowerCase() === "!help") {
    bot.message.send(`Доступные команды: !ping, !help, !about`);
  }

  // Команда !about
  if (message.toLowerCase() === "!about") {
    bot.message.send(`Я бот для Highrise, написанный на Node.js! 🤖`);
  }
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
bot.login(process.env.HIGHRISE_TOKEN, process.env.HIGHRISE_ROOM_ID);
