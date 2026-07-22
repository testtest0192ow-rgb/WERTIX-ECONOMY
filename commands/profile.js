const {
    SlashCommandBuilder,
    AttachmentBuilder
} = require("discord.js");

const User = require("../models/User");
const createProfileCard = require("../utils/profileCard");


module.exports = {

    data: new SlashCommandBuilder()

        .setName("profile")
        .setDescription("Посмотреть профиль игрока")

        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Посмотреть профиль другого пользователя")
                .setRequired(false)
        ),



    async execute(interaction) {

        try {

            const target =
                interaction.options.getUser("user")
                || interaction.user;



            let user = await User.findOne({
                userId: target.id
            });



            if (!user) {

                user = await User.create({

                    userId: target.id,

                    coins: 0,

                    streak: 0,

                    messages: 0,

                    voiceTime: 0

                });

            }



            const image = await createProfileCard(
                target,
                {

                    coins: user.coins || 0,

                    streak: user.streak || 0,

                    messages: user.messages || 0,

                    voiceTime: user.voiceTime || 0

                }
            );



            const attachment = new AttachmentBuilder(
                image,
                {
                    name: "profile.png"
                }
            );



            await interaction.reply({

                files: [attachment]

            });



        } catch (error) {


            console.error("Profile error:", error);


            if (!interaction.replied) {

                await interaction.reply({

                    content: "❌ Не удалось загрузить профиль",

                    ephemeral: true

                });

            }

        }

    }

};
