const {
    SlashCommandBuilder,
    AttachmentBuilder
} = require("discord.js");


const User = require("../models/User.js");

const {
    createBalanceCard
} = require("../utils/balanceCard.js");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("balance")

        .setDescription(
            "Показать баланс WERTIX"
        ),




    async execute(interaction) {


        // даём Discord время на создание картинки
        await interaction.deferReply();



        let user = await User.findOne({

            userId: interaction.user.id

        });




        if (!user) {


            user = await User.create({

                userId: interaction.user.id,

                coins: 0

            });


        }





        const image = await createBalanceCard(

            user,

            interaction.user

        );






        const attachment = new AttachmentBuilder(

            image,

            {

                name: "wertix-balance.png"

            }

        );






        await interaction.editReply({

            files: [

                attachment

            ]

        });



    }


};
