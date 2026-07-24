const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('💳 Снять деньги из банка')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма (0 = всё)')
                .setRequired(true)),
    
    async execute(interaction) {
        let amount = interaction.options.getInteger('amount');
        let user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!user) return interaction.reply({ content: '❌ Ты ещё не в системе!', ephemeral: true });
        
        if (amount === 0) amount = user.bank;
        if (amount <= 0 || amount > user.bank) {
            return interaction.reply({ content: '❌ Неверная сумма!', ephemeral: true });
        }
        
        user.bank -= amount;
        user.wallet += amount;
        await user.save();
        
        const embed = new EmbedBuilder()
            .setTitle(`${emojis.wallet} Снятие`)
            .setColor('#64C8FF')
            .setDescription(`✅ Снято из банка: **${amount.toLocaleString()}** коинов`)
            .addFields(
                { name: `${emojis.wallet} Кошелёк`, value: `\`\`\`${user.wallet.toLocaleString()}\`\`\``, inline: true },
                { name: `${emojis.bank} Банк`, value: `\`\`\`${user.bank.toLocaleString()}\`\`\``, inline: true }
            );
        
        await interaction.reply({ embeds: [embed] });
    },
};
