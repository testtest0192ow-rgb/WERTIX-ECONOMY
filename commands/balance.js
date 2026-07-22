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
            "Показать баланс"
        ),



    async execute(interaction) {


        try {


            await interaction.deferReply();



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




            const image = await createBalanceCard(

                user,

                interaction.user

            );




            const attachment = new AttachmentBuilder(

                image,

                {

                    name: "balance.png"

                }

            );





            await interaction.editReply({

                files: [

                    attachment

                ]

            });



        } catch (error) {


            console.log(
                "BALANCE ERROR:",
                error
            );



            if (interaction.deferred) {


                await interaction.editReply({

                    content:
                        "❌ Ошибка при создании баланса"

                });


            } else {


                await interaction.reply({

                    content:
                        "❌ Ошибка",

                    ephemeral:
                        true

                });


            }


        }


    }


};
