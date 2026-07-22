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


        // даём Discord понять, что бот обрабатывает запрос
        await interaction.deferReply();



        const user = interaction.user;



        // временные данные
        // позже заменим на MongoDB

        const userData = {


            username: user.username,


            avatar: user.displayAvatarURL({

                extension: "png",

                size: 256

            }),



            joinDate: "22.07.2026",



            balance: "5 000 000",



            streak: 25,



            marriage: "Нет",



            voice: 240,



            messages: "12 500",



            level: 15

        };





        const image = await createProfileCard(userData);




        const file = new AttachmentBuilder(

            image,

            {

                name: "profile.png"

            }

        );





        const button = new ActionRowBuilder()

            .addComponents(


                new ButtonBuilder()

                    .setCustomId("love_profile")

                    .setLabel("Профиль любви")

                    .setEmoji("<:emoji_6:1529430913396506705>")

                    .setStyle(ButtonStyle.Secondary)


            );






        // вместо reply используем editReply после deferReply

        await interaction.editReply({


            files: [

                file

            ],


            components: [

                button

            ]


        });



    }

};
