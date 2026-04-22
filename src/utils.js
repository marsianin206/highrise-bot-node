async function findUser(bot, username) {
  const users = await bot.room.players.get();
  const search = username.toLowerCase().replace('@', '').trim();
  
  for (const u of users || []) {
    const user = u[0];
    const name = (user.username || '').toLowerCase().trim();
    if (name === search) return user;
  }
  
  for (const u of users || []) {
    const user = u[0];
    const name = (user.username || '').toLowerCase().trim();
    if (name.includes(search) || search.includes(name)) return user;
  }
  
  return null;
}

async function getAllPlayers(bot) {
  const users = await bot.room.players.get();
  return (users || []).map(u => u[0]);
}

module.exports = { findUser, getAllPlayers };