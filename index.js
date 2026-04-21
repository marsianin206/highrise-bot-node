require('dotenv').config();
const { Highrise } = require("highrise.sdk.dev");
const chokidar = require('chokidar');
const path = require('path');
const CommandHandler = require('./src/CommandHandler');

// Проверка конфига
if (!process.env.BOT_TOKEN || !process.env.ROOM_ID) {
  console.error("Ошибка: BOT_TOKEN или ROOM_ID не установлены в .env");
  process.exit(1);
}

// Инициализация бота
const bot = new Highrise({
  events: [
    "ready",
    "chatMessageCreate",
    "playerJoin",
    "playerLeave",
    "emoteCreate"
  ],
  reconnect: 5 // Авто-переподключение каждые 5 секунд при разрыве
});

// Инициализация менеджера команд
const commandManager = new CommandHandler(bot);
commandManager.loadCommands();

// Настройка Hot Reload через chokidar
const watcher = chokidar.watch(path.join(__dirname, 'src'), {
  persistent: true,
  ignoreInitial: true
});

watcher.on('change', (filePath) => {
  console.log(`[HotReload] Файл изменен: ${path.basename(filePath)}. Перезагрузка логики...`);
  commandManager.loadCommands();
});

// --- Обработка событий ---

bot.on("ready", (session) => {
  console.log(`[Бот] Онлайн! Комната: ${session.room_info.room_name}`);
});

bot.on("chatMessageCreate", (user, message) => {
  console.log(`[Чат] ${user.username || user}: ${message}`);
  
  // Передаем сообщение в менеджер команд
  commandManager.handleCommand(user, message);

  // Дополнительная логика (реакция на слово "бот")
  const msg = message.toLowerCase();
  if (msg.includes("бот") || msg.includes("bot")) {
    bot.chat.send(`Вы звали меня, @${user.username || user}? Я тут! 👋`);
  }
});

bot.on("emoteCreate", (user, receiver, emote_id) => {
  console.log(`[Эмоция] ${user.username} -> ${emote_id}`);
  // Авто-повтор эмоции
  bot.player.emote(emote_id).catch(() => {});
});

bot.on("playerJoin", (user, position) => {
  console.log(`[Вход] ${user.username} вошел в комнату.`);
  bot.chat.send(`Добро пожаловать, @${user.username}! ✨`);
});

bot.on("playerLeave", (user) => {
  console.log(`[Выход] ${user.username} покинул комнату.`);
});

// Обработка ошибок в новом SDK
bot.on("error", (error) => {
  console.error("[Бот] Критическая ошибка:", error);
});

// Запуск
console.log("[Бот] Запуск...");
bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);
