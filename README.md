<h1>Discord-Handlers</h1>
<h4>Manipulando eventos e comandos com Discord.js v13</h4>

<hr />

<h3>Instalações</h3>

```
npm i discord.js
npm i dotenv
```

<h3>Index</h3>

```js
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

    client.login(process.env.TOKEN); // Token do bot no arquivo .env
})();
```

<h3>Lendo arquivos de eventos</h3>

```js
module.exports = (client) => {
    client.handlerEvents = async (eventFiles) => {
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
};
```

<h3>Evento Ready</h3>

```js
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
```

<h3>Evento message</h3>

```js
module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {
        if (message.author.bot) return;

        const prefix = '!!'; // prefixo do bot

        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(" ");
        const cmd = args.shift().toLowerCase();
        const command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));

        try {
            command.execute(client, message, args);
        } catch (error) {
            return;
        }
    },
};
```

<h3>Lendo arquivos de comando</h3>

```js
const fs = require('fs');

module.exports = (client) => {
    client.handlerCommands = async (commandsFolders, path) => {
        for (folder of commandsFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.name, command);
            }
        }
    }
};
```

<h3>Comando ping</h3>
<h4>O comando abaixo calcula a quantidade de tempo que leva desde a criação da mensagem de comando até a criação da mensagem de resposta da API.</h4>

```js
module.exports = {
	name: 'ping',
	aliases: ['latencia', 'latency'], // Se você quiser usar um apelido para o seu comando, coloque aqui
	async execute(client, message) {
		const msg = await message.channel.send('Pinging...');
		msg.edit(`Pong 🏓\nBOT: ${Math.round(client.ws.ping)}ms\nAPI: ${msg.createdTimestamp - message.createdTimestamp}ms`);
	},
};
```