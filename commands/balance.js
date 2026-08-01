const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Баланс'),

    async execute(interaction) {
        let user = await User.findOne({ userId: interaction.user.id });

        if (!user) user = await User.create({ userId: interaction.user.id });

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle(`${emojis.coin} Баланс`)
            .setDescription(
                `${emojis.wallet} Кошелёк: **${user.balance}**\n` +
                `${emojis.bank} Банк: **${user.bank}**`
            )
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
};
