const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('🎁 Ежедневный бонус'),
    
    async execute(interaction) {
        let user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!user) {
            user = await User.create({ userId: interaction.user.id, guildId: interaction.guild.id });
        }
        
        const now = new Date();
        const lastDaily = user.lastDaily;
        
        if (lastDaily) {
            const diff = now - lastDaily;
            const hoursLeft = 24 - Math.floor(diff / (1000 * 60 * 60));
            if (hoursLeft > 0) {
                return interaction.reply({
                    content: `❌ Ты уже получал бонус! Приходи через **${hoursLeft}** часов`,
                    ephemeral: true
                });
            }
        }
        
        // Расчёт награды
        const baseReward = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
        const streakBonus = user.dailyStreak * 50;
        const levelBonus = user.level * 10;
        const totalReward = baseReward + streakBonus + levelBonus;
        
        user.wallet += totalReward;
        user.dailyStreak += 1;
        user.lastDaily = now;
        user.totalEarned += totalReward;
        user.xp += 50;
        
        // Проверка уровня
        const newLevel = Math.floor(user.xp / 1000) + 1;
        let levelUp = false;
        if (newLevel > user.level) {
            user.level = newLevel;
            levelUp = true;
        }
        
        await user.save();
        
        const embed = new EmbedBuilder()
            .setTitle(`${emojis.coins_stack} Ежедневный бонус`)
            .setColor('#FFD700')
            .setDescription(`Ты получил **${totalReward.toLocaleString()}** коинов!`)
            .addFields(
                { name: 'Базовая награда', value: `\`\`\`${baseReward}\`\`\``, inline: true },
                { name: 'Бонус за серию', value: `\`\`\`+${streakBonus} (${user.dailyStreak} дней)\`\`\``, inline: true },
                { name: 'Бонус за уровень', value: `\`\`\`+${levelBonus}\`\`\``, inline: true },
                { name: '🔥 Серия', value: `\`\`\`${user.dailyStreak} дней\`\`\``, inline: true }
            );
        
        if (levelUp) {
            embed.addFields({ name: '⭐ Уровень повышен!', value: `\`\`\`${user.level}\`\`\``, inline: false });
        }
        
        await interaction.reply({ embeds: [embed] });
    },
};
