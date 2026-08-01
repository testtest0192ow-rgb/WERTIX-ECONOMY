const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Снять деньги')
        .addIntegerOption(opt =>
            opt.setName('amount').setRequired(true)
        ),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        let user = await User.findOne({ userId: interaction.user.id });

        if (!user || user.bank < amount || amount <= 0) {
            return interaction.reply(`${emojis.error} Ошибка`);
        }

        user.bank -= amount;
        user.balance += amount;
        await user.save();

        interaction.reply(`${emojis.success} Ты снял ${amount}`);
    }
};
