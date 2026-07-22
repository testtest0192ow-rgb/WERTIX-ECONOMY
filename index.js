require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


client.once("ready", () => {
    console.log(`✅ WERTIX запущен как ${client.user.tag}`);
});


client.login(process.env.TOKEN);
