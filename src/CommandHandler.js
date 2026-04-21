const fs = require('fs');
const path = require('path');

class CommandHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Map();
    this.commandsPath = path.join(__dirname, 'commands');
  }

  // Загрузка всех команд из папки src/commands
  loadCommands() {
    this.commands.clear();
    const commandFiles = fs.readdirSync(this.commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(this.commandsPath, file);
      
      // Очистка кэша require для Hot Reload
      delete require.cache[require.resolve(filePath)];
      
      try {
        const command = require(filePath);
        if (command.name && typeof command.execute === 'function') {
          this.commands.set(command.name.toLowerCase(), command);
          console.log(`[CommandHandler] Загружена команда: ${command.name}`);
        }
      } catch (error) {
        console.error(`[CommandHandler] Ошибка при загрузке команды ${file}:`, error);
      }
    }
    console.log(`[CommandHandler] Всего загружено команд: ${this.commands.size}`);
  }

  // Выполнение команды
  async handleCommand(user, message) {
    if (!message.startsWith('!')) return;

    const args = message.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = this.commands.get(commandName);
    if (command) {
      try {
        await command.execute(this.client, user, message, args);
      } catch (error) {
        console.error(`[CommandHandler] Ошибка выполнения команды ${commandName}:`, error);
        this.client.chat.send("Произошла ошибка при выполнении команды.");
      }
    }
  }
}

module.exports = CommandHandler;
