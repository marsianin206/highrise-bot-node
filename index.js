require('dotenv').config();
const { Highrise } = require("highrise.sdk.dev");
const chokidar = require('chokidar');
const path = require('path');
const CommandHandler = require('./src/CommandHandler');
const Analyzer = require('./src/analyzer');
let tg = require('./src/telegram');
let analyzer;

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
let commandManager = new CommandHandler(bot);
bot.handler = commandManager;
commandManager.loadCommands();
analyzer = new Analyzer(bot, commandManager);
bot.analyzer = analyzer;

// Настройка Hot Reload через chokidar
const watcher = chokidar.watch([
  path.join(__dirname, 'src', 'commands'),
  path.join(__dirname, 'src', 'CommandHandler.js'),
  path.join(__dirname, 'src', 'config.js'),
  path.join(__dirname, 'src', 'telegram.js'),
  path.join(__dirname, 'src', 'analyzer.js')
], {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 50
  }
});

function reloadCommandHandler() {
  delete require.cache[require.resolve('./src/CommandHandler')];
  delete require.cache[require.resolve('./src/telegram')];
  delete require.cache[require.resolve('./src/config')];
  delete require.cache[require.resolve('./src/analyzer')];
  try {
    const HandlerClass = require('./src/CommandHandler');
    const freshHandler = new HandlerClass(bot);
    freshHandler.loadCommands();
    commandManager = freshHandler;
    bot.handler = freshHandler;
    tg = require('./src/telegram');
    analyzer = new Analyzer(bot, commandManager);
    bot.analyzer = analyzer;
    console.log(`[HotReload] Обработчик обновлен. Команд: ${freshHandler.commands.size}`);
  } catch (error) {
    console.error(`[HotReload] Ошибка:`, error.message);
  }
}

watcher.on('all', (event, filePath) => {
  const eventNames = {
    'add': 'Добавлен',
    'change': 'Изменен',
    'unlink': 'Удален'
  };
  console.log(`[HotReload] ${eventNames[event] || event}: ${path.basename(filePath)}`);
  reloadCommandHandler();
});

// --- Обработка событий ---

bot.on("ready", (session) => {
  console.log(`[Бот] Онлайн! Комната: ${session.room_info.room_name}`);
});

bot.on("chatCreate", (user, message) => {
  try {
    console.log(`[Чат] ${user.username || user}: ${message}`);
    commandManager.handleCommand(user, message);
    const msg = message.toLowerCase();
    if (msg.includes("бот") || msg.includes("bot")) {
      bot.message.send(`Вы звали меня, @${user.username || user}? Я тут! 👋`);
    }
  } catch (e) {
    console.error("[CHAT] Ошибка:", e);
    if (tg) tg.error(e, "ChatEvent");
  }
});

bot.on("playerEmote", (sender, receiver, emote_id) => {
  try {
    console.log(`[Эмоция] ${sender.username} -> ${emote_id}`);
    bot.player.emote(emote_id).catch(() => {});
  } catch (e) {
    console.error("[EMOTE] Ошибка:", e);
  }
});

bot.on("playerJoin", (user, position) => {
  try {
    console.log(`[Вход] ${user.username} вошел в комнату.`);
    bot.message.send(`Добро пожаловать, @${user.username}! ✨`);
  } catch (e) {
    console.error("[JOIN] Ошибка:", e);
  }
});

bot.on("playerLeave", (user) => {
  try {
    console.log(`[Выход] ${user.username} покинул комнату.`);
  } catch (e) {
    console.error("[LEAVE] Ошибка:", e);
  }
});

bot.on("error", (error) => {
  console.error("[Бот] Ошибка:", error);
  delete require.cache[require.resolve('./src/telegram')];
  try { tg = require('./src/telegram'); } catch {}
  tg.error(error, "BotError");
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  delete require.cache[require.resolve('./src/telegram')];
  try { tg = require('./src/telegram'); } catch {}
  tg.error(err, "UncaughtException");
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
  delete require.cache[require.resolve('./src/telegram')];
  try { tg = require('./src/telegram'); } catch {}
  tg.error(reason, "UnhandledRejection");
});

// Запуск
console.log("[Бот] Запуск...");
bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);
tg.startup();
