const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Положить деньги в банк')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма (0 = всё)')
                .setRequired(true)),
    
    async execute(interaction) {
        let amount = interaction.options.getInteger('amount');
        let user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!user) return interaction.reply({ content: '❌ Напиши /balance сначала', flags: 64 });
        
        if (amount === 0) amount = user.wallet;
        if (amount <= 0 || amount > user.wallet) {
            return interaction.reply({ content: '❌ Неверная сумма!', flags: 64 });
        }
        
        user.wallet -= amount;
        user.bank += amount;
        await user.save();
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setDescription(`✅ В банк: **${amount.toLocaleString()}**`);
        
        await interaction.reply({ embeds: [embed] });
    },
};
