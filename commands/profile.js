const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const User = require("../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Показать профиль игрока"),

    async execute(interaction) {

        const target = interaction.user;

        let user = await User.findOne({
            userId: target.id
        });

        if (!user) {
            user = await User.create({
                userId: target.id,
                coins: 0,
                messages: 0,
                voiceTime: 0,
                streak: 0
            });
        }

        const avatar = target.displayAvatarURL({
            extension: "png",
            size: 512
        });


        const coins = user.coins || 0;
        const messages = user.messages || 0;
        const voice = user.voiceTime || 0;
        const streak = user.streak || 0;


        let flame = "🔥";

        if (streak >= 30) {
            flame = "✨🔥";
        } 
        else if (streak >= 7) {
            flame = "🔥✨";
        }


        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setAuthor({
                name: target.username,
                iconURL: avatar
            })
            .setThumbnail(avatar)
            .setDescription(
`
💰 **Монеты**
\`${coins.toLocaleString()}\`

${flame} **Стрик**
\`${streak} дней\`

💬 **Сообщения**
\`${messages.toLocaleString()}\`

🎧 **Время в голосовых**
\`${voice} минут\`

🏆 **Уровень**
\`${Math.floor(messages / 100) + 1}\`
`
            )
            .setFooter({
                text: "Профиль игрока"
            })
            .setTimestamp();


        await interaction.reply({
            embeds: [embed]
        });
    }
};
