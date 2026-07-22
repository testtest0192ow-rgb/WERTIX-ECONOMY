const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");


const User = require("../models/User.js");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("balance")

        .setDescription(
            "Показать баланс WERTIX"
        ),




    async execute(interaction) {


        let user = await User.findOne({

            userId: interaction.user.id

        });




        if (!user) {


            user = await User.create({

                userId: interaction.user.id,

                coins: 0

            });


        }





        const embed = new EmbedBuilder()


            .setColor("#2b2d31")


            .setAuthor({

                name:
                interaction.user.username,

                iconURL:
                interaction.user.displayAvatarURL({
                    size: 512
                })

            })


            .setTitle(
                "💰 WERTIX Balance"
            )



            .setThumbnail(

                interaction.user.displayAvatarURL({
                    size:512
                })

            )



            .addFields(

                {

                    name:
                    "🪙 Монеты",

                    value:
                    `**${user.coins.toLocaleString()}**`,

                    inline:true

                },

                {

                    name:
                    "🔥 Timely стрик",

                    value:
                    `${user.timelyStreak} дней`,

                    inline:true

                }


            )



            .setFooter({

                text:
                "WERTIX Economy"

            })



            .setTimestamp();






        await interaction.reply({

            embeds:[
                embed
            ]

        });



    }


};
