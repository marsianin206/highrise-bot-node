const fs = require('fs');
const path = require('path');
let tg;
try { tg = require('./telegram'); } catch {}

class CommandHandler {
  constructor(client) {
    this.client = client;
    this.commands = new Map();
    this.commandsPath = path.join(__dirname, 'commands');
    this.config = this.loadConfig();
    this.lastUsed = new Map();
  }

  loadConfig() {
    try {
      delete require.cache[require.resolve('./config')];
      return require('./config');
    } catch {
      return { owners: [], moderators: [], designers: [], vips: [], cooldown: 1000 };
    }
  }

  getLevel(username) {
    const name = username?.username || username;
    if (this.config.owners.includes(name)) return 3;
    if (this.config.moderators.includes(name)) return 2;
    if (this.config.designers.includes(name)) return 1;
    if (this.config.vips.includes(name)) return 0.5;
    return 0;
  }

  hasPerms(username, level = 1) {
    return this.getLevel(username) >= level;
  }

  isOwner(username) {
    return this.getLevel(username) >= 3;
  }

  canMod(username) {
    return this.hasPerms(username, 2);
  }

  checkCooldown(username) {
    const now = Date.now();
    const last = this.lastUsed.get(username) || 0;
    if (now - last < this.config.cooldown) return false;
    this.lastUsed.set(username, now);
    return true;
  }

  loadCommands() {
    this.commands.clear();
    this.config = this.loadConfig();
    const files = fs.readdirSync(this.commandsPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(this.commandsPath, file);
      delete require.cache[require.resolve(filePath)];
      try {
        const cmd = require(filePath);
        if (cmd.name && typeof cmd.execute === 'function') {
          cmd.minLevel = cmd.minLevel || 0;
          this.commands.set(cmd.name.toLowerCase(), cmd);
        }
      } catch (e) {
        console.error(`[CMD] Ошибка ${file}:`, e.message);
        if (tg) tg.error(e, `CMD Load: ${file}`);
      }
    }
  }

  async handleCommand(user, message) {
    if (!message.startsWith('!')) return;
    const username = user?.username || user;
    const args = message.slice(1).trim().split(/ +/);
    const name = args.shift().toLowerCase();
    const cmd = this.commands.get(name);
    if (!cmd) return;
    if (!this.hasPerms(username, cmd.minLevel || 0)) return;
    if (cmd.cooldown && !this.checkCooldown(username)) return;
    try {
      await cmd.execute(this.client, user, message, args);
      if (this.client.analyzer) this.client.analyzer.stats.commands++;
    } catch (e) {
      console.error(`[CMD] Ошибка ${name}:`, e.message);
      if (this.client.analyzer) this.client.analyzer.log(name, e, user);
      if (tg) tg.error(e, `CMD: !${name}`);
    }
  }
}

module.exports = CommandHandler;