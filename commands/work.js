const { SlashCommandBuilder } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Работа'),

    async execute(interaction) {
        let user = await User.findOne({ userId: interaction.user.id });

        if (!user) user = await User.create({ userId: interaction.user.id });

        const amount = Math.floor(Math.random() * 500) + 100;

        user.balance += amount;
        await user.save();

        interaction.reply(`${emojis.work} Ты заработал ${amount}`);
    }
};
