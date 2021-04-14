const Discord = require('discord.js');

const client = new Discord.Client();

client.login(process.env.DANS_DISCORD_BOT_TOKEN);

module.exports = client;
