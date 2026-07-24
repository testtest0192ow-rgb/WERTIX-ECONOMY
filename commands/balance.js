const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Показать баланс')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь')
                .setRequired(false)),
    
    async execute(interaction) {
        await interaction.deferReply();
        
        const target = interaction.options.getUser('user') || interaction.user;
        
        let user = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        if (!user) {
            user = await User.create({ userId: target.id, guildId: interaction.guild.id });
        }
        
        const total = user.wallet + user.bank;
        
        const embed = new EmbedBuilder()
            .setTitle(`Баланс ${target.username}`)
            .setColor('#FFD700')
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Кошелёк', value: `${user.wallet.toLocaleString()}`, inline: true },
                { name: 'Банк', value: `${user.bank.toLocaleString()}`, inline: true },
                { name: 'Всего', value: `${total.toLocaleString()}`, inline: true },
                { name: 'Уровень', value: `${user.level}`, inline: true },
                { name: 'Престиж', value: `${user.prestige}`, inline: true }
            );
        
        await interaction.editReply({ embeds: [embed] });
    },
};
