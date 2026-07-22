const {
    SlashCommandBuilder,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const createProfileCard = require("../utils/profileCard");


module.exports = {

    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Показать профиль пользователя"),


    async execute(interaction) {

        const user = interaction.user;


        const image = await createProfileCard({

            username: user.username,

            avatar: user.displayAvatarURL({
                extension: "png",
                size: 256
            }),


            joinDate: "22.07.26",


            balance: "5 000 000",

            // текущий стрик пользователя
            streak: 25,


            marriage: "Нет",


            voice: 240,


            level: 15

        });



        const file = new AttachmentBuilder(
            image,
            {
                name: "profile.png"
            }
        );



        const buttons = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()

                    .setCustomId("love_profile")

                    .setLabel("Профиль любви")

                    // твой кастомный эмодзи любви
                    .setEmoji("<:emoji_6:1529430913396506705>")

                    .setStyle(ButtonStyle.Secondary)

            );



        await interaction.reply({

            files: [file],

            components: [
                buttons
            ]

        });

    }

};
