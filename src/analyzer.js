const SAFE_CMDS = ['ping'];

class Analyzer {
  constructor(bot, handler) {
    this.bot = bot;
    this.handler = handler;
    this.errors = [];
    this.stats = { commands: 0, errors: 0, checks: 0, uptime: Date.now() };
    this.startAutoCheck();
  }

  startAutoCheck() {
    this.interval = setInterval(() => {
      this.checkAll();
      this.cleanup();
    }, 60000);
  }

  async testCommand(name) {
    const cmd = this.handler.commands.get(name);
    if (!cmd) return { name, ok: false, error: 'not found' };
    
    const mockUser = { username: 'Analyzer', id: '00000000' };
    const fakeMsg = '!' + name;
    
    try {
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      await Promise.race([
        cmd.execute(this.bot, mockUser, fakeMsg, []),
        timeout
      ]);
      return { name, ok: true };
    } catch (e) {
      return { name, ok: false, error: e.message.substring(0, 80) };
    }
  }

  async checkAll() {
    this.stats.checks++;
    const results = [];
    const errors = [];
    
    for (const [name] of this.handler.commands) {
      if (!SAFE_CMDS.includes(name)) continue;
      try {
        const result = await this.testCommand(name);
        results.push(result);
        if (!result.ok) {
          this.log(name, new Error(result.error), 'Analyzer');
          errors.push(result);
        }
      } catch (e) {
        this.log(name, e, 'Analyzer');
        errors.push({ name: name, error: e.message });
      }
    }
    
    const ok = results.filter(r => r.ok).length;
    const fail = errors.length;
    
    if (fail > 0) {
      const msg = '🔍 <b>AutoCheck</b>\n✅ ' + ok + ' ❌ ' + fail;
      for (const r of errors) {
        msg += '\n!' + r.name + ': ' + r.error;
      }
      this.send(msg);
    }
    
    return { ok, fail, errors };
  }

  log(cmd, err, user) {
    const entry = {
      time: new Date().toISOString(),
      cmd: cmd,
      error: (err.message || String(err)).substring(0, 100),
      user: typeof user === 'object' ? user.username : user
    };
    this.errors.unshift(entry);
    if (this.errors.length > 100) this.errors.pop();
    this.stats.errors++;
  }

  report() {
    const uptime = Math.floor((Date.now() - this.stats.uptime) / 60000);
    const msg = '📊 <b>Report</b>\n⏱️ Uptime: ' + uptime + 'min\n📨 Cmds: ' + this.stats.commands + '\n🔍 Checks: ' + this.stats.checks + '\n⚠️ Errors: ' + this.stats.errors;
    this.send(msg);
  }

  cleanup() {
    const old = Date.now() - 3600000;
    this.errors = this.errors.filter(e => new Date(e.time).getTime() > old);
  }

  send(msg) {
    try {
      const tg = require('./telegram');
      if (tg && tg.send) tg.send(msg);
    } catch {}
  }

  getErrors(count) {
    count = count || 10;
    return this.errors.slice(0, count);
  }
}

module.exports = Analyzer;