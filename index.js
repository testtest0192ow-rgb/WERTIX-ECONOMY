require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");

const {
    Client,
    GatewayIntentBits,
    Collection,
    REST,
    Routes
} = require("discord.js");


const client = new Client({

    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]

});



client.commands = new Collection();



const commandFiles = fs.readdirSync("./commands")
    .filter(file => file.endsWith(".js"));



for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(
        command.data.name,
        command
    );

}




const rest = new REST({

    version: "10"

}).setToken(process.env.TOKEN);





client.once("ready", async () => {


    console.log(
        `✅ WERTIX онлайн: ${client.user.tag}`
    );



    try {


        await mongoose.connect(
            process.env.MONGO_URI
        );


        console.log(
            "✅ MongoDB подключена"
        );



    } catch(error) {


        console.log(
            "❌ MongoDB ошибка:",
            error
        );


    }





    try {


        await rest.put(

            Routes.applicationCommands(
                client.user.id
            ),

            {

                body: client.commands.map(
                    cmd => cmd.data.toJSON()
                )

            }

        );


        console.log(
            "✅ Команды загружены"
        );


    } catch(error) {


        console.log(
            "❌ Ошибка команд:",
            error
        );


    }


});





client.on(
"interactionCreate",
async interaction => {


    if (!interaction.isChatInputCommand())
        return;



    const command =
        client.commands.get(
            interaction.commandName
        );



    if (!command)
        return;



    try {


        await command.execute(
            interaction
        );



    } catch(error) {


        console.log(error);



        if (!interaction.replied) {


            interaction.reply({

                content:
                "❌ Произошла ошибка",

                ephemeral:true

            });


        }


    }


});





client.login(
    process.env.TOKEN
);
