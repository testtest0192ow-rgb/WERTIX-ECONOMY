const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('💸 Перевести деньги')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Кому')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма')
                .setRequired(true)),
    
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        
        if (target.id === interaction.user.id) {
            return interaction.reply({ content: '❌ Нельзя перевести себе!', ephemeral: true });
        }
        
        if (amount < 10) {
            return interaction.reply({ content: '❌ Минимальная сумма: 10 коинов', ephemeral: true });
        }
        
        let sender = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!sender || sender.wallet < amount) {
            return interaction.reply({ content: '❌ Недостаточно денег!', ephemeral: true });
        }
        
        let receiver = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        if (!receiver) {
            receiver = await User.create({ userId: target.id, guildId: interaction.guild.id });
        }
        
        // Налог 6%
        const tax = Math.floor(amount * 0.06);
        const finalAmount = amount - tax;
        
        sender.wallet -= amount;
        receiver.wallet += finalAmount;
        await sender.save();
        await receiver.save();
        
        const embed = new EmbedBuilder()
            .setTitle(`${emojis.money_stack} Перевод`)
            .setColor('#FFD700')
            .setDescription(`✅ **${amount.toLocaleString()}** → ${target.username}`)
            .addFields(
                { name: 'Получатель получит', value: `\`\`\`${finalAmount.toLocaleString()}\`\`\``, inline: true },
                { name: 'Налог (6%)', value: `\`\`\`${tax.toLocaleString()}\`\`\``, inline: true },
                { name: 'Ваш кошелёк', value: `\`\`\`${sender.wallet.toLocaleString()}\`\`\``, inline: true }
            );
        
        await interaction.reply({ embeds: [embed] });
    },
};
