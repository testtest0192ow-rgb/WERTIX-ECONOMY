const {
    SlashCommandBuilder,
    AttachmentBuilder
} = require("discord.js");

const createLoveCard = require("../utils/loveCard");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("love")

        .setDescription("Показать профиль любви"),



    async execute(interaction) {


        await interaction.deferReply();



        const user = interaction.user;



        // временные данные
        // потом заменим на MongoDB

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

};
