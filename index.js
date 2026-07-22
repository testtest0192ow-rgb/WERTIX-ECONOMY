const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const fs = require("fs");

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent,

        GatewayIntentBits.GuildMembers

    ]

});



client.commands = new Collection();



// загрузка команд

const commandFiles = fs.readdirSync("./commands")
    .filter(file => file.endsWith(".js"));


for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(
        command.data.name,
        command
    );

}



client.once("clientReady", () => {

    console.log(`✅ WERTIX онлайн: ${client.user.tag}`);

});




// команды

client.on("interactionCreate", async interaction => {


    if (!interaction.isChatInputCommand()) return;



    const command = client.commands.get(
        interaction.commandName
    );



    if (!command) return;



    try {


        await command.execute(interaction);



    } catch (error) {


        console.error(error);



        // проверяем, отвечал ли уже Discord

        if (interaction.replied || interaction.deferred) {


            await interaction.followUp({

                content: "❌ Произошла ошибка",

                ephemeral: true

            });



        } else {



            await interaction.reply({

                content: "❌ Произошла ошибка",

                ephemeral: true

            });


        }


    }


});




// кнопки

client.on("interactionCreate", async interaction => {


    if (!interaction.isButton()) return;



    try {


        if (interaction.customId === "love_profile") {


            await interaction.reply({

                content: "💖 Профиль любви в разработке",

                ephemeral: true

            });


        }



    } catch(error) {


        console.error(error);



        if (!interaction.replied) {


            await interaction.reply({

                content: "❌ Ошибка кнопки",

                ephemeral: true

            });


        }


    }


});



client.login(process.env.TOKEN);
