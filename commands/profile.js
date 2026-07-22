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


        await interaction.deferReply();



        const user = interaction.user;



        // Данные пользователя
        // Потом сюда подключим MongoDB

        const userData = {

            username: user.username,


            avatar: user.displayAvatarURL({

                extension: "png",

                size: 512

            }),


            joinDate: "22.07.2026",


            balance: 0,


            timely: 0,


            marriage: "Не состоит в браке",


            voice: "0ч 0м",


            messages: 0,


            level: 1,


            xp: 0,


            maxXp: 100


        };





        const image = await createProfileCard(userData);



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

                    .setEmoji("<:emoji_6:1529430913396506705>")

                    .setStyle(ButtonStyle.Secondary)

            );





        await interaction.editReply({

            files: [file],

            components: [buttons]

        });



    }

};
