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

// Инициализация бота с правильными названиями событий для highrise.sdk.dev
const bot = new Highrise({
  Events: [
    "SessionMetadata",
    "ChatEvent",
    "UserJoinedEvent",
    "UserLeftEvent",
    "EmoteEvent",
    "Error"
  ],
  reconnect: 5
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

// В highrise.sdk.dev событие чата называется chatCreate
bot.on("chatCreate", (user, message) => {
  console.log(`[Чат] ${user.username || user}: ${message}`);
  
  // Передаем сообщение в менеджер команд
  commandManager.handleCommand(user, message);

  // Реакция на слово "бот"
  const msg = message.toLowerCase();
  if (msg.includes("бот") || msg.includes("bot")) {
    bot.chat.send(`Вы звали меня, @${user.username || user}? Я тут! 👋`);
  }
});

// В highrise.sdk.dev событие эмоции называется playerEmote
bot.on("playerEmote", (sender, receiver, emote_id) => {
  console.log(`[Эмоция] ${sender.username} -> ${emote_id}`);
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

bot.on("error", (error) => {
  console.error("[Бот] Ошибка:", error);
});

// Запуск
console.log("[Бот] Запуск...");
bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);
