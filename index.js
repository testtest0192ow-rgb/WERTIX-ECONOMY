const {
    Client,
    GatewayIntentBits,
    Collection,
    AttachmentBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const createLoveCard = require("./utils/loveCard");


const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent

    ]

});



client.commands = new Collection();



// загрузка команд

const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));



for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(
        command.data.name,
        command
    );

}



client.once("ready", () => {

    console.log(`✅ WERTIX онлайн: ${client.user.tag}`);

});




// обработчик команд + кнопок

client.on("interactionCreate", async interaction => {


    try {


        // Slash команды

        if (interaction.isChatInputCommand()) {


            const command = client.commands.get(
                interaction.commandName
            );


            if (!command) return;


            await command.execute(
                interaction
            );


        }




        // Кнопки

        if (interaction.isButton()) {



            // кнопка профиль любви

            if (interaction.customId === "love_profile") {



                await interaction.deferReply({
                    ephemeral: true
                });



                const user = interaction.user;



                const loveData = {


                    username: user.username,


                    avatar: user.displayAvatarURL({

                        extension: "png",

                        size: 512

                    }),



                    partner: "Нет пары",


                    status: "Свободен",


                    startDate: "—",


                    days: 0,


                    loveLevel: 1,


                    loveXp: 0


                };



                const image = await createLoveCard(
                    loveData
                );



                const file = new AttachmentBuilder(

                    image,

                    {
                        name: "love-profile.png"
                    }

                );



                await interaction.editReply({

                    files: [
                        file
                    ]

                });



            }



        }



    } catch (error) {


        console.error(error);



        if (interaction.deferred || interaction.replied) {


            await interaction.editReply({

                content: "❌ Произошла ошибка"

            });



        } else {


            await interaction.reply({

                content: "❌ Произошла ошибка",

                ephemeral: true

            });


        }


    }



});





client.login(process.env.TOKEN);
