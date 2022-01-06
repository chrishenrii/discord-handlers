const fs = require('fs');

module.exports = (client) => {
    client.handlerCommands = async (commandsFolders, path) => {
        for (folder of commandsFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.name, command);
            }
        }
    }
};