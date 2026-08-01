require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB OK'))
    .catch(console.error);

client.login(process.env.TOKEN);
