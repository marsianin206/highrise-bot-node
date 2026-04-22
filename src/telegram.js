require('dotenv').config();
const https = require('https');

const CONFIG = {
  token: process.env.TG_TOKEN,
  chatId: process.env.TG_CHAT_ID
};

function send(message) {
  if (!CONFIG.token || !CONFIG.chatId) return;
  const data = JSON.stringify({
    chat_id: CONFIG.chatId,
    text: message,
    parse_mode: "HTML"
  });
  
  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${CONFIG.token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
      console.log(`[TG] Error: ${res.statusCode}`);
    }
  });
  
  req.on('error', (e) => {
    console.log(`[TG] Request error: ${e.message}`);
  });
  
  req.write(data);
  req.end();
}

function error(err, context = "") {
  if (!CONFIG.token || !CONFIG.chatId) return;
  const errMsg = String(err.message || err).substring(0, 50);
  const msg = `<b>❌ ${context}</b>\n${errMsg}`;
  send(msg);
  console.error(`[ERROR] ${context}:`, err);
}

function startup() {
  send("<b>🚀 Bot started</b>\nRoom online!");
}

function restart() {
  send("<b>🔄 Bot restarted</b>");
}

module.exports = { send, error, startup, restart };