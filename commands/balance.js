const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('💰 Показать баланс')
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
            .setTitle(`${emojis.coin} Баланс ${target.username}`)
            .setColor('#FFD700')
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: `${emojis.wallet} Кошелёк`, value: `\`\`\`${user.wallet.toLocaleString()} коинов\`\`\``, inline: true },
                { name: `${emojis.bank} Банк`, value: `\`\`\`${user.bank.toLocaleString()} коинов\`\`\``, inline: true },
                { name: `${emojis.diamond} Всего`, value: `\`\`\`${total.toLocaleString()} коинов\`\`\``, inline: false },
                { name: `${emojis.crown} Уровень`, value: `\`\`\`${user.level}\`\`\``, inline: true },
                { name: `${emojis.fire} Престиж`, value: `\`\`\`${user.prestige}\`\`\``, inline: true }
            )
            .setFooter({ text: 'SECTOR ECONOMY' })
            .setTimestamp();
        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('deposit').setLabel('В банк').setStyle(ButtonStyle.Primary).setEmoji('🏦'),
                new ButtonBuilder().setCustomId('withdraw').setLabel('Снять').setStyle(ButtonStyle.Primary).setEmoji('💳'),
                new ButtonBuilder().setCustomId('income').setLabel('Доходы').setStyle(ButtonStyle.Success).setEmoji('📈'),
                new ButtonBuilder().setCustomId('expenses').setLabel('Расходы').setStyle(ButtonStyle.Danger).setEmoji('📉'),
            );
        
        await interaction.editReply({ embeds: [embed], components: [row] });
    },
};
