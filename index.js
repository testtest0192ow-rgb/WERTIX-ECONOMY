require("dotenv").config();

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


const commands = [
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Проверка работы WERTIX")
].map(command => command.toJSON());


const rest = new REST({ version: "10" })
    .setToken(process.env.TOKEN);


client.once("ready", async () => {

    console.log(`✅ WERTIX онлайн: ${client.user.tag}`);


    try {

        await rest.put(
            Routes.applicationCommands(client.user.id),
            {
                body: commands
            }
        );


        console.log("✅ Команды загружены");

    } catch(error) {

        console.log(error);

    }

});


client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;


    if (interaction.commandName === "ping") {

        await interaction.reply({
            content: "🏓 WERTIX работает!",
            ephemeral: false
        });

    }

});


client.login(process.env.TOKEN);
