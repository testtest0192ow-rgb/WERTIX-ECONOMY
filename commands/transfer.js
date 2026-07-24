const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Перевести деньги')
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
            return interaction.reply({ content: '❌ Нельзя себе!', flags: 64 });
        }
        if (amount < 10) {
            return interaction.reply({ content: '❌ Минимум 10!', flags: 64 });
        }
        
        let sender = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!sender || sender.wallet < amount) {
            return interaction.reply({ content: '❌ Недостаточно денег!', flags: 64 });
        }
        
        let receiver = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        if (!receiver) receiver = await User.create({ userId: target.id, guildId: interaction.guild.id });
        
        const tax = Math.floor(amount * 0.06);
        const final = amount - tax;
        
        sender.wallet -= amount;
        receiver.wallet += final;
        await sender.save();
        await receiver.save();
        
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setDescription(`✅ **${final.toLocaleString()}** → ${target.username}`)
            .addFields({ name: 'Налог (6%)', value: `${tax}`, inline: true });
        
        await interaction.reply({ embeds: [embed] });
    },
};
