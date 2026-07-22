require("dotenv").config();

const mongoose = require("mongoose");

const User = mongoose.model("User", new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },

    coins: {
        type: Number,
        default: 0
    },

    messages: {
        type: Number,
        default: 0
    },

    voiceTime: {
        type: Number,
        default: 0
    },

    wins: {
        type: Number,
        default: 0
    },

    losses: {
        type: Number,
        default: 0
    }

}));


const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});


const commands = [

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Проверка работы WERTIX"),


    new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Показать баланс монет")

].map(command => command.toJSON());



const rest = new REST({
    version: "10"
}).setToken(process.env.TOKEN);



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

    } catch (error) {

        console.log("❌ Ошибка команд:", error);

    }



    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB подключена");


    } catch (error) {

        console.log("❌ Ошибка MongoDB:", error);

    }

});




client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;



    if (interaction.commandName === "ping") {

        return interaction.reply({
            content: "🏓 WERTIX работает!"
        });

    }




    if (interaction.commandName === "balance") {


        let user = await User.findOne({

            userId: interaction.user.id

        });



        if (!user) {

            user = await User.create({

                userId: interaction.user.id,

                coins: 0,

                messages: 0,

                voiceTime: 0,

                wins: 0,

                losses: 0

            });

        }




        const embed = new EmbedBuilder()

            .setColor("#2b2d31")

            .setAuthor({

                name: interaction.user.username,

                iconURL: interaction.user.displayAvatarURL()

            })

            .setTitle("💰 WERTIX Balance")


            .addFields(

                {
                    name: "🪙 Монеты",
                    value: `**${user.coins.toLocaleString()}**`,
                    inline: true
                },

                {
                    name: "💬 Сообщения",
                    value: `**${user.messages}**`,
                    inline: true
                },

                {
                    name: "🎙️ Время в ГС",
                    value: `**${user.voiceTime} минут**`,
                    inline: true
                },

                {
                    name: "🏆 Победы",
                    value: `**${user.wins}**`,
                    inline: true
                },

                {
                    name: "❌ Поражения",
                    value: `**${user.losses}**`,
                    inline: true
                }

            )


            .setThumbnail(
                interaction.user.displayAvatarURL()
            )


            .setFooter({

                text: "WERTIX Economy"

            })


            .setTimestamp();



        return interaction.reply({

            embeds: [embed]

        });

    }


});



client.on("error", error => {

    console.log("❌ Discord Error:", error);

});


process.on("unhandledRejection", error => {

    console.log("❌ Promise Error:", error);

});



client.login(process.env.TOKEN);
