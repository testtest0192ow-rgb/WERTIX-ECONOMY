const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Ежедневный бонус'),
    
    async execute(interaction) {
        let user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!user) user = await User.create({ userId: interaction.user.id, guildId: interaction.guild.id });
        
        const now = new Date();
        if (user.lastDaily) {
            const diff = now - user.lastDaily;
            const hoursLeft = 24 - Math.floor(diff / 3600000);
            if (hoursLeft > 0) {
                return interaction.reply({ content: `❌ Жди **${hoursLeft}** ч`, flags: 64 });
            }
        }
        
        const reward = Math.floor(Math.random() * 1000) + 500 + (user.dailyStreak * 50) + (user.level * 10);
        user.wallet += reward;
        user.dailyStreak += 1;
        user.lastDaily = now;
        user.xp += 50;
        
        const newLevel = Math.floor(user.xp / 1000) + 1;
        if (newLevel > user.level) user.level = newLevel;
        
        await user.save();
        
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setDescription(`🎁 **+${reward.toLocaleString()}**! Серия: **${user.dailyStreak}** дн`);
        
        await interaction.reply({ embeds: [embed] });
    },
};
