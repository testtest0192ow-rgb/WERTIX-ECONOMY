const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

const jobs = [
    { name: 'Программист', icon: '💻', min: 500, max: 1500 },
    { name: 'Таксист', icon: '🚕', min: 300, max: 1000 },
    { name: 'Пиццайоло', icon: '🍕', min: 200, max: 700 },
    { name: 'Дизайнер', icon: '🎨', min: 400, max: 1200 },
    { name: 'Стример', icon: '🎮', min: 300, max: 1500 },
    { name: 'Учитель', icon: '📚', min: 250, max: 800 },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('💼 Работать'),
    
    async execute(interaction) {
        let user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!user) {
            user = await User.create({ userId: interaction.user.id, guildId: interaction.guild.id });
        }
        
        const now = new Date();
        if (user.lastWork) {
            const diff = now - user.lastWork;
            const minutesLeft = 60 - Math.floor(diff / 60000);
            if (minutesLeft > 0) {
                return interaction.reply({
                    content: `❌ Ты устал! Отдохни ещё **${minutesLeft}** минут`,
                    ephemeral: true
                });
            }
        }
        
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        let earnings = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;
        
        // Бонус за уровень
        const levelBonus = Math.floor(earnings * (user.level * 0.01));
        earnings += levelBonus;
        
        user.wallet += earnings;
        user.lastWork = now;
        user.totalEarned += earnings;
        user.xp += 20;
        
        // Проверка уровня
        const newLevel = Math.floor(user.xp / 1000) + 1;
        let levelUp = false;
        if (newLevel > user.level) {
            user.level = newLevel;
            levelUp = true;
        }
        
        await user.save();
        
        const embed = new EmbedBuilder()
            .setTitle(`${emojis.briefcase} Работа`)
            .setColor('#64C8FF')
            .setDescription(`Ты работал **${job.name}** ${job.icon}`)
            .addFields(
                { name: 'Заработано', value: `\`\`\`${earnings.toLocaleString()} коинов\`\`\``, inline: true },
                { name: 'Бонус за уровень', value: `\`\`\`+${levelBonus}\`\`\``, inline: true },
                { name: 'Кошелёк', value: `\`\`\`${user.wallet.toLocaleString()}\`\`\``, inline: true }
            );
        
        if (levelUp) {
            embed.addFields({ name: '⭐ Уровень повышен!', value: `\`\`\`${user.level}\`\`\``, inline: false });
        }
        
        await interaction.reply({ embeds: [embed] });
    },
};
