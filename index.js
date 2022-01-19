require('dotenv').config();
const fs = require('fs');
const { Collection, Client, Intents } = require('discord.js');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
	]
});

client.commands = new Collection();

const functions = fs.readdirSync('./src/functions').filter(file => file.endsWith('.js'));
const eventsFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
const commandsFolders = fs.readdirSync('./src/commands');

(async () => {
    for (file of functions) {
        require(`./src/functions/${file}`)(client);
    }
    client.handlerEvents(eventsFiles, "./src/events");
    client.handlerCommands(commandsFolders, "./src/commands");

    client.login(process.env.TOKEN);
})();