const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', async () => {
  const channel = await client.channels.fetch('831983313584521247');
  channel.send('hello');
});

client.login(process.env.DANS_DISCORD_BOT_TOKEN);
