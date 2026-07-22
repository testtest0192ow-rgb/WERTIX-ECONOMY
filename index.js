require("dotenv").config();

const mongoose = require("mongoose");

const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder
} = require("discord.js");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});


// Команды WERTIX
const commands = [
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Проверка работы WERTIX")
].map(command => command.toJSON());


// Регистрация команд
const rest = new REST({ version: "10" })
    .setToken(process.env.TOKEN);


// Запуск бота
client.once("ready", async () => {

    console.log(`✅ WERTIX онлайн: ${client.user.tag}`);


    // Подключение команд
    try {

        await rest.put(
            Routes.applicationCommands(client.user.id),
            {
                body: commands
            }
        );

        console.log("✅ Команды загружены");

    } catch (error) {

        console.log("❌ Ошибка команд:", error);

    }


    // Подключение MongoDB
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB подключена");

    } catch (error) {

        console.log("❌ Ошибка MongoDB:", error);

    }

});


// Обработка команд
client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;


    if (interaction.commandName === "ping") {

        await interaction.reply({
            content: "🏓 WERTIX работает!",
            ephemeral: false
        });

    }

});


// Запуск
client.login(process.env.TOKEN);
