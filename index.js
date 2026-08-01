const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// 🔥 handler команд
const loadCommands = () => {
    const files = fs.readdirSync('./commands');

    for (const file of files) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
};

// 🔥 handler событий (будет масштаб)
const loadEvents = () => {
    const eventFiles = fs.readdirSync('./events');

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        client.on(event.name, (...args) => event.execute(...args, client));
    }
};

loadCommands();
loadEvents();

client.login(process.env.TOKEN);
