const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Снять деньги из банка')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма (0 = всё)')
                .setRequired(true)),
    
    async execute(interaction) {
        let amount = interaction.options.getInteger('amount');
        let user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!user) return interaction.reply({ content: '❌ Напиши /balance сначала', flags: 64 });
        
        if (amount === 0) amount = user.bank;
        if (amount <= 0 || amount > user.bank) {
            return interaction.reply({ content: '❌ Неверная сумма!', flags: 64 });
        }
        
        user.bank -= amount;
        user.wallet += amount;
        await user.save();
        
        const embed = new EmbedBuilder()
            .setColor('#64C8FF')
            .setDescription(`✅ Снято: **${amount.toLocaleString()}**`);
        
        await interaction.reply({ embeds: [embed] });
    },
};
